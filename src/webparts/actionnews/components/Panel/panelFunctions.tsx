import * as React from 'react';


import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { Fabric, Stack, IStackTokens, initializeIcons } from 'office-ui-fabric-react';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';


import { Dialog, DialogType, DialogFooter, IDialogProps } 	from 'office-ui-fabric-react/lib/Dialog';
import { Button, ButtonType, } 			from 'office-ui-fabric-react/lib/Button';
import { Label } 			from 'office-ui-fabric-react/lib/Label';

import { getHelpfullError } from '../../../../services/ErrorHandler';

import { IMyProgress, IQuickButton, IQuickCommands, IUser } from '../IReUsableInterfaces';

import { IActionItem } from '../IActionnewsState';

export const ButtonIdDelim = '|||';

/***
 *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d8888b.  .d8b.  d8b   db d88888b db           d8888b. db    db d888888b d888888b  .d88b.  d8b   db .d8888. 
 *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          88  `8D d8' `8b 888o  88 88'     88           88  `8D 88    88 `~~88~~' `~~88~~' .8P  Y8. 888o  88 88'  YP 
 *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88oodD' 88ooo88 88V8o 88 88ooooo 88           88oooY' 88    88    88       88    88    88 88V8o 88 `8bo.   
 *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88~~~   88~~~88 88 V8o88 88~~~~~ 88           88~~~b. 88    88    88       88    88    88 88 V8o88   `Y8b. 
 *    Y8b  d8 88 `88. 88.     88   88    88    88.          88      88   88 88  V888 88.     88booo.      88   8D 88b  d88    88       88    `8b  d8' 88  V888 db   8D 
 *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      88      YP   YP VP   V8P Y88888P Y88888P      Y8888P' ~Y8888P'    YP       YP     `Y88P'  VP   V8P `8888Y' 
 *                                                                                                                                                                     
 *                                                                                                                                                                     
 */

/**
 * 
 * @param quickCommands 
 * @param item 
 * @param sourceUserInfo  //This is just passed in in order to allow for user targeted b.showWhenEvalTrue checks
 */
export function createPanelButtons ( quickCommands: IQuickCommands, item: IActionItem , _panelButtonClicked: any, sourceUserInfo: IUser ) {

    let allButtonRows : any[] = [];

    if ( quickCommands && quickCommands.buttons.length > 0 ) {

        let buildAllButtonsTest = true;
        if ( quickCommands.showWhenEvalTrue && quickCommands.showWhenEvalTrue.length > 0 ) {
            buildAllButtonsTest = eval( quickCommands.showWhenEvalTrue );
            if ( buildAllButtonsTest === true ) {
                //build all the buttons ( subject to individual button checks )
            } else { buildAllButtonsTest = false; }
        }

        if ( buildAllButtonsTest === true ) {
            quickCommands.buttons.map( (buttonRow, r) => {

                if ( buttonRow && buttonRow.length > 0 ) {
                    let rowResult : any = null;
                    let buttons : any[] = [];

                    buttonRow.map( (b,i) => {

                        let buildThisButton = true;

                        /**
                         * showWhenEvalTrue must be run in the context of this section of code to be valid.
                         */

                        if ( b.showWhenEvalTrue && b.showWhenEvalTrue.length > 0 ) {

                            let buildButtonTest = false;
                            try {
                                buildButtonTest = eval( b.showWhenEvalTrue );
                            } catch (e) {
                                let errMessage = getHelpfullError(e, true, true);
                                alert('panelFunctions.tsx Error creating button: \n' + b.showWhenEvalTrue + '\n\n' + errMessage );
                            }
                            
                            if ( buildButtonTest === true ) {
                                //build all the buttons
                            } else { buildThisButton = false; }
                        }
                        if ( buildThisButton === true ) {
                            let icon = b.icon ? { iconName: b.icon } : null;
                            let buttonID = ['ButtonID', r, i , item.Id].join(ButtonIdDelim);
                            let buttonTitle = b.label;
                            let thisButton = b.primary === true ?
                                <div id={ buttonID } title={ buttonTitle } ><PrimaryButton text={b.label} iconProps= { icon } onClick={ _panelButtonClicked } disabled={b.disabled} checked={b.checked} /></div>:
                                <div id={ buttonID } title={ buttonTitle } ><DefaultButton text={b.label} iconProps= { icon } onClick={ _panelButtonClicked } disabled={b.disabled} checked={b.checked} /></div>;
                            buttons.push( thisButton );
                        }

                    }); //END buttonRow.map( (b,i) => {

                    const stackQuickCommands: IStackTokens = { childrenGap: 10 };
                    rowResult = <Stack horizontal={ true } tokens={stackQuickCommands}>
                        {buttons}
                    </Stack>;

                    let styleRows = {paddingBottom: 10};
                    if ( quickCommands.styleRow ) {
                        try {
                            Object.keys(quickCommands.styleRow).map( k => {
                                styleRows[k] = quickCommands.styleRow[k];
                            });
                        } catch (e) {
                            alert( `quickCommands.styleRow is not valid JSON... please fix: ${quickCommands.styleRow}` );
                        }
                    }
                    allButtonRows.push( <div style={ styleRows }> { rowResult } </div> );

                } //END   if ( buttonRow && buttonRow.length > 0 ) {

            }); //END  quickCommands.buttons.map( (buttonRow, r) => {

        } //END   if ( buildAllButtonsTest === true ) {


    }

    return allButtonRows;
}