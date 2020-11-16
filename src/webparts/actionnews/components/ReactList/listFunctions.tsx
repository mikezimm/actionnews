
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";

import { Web, IList, IItem } from "@pnp/sp/presets/all";

import { ICustViewDef, IQuickButton, IUser } from '../IReUsableInterfaces';

import { getHelpfullError } from '../../../../services/ErrorHandler';

import { removeItemFromArrayOnce, removeItemFromArrayAll, addItemToArrayIfItDoesNotExist } from '../../../../services/arrayServices';

import { ensureUserHere } from '../../../../services/userServices';


import { IActionItem } from '../IActionnewsState';

 /***
 *     d888b  d88888b d888888b      db    db d888888b d88888b db   d8b   db      d88888b db    db d8b   db  .o88b. d888888b d888888b  .d88b.  d8b   db .d8888. 
 *    88' Y8b 88'     `~~88~~'      88    88   `88'   88'     88   I8I   88      88'     88    88 888o  88 d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
 *    88      88ooooo    88         Y8    8P    88    88ooooo 88   I8I   88      88ooo   88    88 88V8o 88 8P         88       88    88    88 88V8o 88 `8bo.   
 *    88  ooo 88~~~~~    88         `8b  d8'    88    88~~~~~ Y8   I8I   88      88~~~   88    88 88 V8o88 8b         88       88    88    88 88 V8o88   `Y8b. 
 *    88. ~8~ 88.        88          `8bd8'    .88.   88.     `8b d8'8b d8'      88      88b  d88 88  V888 Y8b  d8    88      .88.   `8b  d8' 88  V888 db   8D 
 *     Y888P  Y88888P    YP            YP    Y888888P Y88888P  `8b8' `8d8'       YP      ~Y8888P' VP   V8P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
 *                                                                                                                                                             
 *                                                                                                                                                             
 */

function getBestFitView (  viewDefs: ICustViewDef[], currentWidth: number ) {
    let result : ICustViewDef = null;
    let minResult : ICustViewDef = null;

    let maxViewWidth: number = 0 ;
    let minViewWidth: number = 10000;

    viewDefs.map( vd => {
        let thisWidth: number = typeof vd.minWidth === 'string' ? parseInt(vd.minWidth,10) : vd.minWidth;
        if ( currentWidth >= thisWidth && thisWidth >= maxViewWidth ) {
            result = vd;
            maxViewWidth = thisWidth;
        }
    });

    //This section was created in case the webpart width is smaller than the smallest defined width
    if ( result === null ) {
        console.log('getAppropriateViewFields ERR:  User defined are to big for this webpart width.');
        viewDefs.map( vd => {
            let thisWidth: number = typeof vd.minWidth === 'string' ? parseInt(vd.minWidth,10) : vd.minWidth;
            if ( thisWidth < minViewWidth ) {
                minResult = vd;
                minViewWidth = thisWidth;
            }
        });
        result = minResult;
    }

    // console.log('getAppropriateViewFields: currentWidth = ', currentWidth);
    // console.log('getAppropriateViewFields: Width >= ', maxViewWidth);
    // console.log('getAppropriateViewFields: vd result', result);

    return result;
    
}


export function getAppropriateViewFields ( viewDefs: ICustViewDef[], currentWidth: number ) {
    let result : IViewField[] = [];

    if ( viewDefs ) {

        result = getBestFitView( viewDefs, currentWidth ).viewFields;
    
        let avgWidth = result.length > 0 ? currentWidth/result.length : 100;
        let completeResult = result.map( f => {
    
            let thisField = f;
            let minWidth = thisField.minWidth ? thisField.minWidth : avgWidth;
            let maxWidth = thisField.maxWidth ? thisField.maxWidth : minWidth  + 100;
            if ( thisField.minWidth === undefined ) { thisField.minWidth = minWidth; }
            if ( thisField.maxWidth === undefined ) { thisField.maxWidth = maxWidth; }
            if ( thisField.isResizable === undefined ) { thisField.isResizable = true; }
            if ( thisField.sorting === undefined ) { thisField.sorting = true; }
            return thisField;
        });
        /*        */

        // console.log('getAppropriateViewFields: completeResult', completeResult);

        return completeResult;

    } else {
        alert('View Def is not available... can not show any items! - see getAppropriateViewFields()');
        return null;
    }

}

