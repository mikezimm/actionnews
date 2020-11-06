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

const TitleField = createEntryField("Title", "Title", "Title", "Text", false );
const FollowupDate = createEntryField("FollowupDate","FollowupDate", "FollowupDate","Time", false);

const Primary = createEntryField("Primary","Primary", "Primary","User", false);
const Secondary = createEntryField("Secondary","Secondary", "Secondary","MultiUser", false);

const FollowupComments = createEntryField("FollowupComments", "FollowupComments", "FollowupComments", "Text", false );

const Status = createEntryField("Status", "Status", "Status", "Choice", false );

const Notified = createEntryField("Notified", "Notified", "Notified", "Choice", false );


export const ActionNewsQuickFields : IQuickField[][] = [
  
  [ TitleField ], //Row 1 fields
  [ Primary, Secondary ], //Row 2 fields
  [ FollowupComments ],
  [ FollowupDate ],
  [ Notified ],
  [ Status ], //Row 3 fields
  [  ], //Row 4 fields

];

