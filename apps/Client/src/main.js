import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import App from './components/App.jsx';

const mountNode = document.querySelector('#main');
ReactDOM.render(<App />, mountNode);