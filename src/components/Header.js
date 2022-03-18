import React, { Component } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import getServerUrl from '../functions/getServerUrl';

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logedIn: false,
      userInfo: {}
    };
  }

  componentDidMount() {
    let userId = localStorage.getItem("userId");
    let sessionId = localStorage.getItem("sessionId");

    if (userId !== null && sessionId !== null) {
      this.setState({ logedIn: true });

      // ログインしていたらユーザ情報を取得
      fetch(getServerUrl() + "/api/User/me", {
        headers: {
          'x-user-id': userId,
          'x-session-id': sessionId
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              logedIn: true
            });
            return res.json()
          }
        })
        .then(json => {
          if (json === undefined) return;
          console.log(json);
          this.setState({
            userInfo: json
          });
        });
    }
  }

  render() {
    return (
      <>
        <Navbar bg="light">
          <Container>
            <Navbar.Brand href="/">スプラトゥーン2動画索引</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                <Nav.Link href="/history">
                  編集履歴
                </Nav.Link>
                {this.state.logedIn === false &&
                  <Nav.Link href="/login">
                    ログイン
                  </Nav.Link>
                }
                {this.state.logedIn === true &&
                  <>
                    <Nav.Link href="/edit">
                      編集
                    </Nav.Link>
                    <Nav.Link href="/logout">
                      ログアウト
                    </Nav.Link>
                    <Nav.Link>
                      <Image roundedCircle height="20px" src={this.state.userInfo.image} />
                      {this.state.userInfo.name}
                    </Nav.Link>
                  </>
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    )
  }
}
