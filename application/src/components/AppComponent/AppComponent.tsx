import { observer } from 'mobx-react-lite';
import React, {
  FunctionComponent,
  Suspense,
  useEffect, useState
} from 'react';

import styles from './AppComponent.module.scss';
import {useRequest} from "@snowinmars/common-react/hooks/useRequest";

// eslint-disable-next-line no-extra-parens
const AppComponent: FunctionComponent = (): JSX.Element => {
  const { loading, result, error, fetch } = useRequest(() => new Promise((r) => setTimeout(r, 2000)).then(() => 'ok'));

  useEffect(() => {
    fetch();
  }, []);

  return (
    <React.StrictMode>
      <div className={styles.container}>
        {
          loading && <p>loading</p>
        }
        {
          !!result && <p>ok</p>
        }
        {
          !!error && <p>error</p>
        }
      </div>
    </React.StrictMode>
  );
};

export default observer(AppComponent);
