import { createEntryField } from './fields/fieldDefinitions';

import { dropdownHeaderPrefix, dropdownDivider } from './fields/dropdownFieldBuilder';

import { IQuickCommands , ICustViewDef, IQuickField } from "./IReUsableInterfaces";

import { msPerWk, msPerDay } from '../../../services/dateServices';

/**
 * 
 * @param title Title string if required, can contain <above> or <below> anywhere to target location.
 * @param styles Styles should be this limited structure:  { color: 'htmlColor', height: 2 }
 */
export function MakeQuickDivider( title: string, styles: any ) {

  let quickDivider : IQuickField = {
    title: title,
    // column: string;
    required: false,
    type: 'Divider',
    default: '',
    styles: styles,
  };

  return quickDivider;

}

export function MakeSaveButtons( styles: any = null ) {

  let quickDivider : IQuickField = {
    // column: string;
    required: false,
    type: 'Buttons',
    styles: styles,

  };

  return quickDivider;

}

export const ActionSearchCols = [

  'Title',
  'Primary/Title',
  'Primary/Id',

  'Secondary/Title',
  'Secondary/Id',

  'FollowupDate',
  'Notified',

  'FollowupComments',
  'Status',
  'WebURL',

  'LibraryName',
  'PageID',

  'PlannerTasks',

];

export function makeIQuickField ( name: string, title: string, column: string, type: string, blinkOnProject: boolean, typeProperty: any, disabled: boolean, required: boolean, defValue?: any ) {

  const newField : IQuickField = createEntryField( name, title, column, type, false  );

  if ( type.toLowerCase() === 'choice' ) {
    if ( typeProperty ) { newField.choices = typeProperty ; }
  }
  if ( disabled === true ) { newField.disabled = true ; }
  if ( required === true ) { newField.required = true ; }
  if ( type.toLowerCase() === 'splituser') { newField.required = true ; } //2020-11-12:  Added to avoid save issues
  if ( defValue ) { newField.value = defValue ; }

  return newField ;

}

function getTodayPlus7Days() {          //Based on https://www.sitepoint.com/community/t/how-do-i-add-one-week-to-a-date/47817/2
  let start = new Date();
  let todayPlus7 = new Date( start.getTime() + msPerDay * 7 );
  return todayPlus7;
}

export function getNewActionQuickFields( setTitleDefault : string, setCommentsDefault : string ) {

  let TitleField : IQuickField = makeIQuickField("Title", "Title", "Title", "Text", false, null, false, true, setTitleDefault  );
  let FollowupDate : IQuickField = makeIQuickField("FollowupDate","FollowupDate", "FollowupDate", "Time", false, null, false, false, getTodayPlus7Days() ); //true

  let Primary : IQuickField = makeIQuickField("Primary","Primary", "Primary","SplitUser", false, null, false, true ); //2020-11-12:  Set from required = falst to true for split code
  let Secondary : IQuickField = makeIQuickField("Secondary","Secondary", "Secondary","MultiUser", false, null, false, false );

  let FollowupComments : IQuickField = makeIQuickField("FollowupComments", "FollowupComments", "FollowupComments", "MultiLine", false, null, false, false, setCommentsDefault ); //true

  const statusChoices: string[] = [
    dropdownHeaderPrefix + 'Active',
    '0. Created', 
    '2. Notified', 
    '4. Reviewing',
    '6. Working', 
    dropdownHeaderPrefix + 'InActive', 
    '8. Complete', 
    '8. Cancelled', 
    dropdownDivider, 
    dropdownHeaderPrefix + 'Archive',
    '9. Archive',
  ] ;

  let Status : IQuickField = makeIQuickField("Status", "Status", "Status", "Choice", false, statusChoices, false, true, '0. Created'  );

  let Notified : IQuickField = makeIQuickField("Notified", "Notified", "Notified", "Time", false, null, true, false );

  let NotifyCount : IQuickField = makeIQuickField("NotifyCount", "NotifyCount", "NotifyCount", "Text", false, null, true, false );
  let NotifyHistory : IQuickField = makeIQuickField("NotifyHistory", "NotifyHistory", "NotifyHistory", "MultiLine", false, null, true, false );

  let NotifyDivider : IQuickField = MakeQuickDivider('<Above>Notifications', {} );

  let SaveButtons : IQuickField = MakeSaveButtons();

  let testSpan : IQuickField = {
    required: false,
    title: 'Hellow TestSpan',
    type: 'span',
    styles: { color: 'green', fontSize: '20px' }
  };

  let testLink : IQuickField = {
    required: false,
    title: 'Go to google!',
    type: 'link',
    value: 'https://www.google.com',
    styles: { fontSize: '20px' }  ,
  };

  let testImage : IQuickField = {
    required: false,
    title: 'Cool lightning image!',
    type: 'image',
    value: 'https://wallpapercave.com/wp/wO7581D.jpg',
    default: 'https://wallpapercave.com/wp/wO7581D.jpg', //for images: default is the href
    styles: { padding: '0px', ImageCoverStyle: 3 ,ImageFit: 2 ,height: 40, width: '100%' }  ,
  };

  let ActionNewsNEWQuickFields : IQuickField[][] = [

    [ TitleField ], //Row 1 fields
    [ Primary, Secondary ], //Row 2 fields
    [ FollowupComments ], //Row 3 fields
    [ FollowupDate ], //Row 4 fields
    [ Status ],
    [ SaveButtons ],
    [ NotifyDivider ],
    [ testSpan , testLink ],
    [ testImage ],
    [ Notified, NotifyCount ],
    [ NotifyHistory ],
  
  ];

  return ActionNewsNEWQuickFields;

}


