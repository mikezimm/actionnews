import * as React from 'react';

import * as links from '../AllLinks';

import styles from '../Component/InfoPane.module.scss';

import { IHelpTable } from '../Component/InfoPage';

export function basicsContent() {

    let html1 = <div>
        <h2>Please submit any issues or suggestions on github (requires free account)</h2>
    </div>;

    return { html1: html1 };

}
  

