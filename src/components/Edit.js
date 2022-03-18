import React, { Component } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';
import { Header } from './Header';
import { EditVideo } from './EditVideo';
import { EditChannel } from './EditChannel';
import { EditUser } from './EditUser';
import getServerUrl from '../functions/getServerUrl';

export class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      sessionId: "",
      logedIn: false,
      userInfo: {},
      canDelete: false,
      canSeeUser: false,
      canImportAndExport: false,
    };
  }

  componentDidMount() {
    let userId = localStorage.getItem("userId");
    let sessionId = localStorage.getItem("sessionId");

    if (userId !== null && sessionId !== null) {
      fetch(getServerUrl() + "/api/User/me", {
        headers: {
          'x-user-id': userId,
          'x-session-id': sessionId
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              userId: userId,
              sessionId: sessionId,
              logedIn: true
            });
            return res.json()
          }
          else {
            window.location.href = "/";
          }
        })
        .then(json => {
          if (json === undefined) return;
          console.log(json);
          if (json.role === "Administrator") {
            this.setState({
              canDelete: true,
              canSeeUser: true,
              canImportAndExport: true
            });
          }
          else if (json.role === "Maintainer") {
            this.setState({
              canDelete: true
            });
          }
          this.setState({
            userInfo: json
          });
        });
    }
    else {
      window.location.href = "/";
    }
  }


  render() {
    return (
      <>
        <Toaster position="top-center" />

        <Header />

        <Container className="mt-3">
          <Tabs defaultActiveKey="video" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="video" title="動画">
              <EditVideo
                userId={this.state.userId}
                sessionId={this.state.sessionId}
                canDelete={this.state.canDelete}
                canImportAndExport={this.state.canImportAndExport}
                />
            </Tab>
            <Tab eventKey="channel" title="チャンネル">
              <EditChannel
                userId={this.state.userId}
                sessionId={this.state.sessionId}
                canDelete={this.state.canDelete}
                canImportAndExport={this.state.canImportAndExport}
              />
            </Tab>
            <Tab eventKey="user" title="ユーザ" disabled={!this.state.canSeeUser}>
              <EditUser
                userId={this.state.userId}
                sessionId={this.state.sessionId}
              />
            </Tab>
          </Tabs>
        </Container>
      </>
    )
  }
}