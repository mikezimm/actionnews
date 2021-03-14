import * as React from 'react';

import { IHelpTable } from './InfoPage';

export function buildAboutTable() {

    let table : IHelpTable  = {
        heading: 'Version History',
        headers: ['Date','Version','Focus','Notes'],
        rows: [],
    };

    table.rows.push( ['2020-10-06', '1.0.4.6',    <span>Add <b>Early Access bar</b></span>,                                                   ''] );
    table.rows.push( ['2020-10-06', '1.0.4.5',    <span>Add support to view <b>List attachments, List link, Stat chart updates</b></span>,    ''] );
    table.rows.push( ['2020-10-06', '1.0.4.4',    <span>Fix Refiners based on numbers, add <b>Math Groupings</b></span>,                      '+ Bug fixes'] );
    table.rows.push( ['2020-10-01', '1.0.4.3',    'Add Buttons to Property Pane',                                                             ''] );
    table.rows.push( ['2020-10-01', '1.0.4.2',    'Update Prop pane for Toggles and other settings',                                          ''] );
    table.rows.push( ['2020-10-01', '1.0.4.1',    <span>Add Summary <b>Stats charts</b>, add <b>kpi-tiles</b> chart type</span>,              ''] );
    table.rows.push( ['2020-09-29', '1.0.3.1',    <span>Property Pane <b>listDefinition Selector</b> works now</span>,                        ''] );
    table.rows.push( ['2020-09-25', '1.0.2.2',    'Bump to test hosting issue',                                                               ''] );
    table.rows.push( ['2020-09-25', '1.0.2.1',    <span>Summary <b>Refiner charts</b> working</span>,                                         'Including On-Click Reformat'] );
    table.rows.push( ['2020-09-15', '1.0.2.0',    'Add Data and Charts',                                                                      'Testing note'] );
    table.rows.push( ['2020-09-15', '1.0.1.0',    'Add React based list',                                                                     'With sorting, columnwidths, grouping and details button'] );
    table.rows.push( ['2020-09-14', '1.0.0.1',    'Baseline Drilldown from Generic Project',                                                  'With basic Pivot and Command bar options'] );
    
    return table;

}