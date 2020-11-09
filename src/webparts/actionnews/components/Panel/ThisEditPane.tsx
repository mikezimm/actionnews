import * as React from 'react';
import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import styles from '../createButtons/CreateButtons.module.scss';

import epStyles from './EditPaneStyles.module.scss';

import { IQuickCommands, ICustViewDef,IQuickField, IUser } from '../IReUsableInterfaces';

import { ISingleButtonProps } from '../createButtons/ICreateButtons';

import { _createDropdownField } from '../fields/dropdownFieldBuilder';

import { createTextField } from '../fields/textFieldBuilder';

import { createDateField } from '../fields/dateFieldBuilder';

import { createPeopleField } from '../fields/peopleFieldBuilder';

export interface IEditPaneProps {
  // These are set based on the toggles shown above the s (not needed in real code)
  fields: IQuickField[][];
  contextUserInfo: IUser;  //For site you are on ( aka current page context )
  sourceUserInfo: IUser;   //For site where the list is stored
  onChange: any; //Callback to update the parent data
  _clearDateField: any; //Callback to clear the date
  _addYouToField: any;
  _addWeekToDate: any;
  _updateDropdown: any;
  _saveItem: any;
  _cancelItem: any;
  wpContext: WebPartContext;
  webAbsoluteUrl: string;

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

    let fields = this.props.fields.map( fieldRow => {

      let rowFields = fieldRow.length;
      let fieldWidth = ( 500 / rowFields ) - ( fieldRow.length - 1 ) * 10 ; //Accounts for 30 padding between cells on same row
      let thisRow: any[] = fieldRow.map( thisFieldObject => {
        let thisField: any = <div> { thisFieldObject.name } - { thisFieldObject.value }</div>;
        if ( thisFieldObject.type === 'Text' || thisFieldObject.type === 'MultiLine') {
          thisField = createTextField( thisFieldObject, 'EditFieldID', this.props.onChange, null, fieldWidth );
        } else if ( thisFieldObject.type === 'Time' || thisFieldObject.type === 'Date' ) {
          thisField = createDateField( thisFieldObject, 'EditFieldID', this.props.onChange, this.props._clearDateField, this.props._addWeekToDate, thisFieldObject.required, null, fieldWidth );
        } else if ( thisFieldObject.type === 'User' || thisFieldObject.type === 'MultiUser' ) {
          thisField = createPeopleField( thisFieldObject, thisFieldObject.type === 'User' ? 1 : 4 , this.props.onChange, this.props._addYouToField, 'EditFieldID', this.props.wpContext , this.props.webAbsoluteUrl, null, fieldWidth );
        } else if ( thisFieldObject.type === 'Choice' || thisFieldObject.type === 'Dropdown' ) {
          thisField = _createDropdownField( thisFieldObject, this.props._updateDropdown, 'EditFieldID', null, fieldWidth );
        }

        //createDateField
        return thisField;
      });

      return  <div style={{  }}>
        <Stack horizontal={ true } tokens={stackTokens}>
              { thisRow }
          </Stack>
        </div>;

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

    let iconSave = { iconName: 'Save' };
    let saveButton = <div id={ 'SaveButton' } title={ 'Save' } ><PrimaryButton text={ 'Save' } iconProps= { iconSave } onClick={ this.props._saveItem } disabled={this.checkForSaveDisabled()} checked={ null } /></div>;

    let iconCancel = { iconName: 'Cancel' };
    let cancelButton = <div id={ 'CancelButton' } title={ 'Cancel' } ><PrimaryButton text={ 'Cancel' } iconProps= { iconCancel } onClick={ this.props._cancelItem } disabled={false} checked={ null } /></div>;

    let panelButtons = <Stack horizontal={ true } tokens={stackTokens}>
        { saveButton } { cancelButton }
    </Stack>;

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
            { fields }
            { panelButtons }
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
      });
    }) ;

    return disableSave;
  }

}
