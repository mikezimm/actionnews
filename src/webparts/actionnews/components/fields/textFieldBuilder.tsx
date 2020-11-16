import * as React from 'react';

import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { createIconButton , createIconButtonWithReturnVal, defCommandIconStyles} from "../createButtons/IconButton";

import { IFormFields, IProjectFormFields, IFieldDef } from '../fields/fieldDefinitions';

import { IQuickField } from '../IReUsableInterfaces';

import epStyles from '../Panel/EditPaneStyles.module.scss';

const defaultWidth = 200;
const emptyString = (value: string | Date) : string => { return "";};

/***
 *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d888888b d88888b db    db d888888b      d88888b d888888b d88888b db      d8888b. 
 *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          `~~88~~' 88'     `8b  d8' `~~88~~'      88'       `88'   88'     88      88  `8D 
 *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo         88    88ooooo  `8bd8'     88         88ooo      88    88ooooo 88      88   88 
 *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~         88    88~~~~~  .dPYb.     88         88~~~      88    88~~~~~ 88      88   88 
 *    Y8b  d8 88 `88. 88.     88   88    88    88.             88    88.     .8P  Y8.    88         88        .88.   88.     88booo. 88  .8D 
 *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P         YP    Y88888P YP    YP    YP         YP      Y888888P Y88888P Y88888P Y8888D' 
 *                                                                                                                                           
 *                                                                                                                                           
 */

export function createTextField(field: IQuickField, pageIDPref: string, _onChange: any, _setValue: any, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>, fieldWidth: number, disabled: boolean = false) {
    let defaultValue = field.value ? field.value : null ;

//    let fieldWidth = field.width ? field.width : 200;

    if ( getStyles === null ) { 
        getStyles = { wrapper: { width: fieldWidth } };
    }

    let isRequired = field.required ? field.required : false ;
    if ( field.value && field.value.length > 0 ) { isRequired = false ; }

    let myIconStyles = defCommandIconStyles;
    myIconStyles.icon.fontSize = 14;
    myIconStyles.icon.fontWeight = "900";
    let setThisValue = _setValue !== null ? createIconButton('Down','Set Title', _setValue, null, myIconStyles ) : null ;

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



    let thisField = 
    <div id={ pageIDPref + field.column } style={{ width: fieldWidth }}  className={ [epStyles.peopleBlock, epStyles.commonStyles ].join(' ') }>
        <div className={ setThisValue !== null ? epStyles.addMeButton : '' }>{ setThisValue } </div>
        <div className={ [epStyles.fieldWithIconButton, epStyles.setInputWidth100].join(' ') } style={{ width: fieldWidth }}  >
            <TextField
            className={ epStyles.textField }
            styles={ getStyles  } //this.getReportingStyles
            defaultValue={ defaultValue }
            label={ field.title }
            required={ isRequired }
            autoComplete='off'
            disabled={ disabled === true ? disabled : field.disabled}
            onChanged={(value: string) => {
                _onChange(field.column, value);
            }}
            validateOnFocusIn
            validateOnFocusOut
            multiline= { field.type === "MultiLine" ? true : false }
            autoAdjustHeight= { true }

    /></div></div>;
  

    return thisField;
}