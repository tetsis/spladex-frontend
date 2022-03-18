import React, { Component } from 'react';
import { Routes, Route } from 'react-router';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Callback } from './components/Callback';
import { Logout } from './components/Logout';
import { Edit } from './components/Edit';
import { EditingHistory } from './components/EditingHistory';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/callback' element={<Callback />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/edit' element={<Edit />} />
        <Route path='/history' element={<EditingHistory />} />
      </Routes>
    );
  }
}