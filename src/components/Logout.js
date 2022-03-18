import React, { Component } from 'react';
import getServerUrl from '../functions/getServerUrl';

export class Logout extends Component {
  static displayName = Logout.name;

  componentDidMount() {
    fetch(getServerUrl() + "/api/User/logout", {
      method: 'POST'
    })
      .then(res => {
        localStorage.removeItem("userId");
        localStorage.removeItem("sessionId");

        window.location.href = "/";
      });
  }

  render() {
    return (
      <div>
        <p>ログアウト処理中です。少々お待ちください。</p>
      </div>
    );
  }
}

