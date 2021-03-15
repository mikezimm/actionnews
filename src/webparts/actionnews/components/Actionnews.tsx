import * as React from 'react';
import styles from './Actionnews.module.scss';
import stylesC from './CommonStyles.module.scss';
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/presets/all";

import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import { CompoundButton, Stack, IStackTokens, elementContains, initializeIcons } from 'office-ui-fabric-react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import stylesContents from './Contents/contents.module.scss';

import { IActionnewsProps, INewsScope } from './IActionnewsProps';

import { IActionnewsState, ActionStatus, IActionItem, IActionStatus, IPlannerTask, ActionSearchCols, INewsService,   } from './IActionnewsState';

import { IQuickCommands, ICustViewDef, IQuickField, IUser } from './IReUsableInterfaces';

import { escape } from '@microsoft/sp-lodash-subset';

import { allAvailableActions, getPageTitleTest, allAvailableActionsTitle } from './NewsFunctions';

import * as links from '@mikezimm/npmfunctions/dist/HelpInfo/Links/LinksRepos';

import { getExpandColumns, getKeysLike, getSelectColumns } from '../../../services/getFunctions';

import ReactListItems from './ReactList/reactListView';

import { getHelpfullError, } from '@mikezimm/npmfunctions/dist/Logging/ErrorHandler';
import { createIconButton , defCommandIconStyles} from "./createButtons/IconButton";

import  EarlyAccess from './HelpInfo/EarlyAccess';

import ThisEditPane from './Panel/ThisEditPane';

import { ActionQuickCommands } from './const_ActionCommands';

import { ActionNewsViewDefs } from './const_ActionViewDefs';

import { getNewActionQuickFields } from './const_ActionQuickFields';

import InfoPages from './HelpInfo/Component/InfoPages';

import { findParentElementPropLikeThis } from '../../../services/basicElements';

