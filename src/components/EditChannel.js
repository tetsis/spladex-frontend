import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Card, Stack } from 'react-bootstrap';
import toast from 'react-hot-toast';
import getServerUrl from '../functions/getServerUrl';

export class EditChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelId: "",
      channelInfo: {},
      canAddChannel: false,
      alreadyExistsChannel: false
    };
  }

  handleChangeChannelId = (event) => {
    this.setState({ channelId: event.target.value });
  }

  handleSearchChannel = () => {
    fetch(getServerUrl() + "/api/Channel/info/" + this.state.channelId)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            canAddChannel: true
          });
          return res.json()
        }
        else {
          this.setState({
            canAddChannel: false
          });
        }
      })
      .then(json => {
        console.log(json);
        this.setState({
          channelInfo: json
        });
      });

    fetch(getServerUrl() + "/api/Channel/" + this.state.channelId)
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
      })
      .then(json => {
        if (json === undefined) {
          this.setState({
            alreadyExistsChannel: false
          });
          return;
        }

        console.log(json);

        this.setState({
          alreadyExistsChannel: true
        });
      });
  }

  handleSaveChannel = () => {
    let data = {
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      channelId: this.state.channelId
    };
    console.log(data);
    fetch(getServerUrl() + "/api/Channel", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("チャンネルを保存しました。ご協力ありがとうございます。");
        }
      });

    this.setState({
      canAddChannel: false,
      channelId: ""
    });
  }

  handleRemoveCannel = () => {
    let data = {
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      channelId: this.state.channelId,
    };
    console.log(data);
    fetch(getServerUrl() + "/api/Channel", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("チャンネルを削除しました。");
        }
      });

    this.setState({
      canAddChannel: false,
      channelId: "",
      channelInfo: {}
    });
  }

  handleCancelChannel = () => {
    this.setState({
      canAddChannel: false,
      channelId: "",
      channelInfo: {}
    });
  }

  handleExportChannel = () => {
    fetch(getServerUrl() + "/api/Channel/export", {
      headers: {
        'x-user-id': this.props.userId,
        'x-session-id': this.props.sessionId
      }
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        let blob = new Blob([JSON.stringify(json, null, 2)], { "type": "text/plain" });
        let url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display:none";
        a.href = url;
        a.download = "sbi-channels.json"
        a.click();
        window.URL.revokeObjectURL(url);
        a.parentNode.removeChild(a);

        toast.success("エクスポート完了しました。");
      });
  }

  handleImportChannel = () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.style = "display:none";
    input.type = "file";
    input.accept = ".json";
    input.click();
    input.addEventListener("change", () => {
      let reader = new FileReader();
      reader.readAsText(input.files[0], "utf-8");
      reader.onload = async () => {
        let channels = JSON.parse(reader.result);

        for (let i = 0; i < channels.length; i++) {
          let channel = channels[i];
          let data = {
            userId: this.props.userId,
            sessionId: this.props.sessionId,
            channelId: channel.id
          };
          console.log(data);
          await fetch(getServerUrl() + "/api/Channel", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        }
        toast.success("インポート完了しました。");
      };
    });
  }

  render() {
    return (
      <Form>
        {this.state.canAddChannel === false &&
          <>
            <Form.Group className="mb-3">
              <Form.Label>チャンネルID</Form.Label>
              <Form.Control type="text" value={this.state.channelId} onChange={(e) => this.handleChangeChannelId(e)} />
              <Form.Text className="text-muted">
                https://www.youtube.com/channel/[チャンネルID]
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="button" onClick={this.handleSearchChannel}>
              検索
            </Button>
          </>
        }

        {this.state.canAddChannel === true &&
          <>
            <Container className="mt-3">
              <Row xs={2} md={4} className="g-4">
                <Col>
                  <Card className="mt-3 mb-3">
                      <Card.Img variant="top" src={this.state.channelInfo.thumbnail} />
                    <Card.Title>{this.state.channelInfo.name}</Card.Title>
                    <Card.Text>
                      チャンネル登録者数：{Number(this.state.channelInfo.subscriberCount).toLocaleString()}
                    </Card.Text>
                  </Card>
                </Col>
              </Row>
            </Container>

            <Form.Group className="mb-3">
              <Stack direction="horizontal" gap={3}>
                <Button variant="primary" type="button" onClick={this.handleSaveChannel}>
                  保存
                </Button>
                {(this.props.canDelete && this.state.alreadyExistsChannel) &&
                  <Button variant="danger" type="button" onClick={this.handleRemoveCannel}>
                    削除
                  </Button>
                }
                <Button variant="secondary" type="button" onClick={this.handleCancelChannel}>
                  キャンセル
                </Button>
              </Stack>
            </Form.Group>
          </>
        }

        {this.props.canImportAndExport === true &&
          <Stack direction="horizontal" gap={3} className="mt-5">
            <Button variant="warning" type="button" onClick={this.handleExportChannel}>
              エクスポート
            </Button>
            <Button variant="warning" type="button" onClick={this.handleImportChannel}>
              インポート
            </Button>
          </Stack>
        }
      </Form>
    )
  }
}