/***
 *     d888b  d88888b d888888b      db    db d888888b d88888b db   d8b   db       d888b  d8888b.  .d88b.  db    db d8888b. .d8888. 
 *    88' Y8b 88'     `~~88~~'      88    88   `88'   88'     88   I8I   88      88' Y8b 88  `8D .8P  Y8. 88    88 88  `8D 88'  YP 
 *    88      88ooooo    88         Y8    8P    88    88ooooo 88   I8I   88      88      88oobY' 88    88 88    88 88oodD' `8bo.   
 *    88  ooo 88~~~~~    88         `8b  d8'    88    88~~~~~ Y8   I8I   88      88  ooo 88`8b   88    88 88    88 88~~~     `Y8b. 
 *    88. ~8~ 88.        88          `8bd8'    .88.   88.     `8b d8'8b d8'      88. ~8~ 88 `88. `8b  d8' 88b  d88 88      db   8D 
 *     Y888P  Y88888P    YP            YP    Y888888P Y88888P  `8b8' `8d8'        Y888P  88   YD  `Y88P'  ~Y8888P' 88      `8888Y' 
 *                                                                                                                                 
 *                                                                                                                                 
 */

export function getAppropriateViewGroups ( viewDefs: ICustViewDef[], currentWidth: number ) {
    let result : IGrouping[] = [];

    if ( viewDefs ) {

        result = getBestFitView( viewDefs, currentWidth ).groupByFields;
        //console.log('getAppropriateViewGroups: ', result);
        return result;

    } else {
        alert('View Def is not available... can not show any items! - see getAppropriateViewGroups()');
        return null;
    }

}

export function getAppropriateViewProp ( viewDefs: ICustViewDef[], currentWidth: number, prop: 'includeDetails' | 'includeAttach' | 'includeListLink' ) {
    let result : boolean = false;

    if ( viewDefs ) {
        result = getBestFitView( viewDefs, currentWidth )[prop];
        //console.log('getAppropriateDetailMode: ', result);
        return result;
    } else {
        alert('View Def is not available... can not show any items! - see getAppropriateViewProp()');
        return null;
    }
}

/***
 *    db    db d8888b. d8888b.  .d8b.  d888888b d88888b      db      d888888b .d8888. d888888b      d888888b d888888b d88888b .88b  d88. 
 *    88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'          88        `88'   88'  YP `~~88~~'        `88'   `~~88~~' 88'     88'YbdP`88 
 *    88    88 88oodD' 88   88 88ooo88    88    88ooooo      88         88    `8bo.      88            88       88    88ooooo 88  88  88 
 *    88    88 88~~~   88   88 88~~~88    88    88~~~~~      88         88      `Y8b.    88            88       88    88~~~~~ 88  88  88 
 *    88b  d88 88      88  .8D 88   88    88    88.          88booo.   .88.   db   8D    88           .88.      88    88.     88  88  88 
 *    ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P      Y88888P Y888888P `8888Y'    YP         Y888888P    YP    Y88888P YP  YP  YP 
 *                                                                                                                                       
 *                                                                                                                                       
 */

