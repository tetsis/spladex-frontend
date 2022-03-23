import React, { Component } from 'react';
import { Container, Row, Col, Card, Button, Modal  } from 'react-bootstrap';
import getServerUrl from '../../functions/getServerUrl';

export class ChannelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: []
    };
  }

  componentDidMount() {
    this.handleGetChannels();
  }

  handleGetChannels = () => {
    fetch(getServerUrl() + "/api/Channel")
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          channels: json
        });
      });
  }

  render() {
    return (
      <Modal size="lg" show={this.props.showModal} onHide={this.props.handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>チャンネル</Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row sm={4} md={8} className="g-4">
              {this.state.channels.map((channel, index) => (
                <Col key={index}>
                  <Card className="mt-3 mb-3" onClick={() => this.props.handleSelect(channel)}>
                      <Card.Img variant="top" src={channel.channelInfo.thumbnail} />
                    <Card.Text>
                      {channel.channelInfo.name}
                    </Card.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {this.props.handleUnselect !== undefined &&
            <Button variant="outline-secondary" onClick={this.props.handleUnselect}>
              選択を解除
            </Button>
          }
          <Button variant="secondary" onClick={this.props.handleCloseModal}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
