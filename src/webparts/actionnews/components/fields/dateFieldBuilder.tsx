

import * as React from 'react';

import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";

import { IFormFields, IProjectFormFields, IFieldDef } from './fieldDefinitions';

import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { IUser } from '../IReUsableInterfaces';

import { DateTimePicker, DateConvention, TimeConvention, TimeDisplayControlType } from '@pnp/spfx-controls-react/lib/dateTimePicker';

import { IQuickField } from '../IReUsableInterfaces';

import { getHelpfullError, } from '../../../../services/ErrorHandler';

import { createIconButton , createIconButtonWithReturnVal, defCommandIconStyles} from "../createButtons/IconButton";

import { createSVGButton } from  '../createButtons/SvgIcon';

import stylesF from './StylesField.module.scss';

import epStyles from '../Panel/EditPaneStyles.module.scss';

import { CompoundButton, Stack, IStackTokens, elementContains, initializeIcons } from 'office-ui-fabric-react';

const stackPageTokens: IStackTokens = { childrenGap: 3 };

export const dateConvention = DateConvention.DateTime;
export const showMonthPickerAsOverlay = true;
export const showWeekNumbers = true;
export const timeConvention = TimeConvention.Hours12;
export const showGoToToday = true;
export const timeDisplayControlType = TimeDisplayControlType.Dropdown;

const emptyString = (value: string | Date) : string => { return "";};

export function createDateField(field: IQuickField, pageIDPref: string, _onChange: any, _clearDate: any, _addWk: any, required: boolean, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>, fieldWidth ) {

  const getDateErrorMessage = (value: Date): string => {
    let mess = value == null ? "Don't forget Date!" : "";
    return mess;
  };

  let sevenIcon = "data:image/svg+xml;base64,CjxpbWcgc3R5bGU9IndpZHRoOiAxMDAlOyBoZWlnaHQ6IGF1dG87IGZsb2F0OiBsZWZ0O2JhY2tncm91bmQtaW1hZ2U6IG5vbmU7IiBzcmM9Ii8vY2RuLm9ubGluZXdlYmZvbnRzLmNvbS9zdmcvaW1nXzMyMDkxOC5wbmciIGFsdD0iU2V2ZW4gRGF5cyBObyBSZWFzb24gVG8gUmV0dXJuICh3aGl0ZSkiPgogIA==";
  let sevenIcon2 = "data:image/svg+xml;base64,CjxpbWcgc3R5bGU9IndpZHRoOiAxMDAlOyBoZWlnaHQ6IGF1dG87IGZsb2F0OiBsZWZ0O2JhY2tncm91bmQtaW1hZ2U6IG5vbmU7IiBzcmM9Ii8vY2RuLm9ubGluZXdlYmZvbnRzLmNvbS9zdmcvaW1nXzEyNDYzMC5wbmciIGFsdD0iTW9udGgiPgogIA==";

  let timeStamp = field.value ;
  if (timeStamp != null) { timeStamp = new Date(timeStamp); }
  let myIconStyles = defCommandIconStyles;
  myIconStyles.icon.fontSize = 14;
  myIconStyles.icon.fontWeight = "900";
  let clearThisDate = field.disabled === true || _clearDate === null ? null : createIconButton('Clear','ClearDate', _clearDate, null, myIconStyles );

  let myIconStyles2 = JSON.parse(JSON.stringify( myIconStyles ));
  myIconStyles2.icon.fontSize = 16;
  let addWeek  = field.disabled === true || _addWk === null ? null :  createIconButtonWithReturnVal( 'AddEvent' ,'Add 1 week', _addWk, field.column, myIconStyles2, 7 );

  /**
   * Found onChange example here:
   * https://github.com/pnp/sp-dev-fx-webparts/blob/04d41005dd072154b0e82254b3973c7c81585258/samples/react-quick-poll/src/webparts/simplePoll/SimplePollWebPart.ts
   */

   let buttons = [];
   if ( clearThisDate !==  null  ) { buttons.push(clearThisDate) ; }
   if ( addWeek !==  null  ) { buttons.push(addWeek) ; }

   let theseButtons = buttons.length === 0 ? null : <Stack horizontal={true} wrap={false} horizontalAlign={"end"} tokens={stackPageTokens} className={ '' }>{ buttons } </Stack>;

   if ( getStyles === null ) { 
        getStyles = { wrapper: { width: fieldWidth } };
    }

  return (
      // Uncontrolled
      <div id={ pageIDPref + field.column } style={{ width: fieldWidth }}  className={ [epStyles.peopleBlock, epStyles.commonStyles ].join(' ') }>
      <div className={ theseButtons !== null ? epStyles.addMeButton : '' }>{ buttons.length > 0 ? theseButtons : null } </div>
      <div className={ [epStyles.fieldWithIconButton, epStyles.setInputWidth100].join(' ') } style={{ width: fieldWidth }}  >
        <DateTimePicker 
            label={field.title}
            value={timeStamp}
            onChange={(date: Date) => {
              _onChange(field.column, date);
            }}

            disabled={field.disabled}
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