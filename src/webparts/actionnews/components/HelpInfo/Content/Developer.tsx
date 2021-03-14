import * as React from 'react';

import * as links from '../AllLinks';

import { IHelpTable } from '../Component/InfoPage';

export function devTable() {

    let table : IHelpTable  = {
        heading: 'Open source components and docs used in webparts',
        headers: ['MS Dev Docs','Github','Description'],
        rows: [],
    };

    table.rows.push( [ links.devDocsWeb, links.gitRepoSPFxContReact , 'MSFT Dev Docs for Fabric React UI Components' ] );
    table.rows.push( [ links.devDocsPnpJSsp, links.gitRepoPnpJSsp, 'PNP JS sp:  Library for interacting with SPO' ] );
    table.rows.push( [ links.devDocsIcon, , '' ] );
    table.rows.push( [ links.devDocsText, , '' ] );
    table.rows.push( [ links.devDocsDate, links.gitSampleReactDate, '' ] );
    table.rows.push( [ links.devDocsSlider, , '' ] );
    table.rows.push( [ links.devDocsToggle, , '' ] );
    table.rows.push( [ links.devDocsChoice, , '' ] );
    
    table.rows.push( [ links.devDocsButton, , '' ] );
    table.rows.push( [ links.devDocsStack, , '' ] );
    table.rows.push( [ links.devDocsList, links.gitSampleReactList, '' ] );

    table.rows.push( [ links.devDocsPivo, , '' ] );
    table.rows.push( [ links.devDocsReGr, , '' ] );
    table.rows.push( [ links.devDocsLink, , '' ] );

    table.rows.push( [ links.chartJSSamples, , '' ] );
    table.rows.push( [ links.devDocsWebPartTitle, , 'React Webpart Title' ] );

    return { table: table };
}