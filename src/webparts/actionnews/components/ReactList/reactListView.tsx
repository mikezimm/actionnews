
import * as React from 'react';
import { Icon  } from 'office-ui-fabric-react/lib/Icon';

import { Web, IList, IItem, } from "@pnp/sp/presets/all";
import { Link, ILinkProps } from 'office-ui-fabric-react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import { WebPartContext } from '@microsoft/sp-webpart-base';

import { PageContext } from '@microsoft/sp-page-context';

import { IMyProgress, IQuickButton, IQuickCommands, IUser, IQuickField } from '../IReUsableInterfaces';

import { IActionItem } from '../IActionnewsState';

import { autoDetailsList } from '../../../../services/hoverCardService';

import { doesObjectExistInArray,  } from '../../../../services/arrayServices';

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

import { updateReactListItem, getUpdateObjectFromString } from './listFunctions';

import { createIconButton , defCommandIconStyles} from "../createButtons/IconButton";

import { createPanelButtons, ButtonIdDelim, buildSingleQuickButton } from '../Panel/panelFunctions';

import { getEmailFromLoginName, checkForLoginName, ensureUserHere, ensureTheseUsers } from '../../../../services/userServices';

import { msPerWk, msPerDay } from '../../../../services/dateServices';

import ThisEditPane from '../Panel/ThisEditPane';

import { _saveEditPaneItem } from '../Panel/editPaneFunctions';

import { IContentsToggles, makeToggles } from '../fields/toggleFieldBuilder';

import { getNewActionQuickFields } from '../const_ActionQuickFields';

import styles from '../Contents/listView.module.scss';
import stylesInfo from '../HelpInfo/InfoPane.module.scss';
import { IView } from '@pnp/sp/views';

import  EarlyAccess from '../HelpInfo/EarlyAccess';

export interface IReactListItemsProps {
    title?: string;
    descending?: boolean;
    maxChars?: number;
    items: IActionItem[];

    reloadAllItems: any;

    WebpartHeight:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/

    webURL: string; //Used for attachments
    listName: string; //Used for attachments
    parentListURL: string;

    wpContext: WebPartContext;
    contextUserInfo: IUser;  //For site you are on ( aka current page context )
    sourceUserInfo: IUser;   //For site where the list is stored

    blueBar: any;

    showIDs?: boolean;
    showDesc?: boolean;

    parentListFieldTitles?: string;
    viewFields?: IViewField[];
    
    groupByFields?:  IGrouping[];
    includeDetails: boolean;
    includeAttach: boolean;
    includeListLink: boolean;

    highlightedFields?: string[];

    quickCommands?: IQuickCommands;
    quickFields: IQuickField[][];
    staticFields: IQuickField[][];
    quickNewButton: IQuickButton;

    allowSplit: boolean;

    recentUsers: IUser[];

}

export interface IReactListItemsState {
  maxChars?: number;
  parentListFieldTitles: any;
  viewFields: IViewField[];
  groupByFields?:  IGrouping[];
  quickFields: IQuickField[][];

  showPanel: boolean;
  showNewPanel: boolean;
  showEditPanel: boolean;
  panelMode: 'View' | 'New' | 'Edit' | 'Attachments' | '';
  panelWidth: PanelType;
  showAttach: boolean;
  clickedAttach: boolean;  //if you clicked the attached icon (vs selected row), it only will show the attachments in the panel for cleaner implimentation

  panelId: number;
  lastPanelId: number;
  panelItem: IActionItem;
  panelAttachments: any[];
  lastAttachId: number;
  panelMessage?: any;

  myDialog? : IMyDialogProps;
  pickedCommand?: IQuickButton; //Index of command and ID of panel item

  allowSplit: boolean; //From Edit Panel
  
  recentUsers: IUser[];

}

const stackFormRowTokens: IStackTokens = { childrenGap: 10 };

const iconClassAction = mergeStyles({
  fontSize: 18,
  fontWeight: "bolder",
  color: "black",
  //margin: '0px 2px',
  paddingRight: '10px',
  verticalAlign: 'bottom',
});

const iconClassInfo = mergeStyles({
  fontSize: 18,
  //margin: '0px 2px',
  paddingRight: '10px',
  verticalAlign: 'bottom',
});


export default class ReactListItems extends React.Component<IReactListItemsProps, IReactListItemsState> {

    private createAttachPanel () {
        return null;
    }

    private async createPanelAttachments( thisId: any, panelItem: IActionItem ): Promise<void>{

        let thisListWeb = Web(this.props.webURL);
        let thisListObject = thisListWeb.lists.getByTitle( this.props.listName );
        let allItems : any[] = [];
        let errMessage = null;
        let attachments: any[] = [];

        if ( panelItem.Attachments && panelItem.Attachments === true ) {

            try {
                allItems = await thisListObject.items.getById( thisId ).attachmentFiles();
    
                if ( allItems.length > 0 ) {
                    attachments.push( <h2>({ allItems.length}) Attachments</h2> );
                    attachments.push( <div style={{ paddingBottom: "10px"}}><b>CTRL-Click</b> to open in new window</div> );
                    allItems.map( a => {
                        let attachmentItem = <div><Link target= { "_blank" } href= { a.ServerRelativeUrl }> { a.FileName }</Link></div>;
                            attachments.push( attachmentItem );
        
                    });
                }
            } catch (e) {
                errMessage = getHelpfullError(e, true, true);
            }
        }

        this.setState({ 
            panelAttachments: attachments,
            lastAttachId: thisId,
        });

    }

