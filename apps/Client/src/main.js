import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import AppContainer from './containers/AppContainer';

const mountNode = document.querySelector('#main');
ReactDOM.render(<AppContainer/>, mountNode);