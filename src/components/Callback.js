import React, { Component } from 'react';
import getServerUrl from '../functions/getServerUrl';

export class Callback extends Component {
  static displayName = Callback.name;

  componentDidMount() {
    const params = window.location.search;
    fetch(getServerUrl() + "/api/User/callback" + params, {
      method: 'POST'
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }

        window.location.href = "/";
      })
      .then(json => {
        localStorage.setItem("userId", json.userId);
        localStorage.setItem("sessionId", json.sessionId);

        window.location.href = "/";
      });
  }

  render() {
    return (
      <div>
        <p>アカウント情報を確認しています。少々お待ちください。</p>
      </div>
    )
  }
}

