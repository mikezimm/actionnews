import * as React from 'react';
import { IconButton, IIconProps, IContextualMenuProps, Stack, Link } from 'office-ui-fabric-react';

const emojiIcon: IIconProps = { iconName: 'BarChartVerticalFill' };

import styles from './CreateButtons.module.scss';
import { Image } from 'office-ui-fabric-react/lib/Image';

export const defCommandIconStyles = {
  root: {padding:'10px !important', height: 32},//color: 'green' works here
  icon: { 
    fontSize: 18,
    fontWeight: "normal",
    margin: '0px 2px',
    color: '#00457e', //This will set icon color
 },
};

export function createSVGButton(svg, titleText, _onClick, thisID,  iconStyles, sendValue){

    if ( iconStyles == null ) { iconStyles = defCommandIconStyles ; }

    if (thisID == null ) { thisID = Math.random().toString(36).substring(7);} else {

      //2020-05-11:  Issue 44 Added so activity can have / or \ from partial URLs
      //First replace slashes with words so that they will go through and can be returned back to those values in the onclick url
      thisID = thisID.replace(/\//gi, 'forwardSSlash');
      thisID = thisID.replace(/\\/gi, 'backwardSSlash');
      
      //Remove all special characters in Title or this so that it can be made an element ID
      thisID = thisID.replace(/[^\w\s|-]/gi, '');
    }

    //console.log('createIconButton:', iconStyles);

    return (
      <div className= {styles.buttons} id={ thisID }>
        <img src={ svg } 
          title= { titleText }
          width={"64"} height={"64"}
          onClick={(x: any) => {
            _onClick(thisID, sendValue);
          }}
          style={ iconStyles }>
        </img>
      </div>
    );
  }

