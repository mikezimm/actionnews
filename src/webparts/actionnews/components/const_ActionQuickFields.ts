import { createEntryField } from './fields/fieldDefinitions';

import { IQuickCommands , ICustViewDef, IQuickField } from "./IReUsableInterfaces";


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

export function makeIQuickField ( name: string, title: string, column: string, type: string, blinkOnProject: boolean, typeProperty: any, disabled: boolean ) {

  const newField : IQuickField = createEntryField( name, title, column, type, false  );

  if ( type.toLowerCase() === 'choice' ) {
    if ( typeProperty ) { newField.choices = typeProperty ; }

  }
  if ( disabled === true ) { newField.disabled = true ; }

  return newField ;

}

const TitleField : IQuickField = makeIQuickField("Title", "Title", "Title", "Text", false, null, false  );
const FollowupDate : IQuickField = makeIQuickField("FollowupDate","FollowupDate", "FollowupDate", "Time", false, null, false );

const Primary : IQuickField = makeIQuickField("Primary","Primary", "Primary","User", false, null, false );
const Secondary : IQuickField = makeIQuickField("Secondary","Secondary", "Secondary","MultiUser", false, null, false );

const FollowupComments : IQuickField = makeIQuickField("FollowupComments", "FollowupComments", "FollowupComments", "Text", false, null, false );

const statusChoices: string[] = [ '0. Created', '2. Notified', '4. Reviewing', '6. Working', '8. Complete', '8. Cancelled' ] ;
const Status : IQuickField = makeIQuickField("Status", "Status", "Status", "Choice", false, statusChoices, false );

const Notified : IQuickField = makeIQuickField("Notified", "Notified", "Notified", "Time", false, null, true );

const NotifyCount : IQuickField = makeIQuickField("NotifyCount", "NotifyCount", "NotifyCount", "Number", false, null, true );
const NotifyHistory : IQuickField = makeIQuickField("NotifyHistory", "NotifyHistory", "NotifyHistory", "MultiLine", false, null, true );

export const ActionNewsQuickFields : IQuickField[][] = [
  
  [ TitleField ], //Row 1 fields
  [ Primary, Secondary ], //Row 2 fields
  [ FollowupComments ],
  [ FollowupDate ],
  [ Notified ],
  [ Status, NotifyCount ], //Row 3 fields
  [ NotifyHistory ], //Row 4 fields

];

