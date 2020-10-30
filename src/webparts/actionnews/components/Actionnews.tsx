import * as React from 'react';
import styles from './Actionnews.module.scss';
import { IActionnewsProps } from './IActionnewsProps';
import { IActionnewsState, ActionStatus, IActionItem, IActionStatus, IPlannerTask, INewsService } from './IActionnewsState';
import { escape } from '@microsoft/sp-lodash-subset';

import InfoPage from './HelpInfo/infoPages';

import { allAvailableActions } from './NewsFunctions';



export default class Actionnews extends React.Component<IActionnewsProps, IActionnewsState> {

  
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

  let pageID = this.props.pageId;

  this.state = {

        // 0 - Context
        description: 'string',

        //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        WebpartHeight: this.props.WebpartElement.getBoundingClientRect().height ,
        WebpartWidth:  this.props.WebpartElement.getBoundingClientRect().width - 50 ,

        newsService : {
          tenant: this.props.tenant,

          scope: this.props.scope,
          listWeb: this.props.listWeb,
          listName: this.props.listName,
      
          currentUser: null,  //Current user information on save location
      
          pageID: pageID,
          pageUrl: this.props.pageUrl,
          webServerRelativeUrl: this.props.webServerRelativeUrl,

        },

        allItems: [],
        errMessage: '',
  
  };
}

public componentDidMount() {
  this._updateStateOnPropsChange();
  console.log('Mounted!');
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

  if ( prevProps.listName !== this.props.listName ) {

    rebuildPart = true ;
  }

  if (rebuildPart === true) {
    this._updateStateOnPropsChange();
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
      <div className={ styles.actionnews }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="/sites/ActionNews/Lists/TheNewsPosts/" className={ styles.button }>
                <span className={ styles.label }>TheNewsPosts</span>
              </a>
              <div>
                {
                    this.state.allItems.map( i => {
                      return <li> { i.Id } { i.Title } { i.PageID } </li>;
                    })

                }

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getAllItemsCall() {

    let result : any = allAvailableActions( this.state.newsService, this.addTheseItemsToState.bind(this) );

}

private addTheseItemsToState( newsService: INewsService, allItems , errMessage : string ) {

    if ( allItems.length < 300 ) {
        console.log('addTheseItemsToState allItems: ', allItems);
    } {
        console.log('addTheseItemsToState allItems: QTY: ', allItems.length );
    }


    this.setState({
        allItems: allItems,
        newsService:  newsService,
        errMessage: errMessage,
    });

    //This is required so that the old list items are removed and it's re-rendered.
    //If you do not re-run it, the old list items will remain and new results get added to the list.
    //However the list will show correctly if you click on a pivot.
    //this.searchForItems( '', this.state.searchMeta, 0, 'meta' );
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

private _updateStateOnPropsChange(): void {
  this.getAllItemsCall();
}

}
