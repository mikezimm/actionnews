

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

  export const JSON_Edit_Link = PropertyPaneLink('JSON Link' , {
        text: 'Use this site to more easily work on JSON',
        href: 'https://codebeautify.org/jsonviewer',
        target: '_blank',
    });