import * as React from 'react';
import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import styles from '../createButtons/CreateButtons.module.scss';

import stylesF from '../fields/Fields.module.scss';

import { IQuickCommands, ICustViewDef,IQuickField, IUser } from '../IReUsableInterfaces';

import { ISingleButtonProps } from '../createButtons/ICreateButtons';

import { _createDropdownField } from '../fields/dropdownFieldBuilder';

export interface IEditPaneProps {
  // These are set based on the toggles shown above the s (not needed in real code)
  fields: IQuickField[][];
  contextUserInfo: IUser;  //For site you are on ( aka current page context )
  sourceUserInfo: IUser;   //For site where the list is stored
  onChange: any; //Callback to update the parent data

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
        let thisField: any = null;
        return <div> { thisFieldObject.name } - { thisFieldObject.value }</div>;
      });

      return <div>
        <Stack horizontal={ true } tokens={stackTokens}>
              { thisRow }
          </Stack>
        </div>;

    }) ;

    return (
    <div className={[styles.floatRight, stylesF.editFields ].join(' ')}>
        <Stack horizontal={ false } tokens={stackTokens}>
            { fields }
        </Stack>
    </div>
    );
  }

}
