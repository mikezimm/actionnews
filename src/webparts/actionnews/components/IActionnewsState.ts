import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { IUser, IQuickCommands, ICustViewDef, IQuickField } from  './IReUsableInterfaces';

import { INewsScope } from './IActionnewsProps';

import { ITheTime, weekday3, monthStr3 } from '../../../services/dateServices';

export const ActionSearchCols = [

    'Title',
    'Primary/Title',
    'Primary/Id',

    'Secondary/Title',
    'Secondary/Id',

    'FollowupDate',
    'Notified',

    'FollowupComments',
    'Status',
    'WebURL',

    'LibraryName',
    'PageID',

    'PlannerTasks',

];

export interface INewsService {

    tenant: string;

    scope: INewsScope;
    listWeb: string;
    listName: string;
    listTitle?: string;
    listGuid?: string;

    pageUrl: string;

    contextUserInfo?: IUser;  //For site you are on ( aka current page context )
    sourceUserInfo?: IUser;   //For site where the list is stored

    currentUser?: IUser;  //Current user information on save location

    webServerRelativeUrl: string;
    pageID: string;

    pageLibraryServerRelativeUrl: string;
    pageLibraryTitle: string;
    pageLibraryId: any;
    
    viewDefs: ICustViewDef[];
    staticColumns: string[];
    selectColumns: string[];
    expandColumns: string[];
    staticColumnsStr: string;
    selectColumnsStr: string;
    expandColumnsStr: string;
    removeFromSelect: string[];
    
}


export interface IActionnewsState {
    description: string;

    WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    
    newsService: INewsService;

    quickCommands: IQuickCommands;

    quickFields: IQuickField[][];
    staticFields: IQuickField[][];

    allItems: IActionItem[];

    bannerMessage: any;

    showTips: boolean;

    errMessage: string;

    groupByFields: IGrouping[];

    showNewItem: boolean;
    panelWidth: PanelType;

    recentUsers: IUser[];

  }

export type IActionStatus = '1. Created' | '3. Reviewing' | '5. Complete' ;

export const ActionStatus : IActionStatus[] = ['1. Created', '3. Reviewing', '5. Complete'];

export interface IPlannerTask {
    userId: string;
    plannerId: string;
    ItemId: string;
}

export interface IActionItem {  //extends Partial<any>

    Id: any;
    Title: string;
    Primary: number[];
    Secondary?: number[];
    FollowupDate: string;
    Notified: string;
    FollowupComments: string;
    Status: IActionStatus;
    WebURL: string;
    LibraryName: string;
    PageID: string;
    PlannerTasks: IPlannerTask[];

    searchString: string;
    meta: string[];

    Created: any;
    Modified: any;
    Author: any;
    Editor: any;
    timeCreated : ITheTime;

    timeModified : ITheTime;
    bestCreate: string;
    bestMod: string;

    author: IUser;
    editor: IUser;

    Attachments?: boolean; //Added for compatibility and reusability with ReactList

}