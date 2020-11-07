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
  wpContext: WebPartContext;
  webAbsoluteUrl: string;

}

export interface IEditPaneState {

}
//  formatting
const stackTokens: IStackTokens = { childrenGap: 40 };

export default class ThisEditPane extends React.Component<IEditPaneProps, IEditPaneState> {

  /**
   * Constructor
   */

  constructor(props: IEditPaneProps) {
    super(props);

    this.state = {
      width: null
    };
  }


  public render(): React.ReactElement<IEditPaneProps> {

    let fields = this.props.fields.map( fieldRow => {

      let thisRow: any[] = fieldRow.map( thisFieldObject => {
        let thisField: any = <div> { thisFieldObject.name } - { thisFieldObject.value }</div>;
        if ( thisFieldObject.type === 'Text') {
          thisField = createTextField( thisFieldObject, 'EditFieldID', this.props.onChange, null );
        } else if ( thisFieldObject.type === 'Time' || thisFieldObject.type === 'Date' ) {
          thisField = createDateField( thisFieldObject, 'EditFieldID', this.props.onChange, this.props._clearDateField, thisFieldObject.required, null );
        } else if ( thisFieldObject.type === 'User' || thisFieldObject.type === 'MultiUser' ) {
          thisField = createPeopleField( thisFieldObject, 3, this.props.onChange, this.props._addYouToField, 'EditFieldID', this.props.wpContext , this.props.webAbsoluteUrl, null );
        }

        //createDateField
        return thisField;
      });

      return  <div>
        <Stack horizontal={ true } tokens={stackTokens}>
              { thisRow }
          </Stack>
        </div>;

    }) ;

    return (
    <div className={[styles.floatRight, epStyles.commonStyles ].join(' ')}>
        <Stack horizontal={ false } tokens={stackTokens}>
            { fields }
        </Stack>
    </div>
    );
  }

}
