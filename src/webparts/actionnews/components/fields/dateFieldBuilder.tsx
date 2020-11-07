

import * as React from 'react';

import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";

import { IFormFields, IProjectFormFields, IFieldDef } from './fieldDefinitions';

import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { IUser } from '../IReUsableInterfaces';

import { DateTimePicker, DateConvention, TimeConvention, TimeDisplayControlType } from '@pnp/spfx-controls-react/lib/dateTimePicker';

import { IQuickField } from '../IReUsableInterfaces';

import { getHelpfullError, } from '../../../../services/ErrorHandler';

import { createIconButton , defCommandIconStyles} from "../createButtons/IconButton";

import stylesF from './StylesField.module.scss';

import epStyles from '../Panel/EditPaneStyles.module.scss';

export const dateConvention = DateConvention.DateTime;
export const showMonthPickerAsOverlay = true;
export const showWeekNumbers = true;
export const timeConvention = TimeConvention.Hours12;
export const showGoToToday = true;
export const timeDisplayControlType = TimeDisplayControlType.Dropdown;

const emptyString = (value: string | Date) : string => { return "";};

const fieldWidth = 200;


export function createDateField(field: IFieldDef | IQuickField, pageIDPref: string, _onChange: any, _clearDate: any, required: boolean, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {

  const getDateErrorMessage = (value: Date): string => {
    let mess = value == null ? "Don't forget Date!" : "";
    return mess;
  };

  let timeStamp = field.value ;
  if (timeStamp != null) { timeStamp = new Date(timeStamp); }
  let myIconStyles = defCommandIconStyles;
  myIconStyles.icon.fontSize = 14;
  myIconStyles.icon.fontWeight = "900";
  let clearThisDate = _clearDate === null ? null : createIconButton('Clear','ClearDate', _clearDate, null, myIconStyles );

  /**
   * Found onChange example here:
   * https://github.com/pnp/sp-dev-fx-webparts/blob/04d41005dd072154b0e82254b3973c7c81585258/samples/react-quick-poll/src/webparts/simplePoll/SimplePollWebPart.ts
   */

  return (
      // Uncontrolled
      <div id={ pageIDPref + field.column } style={{ width: fieldWidth }}  className={ epStyles.peopleBlock}>
      <div className={epStyles.addMeButton}>{ clearThisDate } </div>
      <div className={epStyles.fieldWithIconButton}>
        <DateTimePicker 
            label={field.title}
            value={timeStamp}
            onChange={(date: Date) => {
              _onChange(field.column, date);
            }}
            key={ pageIDPref + field.column }
            dateConvention={DateConvention.Date} showMonthPickerAsOverlay={showMonthPickerAsOverlay}
            showWeekNumbers={showWeekNumbers} timeConvention={timeConvention}
            showGoToToday={showGoToToday} timeDisplayControlType={timeDisplayControlType}
            showLabels={false}
            //onGetErrorMessage={ required === true ? getDateErrorMessage : emptyString }
            onGetErrorMessage={ required === true && timeStamp == null ? emptyString : getDateErrorMessage }
        /></div>
      </div>

  );

}