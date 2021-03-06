
import * as React from 'react';
import { Icon  } from 'office-ui-fabric-react/lib/Icon';

import { Web, IList, IItem, IItemAddResult, } from "@pnp/sp/presets/all";
import { Link, ILinkProps } from 'office-ui-fabric-react';

import { IMyProgress, IQuickButton, IQuickCommands, IUser, IQuickField } from '../IReUsableInterfaces';

import { IActionItem } from '../IActionnewsState';

import { autoDetailsList } from '../../../../services/hoverCardService';

import { doesObjectExistInArray,  } from '../../../../services/arrayServices';

import { checkIfUserExistsInArray } from '../../../../services/userServices';

import { findParentElementPropLikeThis } from '../../../../services/basicElements';

import { getHelpfullError } from '../../../../services/ErrorHandler';

import { buildConfirmDialog, IMyDialogProps } from '../../../../services/dialogBoxService'; 

import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping, } from "@pnp/spfx-controls-react/lib/ListView";
import { IGroup } from 'office-ui-fabric-react/lib/components/DetailsList';

import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { Fabric, Stack, IStackTokens, initializeIcons } from 'office-ui-fabric-react';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';


import { Dialog, DialogType, DialogFooter, IDialogProps } 	from 'office-ui-fabric-react/lib/Dialog';
import { Button, ButtonType, } 			from 'office-ui-fabric-react/lib/Button';
import { Label } 			from 'office-ui-fabric-react/lib/Label';

import { } from '../ReactList/listFunctions';

/***
 *    .d8888.  .d8b.  db    db d88888b      d88888b d8888b. d888888b d888888b      d8888b.  .d8b.  d8b   db d88888b      d888888b d888888b d88888b .88b  d88. 
 *    88'  YP d8' `8b 88    88 88'          88'     88  `8D   `88'   `~~88~~'      88  `8D d8' `8b 888o  88 88'            `88'   `~~88~~' 88'     88'YbdP`88 
 *    `8bo.   88ooo88 Y8    8P 88ooooo      88ooooo 88   88    88       88         88oodD' 88ooo88 88V8o 88 88ooooo         88       88    88ooooo 88  88  88 
 *      `Y8b. 88~~~88 `8b  d8' 88~~~~~      88~~~~~ 88   88    88       88         88~~~   88~~~88 88 V8o88 88~~~~~         88       88    88~~~~~ 88  88  88 
 *    db   8D 88   88  `8bd8'  88.          88.     88  .8D   .88.      88         88      88   88 88  V888 88.            .88.      88    88.     88  88  88 
 *    `8888Y' YP   YP    YP    Y88888P      Y88888P Y8888D' Y888888P    YP         88      YP   YP VP   V8P Y88888P      Y888888P    YP    Y88888P YP  YP  YP 
 *                                                                                                                                                            
 *                                                                                                                                                            
 */

/**
 * 
 * @param webUrl 
 * @param listName 
 * @param quickFields 
 * @param recentUsers - This should include both the local User ID and remote User IDs for any user fields.
 */
export async function _saveEditPaneItem( webUrl: string, listName: string, quickFields : IQuickField[][], staticFields : IQuickField[][], recentUsers: IUser[] ) {

    let saveNewObject : any = null;
    saveNewObject = addTheseFieldsToSaveObject( saveNewObject , quickFields, recentUsers);
    saveNewObject = addTheseFieldsToSaveObject( saveNewObject , staticFields, recentUsers);

    console.log('prepared saveEditPanelItem: ', saveNewObject );
    //saveNewObject = { Title: 'Test Title'  } ;
    let results = await _saveNewItem( webUrl, listName, saveNewObject);
    return results;

}

/***
 *     .d8b.  d8888b. d8888b.      d88888b d888888b d88888b db      d8888b. .d8888.      d888888b  .d88b.       .d8888.  .d8b.  db    db d88888b 
 *    d8' `8b 88  `8D 88  `8D      88'       `88'   88'     88      88  `8D 88'  YP      `~~88~~' .8P  Y8.      88'  YP d8' `8b 88    88 88'     
 *    88ooo88 88   88 88   88      88ooo      88    88ooooo 88      88   88 `8bo.           88    88    88      `8bo.   88ooo88 Y8    8P 88ooooo 
 *    88~~~88 88   88 88   88      88~~~      88    88~~~~~ 88      88   88   `Y8b.         88    88    88        `Y8b. 88~~~88 `8b  d8' 88~~~~~ 
 *    88   88 88  .8D 88  .8D      88        .88.   88.     88booo. 88  .8D db   8D         88    `8b  d8'      db   8D 88   88  `8bd8'  88.     
 *    YP   YP Y8888D' Y8888D'      YP      Y888888P Y88888P Y88888P Y8888D' `8888Y'         YP     `Y88P'       `8888Y' YP   YP    YP    Y88888P 
 *                                                                                                                                               
 *                                                                                                                                               
 */

