import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// import App from './demo/App'
import PageNotFound from './containers/PageNotFound'

// import Chat from './components/Chat'
import RTTClient from './containers/RTTClient'

// import { SDBDoc, SDBClient } from 'sdb-ts'

// // import { sharedb } from 'sharedb/lib/client';
// // import StringBinding from 'sharedb-string-binding';
// import ReconnectingWebSocket from 'reconnecting-websocket';

// // var sharedb = require('sharedb/lib/client');
// // var StringBinding = require('sharedb-string-binding');
// // var ReconnectingWebSocket = require('reconnecting-websocket');

// var socket = new ReconnectingWebSocket('ws://localhost:3001');
// // var connection = new sharedb.Connection(socket);
// const connection = new SDBClient(socket);

// var doc = connection.get('examples', 'textarea');
// doc.subscribe(function(err: any) {
//   if (err) console.error(err);
//   console.log('it worked!')
// });


function App() {
  return (
    <BrowserRouter>
    <div>
      <Switch>
        {/* <Route path='/' component={Chat} exact={true} /> */}
        <Route path='/' component={RTTClient} exact={true} />
        <Route path='/portal' component={PageNotFound} />
        {/* <Route path='/teams' component={} /> */}
        {/* <Route component={PageNotFound} /> */}
      </Switch>
    </div>
  </BrowserRouter>
  );
}

export default App;
