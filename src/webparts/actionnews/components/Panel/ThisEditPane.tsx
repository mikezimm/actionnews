import * as React from 'react';
import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import styles from '../createButtons/CreateButtons.module.scss';

import stylesC from '../CommonStyles.module.scss';

import epStyles from './EditPaneStyles.module.scss';

import { IQuickCommands, ICustViewDef,IQuickField, IUser, IQuickButton } from '../IReUsableInterfaces';

import { MyDivider , MyText , IMyTextElementTypes, MyImage } from '../../../../services/basicElements';

import { defCommandIconStyles, createIconButton } from '../createButtons/IconButton';

import { ISingleButtonProps } from '../createButtons/ICreateButtons';

import { _createDropdownField } from '../fields/dropdownFieldBuilder';

import { createTextField } from '../fields/textFieldBuilder';

import { createDateField } from '../fields/dateFieldBuilder';

import { createPeopleField } from '../fields/peopleFieldBuilder';

import { createLink } from '../HelpInfo/AllLinks';

export interface IEditPaneProps {
  // These are set based on the toggles shown above the s (not needed in real code)
  fields: IQuickField[][];
  quickNewButton: Element;

  //staticFields: IQuickField[][];
  contextUserInfo: IUser;  //For site you are on ( aka current page context )
  sourceUserInfo: IUser;   //For site where the list is stored
  onChange: any; //Callback to update the parent data
  _clearDateField: any; //Callback to clear the date
  _addYouToField: any;
  _addWeekToDate: any;
  _updateDropdown: any;
  _saveItem: any;
  _cancelItem: any;
  _setReadOnly: any;
  _getTitleValue: any;
  wpContext: WebPartContext;
  webAbsoluteUrl: string;
  allowSplit: boolean;
  readOnlyMode: boolean;

}

export interface IEditPaneState {
  width: number;
}
//  formatting
const stackTokens: IStackTokens = { childrenGap: 20 };

export default class ThisEditPane extends React.Component<IEditPaneProps, IEditPaneState> {

/***
 *     .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b. 
 *    d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D 
 *    8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY' 
 *    8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b   
 *    Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88. 
 *     `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD 
 *                                                                                                  
 *                                                                                                  
 */

  constructor(props: IEditPaneProps) {
    super(props);
    let currentRef = React.createRef();
    //console.log( 'currentRef', currentRef );

    this.state = {
      width: null
    };
  }

  

/***
 *         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
 *         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
 *         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
 *         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
 *         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
 *         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
 *                                                                                         
 *                                                                                         
 */

public componentDidUpdate(prevProps: IEditPaneProps): void {
  let redraw = false;

  if ( prevProps.fields !== this.props.fields ) { redraw = true; }
  if ( redraw === true ) {
      this._updateStateOnPropsChange();
  }

}

/***
 *    d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
 *    88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
 *    88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
 *    88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
 *    88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
 *    88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
 *                                                     
 *                                                     
 */

