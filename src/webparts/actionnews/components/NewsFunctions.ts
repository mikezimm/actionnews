import { Web, IList, IItem } from "@pnp/sp/presets/all";

import { sp } from '@pnp/sp';

import { makeSmallTimeObject, makeTheTimeObject,ITheTime, getAge, getBestTimeDelta, isStringValidDate, monthStr3} from '../../../services/dateServices';

import { doesObjectExistInArray, addItemToArrayIfItDoesNotExist, sortKeysByOtherKey } from '../../../services/arrayServices';

import { getHelpfullError } from '../../../services/ErrorHandler';

import { getExpandColumns, getKeysLike, getSelectColumns } from '../../../services/getFunctions';

import { IActionnewsState, ActionStatus, IActionItem, IActionStatus, IPlannerTask, ActionSearchCols, INewsService,  } from './IActionnewsState';


const allColumns = ['Title','Id','Created','Modified','Author/Title','Author/ID','Author/Name','Editor/Title','Editor/ID','Editor/Name',
    'Primary/Title', 'Primary/ID', 'Secondary/Title', 'Secondary/ID'];

export async function allAvailableActions(   newsService: INewsService, addTheseItemsToState: any  ): Promise<IActionItem[]>{

    let expColumns = getExpandColumns(allColumns);
    let selColumns = getSelectColumns(allColumns);

    let allItems : IActionItem[] = null;

//    let legacyPageContext = await currentPage.legacyPageContext()//.pageItemId;
//    console.log('UniqueId:', legacyPageContext.pageItemId);
//    newsService.pageID = legacyPageContext.pageItemId;

    let getThisWeb = newsService.listWeb;
    if ( getThisWeb.indexOf(newsService.tenant) < 0 ) {getThisWeb = newsService.tenant + newsService.listWeb; }
    let thisListWeb = Web( getThisWeb );
    let scope = newsService.scope;
    let errMessage = '';
    
    let thisListObject = thisListWeb.lists.getByTitle(newsService.listName);
    let expandThese = expColumns.join(',');
    let selectCols = '*,' + selColumns.join(',');

    /**
     * IN FUTURE, ALWAYS BE SURE TO PUT SELECT AND EXPAND AFTER .ITEMS !!!!!!
     */

     try {
        let restFilter = null;

        if ( restFilter !== null ) {
            allItems = await thisListObject.items.select(selectCols).expand(expandThese).orderBy('ID',false).top(500).filter(restFilter).get();
        } else {
            allItems = await thisListObject.items.select(selectCols).expand(expandThese).orderBy('ID',false).top(500).get();
        }
    } catch (e) {
        errMessage = getHelpfullError(e, true, true);

    }

    /**
     * Get page title here
     */

     let thisPage = null;
    getThisWeb = newsService.webServerRelativeUrl;
    if ( getThisWeb.indexOf(newsService.tenant) < 0 ) {getThisWeb = newsService.tenant + newsService.webServerRelativeUrl; }
    thisListWeb = Web( getThisWeb );

    thisListObject = thisListWeb.lists.getByTitle(newsService.pageLibraryTitle);
    /**
     * IN FUTURE, ALWAYS BE SURE TO PUT SELECT AND EXPAND AFTER .ITEMS !!!!!!
     */

     try {
        let pageID : any = newsService.pageID;
        thisPage = await thisListObject.items.getById( pageID ).get();
        newsService.pageTitle = thisPage.Title;
        
    } catch (e) {
        errMessage = getHelpfullError(e, true, true);

    }

    allItems = processAllItems( allItems, errMessage, newsService, addTheseItemsToState );

    return allItems;

}

export function processAllItems( allItems : IActionItem[], errMessage: string, newsService: INewsService, addTheseItemsToState: any ){

    let thisIsNow = new Date().toLocaleString();

    for (let i in allItems ) {


    }

    addTheseItemsToState( newsService, allItems, errMessage );
    return allItems;

}
//  d8888b. db    db d888888b db      d8888b.      .88b  d88. d88888b d888888b  .d8b.  
//  88  `8D 88    88   `88'   88      88  `8D      88'YbdP`88 88'     `~~88~~' d8' `8b 
//  88oooY' 88    88    88    88      88   88      88  88  88 88ooooo    88    88ooo88 
//  88~~~b. 88    88    88    88      88   88      88  88  88 88~~~~~    88    88~~~88 
//  88   8D 88b  d88   .88.   88booo. 88  .8D      88  88  88 88.        88    88   88 
//  Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'      YP  YP  YP Y88888P    YP    YP   YP 
//                                                                                     
//     

