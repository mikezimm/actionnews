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

  /**
   * Constructor
   */

  constructor(props: IEditPaneProps) {
    super(props);
    let currentRef = React.createRef();
    //console.log( 'currentRef', currentRef );

    this.state = {
      width: null
    };
  }

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

    let iconSave = { iconName: 'Save' };
    let saveButton = <div id={ 'SaveButton' } title={ 'Save' } ><PrimaryButton text={ 'Save' } iconProps= { iconSave } onClick={ this.props._saveItem } disabled={this.checkForSaveDisabled()} checked={ null } /></div>;

    let iconCancel = { iconName: 'Cancel' };
    let cancelButton = <div id={ 'CancelButton' } title={ 'Cancel' } ><PrimaryButton text={ 'Cancel' } iconProps= { iconCancel } onClick={ this.props._cancelItem } disabled={false} checked={ null } /></div>;

    let panelButtons = <Stack horizontal={ true } tokens={stackTokens}>
        { saveButton } { cancelButton }
    </Stack>;

    return (
    <div className={[styles.floatRight, epStyles.commonStyles ].join(' ')}>
        <Stack horizontal={ false } tokens={stackTokens}>
            { fields }
            { panelButtons }
        </Stack>
    </div>
    );
  }

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
