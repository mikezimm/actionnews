import { IUser } from '../webparts/actionnews/components/IReUsableInterfaces';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

import { getHelpfullError } from './ErrorHandler';

import { Web, IList, IItem, IItemAddResult, } from "@pnp/sp/presets/all";

//getEmailFromLoginName, checkForLoginName

export function getEmailFromLoginName( uName: string ) {

let result = null;

if (uName.indexOf('|') > -1 && uName.indexOf('@') > 0 ) {
    //This is an ID structure from reading in from the list:  "i:0#.f|membership|clicky.mcclickster@mcclickster.onmicrosoft.com"
    let uProps = uName.split('|');
    let expectedEmailIndex = 2;
    if (uProps.length === 3 && uProps[expectedEmailIndex].indexOf('@') > -1) {
        result = uProps[expectedEmailIndex];
    } else {
        alert('Not able to find email from this user name: ' + uName );
    }
}

return result;

}

export function checkForLoginName( u : IUser ) {
let results = undefined;

if ( u.Name ) {
    results = u.Name;

} else if ( u.loginName ) {
    results = u.loginName;

} else if ( u.LoginName ) {
    results = u.LoginName;

} else if ( u.email ) {
    results = u.email;
}

return results;

}

export async function ensureUserHere( loginName: string, webUrl: string ) {
    
    let thisListWeb = Web(webUrl);

    let errMessage = null;

    try {
        const user = await thisListWeb.ensureUser(loginName);
        const users = thisListWeb.siteUsers;
        await users.add(user.data.LoginName);
        console.log('ensureUserHere: user', user );
        console.log('ensureUserHere: users', users );
        return user ;

    } catch (e) {
        errMessage = getHelpfullError(e, true, true);
        let saveMessage =  'Ensure Failed!\n' + loginName + "\n" + webUrl + "\n" + errMessage;

        alert( saveMessage );
        console.log( saveMessage );
    }




}