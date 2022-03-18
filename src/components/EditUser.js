import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, ListGroup } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import toast from 'react-hot-toast';
import getServerUrl from '../functions/getServerUrl';

export class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      bannedUsers: []
    };
  }

  handleGetUsers = () => {
    fetch(getServerUrl() + "/api/User")
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          users: json
        });
      });
  }

  handleDeleteUser = (userId) => {
    let data = {
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      targetUserId: userId
    };
    fetch(getServerUrl() + "/api/User", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("ユーザを削除しました。");
        }
      });
  }

  handleBanUser = (userId) => {
    let data = {
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      targetUserId: userId
    };
    fetch(getServerUrl() + "/api/User/ban", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("ユーザを削除し、禁止ユーザにしました。");
        }
      });
  }

  handleGetBannedUsers = () => {
    fetch(getServerUrl() + "/api/BannedUser", {
      headers: {
        'x-user-id': this.props.userId,
        'x-session-id': this.props.sessionId
      }
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
      })
      .then(json => {
        if (json === undefined) return;
        console.log(json);
        this.setState({
          bannedUsers: json
        });
      });
  }

  handleDeleteBannedUser = (bannedUserId) => {
    let data = {
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      targetUserId: bannedUserId
    };
    fetch(getServerUrl() + "/api/BannedUser", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("禁止ユーザを削除しました。");
        }
      });
  }

  handleChangeRole = (event, targetUserId) => {
    let data = {
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      targetUserId: targetUserId,
      targetRole: event.target.value
    };
    fetch(getServerUrl() + "/api/User/change-role", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("役割を変更しました。");
        }
        else {
          toast.error("役割の変更は失敗しました。");
        }
        this.handleGetUsers();
      });
  }

  render() {
    return (
      <>
        <Container className="mt-3">
          <Button variant="primary" type="button" onClick={this.handleGetUsers}>
            取得
          </Button>
        </Container>
        <Container className="mt-3">
          <ListGroup variant="flush">
            {this.state.users.map((user, index) => (
              <ListGroup.Item key={index}>
                <Row>
                  <Col>
                    <Image roundedCircle height="20px" src={user.image} />
                    {user.name} : {user.role}
                  </Col>
                  <Col sm="2">
                    <Form>
                      <Form.Select value={user.role} onChange={(e) => this.handleChangeRole(e, user.id)}>
                        <option value="Editor">編集者</option>
                        <option value="Maintainer">保守者</option>
                        <option value="Administrator">管理者</option>
                      </Form.Select>
                    </Form>
                  </Col>
                  <Col sm="2">
                    <Button variant="outline-danger" onClick={() => this.handleDeleteUser(user.id)}>
                      削除
                    </Button>
                  </Col>
                  <Col sm="2">
                    <Button variant="danger" onClick={() => this.handleBanUser(user.id)}>
                      禁止（ブロック）
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>

        <h2>禁止ユーザ</h2>
        <Container className="mt-3">
          <Button variant="primary" type="button" onClick={this.handleGetBannedUsers}>
            取得
          </Button>
        </Container>
        <Container className="mt-3">
          <ListGroup variant="flush">
            {this.state.bannedUsers.map((bannedUser, index) => (
              <ListGroup.Item key={index}>
                <Row>
                  <Col>
                    <Image roundedCircle height="20px" src={bannedUser.image} />
                    {bannedUser.name}
                  </Col>
                  <Col sm="2">
                    <Button variant="outline-danger" onClick={() => this.handleDeleteBannedUser(bannedUser.id)}>
                      削除
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      </>
    )
  }
}