import { getAppropriateViewFields, getAppropriateViewGroups, } from './ReactList/listFunctions';
import { PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';

import {  } from './NewsFunctions';

import { makeIQuickField } from './const_ActionQuickFields';

export default class Actionnews extends React.Component<IActionnewsProps, IActionnewsState> {



    /***
     *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d8888b. d8888b. d888888b db      db           db      d888888b .d8888. d888888b 
     *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          88  `8D 88  `8D   `88'   88      88           88        `88'   88'  YP `~~88~~' 
     *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88   88 88oobY'    88    88      88           88         88    `8bo.      88    
     *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88   88 88`8b      88    88      88           88         88      `Y8b.    88    
     *    Y8b  d8 88 `88. 88.     88   88    88    88.          88  .8D 88 `88.   .88.   88booo. 88booo.      88booo.   .88.   db   8D    88    
     *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      Y8888D' 88   YD Y888888P Y88888P Y88888P      Y88888P Y888888P `8888Y'    YP    
     *                                                                                                                                          
     *                                                                                                                                          
     */

    private createMainList( viewDefs: ICustViewDef[] ) {
      
      let pageID = this.props.pageId;

      let list: INewsService = {
        tenant: this.props.tenant,

        scope: this.props.scope,
        listWeb: this.props.listWeb,
        listName: this.props.listName,
        listTitle: null,
        listGuid: null,

        currentUser: null,  //Current user information on save location
    
        pageID: pageID,
        pageUrl: this.props.pageUrl,
        webServerRelativeUrl: this.props.webServerRelativeUrl,
        pageTitle: pageID === "-1" ? 'Workbench' : null,

        collectionURL: this.props.collectionURL,
        pageLibraryServerRelativeUrl: this.props.pageLibraryServerRelativeUrl ,
        pageLibraryTitle: this.props.pageLibraryTitle ,
        pageLibraryId: this.props.pageLibraryId ,

        contextUserInfo: {
            LoginName: this.props.pageContext.user.loginName,
            Title: this.props.pageContext.user.displayName,
            email: this.props.pageContext.user.email,
        },

        sourceUserInfo: null,

        viewDefs: viewDefs,
        staticColumns: [],
        selectColumns: [],
        expandColumns: [],
        staticColumnsStr: '',
        selectColumnsStr: '',
        expandColumnsStr: '',
        removeFromSelect: ['currentTime','currentUser'],
      };

      list = this.updateMainListColumns( list ) ;

      return list;
  }
  
  
/***
 *    db    db d8888b. d8888b.  .d8b.  d888888b d88888b      d8888b. d8888b. d888888b db      db      db      d888888b .d8888. d888888b       .o88b.  .d88b.  db      db    db .88b  d88. d8b   db .d8888. 
 *    88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'          88  `8D 88  `8D   `88'   88      88      88        `88'   88'  YP `~~88~~'      d8P  Y8 .8P  Y8. 88      88    88 88'YbdP`88 888o  88 88'  YP 
 *    88    88 88oodD' 88   88 88ooo88    88    88ooooo      88   88 88oobY'    88    88      88      88         88    `8bo.      88         8P      88    88 88      88    88 88  88  88 88V8o 88 `8bo.   
 *    88    88 88~~~   88   88 88~~~88    88    88~~~~~      88   88 88`8b      88    88      88      88         88      `Y8b.    88         8b      88    88 88      88    88 88  88  88 88 V8o88   `Y8b. 
 *    88b  d88 88      88  .8D 88   88    88    88.          88  .8D 88 `88.   .88.   88booo. 88booo. 88booo.   .88.   db   8D    88         Y8b  d8 `8b  d8' 88booo. 88b  d88 88  88  88 88  V888 db   8D 
 *    ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P      Y8888D' 88   YD Y888888P Y88888P Y88888P Y88888P Y888888P `8888Y'    YP          `Y88P'  `Y88P'  Y88888P ~Y8888P' YP  YP  YP VP   V8P `8888Y' 
 *                                                                                                                                                                                                         
 *                                                                                                                                                                                                         
 */


private updateMainListColumns( list: INewsService ) {

  let selectCols: string = "*";
  let expandThese = "";

  let allColumns = ['Title','Id','Created','Modified','Author/Title','Author/ID','Author/Name','Editor/Title','Editor/ID','Editor/Name'];

  //Add main list columns to allColumns
  ActionSearchCols.map( c=> { allColumns.push(c) ; });

  //Add ViewDef columns to column list
  list.viewDefs.map( vd => {
      vd.viewFields.map( vf => {
          if ( allColumns.indexOf( vf.name ) < 0 && list.removeFromSelect.indexOf(vf.name) < 0 ) {
              allColumns.push( vf.name );
          }
      });
  });

  let expColumns = getExpandColumns(allColumns);
  let selColumns = getSelectColumns(allColumns);

  selColumns.length > 0 ? selectCols += "," + allColumns.join(",") : selectCols = selectCols;
  if (expColumns.length > 0) { expandThese = expColumns.join(","); }

  list.selectColumns = selColumns;
  list.staticColumns = allColumns;
  list.expandColumns = expColumns;

  list.selectColumnsStr = selColumns.join(',');
  list.staticColumnsStr = allColumns.join(',');
  list.expandColumnsStr = expColumns.join(',');

  return list;

}

private makeDefaultTextField( field: 'Title' | 'Comments' , pageTitleBlock: string ) {

  let defaultValue = field === 'Title' ? this.props.titleAddendum : this.props.comments;
  let newValue = '';

  if ( field === 'Title' && defaultValue.toLowerCase().indexOf('<title>') === -1 ) {
    newValue = defaultValue + ' - ' + pageTitleBlock;

  } else if ( defaultValue.toLowerCase().indexOf('<title>') > -1 ) {
    newValue = defaultValue.replace(/\<Title\>/gi, pageTitleBlock);

  }

  newValue = newValue.replace(/\<Today\>/gi, '');
  if (this.state && this.state.newsService && this.state.newsService.contextUserInfo ) {
    newValue = newValue.replace(/\<UserName\>/gi, this.state.newsService.contextUserInfo.Title );
    newValue = newValue.replace(/\<UserInitials\>/gi, this.state.newsService.contextUserInfo.initials);
  }

  return newValue;

}

/***
 *          .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b. 
 *         d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D 
 *         8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY' 
 *         8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b   
 *         Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88. 
 *          `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD 
 *                                                                                                       
 *                                                                                                       
 */


public constructor(props:IActionnewsProps){
  super(props);

//  let quickCommands : IQuickCommands = this.props.quickCommands ? JSON.parse( JSON.stringify(this.props.quickCommands )) : null ;
    
let quickCommands : IQuickCommands = ActionQuickCommands;

//Keeping this in case I allow some settings to be brought in via
  if ( quickCommands !== null ) {
      if ( quickCommands.onUpdateReload === true ) {
          quickCommands.refreshCallback = this._reloadOnUpdate.bind(this);
      }
      if ( quickCommands.successBanner === undefined || quickCommands.successBanner === null ) {
          quickCommands.successBanner = 3.5 * 1000;
      } else { quickCommands.successBanner = quickCommands.successBanner * 1000; }
  }

  let quickFields : IQuickField[][] = getNewActionQuickFields( this.makeDefaultTextField('Title','Fetching Page Title - '), this.makeDefaultTextField('Comments',this.props.comments ) ) ;

  this.state = {

        // 0 - Context
        description: 'string',

        //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        WebpartHeight: this.props.WebpartElement.getBoundingClientRect().height ,
        WebpartWidth:  this.props.WebpartElement.getBoundingClientRect().width - 50 ,

        newsService : this.createMainList( ActionNewsViewDefs ),

        allItems: [],
        errMessage: '',

        quickCommands: quickCommands,

        quickFields: quickFields,
        staticFields: this.makeStaticFields(),

        bannerMessage: null,
        pageTitle: null,

        showTips: false,

        showNewItem: false,
    
        groupByFields: [],

        recentUsers: [],

        panelWidth: PanelType.medium,

        allowSplit: this.props.allowSplit,
        allowCopy: this.props.allowCopy,
  
  };

}

private makeStaticFields ( ) {
  let pageLinkDesc = this.props.pageUrl.replace(this.props.tenant,'');
  let PageID = makeIQuickField("PageID", "PageID", "PageID", "Text", false, '', false, true, this.props.pageId.toString()  );
  let LibraryName = makeIQuickField("LibraryName", "LibraryName", "LibraryName", "Text", false, '', false, true, this.props.pageLibraryTitle  );
  let WebURL = makeIQuickField("WebURL", "WebURL", "WebURL", "Text", false, '', false, true, this.props.webServerRelativeUrl  );
  let PageLink = makeIQuickField("PageLink", "PageLink", "PageLink", "Link", false, '', false, true, { Description: pageLinkDesc, Url: this.props.pageUrl } );
  let CollectionURL = makeIQuickField("CollectionURL", "CollectionURL", "CollectionURL", "Text", false, '', false, true, this.props.collectionURL );
  let PageTitle = makeIQuickField("PageTitle", "PageTitle", "PageTitle", "Text", false, '', false, true, 'Add Page Title here' );
  
  //  let PageURL = makeIQuickField("PageURL", "PageURL", "PageURL", "Link", false, '', false, true, this.props.pageUrl );

  const ActionNewsStaticFields : IQuickField[][] = [
    [ PageID, LibraryName, WebURL, PageLink, CollectionURL ]

  ];

  return ActionNewsStaticFields;
}

public componentDidMount() {
  // this.udpatePageTitle(this.state.newsService);
  this._updateStateOnPropsChange( this.props.scope );
//  console.log('Mounted!');
}


//        
  /***
 *         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
 *         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
 *         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
 *         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
 *         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
 *         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
 *                                                                                         
 *                                                                                         
 */

public componentDidUpdate(prevProps){

  let rebuildPart = false;

  if ( prevProps.scope !== this.props.scope ) {
    rebuildPart = true ;
  }

  if ( prevProps.quickNewButton !== this.props.quickNewButton ) {
    rebuildPart = true ;
  }

  //console.log('componentDidUpdate: Actionnews.tsx');

  if (rebuildPart === true) {
    this._updateStateOnPropsChange( this.props.scope );
  }
}


/***
 *         d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
 *         88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
 *         88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
 *         88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
 *         88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
 *         88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
 *                                                          
 *                                                          
 */

  public render(): React.ReactElement<IActionnewsProps> {

    const stackPageTokens: IStackTokens = { childrenGap: 10 };
    let tipsStyles = defCommandIconStyles;
    tipsStyles.root.padding = '2px';
    tipsStyles.icon.fontSize = 24;
    let toggleTipsButton = <div style={{marginRight: "20px", background: 'white', opacity: '.7', borderRadius: '10px' }}>
    { createIconButton('Help','Toggle Tips',this.toggleTips.bind(this), null, tipsStyles ) } </div>;

    //let toggleTipsButton = createIconButton('Help','Toggle Tips',this.toggleTips.bind(this), null, null );

    /***
    *    d888888b d8b   db d88888b  .d88b.       d8888b.  .d8b.   d888b  d88888b 
    *      `88'   888o  88 88'     .8P  Y8.      88  `8D d8' `8b 88' Y8b 88'     
    *       88    88V8o 88 88ooo   88    88      88oodD' 88ooo88 88      88ooooo 
    *       88    88 V8o88 88~~~   88    88      88~~~   88~~~88 88  ooo 88~~~~~ 
    *      .88.   88  V888 88      `8b  d8'      88      88   88 88. ~8~ 88.     
    *    Y888888P VP   V8P YP       `Y88P'       88      YP   YP  Y888P  Y88888P 
    *                                                                            
    *                                                                            
    */

    const infoPage = <div>
      <InfoPages 
        allLoaded={ true }
        showInfo={ true }

        parentListURL={ this.state.newsService.listWeb + '/lists/' + this.state.newsService.listName }
        childListURL={ null }
        parentListName={ this.state.newsService.listName }
        childListName={ null }

        gitHubRepo={ links.gitRepoActionNews }
      ></InfoPages>
    </div>;

    /***
     *    db      d888888b .d8888. d888888b      d888888b d888888b d88888b .88b  d88. .d8888. 
     *    88        `88'   88'  YP `~~88~~'        `88'   `~~88~~' 88'     88'YbdP`88 88'  YP 
     *    88         88    `8bo.      88            88       88    88ooooo 88  88  88 `8bo.   
     *    88         88      `Y8b.    88            88       88    88~~~~~ 88  88  88   `Y8b. 
     *    88booo.   .88.   db   8D    88           .88.      88    88.     88  88  88 db   8D 
     *    Y88888P Y888888P `8888Y'    YP         Y888888P    YP    Y88888P YP  YP  YP `8888Y' 
     *                                                                                        
     *                                                                                        
     */
 
    let actionNewsHeader = <div style={{ float: 'right' }}>
        <Stack horizontal={true} wrap={true} horizontalAlign={"end"} verticalAlign= {"center"} tokens={stackPageTokens}>{}

        </Stack>
      </div>;

    let currentViewFields: any[] = [];
    if ( ActionNewsViewDefs.length > 0 )  { currentViewFields = getAppropriateViewFields( ActionNewsViewDefs, this.state.WebpartWidth ); }

    let currentViewGroups : IGrouping[] =  getAppropriateViewGroups( ActionNewsViewDefs , this.state.WebpartWidth );

    let  actionNewsItems  = 
      <ReactListItems
          parentListFieldTitles={ ActionNewsViewDefs.length > 0 ? null : null }

          blueBar = { 'Action Items' }
          webURL = { this.state.newsService.listWeb }
          parentListURL = { this.state.newsService.listWeb + '/lists/' + this.state.newsService.listName }
          listName = { this.state.newsService.listName }

          wpContext={ this.props.wpContext }
          contextUserInfo = { this.state.newsService.contextUserInfo }
          sourceUserInfo = { this.state.newsService.sourceUserInfo }

          recentUsers = { this.state.recentUsers }
          viewFields = { currentViewFields }
          groupByFields = { currentViewGroups }
          items = { this.state.allItems }

          reloadAllItems = { this.getAllItemsCall.bind(this) }

          includeDetails = { true }
          includeAttach = { false }
          includeListLink = { true }
          quickCommands = { this.state.quickCommands }

          quickFields = { this.state.quickFields }
          staticFields = { this.state.staticFields }
          quickNewButton = { this.props.quickNewButton }

          //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
          WebpartHeight={ this.props.WebpartElement.getBoundingClientRect().height }
          WebpartWidth={ this.props.WebpartElement.getBoundingClientRect().width - 50 }


          allowSplit={ this.state.allowSplit }

      ></ReactListItems>;


    /***
     *    .d8888. db    db .88b  d88. .88b  d88.  .d8b.  d8888b. db    db 
     *    88'  YP 88    88 88'YbdP`88 88'YbdP`88 d8' `8b 88  `8D `8b  d8' 
     *    `8bo.   88    88 88  88  88 88  88  88 88ooo88 88oobY'  `8bd8'  
     *      `Y8b. 88    88 88  88  88 88  88  88 88~~~88 88`8b      88    
     *    db   8D 88b  d88 88  88  88 88  88  88 88   88 88 `88.    88    
     *    `8888Y' ~Y8888P' YP  YP  YP YP  YP  YP YP   YP 88   YD    YP    
     *                                                                    
     *                                                                    
     */

    let errMessage = this.state.errMessage === '' ? null : <div>
      { this.state.errMessage }
    </div>;
    
    let messages : any[] = [];
    if ( this.state.WebpartWidth > 800 ) { 
        messages.push( <div><span><b>{ 'Welcome to ALV Webpart Early Access!!!' }</b></span></div> ) ;
        messages.push( <div><span><b>{ 'Get more info here -->' }</b></span></div> ) ;
    }
    else if ( this.state.WebpartWidth > 700 ) {
        messages.push( <div><span><b>{ 'Webpart Early Access!' }</b></span></div> ) ;
        messages.push( <div><span><b>{ 'More info ->' }</b></span></div> ) ;
    } else if ( this.state.WebpartWidth > 600 ) {
        messages.push( <div><span><b>{ 'info ->' }</b></span></div> ) ;

    } else if ( this.state.WebpartWidth > 400 ) {
        messages.push( <div><span><b>{ 'info ->' }</b></span></div> ) ;
    }

    let earlyAccess = 
    <div style={{ marginBottom: '15px'}}><EarlyAccess 
            image = { "https://autoliv.sharepoint.com/sites/crs/PublishingImages/Early%20Access%20Image.png" }
            messages = { messages }
            links = { [ this.state.WebpartWidth > 450 ? links.gitRepoActionNews.wiki : null, 
                this.state.WebpartWidth > 600 ? links.gitRepoActionNews.issues : null ]}
            email = { 'mailto:General - WebPart Dev <0313a49d.Autoliv.onmicrosoft.com@amer.teams.ms>?subject=Drilldown Webpart Feedback&body=Enter your message here :)  \nScreenshots help!' }
            farRightIcons = { [ toggleTipsButton ] }
        ></EarlyAccess>
    </div>;

    let createBanner = this.state.quickCommands !== null && this.state.quickCommands.successBanner > 0 ? true : false;
    let bannerMessage = createBanner === false ? null : <div style={{ width: '100%'}} 
        className={ [ stylesC.bannerStyles,  this.state.bannerMessage === null ? stylesC.bannerHide : stylesC.bannerShow ].join(' ') }>
        { this.state.bannerMessage }
    </div>;


    /***
     *    d888888b db   db d888888b .d8888.      d8888b.  .d8b.   d888b  d88888b 
     *    `~~88~~' 88   88   `88'   88'  YP      88  `8D d8' `8b 88' Y8b 88'     
     *       88    88ooo88    88    `8bo.        88oodD' 88ooo88 88      88ooooo 
     *       88    88~~~88    88      `Y8b.      88~~~   88~~~88 88  ooo 88~~~~~ 
     *       88    88   88   .88.   db   8D      88      88   88 88. ~8~ 88.     
     *       YP    YP   YP Y888888P `8888Y'      88      YP   YP  Y888P  Y88888P 
     *                                                                           
     *                                                                           
     */


    let thisPage = <div className={stylesContents.contents}>
        <div className={styles.actionnews}>
            { earlyAccess }
            { bannerMessage }
            {  /* <div className={styles.floatRight}>{ toggleTipsButton }</div> */ }
            <div className={ this.state.errMessage === '' ? stylesContents.hideMe : stylesContents.showErrorMessage  }>{ this.state.errMessage } </div>
            {  /* <p><mark>Check why picking Assists does not show Help as a chapter even though it's the only chapter...</mark></p> */ }
            <div className={( this.state.showTips ? '' : stylesContents.hideMe )}>
                { infoPage }
            </div>
            <div>
            <Stack horizontal={false} wrap={true} horizontalAlign={"stretch"} tokens={stackPageTokens} className={ styles.actionButtons }>{/* Stack for Buttons and Webs */}
                { actionNewsHeader }
                { actionNewsItems }
            </Stack>
            </div>
        </div>
    </div>;

    /***
     *              d8888b. d88888b d888888b db    db d8888b. d8b   db 
     *              88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
     *              88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
     *              88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
     *              88 `88. 88.        88    88b  d88 88 `88. 88  V888 
     *              88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
     *                                                                 
     *                                                                 
     */

    return (
        <div className={ stylesContents.contents }>
        <div className={ styles.container }>
        <div className={ '' }>
                { thisPage }
        </div></div></div>
    );

  }

  private getAllItemsCall( scope: INewsScope) {

    let result : any = allAvailableActions( this.state.newsService, this.addTheseItemsToState.bind(this), this.state.recentUsers, scope );

  }

  private addTheseItemsToState( newsService: INewsService, allItems , errMessage : string, recentUsers: IUser[] ) {

    let quickFields : IQuickField[][] = getNewActionQuickFields( this.makeDefaultTextField('Title', newsService.pageTitle), this.makeDefaultTextField('Comments', this.props.comments),  ) ;

    if ( allItems.length < 300 ) {
        console.log('addTheseItemsToState allItems: ', allItems);
    } {
        console.log('addTheseItemsToState allItems: QTY: ', allItems.length );
    }

    this.setState({
        allItems: allItems,
        newsService:  newsService,
        errMessage: errMessage,
        quickFields: quickFields,
        recentUsers: recentUsers,
    });

    return true;
  }


  /***
   *         db    db d8888b. d8888b.  .d8b.  d888888b d88888b      .d8888. d888888b  .d8b.  d888888b d88888b 
   *         88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'          88'  YP `~~88~~' d8' `8b `~~88~~' 88'     
   *         88    88 88oodD' 88   88 88ooo88    88    88ooooo      `8bo.      88    88ooo88    88    88ooooo 
   *         88    88 88~~~   88   88 88~~~88    88    88~~~~~        `Y8b.    88    88~~~88    88    88~~~~~ 
   *         88b  d88 88      88  .8D 88   88    88    88.          db   8D    88    88   88    88    88.     
   *         ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P      `8888Y'    YP    YP   YP    YP    Y88888P 
   *                                                                                                          
   *                                                                                                          
   */

  private _reloadOnUpdate( message: string, hasError: boolean ) : void {

    this.setState({
        bannerMessage: message,
    });
    this.getAllItemsCall( this.props.scope );

    let delay = hasError === true ? 10000 : this.state.quickCommands.successBanner;

    setTimeout(() => {
        this.setState({ bannerMessage: null });
    } , delay);

  }

  private _updateStateOnPropsChange( scope : INewsScope ): void {
    this.getAllItemsCall( this.props.scope );
  }

/***
 *    .d8888. db   db  .d88b.  db   d8b   db      d8888b.  .d8b.  d8b   db d88888b db      
 *    88'  YP 88   88 .8P  Y8. 88   I8I   88      88  `8D d8' `8b 888o  88 88'     88      
 *    `8bo.   88ooo88 88    88 88   I8I   88      88oodD' 88ooo88 88V8o 88 88ooooo 88      
 *      `Y8b. 88~~~88 88    88 Y8   I8I   88      88~~~   88~~~88 88 V8o88 88~~~~~ 88      
 *    db   8D 88   88 `8b  d8' `8b d8'8b d8'      88      88   88 88  V888 88.     88booo. 
 *    `8888Y' YP   YP  `Y88P'   `8b8' `8d8'       88      YP   YP VP   V8P Y88888P Y88888P 
 *                                                                                         
 *                                                                                         
 */


  public toggleTips = (item: any): void => {
    //This sends back the correct pivot category which matches the category on the tile.

    this.setState({
      showTips: !this.state.showTips,
    });

  } //End toggleTips  


}