function addTheseFieldsToSaveObject( saveNewObject, theseFields, recentUsers ) {

    //Search through each row and field for name:
    theseFields.map( fieldRow => {
        fieldRow.map ( field => {
        if ( field.name && field.value ) {
            if ( saveNewObject === null ) { saveNewObject = {}; }
            let saveColumn = field.name;
            let saveValue : any = field.value;

            if ( field.type.toLowerCase().indexOf('user') > -1  ) {
                saveColumn = saveColumn + 'Id' ;

                let theseIds = { results: [] };
                if ( field.type.toLowerCase().indexOf('user') === 0  ) {
                    if ( saveValue[0] ) {
                        let remoteId : any = checkIfUserExistsInArray( recentUsers, saveValue[0].id );
                        if ( remoteId !== false ) {
                            saveValue = recentUsers[remoteId].remoteID;
                        }

                    }

                } else { //Multi/Split User
                    // results structure for MultiUsers:  https://pnp.github.io/pnpjs/sp/items/#add-items
                    theseIds.results = saveValue.map( u => {
                        let remoteId : any = checkIfUserExistsInArray( recentUsers, u );
                        if ( remoteId !== false ) {
                            saveValue = recentUsers[remoteId].remoteID;
                        }
                        return recentUsers[remoteId].remoteID;
                    });
                    saveValue = theseIds;
                    if ( field.type.toLowerCase().indexOf('split') > -1 && theseIds.results.length > 0 ) { saveValue = theseIds.results[0] ; }
                }

            } else if ( field.type.toLowerCase().indexOf('date') > -1 || field.type.toLowerCase().indexOf('time') > -1 ) {
                saveValue = saveValue.toLocaleString();

            }
            saveNewObject[saveColumn] = saveValue;

        }
        });
    });

    return saveNewObject;

}

/***
 *    .d8888.  .d8b.  db    db d88888b      d8b   db d88888b db   d8b   db      d888888b d888888b d88888b .88b  d88. 
 *    88'  YP d8' `8b 88    88 88'          888o  88 88'     88   I8I   88        `88'   `~~88~~' 88'     88'YbdP`88 
 *    `8bo.   88ooo88 Y8    8P 88ooooo      88V8o 88 88ooooo 88   I8I   88         88       88    88ooooo 88  88  88 
 *      `Y8b. 88~~~88 `8b  d8' 88~~~~~      88 V8o88 88~~~~~ Y8   I8I   88         88       88    88~~~~~ 88  88  88 
 *    db   8D 88   88  `8bd8'  88.          88  V888 88.     `8b d8'8b d8'        .88.      88    88.     88  88  88 
 *    `8888Y' YP   YP    YP    Y88888P      VP   V8P Y88888P  `8b8' `8d8'       Y888888P    YP    Y88888P YP  YP  YP 
 *                                                                                                                   
 *                                                                                                                   
 */

export async function _saveNewItem( webUrl: string, listName: string, saveNewObject : any ): Promise<void>{

    //lists.getById(listGUID).webs.orderBy("Title", true).get().then(function(result) {
    //let allItems : IActionItem[] = await sp.web.webs.get();

    let results : IItemAddResult = null;

    let thisListWeb = Web(webUrl);

    let errMessage = null;

    try {
        let thisListObject = await thisListWeb.lists.getByTitle(listName);
        console.log('_saveNewItem List:', thisListObject);

        await thisListObject.items.add( saveNewObject ).then((response) => {
            results = response;

        });

    } catch (e) {
        errMessage = getHelpfullError(e, true, true);
        let errObject = JSON.stringify( saveNewObject );

        alert( 'Update Failed!\n' + errObject + "\n" + errMessage );
         console.log('Update Failed!\n' + errObject + "\n" + errMessage );
    }

    return results ? results : errMessage ;

}

/***
 *    .d8888.  .d8b.  db    db d88888b      .88b  d88.  .d88b.  d8888b. d888888b d88888b d888888b d88888b d8888b.      d888888b d888888b d88888b .88b  d88. 
 *    88'  YP d8' `8b 88    88 88'          88'YbdP`88 .8P  Y8. 88  `8D   `88'   88'       `88'   88'     88  `8D        `88'   `~~88~~' 88'     88'YbdP`88 
 *    `8bo.   88ooo88 Y8    8P 88ooooo      88  88  88 88    88 88   88    88    88ooo      88    88ooooo 88   88         88       88    88ooooo 88  88  88 
 *      `Y8b. 88~~~88 `8b  d8' 88~~~~~      88  88  88 88    88 88   88    88    88~~~      88    88~~~~~ 88   88         88       88    88~~~~~ 88  88  88 
 *    db   8D 88   88  `8bd8'  88.          88  88  88 `8b  d8' 88  .8D   .88.   88        .88.   88.     88  .8D        .88.      88    88.     88  88  88 
 *    `8888Y' YP   YP    YP    Y88888P      YP  YP  YP  `Y88P'  Y8888D' Y888888P YP      Y888888P Y88888P Y8888D'      Y888888P    YP    Y88888P YP  YP  YP 
 *                                                                                                                                                          
 *                                                                                                                                                          
 */

export async function _saveModifiedItem( webUrl: string, listName: string, Id: number, thisButtonObject : IQuickButton, sourceUserInfo: IUser, panelItem: IActionItem ): Promise<void>{


    //lists.getById(listGUID).webs.orderBy("Title", true).get().then(function(result) {
    //let allItems : IActionItem[] = await sp.web.webs.get();

    let currentTime = new Date().toLocaleString();

    let results : any[] = [];

    let thisListWeb = Web(webUrl);

    let errMessage = null;

    let newUpdateItem: any = JSON.stringify(thisButtonObject.updateItem);

    try {
        let thisListObject = await thisListWeb.lists.getByTitle(listName);
        await thisListObject.items.getById(Id).update( newUpdateItem ).then((response) => {
            if ( thisButtonObject.alert )  { alert( 'Success!\n' + thisButtonObject.alert ); }
            if ( thisButtonObject.console )  { console.log(thisButtonObject.console, response ); }
            
        });

    } catch (e) {
        errMessage = getHelpfullError(e, true, true);
        if ( thisButtonObject.alert )  { 
            alert( 'Update Failed!\n' + thisButtonObject.alert + "\n" + errMessage );
         }
         console.log('Update Failed!\n' + thisButtonObject.alert + "\n" + errMessage );
    }

    return errMessage;

}