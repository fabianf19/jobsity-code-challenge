import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { history, store, persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import './index.scss'
import Calendar from './views/Calendar'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <Route exact path='/' component={Calendar} />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
