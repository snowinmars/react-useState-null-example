import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { PropsWithClassName } from '../../types/propsWithClassName';

import styles from './FullParentComponent.module.scss';

// eslint-disable-next-line no-extra-parens
export const FullParentComponent: FunctionComponent<PropsWithClassName> = (props) => (
  <div className={classNames(styles.fullParent, props.className)}>
    {props.children}
  </div>
);

