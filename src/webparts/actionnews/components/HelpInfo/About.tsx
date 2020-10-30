import * as React from 'react';

import * as links from './AllLinks';

import { Link, ILinkProps } from 'office-ui-fabric-react';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { IActionnewsProps } from '../IActionnewsProps';
import { IActionnewsState } from '../IActionnewsState';

import WebPartLinks from './WebPartLinks';
import { IWebPartLinksProps, IWebPartLinksState } from './WebPartLinks';

import styles from './InfoPane.module.scss';

export interface IInfoAboutMeProps {
    showInfo: boolean;
    allLoaded: boolean;
    parentProps: IActionnewsProps;
    parentState: IActionnewsState;

}

export interface IInfoAboutMeState {
    selectedChoice: string;
    lastChoice: string;
}

export default class InfoAboutMe extends React.Component<IInfoAboutMeProps, IInfoAboutMeState> {


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

public constructor(props:IInfoAboutMeProps){
    super(props);
    this.state = { 
        selectedChoice: 'About',
        lastChoice: '',

    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    // this.onLinkClick = this.onLinkClick.bind(this);

    
  }


  public componentDidMount() {
    
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

  public componentDidUpdate(prevProps){

    let rebuildTiles = false;
    /*
    if (rebuildTiles === true) {
      this._updateStateOnPropsChange({});
    }
    */

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

    public render(): React.ReactElement<IInfoAboutMeProps> {

        if ( this.props.allLoaded && this.props.showInfo ) {
            console.log('About.tsx', this.props, this.state);

/***
 *              d888888b db   db d888888b .d8888.      d8888b.  .d8b.   d888b  d88888b 
 *              `~~88~~' 88   88   `88'   88'  YP      88  `8D d8' `8b 88' Y8b 88'     
 *                 88    88ooo88    88    `8bo.        88oodD' 88ooo88 88      88ooooo 
 *                 88    88~~~88    88      `Y8b.      88~~~   88~~~88 88  ooo 88~~~~~ 
 *                 88    88   88   .88.   db   8D      88      88   88 88. ~8~ 88.     
 *                 YP    YP   YP Y888888P `8888Y'      88      YP   YP  Y888P  Y88888P 
 *                                                                                     
 *                                                                                     
 */
            
            const stackTokensBody: IStackTokens = { childrenGap: 20 };

            let thisPage = null;

            thisPage = <div>

                <h2>Version History</h2>
                {/* 3 files to update version number:  package-solution.json, package-lock.json, package.json*/}
                <table className={styles.infoTable}>
                    <tr><th>Date</th><th>Version</th><th>Focus</th><th>Notes</th></tr>
                    <tr><td>2020-10-06</td><td>{'1.0.4.6'}</td><td>Add <b>Early Access bar</b></td><td></td></tr>
                    <tr><td>2020-10-06</td><td>{'1.0.4.5'}</td><td>Add support to view <b>List attachments, List link, Stat chart updates</b></td><td></td></tr>
                    <tr><td>2020-10-06</td><td>{'1.0.4.4'}</td><td>Fix Refiners based on numbers, add <b>Math Groupings</b></td><td>+ Bug fixes</td></tr>
                    <tr><td>2020-10-01</td><td>{'1.0.4.3'}</td><td>Add Buttons to Property Pane</td><td></td></tr>
                    <tr><td>2020-10-01</td><td>{'1.0.4.2'}</td><td>Update Prop pane for Toggles and other settings</td><td></td></tr>
                    <tr><td>2020-10-01</td><td>{'1.0.4.1'}</td><td>Add Summary <b>Stats charts</b>, add <b>kpi-tiles</b> chart type</td><td></td></tr>
                    <tr><td>2020-09-29</td><td>{'1.0.3.1'}</td><td>Property Pane <b>listDefinition Selector</b> works now</td><td></td></tr>
                    <tr><td>2020-09-25</td><td>{'1.0.2.2'}</td><td>Bump to test hosting issue</td><td></td></tr>
                    <tr><td>2020-09-25</td><td>{'1.0.2.1'}</td><td>Summary <b>Refiner charts</b> working</td><td>Including On-Click Reformat</td></tr>
                    <tr><td>2020-09-15</td><td>{'1.0.2.0'}</td><td>Add Data and Charts</td><td>Testing note</td></tr>
                    <tr><td>2020-09-15</td><td>{'1.0.1.0'}</td><td>Add React based list</td><td>With sorting, columnwidths, grouping and details button</td></tr>
                    <tr><td>2020-09-14</td><td>{'1.0.0.1'}</td><td>Baseline Drilldown from Generic Project</td><td>With basic Pivot and Command bar options</td></tr>
                </table>
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
                <div className={ styles.infoPane }>
                    { thisPage }
                </div>
            ); 
        } else {
            console.log('infoPages.tsx return null');
            return ( null );
        }
    }   //End Public Render
}
