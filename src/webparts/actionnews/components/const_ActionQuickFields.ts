import { createEntryField } from './fields/fieldDefinitions';

import { dropdownHeaderPrefix, dropdownDivider } from './fields/dropdownFieldBuilder';

import { IQuickCommands , ICustViewDef, IQuickField } from "./IReUsableInterfaces";

import { msPerWk, msPerDay } from '../../../services/dateServices';

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
  if ( defValue ) { newField.value = defValue ; }

  return newField ;

}

const TitleField : IQuickField = makeIQuickField("Title", "Title", "Title", "Text", false, null, false, true, 'Get Page Title here'  );

function getTodayPlus7Days() {          //Based on https://www.sitepoint.com/community/t/how-do-i-add-one-week-to-a-date/47817/2
  let start = new Date();
  let todayPlus7 = new Date( start.getTime() + msPerDay * 7 );
  return todayPlus7;
}

const FollowupDate : IQuickField = makeIQuickField("FollowupDate","FollowupDate", "FollowupDate", "Time", false, null, false, true, getTodayPlus7Days() );

const Primary : IQuickField = makeIQuickField("Primary","Primary", "Primary","User", false, null, false, true );
const Secondary : IQuickField = makeIQuickField("Secondary","Secondary", "Secondary","MultiUser", false, null, false, false );

const FollowupComments : IQuickField = makeIQuickField("FollowupComments", "FollowupComments", "FollowupComments", "MultiLine", false, null, false, true );

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

const Status : IQuickField = makeIQuickField("Status", "Status", "Status", "Choice", false, statusChoices, false, true, '0. Created'  );

const Notified : IQuickField = makeIQuickField("Notified", "Notified", "Notified", "Time", false, null, true, false );

const NotifyCount : IQuickField = makeIQuickField("NotifyCount", "NotifyCount", "NotifyCount", "Text", false, null, true, false );
const NotifyHistory : IQuickField = makeIQuickField("NotifyHistory", "NotifyHistory", "NotifyHistory", "MultiLine", false, null, true, false );

export const ActionNewsQuickFields : IQuickField[][] = [

  [ TitleField ], //Row 1 fields
  [ Primary, Secondary ], //Row 2 fields
  [ FollowupComments ], //Row 3 fields
  [ FollowupDate ], //Row 4 fields
  [ Status ],
  [ Notified, NotifyCount ],
  [ NotifyHistory ],

];

