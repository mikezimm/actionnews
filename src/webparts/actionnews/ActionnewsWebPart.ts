import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import { propertyPaneBuilder } from '../../services/propPane/PropPaneBuilder';

import { sp } from '@pnp/sp';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { PageContext } from '@microsoft/sp-page-context';

import * as strings from 'ActionnewsWebPartStrings';
import Actionnews from './components/Actionnews';
import { IActionnewsProps, INewsScope } from './components/IActionnewsProps';

import { makeTheTimeObject } from '../../services/dateServices';
import { IQuickButton } from './components/IReUsableInterfaces';

import { getHelpfullError } from '../../services/ErrorHandler';

export interface IActionnewsWebPartProps {
  description: string;

  // 0 - Context
  pageContext: PageContext;

  scope: INewsScope;
  listWeb: string;
  listName: string;

  allowSplit: boolean;
  allowCopy: boolean;

  titleAddendum: string;
  comments: string;

  quickNewButton: string;

}

export default class ActionnewsWebPart extends BaseClientSideWebPart<IActionnewsWebPartProps> {




/***
 *          .d88b.  d8b   db d888888b d8b   db d888888b d888888b 
 *         .8P  Y8. 888o  88   `88'   888o  88   `88'   `~~88~~' 
 *         88    88 88V8o 88    88    88V8o 88    88       88    
 *         88    88 88 V8o88    88    88 V8o88    88       88    
 *         `8b  d8' 88  V888   .88.   88  V888   .88.      88    
 *          `Y88P'  VP   V8P Y888888P VP   V8P Y888888P    YP    
 *                                                               
 *                                                               
 */

    //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
    public onInit():Promise<void> {
      return super.onInit().then(_ => {

        //https://stackoverflow.com/questions/52010321/sharepoint-online-full-width-page
        if ( window.location.href &&  
          window.location.href.toLowerCase().indexOf("layouts/15/workbench.aspx") > 0 ) {
            
          if (document.getElementById("workbenchPageContent")) {
            document.getElementById("workbenchPageContent").style.maxWidth = "none";
          }
        } 

        //console.log('window.location',window.location);
        sp.setup({
          spfxContext: this.context
        });
      });
    }

    public getUrlVars(): {} {
      var vars = {};
      vars = location.search
      .slice(1)
      .split('&')
      .map(p => p.split('='))
      .reduce((obj, pair) => {
        const [key, value] = pair.map(decodeURIComponent);
        return ({ ...obj, [key]: value }) ;
      }, {});
      return vars;
    }


  public render(): void {

    console.log('Page Context:', this.context.pageContext );
    //Be sure to always pass down an actual URL if the webpart prop is empty at this point.
    //If it's undefined, null or '', get current page context value
    let tenant = this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl,"");

    let scope : INewsScope = this.properties.scope ? this.properties.scope : 'Site';

    let quickNewButtonObj : IQuickButton = null;
    if ( this.properties.quickNewButton && this.properties.quickNewButton.length > 0 ) {
      try { 
        quickNewButtonObj = JSON.parse( this.properties.quickNewButton );
      } catch (e) {
        let errMess = getHelpfullError( e );
        alert('Your Quick New Button property is not a valid JSON object... please fix!\n\n'+ errMess );
      }

    }


    //It's best to add Tenant to URUL here
    let listWeb = this.properties.listWeb ? this.properties.listWeb : tenant + '/sites/ActionNewsSourceTTP/';
    let listName = this.properties.listName ? this.properties.listName : 'TheNewsPosts';
    let pageUrl = this.context.pageContext.legacyPageContext.webAbsoluteUrl + this.context.pageContext.legacyPageContext.serverRequestPath;
    let pageId = this.context.pageContext.legacyPageContext.pageItemId;
    let webServerRelativeUrl = this.context.pageContext.legacyPageContext.webServerRelativeUrl;
    let pageLibraryServerRelativeUrl = this.context.pageContext.legacyPageContext.listUrl;
    let pageLibraryTitle = this.context.pageContext.list ? this.context.pageContext.list.title : '';
    let pageLibraryId = this.context.pageContext.list ? this.context.pageContext.list.id : '';
    let collectionURL = this.context.pageContext.site.serverRelativeUrl;

    const element: React.ReactElement<IActionnewsProps> = React.createElement(
      Actionnews,
      {
        description: this.properties.description,

          // 0 - Context
        pageContext: this.context.pageContext,
        wpContext: this.context,
        tenant: tenant,

        //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        WebpartElement: this.domElement,

        today: makeTheTimeObject(''),

        scope: scope,
        listWeb: listWeb,
        listName: listName,

        pageUrl: pageUrl,
        pageId: pageId,
        webServerRelativeUrl: webServerRelativeUrl,

        pageLibraryServerRelativeUrl: pageLibraryServerRelativeUrl,
        pageLibraryTitle: pageLibraryTitle,
        pageLibraryId: pageLibraryId,
        collectionURL: collectionURL,

        allowSplit: this.properties.allowSplit,
        allowCopy: this.properties.allowCopy,

        titleAddendum: this.properties.titleAddendum ,
        comments: this.properties.comments ,

        quickNewButton: quickNewButtonObj,
      
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return propertyPaneBuilder.getPropertyPaneConfiguration(
      this.properties,
      );
  }

  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any) {
        /**
         * This section is used to determine when to refresh the pane options
         */
        let updateOnThese = [
          'scope','listWeb','listName','allowSplit','allowCopy','otherTab',
          'titleAddendum','comments','quickNewButton'
        ];

        //alert('props updated');
        console.log('onPropertyPaneFieldChanged:', propertyPath, oldValue, newValue);
        if (updateOnThese.indexOf(propertyPath) > -1 ) {
          this.properties[propertyPath] = newValue;
          this.context.propertyPane.refresh();
        }
        this.render();
      }
}
