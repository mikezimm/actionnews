
export type INewsScope = 'User' | 'Page' | 'Site' | 'Web' | 'user' | 'page' | 'site' | 'web';

import { makeTheTimeObject, ITheTime } from '../../../services/dateServices';

import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IQuickButton } from './IReUsableInterfaces';

export interface IActionnewsProps {
  description: string;

  pageContext: PageContext;
  wpContext: WebPartContext;
  WebpartElement: HTMLElement;   //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/

  today: ITheTime;

  tenant: string;

  scope: INewsScope;
  listWeb: string;
  listName: string;

  pageUrl: string;
  pageId: string;
  webServerRelativeUrl: string;

  titleAddendum: string;
  comments: string;
  quickNewButton: IQuickButton;

  pageLibraryServerRelativeUrl: string;
  pageLibraryTitle: string;
  pageLibraryId: any;
  collectionURL: string;

  allowSplit: boolean;
  allowCopy: boolean;

}
