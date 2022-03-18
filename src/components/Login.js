import React, { Component } from 'react';
import getServerUrl from '../functions/getServerUrl';

export class Login extends Component {
  static displayName = Login.name;

  componentDidMount() {
    fetch(getServerUrl() + "/api/User/login", {
      method: 'POST'
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        window.location.href = json;
      });
  }

  render() {
    return (
      <div>
        <p>アカウント連携画面に遷移します。少々お待ちください。</p>
      </div>
    );
  }
}