function buildMetaFromItem( theItem: IActionItem ) {
    let meta: string[] = ['All'];

    if ( theItem.timeCreated.daysAgo === 0 ) {
        meta = addItemToArrayIfItDoesNotExist(meta, 'New');
    } else {
        meta = theItem.timeCreated.daysAgo < 180 ? addItemToArrayIfItDoesNotExist(meta, 'RecentlyCreated') : addItemToArrayIfItDoesNotExist(meta, 'Old');
    }

    meta = theItem.timeModified.daysAgo < 180 ? addItemToArrayIfItDoesNotExist(meta, 'RecentlyUpdated') : addItemToArrayIfItDoesNotExist(meta, 'Stale');

    //meta = addItemToArrayIfItDoesNotExist(meta, theItem.sort );

    return meta;
}

















export async function allAvailableActionsTitle(   newsService: INewsService, addTheseItemsToTitle: any ): Promise<string>{

    let result = null;
    let errMessage = null;

    let getThisWeb = newsService.webServerRelativeUrl;
    if ( getThisWeb.indexOf(newsService.tenant) < 0 ) {getThisWeb = newsService.tenant + newsService.webServerRelativeUrl; }
    let thisListWeb = Web( getThisWeb );

    let thisListObject = thisListWeb.lists.getByTitle(newsService.pageLibraryTitle);
    /**
     * IN FUTURE, ALWAYS BE SURE TO PUT SELECT AND EXPAND AFTER .ITEMS !!!!!!
     */

     try {
        let pageID : any = newsService.pageID;
        result = await thisListObject.items.getById( pageID ).get();
    } catch (e) {
        errMessage = getHelpfullError(e, true, true);

    }

    addTheseItemsToTitle( result );

    return result.Title;

}




export async function getPageTitleTest( newsService: INewsService ) {

    let result = '';
    let list = await sp.web.lists.getByTitle(newsService.pageLibraryTitle);
    let currentPage = await list.items.getById( parseInt( newsService.pageID ) ).get();

    console.log( 'Page Title is' , currentPage.Title );
    return currentPage.Title;

}

//  d8888b. db    db d888888b db      d8888b.      .d8888. d88888b  .d8b.  d8888b.  .o88b. db   db 
//  88  `8D 88    88   `88'   88      88  `8D      88'  YP 88'     d8' `8b 88  `8D d8P  Y8 88   88 
//  88oooY' 88    88    88    88      88   88      `8bo.   88ooooo 88ooo88 88oobY' 8P      88ooo88 
//  88~~~b. 88    88    88    88      88   88        `Y8b. 88~~~~~ 88~~~88 88`8b   8b      88~~~88 
//  88   8D 88b  d88   .88.   88booo. 88  .8D      db   8D 88.     88   88 88 `88. Y8b  d8 88   88 
//  Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'      `8888Y' Y88888P YP   YP 88   YD  `Y88P' YP   YP 
//                                                                                                 
//         

function buildSearchStringFromItem (newItem : IActionItem, staticColumns: string[]) {

    let result = '';
    let delim = '|||';

    if ( newItem.Title ) { result += 'Title=' + newItem.Title + delim ; }
    if ( newItem.Id ) { result += 'Id=' + newItem.Id + delim ; }

    staticColumns.map( c => {
        let thisCol = c.replace('/','');
        if ( newItem[thisCol] ) { result += c + '=' + newItem[thisCol] + delim ; }
    });

    if ( newItem['odata.type'] ) { result += newItem['odata.type'] + delim ; }

    if ( newItem.meta.length > 0 ) { result += 'Meta=' + newItem.meta.join(',') + delim ; }

    result = result.toLowerCase();

    return result;

}