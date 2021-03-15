import {
  IPropertyPanePage,
  PropertyPaneLabel,
  IPropertyPaneLabelProps,
  PropertyPaneHorizontalRule,
  PropertyPaneTextField, IPropertyPaneTextFieldProps,
  PropertyPaneLink, IPropertyPaneLinkProps,
  PropertyPaneDropdown, IPropertyPaneDropdownProps,
  IPropertyPaneDropdownOption,PropertyPaneToggle,
  IPropertyPaneConfiguration,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneSlider,
} from '@microsoft/sp-property-pane';

import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';

import * as strings from 'ActionnewsWebPartStrings';
import { pivotOptionsGroup} from './index';

import * as links from '@mikezimm/npmfunctions/dist/HelpInfo/Links/LinksRepos';

import { JSON_Edit_Link, WebPartInfoGroup } from '@mikezimm/npmfunctions/dist/PropPane/zReusablePropPane';

import { IActionnewsWebPartProps } from '../../webparts/actionnews/ActionnewsWebPart';

const scopeChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
  {   index: 0,   key: 'site', text: 'Site'  },
  {   index: 1,   key: 'page', text: 'Page'  },
  {   index: 2,   key: 'user', text: 'User'  },
];

export class IntroPage {
  public getPropertyPanePage(webPartProps: IActionnewsWebPartProps, ): IPropertyPanePage {

    return <IPropertyPanePage>
    { // <page1>
      header: {
        description: 'Action News webpart'
      },
      displayGroupsAsAccordion: true,
      groups: [
        WebPartInfoGroup( links.gitRepoActionNews,
          `<h4>This webpart looks at data in a whole new way.</h4>
          <p>Use it to show data in a fun animated way allowing drill down and smooth animation.</p>`),

      { groupName: 'Toggles',
        isCollapsed: true ,
        groupFields: [
          PropertyPaneToggle('allowSplit', {
            label: 'Include Split Items',
            offText: 'No',
            onText: 'Yes',
          }),

          PropertyPaneToggle('allowCopy', { //togRefinerCounts, togCountChart, togStats, fetchCount, fetchCountMobile, restFilter
            label: 'Allow Copy items',
            offText: 'No',
            onText: 'Yes',
          }),

          PropertyPaneDropdown('scope', <IPropertyPaneDropdownProps>{
            label: 'Show all items for ...',
            options: scopeChoices,
          }),

        ]}, // this group

        { groupName: 'Default comments',
        isCollapsed: true ,
        groupFields: [

          PropertyPaneTextField('titleAddendum', {
            label: 'Default Title addendum',
            description: 'Item Title is automatically populated with Page Title and this text.',
            multiline: true,
          }),

          PropertyPaneTextField('comments', {
            label: 'Default comments',
            description: 'This text will show up as default comments... can be reminder',
            multiline: true,
          }),

        ]}, // this group
        { groupName: 'Quick New Command',
        isCollapsed: true ,
        groupFields: [
  
          JSON_Edit_Link,
          
          PropertyPaneTextField('quickNewButton', {
            label: 'Command Button in New/Edit Item pane',
            description: 'Create easy button to pre-populate fields.  Limit ONE per webpart',
            multiline: true,
          }),

        ]}, // this group

        

        ]}; // Groups
  } // getPropertyPanePage()
}

export let introPage = new IntroPage();

