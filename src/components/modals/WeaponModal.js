import React, { Component } from 'react';
import { Container, Row, Col, Card, Button, Modal, Accordion } from 'react-bootstrap';
import getServerUrl from '../../functions/getServerUrl';

export class WeaponModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weapons: [],
      weaponTypes: []
    };
  }

  componentDidMount() {
    this.handleGetWeapons();
    this.handleGetWeaponTypes();
  }

  handleGetWeapons = () => {
    fetch(getServerUrl() + "/api/Weapon")
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          weapons: json
        });
      });
  }

  handleGetWeaponTypes = () => {
    fetch(getServerUrl() + "/api/WeaponType")
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          weaponTypes: json
        });
      });
  }

  render() {
    return (
      <Modal size="lg" show={this.props.showModal} onHide={this.props.handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>ブキ</Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Accordion defaultActiveKey={['0']} alwaysOpen>
            {this.state.weaponTypes.map((weaponType, index) => (
              <Accordion.Item eventKey={index}>
                <Accordion.Header>{weaponType.name}</Accordion.Header>
                <Accordion.Body>

                  <Container>
                    <Row sm={4} md={8} className="g-4">
                      {this.state.weapons.map((weapon, weaponIndex) => (
                        <>
                          {weapon.type === weaponType.id &&
                            <Col key={weaponIndex}>
                              <Card className="mt-3 mb-3" onClick={() => this.props.handleSelect(weapon)}>
                                <Card.Text>
                                  {weapon.name}
                                </Card.Text>
                              </Card>
                            </Col>
                          }
                        </>
                      ))}
                    </Row>
                  </Container>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
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