export async function updateReactListItem( webUrl: string, listName: string, Id: number, thisButtonObject : IQuickButton, sourceUserInfo: IUser, panelItem: IActionItem ): Promise<void>{


    //lists.getById(listGUID).webs.orderBy("Title", true).get().then(function(result) {
    //let allItems : IActionItem[] = await sp.web.webs.get();

    let thisListWeb = Web(webUrl);

    let errMessage = null;

    let newUpdateItemObj = getUpdateObjectFromString( thisButtonObject, sourceUserInfo, panelItem );

    try {
        let thisListObject = await thisListWeb.lists.getByTitle(listName);
        await thisListObject.items.getById(Id).update( newUpdateItemObj ).then((response) => {
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

/***
 *     d888b  d88888b d888888b       .d88b.  db    db d888888b  .o88b. db   dD        db    db d8888b. d8888b.  .d8b.  d888888b d88888b       .d88b.  d8888b.    d88b d88888b  .o88b. d888888b 
 *    88' Y8b 88'     `~~88~~'      .8P  Y8. 88    88   `88'   d8P  Y8 88 ,8P'        88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'          .8P  Y8. 88  `8D    `8P' 88'     d8P  Y8 `~~88~~' 
 *    88      88ooooo    88         88    88 88    88    88    8P      88,8P          88    88 88oodD' 88   88 88ooo88    88    88ooooo      88    88 88oooY'     88  88ooooo 8P         88    
 *    88  ooo 88~~~~~    88         88    88 88    88    88    8b      88`8b   C8888D 88    88 88~~~   88   88 88~~~88    88    88~~~~~      88    88 88~~~b.     88  88~~~~~ 8b         88    
 *    88. ~8~ 88.        88         `8P  d8' 88b  d88   .88.   Y8b  d8 88 `88.        88b  d88 88      88  .8D 88   88    88    88.          `8b  d8' 88   8D db. 88  88.     Y8b  d8    88    
 *     Y888P  Y88888P    YP          `Y88'Y8 ~Y8888P' Y888888P  `Y88P' YP   YD        ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P       `Y88P'  Y8888P' Y8888P  Y88888P  `Y88P'    YP    
 *                                                                                                                                                                                             
 *                                                                                                                                                                                             
 */

export function getUpdateObjectFromString( thisButtonObject : IQuickButton, sourceUserInfo: IUser, panelItem: IActionItem ) {

    let currentTime = new Date().toLocaleString();
    
    if ( thisButtonObject.updateItem === null || thisButtonObject.updateItem === undefined ) { 
        return null ; 

    } else {

        let newUpdateItem = JSON.stringify(thisButtonObject.updateItem);

        //Replace [Today] with currect time
        newUpdateItem = newUpdateItem.replace(/\B\[Today\]\B/gi, currentTime);
    
        //Regex looks for anything matching [Today-+xxx] and replaces with date string
        var newUpdateItem2 = newUpdateItem.replace(/\[Today(.*?)\]/gi, (match =>  {
            let numb = parseInt(match.toLowerCase().substring(6).replace("]",""),10);
            var today = new Date();
            var newdate = new Date();
            newdate.setDate(today.getDate()+numb);
            let newDateString = newdate.toLocaleString();
            return newDateString;
        }) );
    
        // Replace [MyName] with userId.Title
        newUpdateItem2 = newUpdateItem2.replace(/\[MyName\]/gi, sourceUserInfo.Title );
    
        let newUpdateItemObj = JSON.parse(newUpdateItem2);
    
        //Replace [Me]
        Object.keys(newUpdateItemObj).map( k => {
            let thisColumn: any = newUpdateItemObj[k];
            if ( typeof thisColumn === 'string' ) { 
    
                //Single value set to current user
                if ( thisColumn.toLowerCase() === '[me]' ) {
                    thisColumn = sourceUserInfo.Id; 
                    console.log('thisColumn is: ', thisColumn ) ;
    
                //Single value only remove you
                } else if ( thisColumn.toLowerCase() === '[-me]' ) {
                    thisColumn = panelItem[k] === sourceUserInfo.Id ? null : panelItem[k]; 
    
                //Multi value set to current user
                } else if ( thisColumn.toLowerCase() === '{me}' ) { 
                    thisColumn = { results: [ sourceUserInfo.Id ]}; 
    
                //Multi value add current user
                } else if ( thisColumn.toLowerCase() === '{+me}' ) { 
    
                    if ( panelItem[k] ) {
                        try {
                            //thisColumn = panelItem[k].results.push( sourceUserInfo.Id ); //Errored out
                            thisColumn = panelItem[k];
                            if ( thisColumn.indexOf( sourceUserInfo.Id ) < 0 )  { thisColumn.push( sourceUserInfo.Id ); }
                            thisColumn = { results: thisColumn };
    
                        } catch (e) {
                            let err = getHelpfullError(e);
                            alert( `Error updating item Column ${k} : \n\n${err}` );
                            console.log( `Error updating item Column ${k} :`, err );
                        }
                    } else { 
                        thisColumn = { results: [ sourceUserInfo.Id ]} ;
                    }
    
                //Multi value remove current user
                } else if ( thisColumn.toLowerCase() === '{-me}' ) { 
    
                    if ( panelItem[k] ) {
                        try {
                            thisColumn = panelItem[k];
                            thisColumn = removeItemFromArrayAll(thisColumn, sourceUserInfo.Id);
                            thisColumn = { results: thisColumn };
    
                        } catch (e) {
                            let err = getHelpfullError(e);
                            alert( `Error updating item Column ${k} : \n\n${err}` );
                            console.log( `Error updating item Column ${k} :`, err );
                        }
                    } { console.log( `Did not find Column ${k} and could not remove you from it.`, panelItem );
                        console.log( `Here's the full panelItem:`, panelItem );
                    }
                } 
    
                newUpdateItemObj[k] = thisColumn;
            } // END This key value is string
        });
    
        return newUpdateItemObj;

    }

}