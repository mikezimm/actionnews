
export type INewsScope = 'User' | 'Page' | 'Site';

import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IActionnewsProps {
  description: string;

  pageContext: PageContext;
  wpContext: WebPartContext;
  WebpartElement: HTMLElement;   //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/

  tenant: string;

  scope: INewsScope;
  listWeb: string;
  listName: string;

  pageUrl: string;
  pageId: string;
  webServerRelativeUrl: string;

  pageLibraryServerRelativeUrl: string;
  pageLibraryTitle: string;
  pageLibraryId: any;

}
