import React from 'react';
import './style/commom.scss'
import './config/rem'

import Route from './router'
import store from './store'
import {Provider} from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <Route/>
    </Provider>
  );
}

export default App;
