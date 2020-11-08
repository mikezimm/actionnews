

import * as React from 'react';

import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { IFormFields, IProjectFormFields, IFieldDef } from '../fields/fieldDefinitions';
import { IQuickField } from '../../components/IReUsableInterfaces';


export function _createDropdownField(field: IQuickField, _onChange: any, pageIDPref: string, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {

  let choices : string[] = field.choices && field.choices.length > 0 ? field.choices : [];
  let fieldWidth = field.width ? field.width : 200;

  const dropdownStyles: Partial<IDropdownStyles> = {
      dropdown: { width: fieldWidth }
    };

  let sOptions: IDropdownOption[] = choices == null ? null : 
    choices.map(val => {
          return {
              key: getChoiceKey(val),
              text: val,
          };
      });

  let thisDropdown = sOptions == null ? null : 
    <div id={ pageIDPref + field.column } style={{ width: fieldWidth }}  className={ [ ].join(' ') }>
        <Dropdown
        label={ field.title }
        selectedKey={ getChoiceKey(field.name) }
        onChange={(choice: any, index: any) => {
          _onChange(field.column, choice, index);
        }}
        options={ sOptions } 
        styles={ dropdownStyles }
      />
    </div>;

  return thisDropdown;

}

export function getChoiceKey(val: string) {

  if (val === null) {  
    console.log('getChoiceKey is null');
    return'valueIsNull'; }
  else if (val === undefined) {  
    console.log('getChoiceKey is undefined');
    return'valueIsNull'; }
  else {
    return val.replace(' ','SPACE').replace('.','DOT').replace('~','TILDE').replace('~','COMMA');
  }

}