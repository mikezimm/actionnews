import * as React from 'react';

import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { IFormFields, IProjectFormFields, IFieldDef } from '../fields/fieldDefinitions';

import stylesF from './Fields.module.scss';

const defaultWidth = 200;
const emptyString = (value: string | Date) : string => { return "";};

/***
 *    d8888b. db    db d888888b db      d8888b.      d88888b d888888b d88888b db      d8888b. .d8888. 
 *    88  `8D 88    88   `88'   88      88  `8D      88'       `88'   88'     88      88  `8D 88'  YP 
 *    88oooY' 88    88    88    88      88   88      88ooo      88    88ooooo 88      88   88 `8bo.   
 *    88~~~b. 88    88    88    88      88   88      88~~~      88    88~~~~~ 88      88   88   `Y8b. 
 *    88   8D 88b  d88   .88.   88booo. 88  .8D      88        .88.   88.     88booo. 88  .8D db   8D 
 *    Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'      YP      Y888888P Y88888P Y88888P Y8888D' `8888Y' 
 *                                                                                                    
 *                                                                                                    
 */

export function createTextField(field: IFieldDef, _onChange: any, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {
    let defaultValue = null;

    let thisField = <div id={ field.name }><TextField
        className={ stylesF.textField }
        styles={ getStyles  } //this.getReportingStyles
        defaultValue={ defaultValue }
        label={ field.title }
        autoComplete='off'
        onChanged={ _onChange }
        validateOnFocusIn
        validateOnFocusOut
        multiline= { field.name === "activity" ? true : false }
        autoAdjustHeight= { true }

    /></div>;
  

    return thisField;
}