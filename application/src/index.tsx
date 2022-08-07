import React from 'react';
import { createRoot } from 'react-dom/client';

import AppComponent from './components/AppComponent/AppComponent';
import './scss/main.global.scss';
import './scss/main.scss';

const container = document.getElementById('root');
if (!container) throw new Error('Root not found');
const root = createRoot(container);

root.render(<AppComponent />);
