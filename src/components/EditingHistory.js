import React, { Component } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import moment from 'moment-timezone';
import { Header } from './Header';
import getServerUrl from '../functions/getServerUrl';

export class EditingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      histories: [],
      page: 1,
      pageNumber: 1,
    };
  }

  componentDidMount() {
    fetch(getServerUrl() + "/api/EditingHistory" +
      "?page=" + this.state.page)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          histories: json.editingHistories,
          pageNumber: json.pageNumber
        });
      });
  }

  toStringFromHistory(history) {
    let operationType;
    if (history.operationType === "Add") {
      operationType = "追加";
    }
    else if (history.operationType === "Modify") {
      operationType = "変更";
    }
    else if (history.operationType === "Remove") {
      operationType = "削除";
    }

    let contentType;
    if (history.contentType === "Video") {
      contentType = "動画";
    }

    return history.userName + " さんが" +
      contentType + "を" +
      operationType + "しました。";
  }

  toStringFromNow(time) {
    moment.tz.setDefault("UTC");
    return moment(time).fromNow();
  }

  toStringFromContent(content) {
    let object = JSON.parse(content);
    let id = object.Id;
    let title = object.VideoInfo.Title;

    return "ID: " + id + " 「" + title + "」";
  }

  render() {
    return (
      <>
        <Header />

        <Container className="mt-3">
          <ListGroup variant="flush">
            {this.state.histories.map((history, index) => (
              <ListGroup.Item key={index}>
                <Row>
                  <Col sm="2">
                    <small>
                      {this.toStringFromNow(history.createTime)}
                    </small>
                  </Col>
                  <Col>
                    <Image roundedCircle height="20px" src={history.userImage} />
                    {this.toStringFromHistory(history)}
                    <br />
                    <small>
                      {this.toStringFromContent(history.content)}
                    </small>
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