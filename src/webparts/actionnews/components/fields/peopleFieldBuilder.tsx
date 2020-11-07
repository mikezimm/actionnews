

import * as React from 'react';

import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";
import { WebPartContext } from '@microsoft/sp-webpart-base';

import { IFormFields, IProjectFormFields, IFieldDef } from '../fields/fieldDefinitions';

import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { IUser, IQuickField } from '../IReUsableInterfaces';

import { createIconButton } from '../createButtons/IconButton';

import stylesF from './StylesField.module.scss';

const fieldWidth = 200;


/**
 * 
 * @param field 
 * @param maxCount 
 * @param _onChange 
 * @param addYouToField 
 * @param pageIDPref Added to function instead of being constant in project so it's more reusable
 * @param getStyles 
 */
export function createPeopleField(field: IFieldDef | IQuickField, maxCount: number, _onChange: any, addYouToField: any, pageIDPref: string , wpContext: WebPartContext, webAbsoluteUrl: string, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {

    let users: IUser[] = maxCount === 1 ? [field.value] : field.value;

    let emails: string[] = users == null ? [] : users.map( u => {
      if ( u == null ) { 
        //alert('Unknown User Structure for createPeopleField: ' +  JSON.stringify(u));
        return null;
      }

      let uName = u.Name;

      if ( uName == undefined ) { // Added because when you remove the person in react comp, the user still is there, the name just gets removed.
        console.log('createPeopleField - did you remove a person from the array?', users, u);
        alert('createPeopleField - did you remove a person from the array?' +  JSON.stringify(u));
        return null;
      }

      if (uName.indexOf('|') > -1 && uName.indexOf('@') > 0 ) {
        //This is an ID structure from reading in from the list:  "i:0#.f|membership|clicky.mcclickster@mcclickster.onmicrosoft.com"
        let uProps = uName.split('|');
        let expectedEmailIndex = 2;
        if (uProps.length === 3 && uProps[expectedEmailIndex].indexOf('@') > -1) {
          return uProps[expectedEmailIndex];
        }
      }
      console.log('Unknown User Structure for createPeopleField', u);
      alert('Unknown User Structure for createPeopleField: ' +  JSON.stringify(u));

      return null;
    });

    let addUserButton = createIconButton('FollowUser','Add you',addYouToField, null, null );

      return (
          // Uncontrolled
          <div id={ pageIDPref + field.column } style={{ width: fieldWidth }} className={ stylesF.peopleBlock}>
            <div className={stylesF.addMeButton}>{ addUserButton } </div>
              <PeoplePicker
                  context={wpContext}
                  webAbsoluteUrl={ webAbsoluteUrl }
                  defaultSelectedUsers={ emails }
                  titleText={ field.title }
                  personSelectionLimit={maxCount}
                  //groupName={"Team Site Owners"} // Leave this blank in case you want to filter from all users
                  showtooltip={false}
                  required={false} // isRequired in v1.16
                  disabled={false}
                  onChange={(person: any) => {  // selectedItems in v1.16
                    _onChange(field.column, person);
                  }}
                  showHiddenInUI={false}
                  principalTypes={[PrincipalType.User]}
                  resolveDelay={1000} 
                  ensureUser={true}
                  peoplePickerWPclassName={stylesF.fieldWithIconButton}
              /></div>
      );

  }