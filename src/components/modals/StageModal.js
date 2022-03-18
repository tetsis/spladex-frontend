import React, { Component } from 'react';
import { Container, Row, Col, Card, Button, Modal  } from 'react-bootstrap';
import getServerUrl from '../../functions/getServerUrl';

export class StageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stages: []
    };
  }

  componentDidMount() {
    this.handleGetStages();
  }

  handleGetStages = () => {
    fetch(getServerUrl() + "/api/Stage")
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          stages: json
        });
      });
  }

  render() {
    return (
      <Modal size="lg" show={this.props.showModal} onHide={this.props.handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>ルール</Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row sm={4} md={8} className="g-4">
              {this.state.stages.map((stage, index) => (
                <Col key={index}>
                  <Card className="mt-3 mb-3" onClick={() => this.props.handleSelect(stage)}>
                    <Card.Text>
                      {stage.name}
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
