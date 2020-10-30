import { IUser, } from  './IReUsableInterfaces';

import { INewsScope } from './IActionnewsProps';

import { ITheTime, weekday3, monthStr3 } from '../../../services/dateServices';

export const ActionSearchCols = [

    'Title',
    'Primary',
    'Secondary',
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

    currentUser?: IUser;  //Current user information on save location

    pageID: string;
    
}

export interface IActionnewsState {
    description: string;

    WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    
    newsService: INewsService; 

    allItems: IActionItem[];

    errMessage: string;
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

}