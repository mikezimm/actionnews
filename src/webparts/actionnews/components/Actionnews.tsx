import * as React from 'react';
import styles from './Actionnews.module.scss';
import { IActionnewsProps } from './IActionnewsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Actionnews extends React.Component<IActionnewsProps, {}> {
  public render(): React.ReactElement<IActionnewsProps> {
    return (
      <div className={ styles.actionnews }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
