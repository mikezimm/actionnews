

import * as React from 'react';

import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { IFormFields, IProjectFormFields, IFieldDef } from '../fields/fieldDefinitions';
import { IQuickField } from '../../components/IReUsableInterfaces';

export const dropdownHeaderPrefix = 'Header=';
export const dropdownDivider = '-Divider-';

/***
 *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d8888b. d8888b.  .d88b.  d8888b. d8888b.  .d88b.  db   d8b   db d8b   db      d88888b d888888b d88888b db      d8888b. 
 *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          88  `8D 88  `8D .8P  Y8. 88  `8D 88  `8D .8P  Y8. 88   I8I   88 888o  88      88'       `88'   88'     88      88  `8D 
 *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88   88 88oobY' 88    88 88oodD' 88   88 88    88 88   I8I   88 88V8o 88      88ooo      88    88ooooo 88      88   88 
 *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88   88 88`8b   88    88 88~~~   88   88 88    88 Y8   I8I   88 88 V8o88      88~~~      88    88~~~~~ 88      88   88 
 *    Y8b  d8 88 `88. 88.     88   88    88    88.          88  .8D 88 `88. `8b  d8' 88      88  .8D `8b  d8' `8b d8'8b d8' 88  V888      88        .88.   88.     88booo. 88  .8D 
 *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      Y8888D' 88   YD  `Y88P'  88      Y8888D'  `Y88P'   `8b8' `8d8'  VP   V8P      YP      Y888888P Y88888P Y88888P Y8888D' 
 *                                                                                                                                                                                 
 *                                                                                                                                                                                 
 */

export function _createDropdownField(field: IQuickField, _onChange: any, pageIDPref: string, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>, fieldWidth, disabled: boolean = false) {

  let choices : string[] = field.choices && field.choices.length > 0 ? field.choices : [];

  const dropdownStyles: Partial<IDropdownStyles> = {
      root: { width: fieldWidth }
    };

  let sOptions: IDropdownOption[] = choices == null ? null : 
    choices.map(val => {

      let isHeader = val.toLowerCase().indexOf(dropdownHeaderPrefix.toLowerCase()) === 0 ? true : false;
      let isDivider = val.toLowerCase().indexOf(dropdownDivider.toLowerCase()) === 0 ? true : false;
      let itemType : DropdownMenuItemType = DropdownMenuItemType.Normal;

      if ( isHeader === true ) {
        val = val.replace(dropdownHeaderPrefix,'') ;
        itemType = DropdownMenuItemType.Header;
      }
      else if ( isDivider === true ) {
        val = '-' ;
        itemType = DropdownMenuItemType.Divider;
      }

        return {
            key: getChoiceKey(val),
            text: val,
            itemType: itemType,
            disabled: disabled === true ? disabled : null,
        };
    });

    if ( getStyles === null ) { 
        getStyles = { wrapper: { width: fieldWidth } };
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

  let thisDropdown = sOptions == null ? null : 
    <div id={ pageIDPref + field.column } style={{ width: fieldWidth }}  className={ [ ].join(' ') }>
        <Dropdown
        label={ field.title }
        selectedKey={ getChoiceKey(field.value) }
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