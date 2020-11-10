

import * as React from 'react';

import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";
import { WebPartContext } from '@microsoft/sp-webpart-base';

import { IFormFields, IProjectFormFields, IFieldDef } from '../fields/fieldDefinitions';

import { PeoplePicker, PrincipalType, } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { IPersonaProps, } from "office-ui-fabric-react/lib/components/Persona/Persona.types";

import { getEmailFromLoginName, checkForLoginName } from '../../../../services/userServices';

import { IUser, IQuickField } from '../IReUsableInterfaces';

import { createIconButton } from '../createButtons/IconButton';

import stylesF from './StylesField.module.scss';
import { SearchResults } from '@pnp/sp/search';


/***
 *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d8888b. d88888b  .d88b.  d8888b. db      d88888b      d88888b d888888b d88888b db      d8888b. 
 *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          88  `8D 88'     .8P  Y8. 88  `8D 88      88'          88'       `88'   88'     88      88  `8D 
 *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88oodD' 88ooooo 88    88 88oodD' 88      88ooooo      88ooo      88    88ooooo 88      88   88 
 *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88~~~   88~~~~~ 88    88 88~~~   88      88~~~~~      88~~~      88    88~~~~~ 88      88   88 
 *    Y8b  d8 88 `88. 88.     88   88    88    88.          88      88.     `8b  d8' 88      88booo. 88.          88        .88.   88.     88booo. 88  .8D 
 *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      88      Y88888P  `Y88P'  88      Y88888P Y88888P      YP      Y888888P Y88888P Y88888P Y8888D' 
 *                                                                                                                                                         
 *                                                                                                                                                         
 */


/**
 * 
 * @param field 
 * @param maxCount 
 * @param _onChange 
 * @param addYouToField 
 * @param pageIDPref Added to function instead of being constant in project so it's more reusable
 * @param getStyles 
 */
export function createPeopleField(field: IQuickField , maxCount: number, _onChange: any, addYouToField: any, pageIDPref: string , wpContext: WebPartContext, webAbsoluteUrl: string, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>, fieldWidth) {
    
    let users: IUser[] = maxCount === 1 ? [field.value] : field.value;

    let emails: string[] = users == null ? [] : users.map( u => {
      if ( u == null ) { 
        //alert('Unknown User Structure for createPeopleField: ' +  JSON.stringify(u));
        return null;
      }

      let userEmail = null;
      if ( u.email ) {
        userEmail = u.email;

      } else if ( u[0] && u[0].email ) {
        userEmail = u[0].email;

      } else {
        let uName = checkForLoginName(u);
        if ( uName === undefined &&  u[0] ) {
          uName = checkForLoginName(u[0]);
        }
  
        if ( uName == undefined ) { // Added because when you remove the person in react comp, the user still is there, the name just gets removed.
          console.log('createPeopleField - did you remove a person from the array?', users, u);
          //alert('createPeopleField - did you remove a person from the array?' +  JSON.stringify(u));
          return null;
        }
  
        userEmail = getEmailFromLoginName( uName );

      }


      if ( userEmail ) {
          return userEmail;
      } else {
          console.log('Unknown User Structure for createPeopleField', u);
          alert('Unknown User Structure for createPeopleField: ' +  JSON.stringify(u));
          return null;
      }


    });

    let addUserButton = field.disabled === true ? null : createIconButton('FollowUser','Add you',addYouToField, null, null );

    let isRequired = field.required ? field.required : false ;
    if ( field.value && field.value.length > 0 ) { isRequired = false ; }

    let fieldTitle = field.title;
    let tooltipMessage: string = null;
    let showtooltip: boolean = false;

    if ( maxCount > 1 && field.type.toLowerCase().indexOf('multi') > -1 ) { 
      fieldTitle += ' ++' ; 
      tooltipMessage = 'Multi-User field';
      showtooltip = true;
    }
    else if ( maxCount > 1 && field.type.toLowerCase().indexOf('split') > -1 ) { 
      fieldTitle += ' +|+' ; 
      tooltipMessage = 'Split-User field - \ncreates one item for each person!';
      showtooltip = true;
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

      return (
          // Uncontrolled
          <div id={ pageIDPref + field.column } style={{ width: fieldWidth }} className={ [stylesF.commonStyles , stylesF.peopleBlock ].join(' ')}>
            <div className={ field.disabled !== true ? stylesF.addMeButton : null } style={{ float: 'right', marginRight: 20 }}>{ addUserButton } </div>
              <PeoplePicker
                  context={wpContext}
                  webAbsoluteUrl={ webAbsoluteUrl }
                  defaultSelectedUsers={ emails }
                  titleText={ fieldTitle }
                  personSelectionLimit={maxCount}
                  //groupName={"Team Site Owners"} // Leave this blank in case you want to filter from all users
                  showtooltip={ showtooltip }
                  required={ isRequired } // isRequired in v1.16
                  disabled={ field.disabled }
                  onChange={(items: IPersonaProps[]) => {  // selectedItems in v1.16
                    _onChange(field.column, items);
                  }}
                  tooltipDirectional = { 5 }
                  tooltipMessage= { tooltipMessage }
                  showHiddenInUI={false}
                  principalTypes={[PrincipalType.User]}
                  resolveDelay={1000} 
                  ensureUser={true}
                  peoplePickerWPclassName={stylesF.fieldWithIconButton}
              /></div>
      );


  }