    private covertFieldInfoToIViewFields( parentListFieldTitles: [] , fieldsToShow: string[] ) {

        /**
         * This is the export format required:
            export const  initials : IViewField = {
            name: "userInitials",
            displayName: "User",
            isResizable: true,
            sorting: true,
            minWidth: 10,
            maxWidth: 30
        };
         */
        let viewFields : IViewField[] = [];
        
        if ( fieldsToShow.length === 0 ) { //Do all in order of fieldInfo
            if ( parentListFieldTitles.length > 0 ) { //Do all in order of fieldInfo
                parentListFieldTitles.map( f => {
                    viewFields.push({
                        name: f[0],
                        displayName: f[1],
                        isResizable: true,
                        sorting: true,
                        minWidth: 50,
                        maxWidth: 100
                    });
                });
            }
        }

        console.log('covertFieldInfoToIViewFields - viewFields', viewFields);
        return viewFields;

    }

    private handleExpandedFieldInfoToIViewFields( viewFields?: IViewField[] ) {
        
        viewFields.map( vf => {
            vf.name = vf.name.replace('/','');
        });

        return viewFields;

    }  

    private createBlankDialog() {

        let myDialog: IMyDialogProps = {
            title: '',
            dialogMessage: '',
            showDialog: false,
            confirmButton: '',
            _confirmDialog: this._confirmUpdateDialog.bind(this),
            _closeDialog: this._closeDialog.bind(this),
        };

        return myDialog;

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

    constructor(props: IReactListItemsProps) {
        super(props);
        console.log( 'listView PROPS: ', this.props, );
        let parentListFieldTitles = this.props.parentListFieldTitles !== undefined && this.props.parentListFieldTitles !== null ? JSON.parse(this.props.parentListFieldTitles) : '';
 //       console.log( 'parentListFieldTitles', parentListFieldTitles );

        let viewFields : IViewField[] = [];
        if ( this.props.viewFields.length > 0 ) { 
            viewFields = this.handleExpandedFieldInfoToIViewFields( this.props.viewFields );
        } else { 
            viewFields = this.covertFieldInfoToIViewFields( parentListFieldTitles , [] );
        }

        let groupByFields : IGrouping[] = [];
        if ( this.props.groupByFields && this.props.groupByFields.length > 0 ) { 
            this.props.groupByFields.map( gF => {  groupByFields.push(gF) ;  });
            groupByFields.map( gF => {  gF.name = gF.name.replace('/','') ;  });
        }

        //Create 
        let recentUsers = JSON.parse(JSON.stringify(this.props.recentUsers ));

        let quickFields : IQuickField[][] = JSON.parse(JSON.stringify( this.props.quickFields ));

        this.state = {
          maxChars: this.props.maxChars ? this.props.maxChars : 50,
          parentListFieldTitles:parentListFieldTitles,
          viewFields: viewFields,
          groupByFields:  groupByFields,
          showPanel: false,
          showAttach: false,
          panelId: null,
          lastPanelId: null,
          panelItem: null,
          panelAttachments: [],
          lastAttachId: null,
          clickedAttach: false,
          myDialog: this.createBlankDialog(),
          pickedCommand: null,
          panelWidth: PanelType.medium,
          allowSplit: this.props.allowSplit,
          showNewPanel: false,
          showEditPanel: false,
          panelMode: '',
          
            recentUsers: recentUsers,
            quickFields: quickFields,

        };
    }
        
    public componentDidMount() {
        //this._getListItems();
    }


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

    public componentDidUpdate(prevProps: IReactListItemsProps): void {
        let redraw = false;

        if ( prevProps.viewFields !== this.props.viewFields ) { redraw = true; }
        if ( prevProps.items.length !== this.props.items.length ) { redraw = true; }
        if ( prevProps.parentListURL !== this.props.parentListURL ) { redraw = true; }

        if ( prevProps.webURL !== this.props.webURL ) { redraw = true; }
        if ( prevProps.listName !== this.props.listName ) { redraw = true; }


        if ( prevProps.quickFields !== this.props.quickFields ) { redraw = true; }
        if ( prevProps.quickCommands !== this.props.quickCommands ) { redraw = true; }

        //checking this does not redraw the component
//        if ( prevProps.WebpartHeight !== this.props.WebpartHeight ) { redraw = true; }
//        if ( prevProps.WebpartWidth !== this.props.WebpartWidth ) { redraw = true; }

        // console.log('componentDidUpdate: reactListView.tsx');
        if ( redraw === true ) {
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

    public render(): React.ReactElement<IReactListItemsProps> {

        //console.log( 'ReactListItems props & state: ', this.props, this.state );

        let thisLog = null;

        if ( this.props.items != null ) { 

            let attachments = this.state.panelAttachments.length > 0 ? this.state.panelAttachments : null ;

            let dialog = !this.state.myDialog.showDialog ? null : buildConfirmDialog( this.state.myDialog );


            /***
             *    d888888b  .d88b.   d888b   d888b  db      d88888b .d8888. 
             *    `~~88~~' .8P  Y8. 88' Y8b 88' Y8b 88      88'     88'  YP 
             *       88    88    88 88      88      88      88ooooo `8bo.   
             *       88    88    88 88  ooo 88  ooo 88      88~~~~~   `Y8b. 
             *       88    `8b  d8' 88. ~8~ 88. ~8~ 88booo. 88.     db   8D 
             *       YP     `Y88P'   Y888P   Y888P  Y88888P Y88888P `8888Y' 
             *                                                              
             *                                                              
             */

           //Only get buttons if panelItem is selected

            let buttons, fields, toggles, panelHeaderText, detailList, fullPanel = null;

            let panelMode = this.state.panelMode;

            if ( this.state.showPanel === true ) {
                panelHeaderText = this.getPanelHeaderText();

                let showButtons = panelMode === 'Edit' || panelMode === 'View' ? true : false;
                if ( showButtons === true ) { 
                    createPanelButtons( this.props.quickCommands, this.state.panelItem, this._panelButtonClicked.bind(this), this.props.sourceUserInfo )  ;
                    detailList = autoDetailsList(this.state.panelItem, ["Title","refiners"],["search","meta","searchString"],true);
                }

                let showPanelWidth = this.state.panelMode === 'View' ? true : false;
                if ( showPanelWidth === true ) { toggles = <div style={{ float: 'right' }}> { makeToggles(this.getPageToggles( this.state.panelWidth )) } </div>; }

                let quickNewButton = null;
                if ( this.props.quickNewButton ) { quickNewButton = buildSingleQuickButton( this.props.quickNewButton, 'quickNewButton', this._updateEditItemValues.bind(this) ); }
                let showFields = this.state.panelMode === 'New' || this.state.panelMode === 'Edit' || this.state.panelMode === 'View' ? true : false;
                fields = showFields !== true ? null : 
                <ThisEditPane 
                    wpContext={ this.props.wpContext }
                    webAbsoluteUrl={ this.props.webURL }
                    fields = { this.state.quickFields }
                    quickNewButton = { quickNewButton }

                    contextUserInfo = { this.props.contextUserInfo }
                    sourceUserInfo = { this.props.sourceUserInfo }
                    onChange = { this._editFieldUpdate.bind(this) }

                    _clearDateField = { this._clearDateField.bind(this) }
                    _addYouToField = { this._addUserToField.bind(this) }
                    _addWeekToDate = { this._addWeekToDate.bind(this) }
                    _updateDropdown = { this._updateDropdown.bind(this) }

                    _saveItem= { this._saveItem.bind(this) }
                    _cancelItem= { this._onClosePanel.bind(this) }
                    _setReadOnly = { this._onShowPanelViewItem.bind(this)}

                    allowSplit= { this.state.allowSplit }
                    _getTitleValue = { null /*this.updatePageTitleInStateTest.bind(this)  null */  }
                    readOnlyMode = { this.state.panelMode === 'View' ? true : false }
                ></ThisEditPane>;

                fullPanel = !this.state.showPanel ? null : 
                <Panel
                    isOpen={this.state.showPanel}
                    type={ this.state.panelWidth }
                    onDismiss={this._onClosePanel }
                    headerText={ panelHeaderText }
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={this._onRenderFooterContent }
                    onRenderHeader={ this.props.allowSplit ? this._onRenderHeader : null }
                    isLightDismiss={ true }
                    isFooterAtBottom={ true }
                >

                    { attachments }
                    { buttons }
                    { fields }
                    { toggles }
                    { detailList }
                </Panel>;

            }

            let attachPanel = !this.state.showAttach ? null : 
            <Panel
                isOpen={this.state.showAttach}
                type={ this.state.panelWidth }
                onDismiss={this._onClosePanel }
                headerText={ this.state.panelId.toString() }
                closeButtonAriaLabel="Close"
                onRenderFooterContent={this._onRenderFooterContent}
                isLightDismiss={ true }
                isFooterAtBottom={ true }
            >
                { attachments }
            </Panel>;

            let viewFieldsBase = this.state.viewFields;
            let attachField = [];
            if ( this.props.includeAttach ) {
                //Add attachments column:
                let callBack = this.props.includeDetails ? null : this._onShowPanel.bind(this);
                
                attachField.push({
                    name: 'Attachments',
                    displayName: 'Attach',
                    sorting: true,
                    minWidth: 25,
                    maxWidth: 35,
                    render: (item: IActionItem) => {
                        let cursor = item.Attachments ? "pointer" : '';
                        return <div id= { 'ButtonID' + item.Id } onClick={ callBack } style={{ fontSize: 'larger' , fontWeight: 'bolder', width: '25px', textAlign: 'center', cursor: cursor }}><Icon iconName= { item.Attachments ? "Attach" : ''}></Icon></div>;
                    },
                });
            }

            let viewFields = attachField.concat( viewFieldsBase );

            let listView = null;
            
            if ( this.props.items.length === 0 ) {
                listView = <div> There are no items to display yet</div>;

            } else {
                listView = <div>
                <ListView
                    items={ this.props.items }
                    viewFields={ viewFields }
                    compact={true}
                    selectionMode={ this.props.includeDetails ? SelectionMode.single : SelectionMode.none }
                    selection={ this._onShowPanel.bind(this) }
                    showFilter={false}
                    //defaultFilter="John"
                    filterPlaceHolder="Search..."
                    groupByFields={ this.props.groupByFields } 
                /></div>;
            }
 

            //        let logTable = itemRows === null ? <div>Nothing to show</div> : <table style={{ display: 'block'}} className={stylesInfo.infoTable}>

            let barText = this.props.blueBar && this.props.blueBar != null ? this.props.blueBar : <span>Items</span>;

            let tipsStyles = defCommandIconStyles;
            tipsStyles.root.padding = '2px';
            tipsStyles.icon.fontSize = 24;
            let toggleNewItemPane = createIconButton('CirclePlus','Create Item',this._onShowPanelNewItem.bind(this), null, tipsStyles );

            let webTitle = null;

            let listLink = !this.props.includeListLink ? null : <div className={ stylesInfo.infoHeading }
                style={{ paddingRight: 20, whiteSpace: 'nowrap', float: 'right', paddingTop: 0, cursor: 'pointer', fontSize: 'smaller',background: 'transparent' }}>
                    <span  onClick={ this._onGoToList.bind(this) } style={{ background: 'transparent' }} className={ stylesInfo.listLink }>Go to list</span>
                    <span style={{marginLeft: 20, float: 'right' }}> { toggleNewItemPane } </span>
                    </div>;

            if ( barText != null ) {
                webTitle =<div className={ [stylesInfo.infoHeading, stylesInfo.innerShadow].join(' ') }><span style={{ paddingLeft: 20, whiteSpace: 'nowrap' }}>( { this.props.items.length }  ) { barText }</span>{ listLink }</div>;

            
            /*stylesL.reactListView*/
            return (
                <div className={ '' } >
                    <div style={{ paddingTop: 10}} className={ stylesInfo.infoPaneTight }>
                    { webTitle }
                    { fullPanel }
                    { attachPanel }
                    { dialog }
                    { listView }
                </div>
                </div>
                );

            } else {

            // <div className={ styles.container }></div>
            return (
                <div className={ styles.logListView }>
                    { thisLog }
                </div>
                );
            } 

        } else { //if ( this.props.items != null ) { 
            return null;
        }  
    } // Render



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

    private _onGoToList = () : void => {

        if ( !this.props.parentListURL || this.props.parentListURL == null || this.props.parentListURL == undefined || this.props.parentListURL.length === 0 ) {
            return; // Do nothing
        }
        let e: any = event;
        let isAltClick = e.altKey;
        let isShfitClick = e.shiftKey;
        let isCtrlClick = e.ctrlKey;
        
        console.log('AltClick, ShfitClick, CtrlClick:', isAltClick, isShfitClick, isCtrlClick );

        window.open(this.props.parentListURL, "_blank");

    }


    private _updateStateOnPropsChange(): void {
        this.setState({
        });
    }
    
    private getPanelHeaderText () {
        let panelHeaderText = null;

        if ( this.state.panelMode === 'New') { panelHeaderText = 'Create New item(s)' ; }
        else if ( this.state.panelMode === 'View') { panelHeaderText = 'Edit item' + this.state.panelId.toString() ; }
        else if ( this.state.panelMode === 'Edit') { panelHeaderText = 'Edit item' + this.state.panelId.toString() ; }

        return panelHeaderText;
    }

/***
 *    d8888b. db    db d888888b d888888b  .d88b.  d8b   db       .o88b. db      d888888b  .o88b. db   dD 
 *    88  `8D 88    88 `~~88~~' `~~88~~' .8P  Y8. 888o  88      d8P  Y8 88        `88'   d8P  Y8 88 ,8P' 
 *    88oooY' 88    88    88       88    88    88 88V8o 88      8P      88         88    8P      88,8P   
 *    88~~~b. 88    88    88       88    88    88 88 V8o88      8b      88         88    8b      88`8b   
 *    88   8D 88b  d88    88       88    `8b  d8' 88  V888      Y8b  d8 88booo.   .88.   Y8b  d8 88 `88. 
 *    Y8888P' ~Y8888P'    YP       YP     `Y88P'  VP   V8P       `Y88P' Y88888P Y888888P  `Y88P' YP   YD 
 *                                                                                                       
 *                                                                                                       
 */


 //private async ensureTrackTimeList(myListName: string, myListDesc: string, ProjectOrTime: string): Promise<boolean> {
     
    private _panelButtonClicked = ( item ) : void => {

        let e: any = event;
        let thisID = findParentElementPropLikeThis(e.target, 'id', 'ButtonID', 5, 'begins');

        if ( !thisID ) { 

            alert('Whoops! Can not find ID of _panelButtonClicked!');
            return null;

        } else {

            this.startThisQuickUpdate( thisID );

        }

    }


    
    /**
     * Open the dialog
     */
    //private _confirmUpdateDialog = () => {
    private _confirmUpdateDialog = (item): void => {

        let e: any = event;
        
        let thisButtonObject : IQuickButton = this.state.pickedCommand ;
        this.completeThisQuickUpdate( this.state.panelId.toString(), thisButtonObject );

        this.setState({
            myDialog: this.createBlankDialog(),
        });

    }

    private async startThisQuickUpdate ( thisID: string ) {

        let buttonID = thisID.split( ButtonIdDelim );
        //let buttonID = ['ButtonID', r, i , item.Id].join(this.delim);
        let buttonRow = buttonID[1];
        let buttonIndex = buttonID[2];
        let itemId = buttonID[3];
        let thisButtonObject : IQuickButton = this.props.quickCommands.buttons[ buttonRow ][ buttonIndex ];

        if ( !thisButtonObject ) {
            alert('_panelButtonClicked - can not find thisButtonObject - ' + thisID );
        } else {

            if ( thisButtonObject.updateItem ) {
                let readyToUpdate = true;
                if ( !this.props.webURL ) { alert('Missing listWebUrl for quickCommands') ; readyToUpdate = false ; }
                if ( !this.props.listName ) { alert('Missing listName for quickCommands') ; readyToUpdate = false ; }

                if ( readyToUpdate === true ) {
                    //Attempt to update item:
                    if ( thisButtonObject.confirm && thisButtonObject.confirm.length > 0 ) { 

                        let myDialog = this.createBlankDialog();
                        myDialog.title = "Are you sure you want to make this update?";
                        myDialog.dialogMessage = thisButtonObject.confirm + '';
                        myDialog.confirmButton = thisButtonObject.label + '';
                        myDialog.showDialog = true;
    
                        this.setState({
                            pickedCommand: thisButtonObject,
                            myDialog: myDialog,
                        });

                    } else {
                        this.completeThisQuickUpdate ( itemId, thisButtonObject );

                    }



                } else {
                    //Don't update item:
                }
            }

            if ( thisButtonObject.panelMessage ) {
                this.setState({
                    panelMessage: thisButtonObject.panelMessage,
                });
            }
        }

    }

    private async completeThisQuickUpdate( itemId: string, thisButtonObject : IQuickButton ) {

        let result = await updateReactListItem( this.props.webURL, this.props.listName, parseInt(itemId), thisButtonObject, this.props.sourceUserInfo, this.state.panelItem );

        //If success (result is error message and null by default )
        if ( result === null && this.props.quickCommands.onUpdateReload === true ) {

            let updates = Object.keys(thisButtonObject.updateItem).map( k => {
                return k;
            });
            let bannerMessage: any = <div style={{ marginTop: '5px'}}> { [
                <h3 style={{paddingTop: '10px'}}>Finished updating item [ {itemId} ]</h3>,
                <div>Including: { updates.join(', ')} </div>
            ] }</div>;

            this.props.quickCommands.refreshCallback( bannerMessage, false );

        } else if ( result !== null ) {
            this.props.quickCommands.refreshCallback( result, true );
        }
    }
    /**
     * Close the dialog
     */
    private _closeDialog = () => {
        this.setState({
            myDialog: this.createBlankDialog(),
        });
    }



/**
 * This function updates the edit property pane values to those in the updateItem prop of the this.props.quickNewButton
 */
private _updateEditItemValues = (): void => {

    let quickNewButton = this.props.quickNewButton;
    let updateProps = quickNewButton && quickNewButton.updateItem ? quickNewButton.updateItem : null ;

    let newUpdateItemObj : any = getUpdateObjectFromString( quickNewButton, this.props.sourceUserInfo, this.state.panelItem );

    if ( newUpdateItemObj !== null ) {

        let quickFields = this.state.quickFields;

        let updateColumns = Object.keys( newUpdateItemObj );

        if ( updateColumns && updateColumns.length > 0 ) {

            //Search through each row and field for name:
            quickFields.map( fieldRow => {
                fieldRow.map ( field => {

                    let doThisProp = updateColumns.indexOf(field.name) > -1 || updateColumns.indexOf(field.column) > -1 ? true : false ;
                    if ( doThisProp ) {
                        let updateThisProp = updateColumns.indexOf(field.column) > -1 ? field.column: field.name;

                        let presetValue = newUpdateItemObj[ updateThisProp ];
                        let doThisUpdate = true;
                        let errMessage = null;
                        if ( field.type.toLowerCase() === 'choice' ) {
                            let choices = field.choices ? field.choices : null;
                            if ( choices !== null && choices.indexOf( presetValue ) > -1 ) {
                                
                            } else {
                                doThisUpdate = false;
                                errMessage = 'Preset button setting is not a valid choice: \n\n\"' + newUpdateItemObj[ updateThisProp ] + '\"\n\n does not exist in the ' + updateThisProp + ' choices:\n\n' + choices.join('\n');
                            }
                        }

                        if ( doThisUpdate === true ) {
                            field.value = presetValue;
                        } else {
                            alert( errMessage );
                        }


                    }

                });
            });
        }

        //Then update the quickFields
    
        this.setState({ quickFields: quickFields, });


    }


}





/***
 *    d8888b. d88888b  .d88b.  d8888b. db      d88888b      d8888b. d888888b  .o88b. db   dD d88888b d8888b. 
 *    88  `8D 88'     .8P  Y8. 88  `8D 88      88'          88  `8D   `88'   d8P  Y8 88 ,8P' 88'     88  `8D 
 *    88oodD' 88ooooo 88    88 88oodD' 88      88ooooo      88oodD'    88    8P      88,8P   88ooooo 88oobY' 
 *    88~~~   88~~~~~ 88    88 88~~~   88      88~~~~~      88~~~      88    8b      88`8b   88~~~~~ 88`8b   
 *    88      88.     `8b  d8' 88      88booo. 88.          88        .88.   Y8b  d8 88 `88. 88.     88 `88. 
 *    88      Y88888P  `Y88P'  88      Y88888P Y88888P      88      Y888888P  `Y88P' YP   YD Y88888P 88   YD 
 *                                                                                                           
 *                                                                                                           
 */

private _addUserToField = (prop: string, valueX: any ): void => {
    let e: any = event;
    let thisID = findParentElementPropLikeThis(e.target, 'id', 'EditFieldID', 15, 'begins');
    thisID = thisID.replace('EditFieldID','');

    let quickFields = this.state.quickFields;

    //Search through each row and field for name:
    quickFields.map( fieldRow => {
      fieldRow.map ( field => {
        if ( field.name === thisID ) { 
          if (field.type.toLowerCase().indexOf('user') < 0 ) {
            alert('Error in _addUserToField:  Trying to add user to non-user field!');
          } else {
            let value = field.value;
            if ( value == null ) { value = []; }
            value.push( this.props.contextUserInfo );
            field.value = value;
            this.updateRecentUsers( field.value, this.state.recentUsers, this.props.webURL );
          }
        }
      });
    });
    //Then update the quickFields

    this.setState({ quickFields: quickFields, });

  }


  /***
 *    d8888b.  .d8b.  d888888b d88888b      d8888b. d888888b  .o88b. db   dD d88888b d8888b. 
 *    88  `8D d8' `8b `~~88~~' 88'          88  `8D   `88'   d8P  Y8 88 ,8P' 88'     88  `8D 
 *    88   88 88ooo88    88    88ooooo      88oodD'    88    8P      88,8P   88ooooo 88oobY' 
 *    88   88 88~~~88    88    88~~~~~      88~~~      88    8b      88`8b   88~~~~~ 88`8b   
 *    88  .8D 88   88    88    88.          88        .88.   Y8b  d8 88 `88. 88.     88 `88. 
 *    Y8888D' YP   YP    YP    Y88888P      88      Y888888P  `Y88P' YP   YD Y88888P 88   YD 
 *                                                                                           
 *                                                                                           
 */

  private _addWeekToDate = (prop: string, value: any ): void => {

    let e: any = event;
    let thisID = findParentElementPropLikeThis(e.target, 'id', 'EditFieldID', 15, 'begins');
    thisID = thisID.replace('EditFieldID','');

    let quickFields = this.state.quickFields;

    //Search through each row and field for name:
    quickFields.map( fieldRow => {
      fieldRow.map ( field => {
        if ( field.name === thisID ) { 

          //Based on https://www.sitepoint.com/community/t/how-do-i-add-one-week-to-a-date/47817/2
          let start = field.value ? field.value: new Date();
          console.log('typeOf start:', typeof start ) ;
          if ( typeof start === 'string' ) { start = new Date(start) ; }
          console.log('typeOf start:', typeof start ) ;

          field.value = new Date( start.getTime() + msPerDay * value );
        }
      });
    });
    //Then update the quickFields
    this.setState({ quickFields: quickFields, });
  }

  private _clearDateField = (prop: string, value: any ): void => {

    let e: any = event;
    let thisID = findParentElementPropLikeThis(e.target, 'id', 'EditFieldID', 15, 'begins');
    thisID = thisID.replace('EditFieldID','');

    let quickFields = this.state.quickFields;

    //Search through each row and field for name:
    quickFields.map( fieldRow => {
      fieldRow.map ( field => {
        if ( field.name === thisID ) { field.value = null ;}
      });
    });
    //Then update the quickFields
    this.setState({ quickFields: quickFields, });

  }

  /***
 *    d88888b d8888b. d888888b d888888b      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
 *    88'     88  `8D   `88'   `~~88~~'      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
 *    88ooooo 88   88    88       88         88    88 88oodD' 88   88 88ooo88    88    88ooooo 
 *    88~~~~~ 88   88    88       88         88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
 *    88.     88  .8D   .88.      88         88b  d88 88      88  .8D 88   88    88    88.     
 *    Y88888P Y8888D' Y888888P    YP         ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
 *                                                                                             
 *                                                                                             
 */

  private _editFieldUpdate = ( prop: string, value: any ): void => {

    let e: any = event;

    let quickFields = this.state.quickFields;
    
    //Search through each row and field for name:
    quickFields.map( fieldRow => {
      fieldRow.map ( field => {
        if ( field.name === prop ) { 
          field.value = value ;
          console.log('found this item to update: ' , prop, value );

          if ( field.type.toLowerCase().indexOf('user') === 0  ) {
            this.updateRecentUsers( field.value, this.state.recentUsers, this.props.webURL );

          } else if ( field.type.toLowerCase().indexOf('user') > 0  ) { //covers multiUser and splitUser
            this.updateRecentUsers( field.value, this.state.recentUsers, this.props.webURL );

          }
        }
      });
    });
    //Then update the quickFields

    this.setState({ quickFields: quickFields, });

  }

  private async updateRecentUsers( theseUsers: IUser[], checkTheseUsers: IUser[] , webUrl: string ) {
    let recentUsers = await ensureTheseUsers( theseUsers, checkTheseUsers, webUrl );
    this.setState({
      recentUsers: recentUsers,
    });
  }

  private _updateDropdown = (prop: React.FormEvent<HTMLDivElement>, e , pickedOption ): void => {

    let quickFields = this.state.quickFields;
    let thisProp : any = prop;

    //Search through each row and field for name:
    quickFields.map( fieldRow => {
      fieldRow.map ( field => {
        if ( field.name === thisProp ) { 
          field.value = pickedOption.text ;
          console.log('found this item to update: ' , thisProp, pickedOption.text );
        }
      });
    });
    //Then update the quickFields

    // console.log('HERE IS Current QuickFields:', quickFields );
    this.setState({ quickFields: quickFields, });
  }

/***
 *    .d8888.  .d8b.  db    db d88888b      d888888b d888888b d88888b .88b  d88. 
 *    88'  YP d8' `8b 88    88 88'            `88'   `~~88~~' 88'     88'YbdP`88 
 *    `8bo.   88ooo88 Y8    8P 88ooooo         88       88    88ooooo 88  88  88 
 *      `Y8b. 88~~~88 `8b  d8' 88~~~~~         88       88    88~~~~~ 88  88  88 
 *    db   8D 88   88  `8bd8'  88.            .88.      88    88.     88  88  88 
 *    `8888Y' YP   YP    YP    Y88888P      Y888888P    YP    Y88888P YP  YP  YP 
 *                                                                               
 *                                                                               
 */

  private async _saveItem ( ) {

    let splitCount = 1;
    let splitUsers = [];
    let splitField = '';
    //Get array of split users
    let quickFields = this.state.quickFields;
    
    let failSafeRequired : any = true;
    let requiredError = [];
    //Search through each row and field for name:
    quickFields.map( fieldRow => {
      fieldRow.map ( field => {

        if ( field.required === true ) {
            if ( field.value === null ) { failSafeRequired = false; requiredError.push(field.name) ; }
            if ( field.value === undefined ) { failSafeRequired = false; requiredError.push(field.name) ; }
            if ( field.value === '' ) { failSafeRequired = false; requiredError.push(field.name) ; }
        }

        if ( failSafeRequired === true && field.type.toLowerCase().indexOf('split') > -1 ) { 
          splitUsers = JSON.parse( JSON.stringify( field.value ));
          splitField = field.name;
          splitCount = field.value ? field.value.length : 0;
        }


      });
    });

    let results : any = null;


    if ( failSafeRequired === false ) {
        let errMessage = 'Missing following values:\n\n' + requiredError.join('\n');
        alert(errMessage);

    } else {


        if ( splitCount === 1 ) {
            let recentUsers = JSON.parse(JSON.stringify( this.state.recentUsers )); // Needed to prevent it from getting over-written in this function somewhere
            results = await _saveEditPaneItem( this.props.webURL, this.props.listName, this.state.quickFields, this.props.staticFields, recentUsers );
        
        } else {
    
            //Save each item individually - unless allowSplit !== true, then just set to first item in array
            if ( splitCount > 1 && this.state.allowSplit !== true ) { splitCount = 1; }
            for (let i = 0; i < splitCount; i++) {
    
            quickFields.map( fieldRow => {
                fieldRow.map ( field => {
                if ( field.name === splitField ) { 
                    field.value = [ splitUsers[i] ];
                }
                });
            });
    
            let recentUsers = JSON.parse(JSON.stringify( this.state.recentUsers )); // Needed to prevent it from getting over-written in this function somewhere
            results = await _saveEditPaneItem( this.props.webURL, this.props.listName, quickFields, this.props.staticFields, recentUsers );
    
            }
    
        }
    
        let passed = results && results.data ? true : false;
    
        if ( passed !== true ) {
            //The save did not happend
            console.log('was NOT ABLE TO SAVE ITEM');
            
            //Put back original splitUsers array - NOT needed if I clear this field after save.
            quickFields.map( fieldRow => {
            fieldRow.map ( field => {
                if ( field.name === splitField ) { 
                field.value = splitUsers;
                }
            });
            });
    
        alert('Your item was not saved...\nPossibly because you have a splitPersonField type with no value.');
    
        } else {
            alert('Your Action News item was just saved!');
    
            this.props.reloadAllItems();
    
        }

    }


    return null;

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



    public _onShowPanelNewItem = ( item: any ): void => {
        // public async _onShowPanelNewItem ( item: any ) {
        //This sends back the correct pivot category which matches the category on the tile.
        //sourceUserInfo
        let quickFields : IQuickField[][] = JSON.parse(JSON.stringify( this.props.quickFields ));
        this.setState({ quickFields: quickFields, showNewPanel: true, showEditPanel: false, showPanel: true, panelMode: 'New' });

  
    } //End toggleNewItem  

    private _onShowPanelEditItem = ( item: any ): void => {

        this.setState({ 

            showNewPanel: false, 
            showEditPanel: true, 
            showPanel: true, 
            panelMode: 'Edit'
         });
    } //End toggleNewItem 

    
    private _onShowPanelViewItem  = ( item: any ): void => {

        this.setState({ 

            showNewPanel: false, 
            showEditPanel: true, 
            showPanel: true, 
            panelMode: 'View'
         });
    } //End toggleNewItem 

    private _onShowPanel = (item): void => {
  
        let e: any = event;
        console.log('_onShowPanel: e',e);
        console.log('_onShowPanel item clicked:',item);

        if ( item.length === 0) { 
            console.log('_onShowPanel was triggered with no items selected');
            return null ;
        }

        let isLink = e.srcElement && e.srcElement.href && e.srcElement.href.length > 0 ? true : false;

        if ( isLink === true ) {
            window.open(e.srcElement.href, '_blank');

        } else {

            let clickedAttachIcon = e !== undefined && e != null && e.target.dataset && e.target.dataset.iconName === 'Attach' ? true : false;

            if (clickedAttachIcon === true || item.length > 0 ) {
                let thisID = clickedAttachIcon === true ? findParentElementPropLikeThis(e.target, 'id', 'ButtonID', 5, 'begins') : item[0].Id;
                thisID = typeof thisID === 'string' ? thisID.replace('ButtonID','') : thisID;
    
                let panelItem  : IActionItem = this._getItemFromId(this.props.items, 'Id', thisID );
                let lastPanelId = this.state.panelId;
                
                let clickedAttach = false;
                if ( e.srcElement.dataset && e.srcElement.dataset.iconName === 'Attach' ) {
                    clickedAttach = true;
                }

                let quickFields : IQuickField[][] = this.state.quickFields;
                if ( clickedAttach !== true ) {

                    quickFields = JSON.parse(JSON.stringify( this.props.quickFields ));

                    quickFields.map( fieldRow => {
                        fieldRow.map( thisFieldObject => {

                            /**
                             * This section checks to make sure only certain field values are reset... the ones for actual fields and not html elements.
                             */
                            let resetField: boolean = true;
                            let fieldType = thisFieldObject.type .toLowerCase();
                            if ( fieldType === 'image' ) { resetField = false; }
                            if ( fieldType === 'divider' ) { resetField = false; }
                            if ( fieldType === 'link' ) { resetField = false; }
                            if ( fieldType === 'h1' || fieldType === 'h2' || fieldType === 'h3' ) { resetField = false; }
                            if ( fieldType === 'span' || fieldType === 'p' ) { resetField = false; }

                            if ( resetField === true ) {
                                thisFieldObject.value = item[0][thisFieldObject.name];
                            }

                        });
                    }) ;


                }
    
                this.createPanelAttachments(thisID, panelItem );
    
                let canShowAPanel = thisID === null || thisID === undefined || panelItem === null ? false : true;
                let showFullPanel = canShowAPanel === true && clickedAttach !== true ? true : false;
                // 2020-10-13:  The last check in this row just didn't seem right... was && this.props.includeListLink === true ? true : false; 
                let showAttachPanel = canShowAPanel === true && clickedAttach === true && this.props.includeAttach === true ? true : false; 

                this.setState({ 
                    showPanel: showFullPanel,
                    showAttach: showAttachPanel , 
                    clickedAttach: clickedAttach,

                    showEditPanel: true,
                    panelMode: 'View',
                    quickFields: quickFields,
                    showNewPanel: false,
                    panelId: thisID,
                    panelItem: panelItem,
                    lastPanelId: lastPanelId,
                    panelAttachments: this.state.lastAttachId === thisID ? this.state.panelAttachments : [],
    
                });
    
            }

        } 

    }

    private _getItemFromId( items: IActionItem[], key: string, val: any ) {
        let panelItem : IActionItem =  null;
        let showIndex = doesObjectExistInArray(this.props.items, key, val, false);
        if (showIndex !== false ) {
            panelItem = this.props.items[showIndex];
            console.log('showPanelPropsItem', panelItem );
        }
        return panelItem;

    }

    private _onClosePanel = (): void => {
        this.setState({ 
            showPanel: false,
            showNewPanel: false,
            showEditPanel: false,
            showAttach: false , 
            clickedAttach: false,
         });
      }


/***
 *    d8888b.  .d8b.  d8b   db d88888b db           d88888b  .d88b.   .d88b.  d888888b d88888b d8888b. 
 *    88  `8D d8' `8b 888o  88 88'     88           88'     .8P  Y8. .8P  Y8. `~~88~~' 88'     88  `8D 
 *    88oodD' 88ooo88 88V8o 88 88ooooo 88           88ooo   88    88 88    88    88    88ooooo 88oobY' 
 *    88~~~   88~~~88 88 V8o88 88~~~~~ 88           88~~~   88    88 88    88    88    88~~~~~ 88`8b   
 *    88      88   88 88  V888 88.     88booo.      88      `8b  d8' `8b  d8'    88    88.     88 `88. 
 *    88      YP   YP VP   V8P Y88888P Y88888P      YP       `Y88P'   `Y88P'     YP    Y88888P 88   YD 
 *                                                                                                     
 *                                                                                                     
 */

      /**
       * This was copied from codepen example code to render a footer with buttons:
       * https://fabricweb.z5.web.core.windows.net/oufr/6.50.2/#/examples/panel
       * 
       */
    private _onRenderFooterContent = (): JSX.Element => {
        return null;

        return (
        <div>
            <PrimaryButton onClick={this._onClosePanel} style={{ marginRight: '8px' }}>
            Save
            </PrimaryButton>
            <DefaultButton onClick={this._onClosePanel}>Cancel</DefaultButton>
        </div>
        );
    }

    private _onRenderHeader = (): JSX.Element => {

        let defStyles = { root: { width: 160, } };
        let thisButton = null;

        if ( this.state.panelMode === 'View' ) {
            let myIconStyles = JSON.parse(JSON.stringify( defCommandIconStyles ));
            myIconStyles.icon.fontSize = 24;
            myIconStyles.icon.fontWeight = "900";

            thisButton = <div style={{ marginRight: 100 }} > { createIconButton('Edit','Edit Item', this._onShowPanelEditItem , null, myIconStyles ) } </div>;

        } else {
            thisButton = <Toggle label={ 'Split Notifications' } 
            onText={ 'On' } 
            offText={ 'Off' } 
            onChange={ this._toggleSplit.bind(this) } 
            checked={ this.state.allowSplit }
            styles={ defStyles }
        />;
        }

        
        const stackTokens: IStackTokens = { childrenGap: 20 };
        let headerText = this.getPanelHeaderText();
        return (
        <div>
          <Stack horizontal={ true } horizontalAlign= { 'space-between' } tokens={stackTokens}>
            <span style={{ marginLeft: 35, fontSize: 28, marginTop: 5 }}> { headerText } </span>
            { thisButton }
          </Stack>
  
        </div>
        );
    }
        
    
    private _toggleSplit() {

        this.setState({ allowSplit: this.state.allowSplit !== true ? true : false });

    }
    /***
     *         d888888b  .d88b.   d888b   d888b  db      d88888b .d8888. 
     *         `~~88~~' .8P  Y8. 88' Y8b 88' Y8b 88      88'     88'  YP 
     *            88    88    88 88      88      88      88ooooo `8bo.   
     *            88    88    88 88  ooo 88  ooo 88      88~~~~~   `Y8b. 
     *            88    `8b  d8' 88. ~8~ 88. ~8~ 88booo. 88.     db   8D 
     *            YP     `Y88P'   Y888P   Y888P  Y88888P Y88888P `8888Y' 
     *                                                                   
     *                                                                   
     */

    private getPageToggles( showStats ) {

        let togRefinerCounts = {
            //label: <span style={{ color: 'red', fontWeight: 900}}>Rails Off!</span>,
            label: <span>Panel width</span>,
            key: 'togggleWidth',
            _onChange: this.updatePanelWidth.bind(this),
            checked: this.state.panelWidth === PanelType.medium ? false : true,
            onText: 'Wide',
            offText: 'Medium',
            className: '',
            styles: '',
        };

        let theseToggles = [];

        theseToggles.push( togRefinerCounts ) ;
        
        let pageToggles : IContentsToggles = {
            toggles: theseToggles,
            childGap: 10,
            vertical: false,
            hAlign: 'end',
            vAlign: 'start',
            rootStyle: { width: 100 , paddingTop: 0, paddingRight: 0, }, //This defines the styles on each toggle
        };

        return pageToggles;

    }

    private updatePanelWidth() {
        this.setState({
            panelWidth: this.state.panelWidth === PanelType.medium ? PanelType.large : PanelType.medium,
        });
    }


}
