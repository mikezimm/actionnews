import * as React from 'react';

import { IHelpTable } from '../Component/InfoPage';

export function aboutTable() {

    let table : IHelpTable  = {
        heading: 'Version History',
        headers: ['Date','Version','Focus','Notes'],
        rows: [],
    };

    table.rows.push( ['2021-03-14', '1.0.0.2',    <span>Update HelpInfo content to standard method</span>,                                                   ''] );
    table.rows.push( ['2020-11-12', '1.0.0.1',    <span>Testing</span>,                                                   ''] );

    /*
    table.rows.push( ['2021-00-00', '1.0.0.0',    <span>Add support to view <b>List attachments, List link, Stat chart updates</b></span>,    ''] );
    */
    
    return { table: table };

}