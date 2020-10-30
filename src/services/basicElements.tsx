import * as React from 'react';

export function convertTextToListItems ( value: string, delim: string, leftPad: number, type: 'ul' | 'ol', otherSettings = null ) {

    let result : any = value;
  
    if ( value !== null && value !== undefined && value.length > 0 ) {
      let lines = value.split(delim);
      if ( lines.length > 0  ) {
        result = lines.map( line => { return <li style={{paddingLeft:0}}>{ line }</li>; } );
        if (type==='ul') {
          result = <div style={{padding: 0}}><ul style={{paddingLeft: leftPad, margin: 0 }}>{ result } </ul></div>;
        } else if ( type === 'ol' ) {
          result = <div style={{padding: 0}}><ol style={{paddingLeft: leftPad, margin: 0 }}>{ result } </ol></div>;
        }
      }
    }
  
    return result;
  
  }

  export function findParentElementPropLikeThis( e: any, prop: string, value: string, maxHops: number, search: 'begins' | 'ends' | 'contains' | 'exact' ) {

    let result : any = null;
    let checkElement: any = e['parentElement'];
    let found = false;

    for (let i = 0; i < maxHops ; i++) {

      if ( found === false ) {

        if ( checkElement[prop] ) {

          let parentProp = checkElement[prop];

          if ( parentProp ) {

            if ( search === 'begins' ) {
              if ( checkElement[prop].indexOf(value) === 0  ) { result = checkElement[prop]; found = true; }

            } else if ( search === 'ends' ) {
              alert('findParentElementPropLikeThis:  Error - feature not yet avaialble!');

            } else if ( search === 'contains' ) {
              if ( checkElement[prop].indexOf(value) > -1  ) { result = checkElement[prop]; found = true; }

            } else if ( search === 'exact' ) {
              if ( checkElement[prop] === value  ) { result = checkElement[prop]; found = true; }

            }

          }

        }

        if ( found === false ) { checkElement = checkElement['parentElement'] ; }

      }

    }

    if ( found === false ) {
      alert('findParentElementPropLikeThis:  Could not find parent element - see console.');
      console.log('findParentElementPropLikeThis: Did not find: prop', prop, );
      console.log('findParentElementPropLikeThis: Did not find: value', value );
      console.log('findParentElementPropLikeThis: Did not find: maxHops', maxHops );
      console.log('findParentElementPropLikeThis: Did not find: search', search );
    }

  return result;

  }