  public render(): React.ReactElement<IEditPaneProps> {

    let fieldsBeforeSave = [];
    let fieldsAfterSave = [];
    let beforeOrAfter : 'before' | 'after' = 'before';

    this.props.fields.map( fieldRow => {
      let isButtonRow: any = false;
      let rowFields = fieldRow.length;
      let fieldWidth = ( 500 / rowFields ) - ( fieldRow.length - 1 ) * 10 ; //Accounts for 30 padding between cells on same row
      let thisRow: any[] = fieldRow.map( thisFieldObject => {

        let thisField: any = <div> { thisFieldObject.name } - { thisFieldObject.value }</div>;
        let thisType : string | IMyTextElementTypes = thisFieldObject.type ? thisFieldObject.type.toLowerCase() : '';
        let readOnlyMode = this.props.readOnlyMode === true ? this.props.readOnlyMode : false;
        
        if ( thisType.indexOf('button') > -1 ) { //Treat this entire row as a button row and do not build it
          beforeOrAfter = 'after';
          isButtonRow = true;
          thisField = null;
        } else if ( thisFieldObject.title === 'Title' ) {
          thisField = createTextField( thisFieldObject, 'EditFieldID', this.props.onChange, this.props._getTitleValue, null, fieldWidth, readOnlyMode );
        } else if ( thisType === 'text' || thisType === 'multiline') {
          thisField = createTextField( thisFieldObject, 'EditfieldID', this.props.onChange, null, null, fieldWidth, readOnlyMode );
        } else if ( thisType === 'time' || thisType === 'date' ) {
          thisField = createDateField( thisFieldObject, 'EditFieldID', this.props.onChange, this.props._clearDateField, this.props._addWeekToDate, thisFieldObject.required, null, fieldWidth, readOnlyMode );
        } else if ( thisType.indexOf('user') > -1 ) {
          let userCount = thisType === 'user' ? 1 : 5 ;
          
          //Turn off MultiUser Split column if prop is off.
          if ( thisType.toLowerCase().indexOf('split') > -1 && this.props.allowSplit !== true ) { userCount = 1 ; }

          thisField = createPeopleField( thisFieldObject, userCount , this.props.onChange, this.props._addYouToField, 'EditFieldID', this.props.wpContext , this.props.webAbsoluteUrl, null, fieldWidth, readOnlyMode );
        } else if ( thisType === 'choice' || thisType === 'dropdown' ) {
          thisField = _createDropdownField( thisFieldObject, this.props._updateDropdown, 'EditFieldID', null, fieldWidth, readOnlyMode );
        } else if ( thisType === 'divider') {
          thisField = MyDivider( thisFieldObject.title , { color: 'gray', height: 2 });
        } else if ( thisType === 'h1' || thisType === 'h2' || thisType === 'h3' ) {
          thisField = MyText( thisType, thisFieldObject.title , thisFieldObject.styles );
        } else if ( thisType === 'span' || thisType === 'p' || thisType === 'h3' ) {
          thisField = MyText( thisType, thisFieldObject.title , thisFieldObject.styles );  
        } else if ( thisType === 'link' ) {
          thisField = createLink( thisFieldObject.value, '_blank' , thisFieldObject.title, thisFieldObject.styles ); 
        } else if ( thisType === 'image' ) {
          thisField = MyImage( thisFieldObject.title, thisFieldObject.value, thisFieldObject.styles, thisFieldObject.default );          
        }

        //createDateField
        return thisField;
      });

      let thisFieldRow =  <div style={{  }}>
        <Stack horizontal={ true } tokens={stackTokens}>
              { thisRow }
          </Stack>
        </div>;

      if ( isButtonRow === true ) {
        //Do nothing with this row... insert buttons later
      } else if ( beforeOrAfter === 'before' ) {
        fieldsBeforeSave.push( thisFieldRow );
      } else {
        fieldsAfterSave.push( thisFieldRow );
      }

    }) ;

  /***
 *    d8888b. db    db d888888b d888888b  .d88b.  d8b   db .d8888. 
 *    88  `8D 88    88 `~~88~~' `~~88~~' .8P  Y8. 888o  88 88'  YP 
 *    88oooY' 88    88    88       88    88    88 88V8o 88 `8bo.   
 *    88~~~b. 88    88    88       88    88    88 88 V8o88   `Y8b. 
 *    88   8D 88b  d88    88       88    `8b  d8' 88  V888 db   8D 
 *    Y8888P' ~Y8888P'    YP       YP     `Y88P'  VP   V8P `8888Y' 
 *                                                                 
 *                                                                 
 */
    let panelButtons = null;
    if ( this.props.readOnlyMode !== true ) {
      let iconSave = { iconName: 'Save' };
      let saveButton = <div id={ 'SaveButton' } title={ 'Save' } ><PrimaryButton text={ 'Save' } iconProps= { iconSave } onClick={ this.props._saveItem } disabled={this.checkForSaveDisabled()} checked={ null } /></div>;
  
      let iconCancel = { iconName: 'Cancel' };
      let cancelButton = <div id={ 'CancelButton' } title={ 'Cancel' } ><DefaultButton text={ 'Cancel' } iconProps= { iconCancel } onClick={ this.props._cancelItem } disabled={false} checked={ null } /></div>;
  
      let myIconStyles = JSON.parse(JSON.stringify( defCommandIconStyles ));
      myIconStyles.icon.fontSize = 24;
      //myIconStyles.icon.fontWeight = "900";
      
      let cancelDiv: any = { };
      cancelDiv.position = 'absolute'; //DOES NOT Work... it sticks to right but does not move when scrolling

      if ( this.props.quickNewButton !== null ) {   }
//      let cancelEditButton = <div style={{ position: 'relative' }}><div style={ cancelDiv } > { createIconButton('Uneditable','Cancel Editing', this.props._setReadOnly , null, myIconStyles ) } </div></div>;

      let cancelEditButton = <div style={{ marginLeft: this.props.quickNewButton === null ? 100 : null }}> { createIconButton('Uneditable','Cancel Editing', this.props._setReadOnly , null, myIconStyles ) } </div>;
      


      panelButtons = 
        <Stack horizontal={ true } tokens={stackTokens} style={{ marginTop: 35, marginBottom: 15, padding: 20, background: 'lightgray' }}>
            { saveButton } { cancelButton } { this.props.quickNewButton } { cancelEditButton }
        </Stack>;
    }

/***
 *    d8888b. d88888b d888888b db    db d8888b. d8b   db 
 *    88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
 *    88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
 *    88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
 *    88 `88. 88.        88    88b  d88 88 `88. 88  V888 
 *    88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
 *                                                       
 *                                                       
 */

    return (
    <div className={[styles.floatRight, epStyles.commonStyles ].join(' ')}>
        <Stack horizontal={ false } tokens={stackTokens}>
            { fieldsBeforeSave }
            { panelButtons }
            { fieldsAfterSave }
        </Stack>
    </div>
    );
  }

/***
 *     .o88b. db   db d88888b  .o88b. db   dD      d8888b. d888888b .d8888.  .d8b.  d8888b. db      d88888b d8888b. 
 *    d8P  Y8 88   88 88'     d8P  Y8 88 ,8P'      88  `8D   `88'   88'  YP d8' `8b 88  `8D 88      88'     88  `8D 
 *    8P      88ooo88 88ooooo 8P      88,8P        88   88    88    `8bo.   88ooo88 88oooY' 88      88ooooo 88   88 
 *    8b      88~~~88 88~~~~~ 8b      88`8b        88   88    88      `Y8b. 88~~~88 88~~~b. 88      88~~~~~ 88   88 
 *    Y8b  d8 88   88 88.     Y8b  d8 88 `88.      88  .8D   .88.   db   8D 88   88 88   8D 88booo. 88.     88  .8D 
 *     `Y88P' YP   YP Y88888P  `Y88P' YP   YD      Y8888D' Y888888P `8888Y' YP   YP Y8888P' Y88888P Y88888P Y8888D' 
 *                                                                                                                  
 *                                                                                                                  
 */

  private checkForSaveDisabled(){

    let disableSave = false;
    this.props.fields.map( fieldRow => {
      fieldRow.map( thisFieldObject => {
        if ( thisFieldObject.required && thisFieldObject.value === null ) { disableSave = true; }
        else if ( thisFieldObject.required && thisFieldObject.value === undefined ) { disableSave = true; }
        else if ( thisFieldObject.required && thisFieldObject.value === '' ) { disableSave = true; }
      });
    }) ;

    return disableSave;
  }

  
  private _updateStateOnPropsChange(): void {
    this.setState({
      });
  }

}
