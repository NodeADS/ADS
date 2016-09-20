import 'materialize-css'
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import io from 'socket.io-client';

var socket = io.connect('http://localhost:8080');

ReactDOM.render(
  <Home socket={socket} />,
  document.getElementById('content')
);
