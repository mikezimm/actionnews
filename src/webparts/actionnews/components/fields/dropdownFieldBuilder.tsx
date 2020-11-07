

import * as React from 'react';

import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { IFormFields, IProjectFormFields, IFieldDef } from '../fields/fieldDefinitions';
import { IQuickField } from '../../components/IReUsableInterfaces';


export function _createDropdownField(field: IQuickField, choices: string[], _onChange: any, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {

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

    let thisDropdown = sOptions == null ? null : <div
        id={ field.name }
          ><Dropdown 
          label={ field.title }
          selectedKey={ getChoiceKey(field.name) }
          onChange={ _onChange }
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