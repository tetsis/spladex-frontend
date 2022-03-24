import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Card, Stack, Image, ListGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Plus, Search } from 'react-bootstrap-icons';
import { RuleModal } from './modals/RuleModal';
import { StageModal } from './modals/StageModal';
import { WeaponModal } from './modals/WeaponModal';
import { ChannelModal } from './modals/ChannelModal';
import toDateStringFromDateTime from '../functions/toDateStringFromDateTime';
import toTimeStringFromSeconds from '../functions/toTimeStringFromSeconds';
import toSecondsFromTimeString from '../functions/toSecondsFromTimeString';
import getServerUrl from '../functions/getServerUrl';

export class EditVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: "",
      videoInfo: {},
      canAddVideo: false,
      alreadyExistsVideo: false,
      battles: [],
      nowBattle: {},
      showRuleModal: false,
      showStageModal: false,
      showWeaponModal: false,
      publishedFrom: null,
      channel: "",
      channelName: "",
      channelThumbnail: "",
      showChannelModal: false,
      videos: []
    };
  }

  componentDidMount() {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    console.log(toDateStringFromDateTime(date, "-"));
    this.setState({publishedFrom: toDateStringFromDateTime(date, "-")});
  }

  handleGetVideos = () => {
    fetch(getServerUrl() + "/api/Video" +
      "?publishedFrom=" + this.state.publishedFrom +
      "&channel=" + this.state.channel)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          videos: json
        });
      });
  }

  // チャンネル
  handleSelectChannel = (channel) => {
    this.setState({
      channel: channel.id,
      channelName: channel.channelInfo.name,
      channelThumbnail: channel.channelInfo.thumbnail,
      showChannelModal: false
    }, () => {
      this.handleGetVideos();
    });

  }
  handleShowChannelModal = () => {
    this.setState({ showChannelModal: true });
  }
  handleCloseChannelModal = () => {
    this.setState({ showChannelModal: false });
  }

  handleChangePublishedFrom = (event) => {
    this.setState({
      publishedFrom: event.target.value
    }, () => {
      this.handleGetVideos();
    });
  }

  handleChangeVideoId = (event) => {
    this.setState({ videoId: event.target.value });
  }

  handleSearchVideo = () => {
    fetch(getServerUrl() + "/api/Video/info/" + this.state.videoId)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            canAddVideo: true
          });
          return res.json()
        }
        else {
          this.setState({
            canAddVideo: false
          });
        }
      })
      .then(json => {
        console.log(json);
        let videoInfo = json;
        this.setState({
          videoInfo: videoInfo
        });
      });

    fetch(getServerUrl() + "/api/Video/" + this.state.videoId)
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
      })
      .then(json => {
        if (json === undefined) {
          this.setState({
            alreadyExistsVideo: false,
            battles: []
          });
          return;
        }

        console.log(json);
        let battles = json.battles;
        for (let i = 0; i < battles.length; i++) {
          battles[i].seconds = toTimeStringFromSeconds(battles[i].seconds);
        }
        console.log(battles);

        this.setState({
          alreadyExistsVideo: true,
          battles: battles
        });
      });
  }

  handleAddBattle = () => {
    let battles = this.state.battles;
    battles.push({
      seconds: "0:00",
      rule: battles.length > 0 ? battles.slice(-1)[0].rule : "SplatZones",
      ruleName: battles.length > 0 ? battles.slice(-1)[0].ruleName : "ガチエリア",
      stage: battles.length > 0 ? battles.slice(-1)[0].stage : "TheReef",
      stageName: battles.length > 0 ? battles.slice(-1)[0].stageName : "バッテラストリート",
      weapon: battles.length > 0 ? battles.slice(-1)[0].weapon : "Sploosh_o_matic",
      weaponName: battles.length > 0 ? battles.slice(-1)[0].weaponName : "ボールドマーカー"
    });
    this.setState({ battles: battles });
  }

  handleRemoveBattle = (index) => {
    let battles = this.state.battles;
    battles.splice(index, 1);
    this.setState({ battles: battles });
  }

  handleSaveVideo = () => {
    let data = {
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      videoId: this.state.videoId,
      battles: this.state.battles
    };
    for (let i = 0; i < data.battles.length; i++) {
      data.battles[i].seconds = toSecondsFromTimeString(data.battles[i].seconds);
    }
    console.log(data);
    fetch(getServerUrl() + "/api/Video", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("動画を保存しました。ご協力ありがとうございます。");
        }
      });

    this.setState({
      canAddVideo: false,
      videoId: ""
    });
  }

  handleRemoveVideo = () => {
    let data = {
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      videoId: this.state.videoId,
    };
    console.log(data);
    fetch(getServerUrl() + "/api/Video", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("動画を削除しました。");
        }
      });

    this.setState({
      canAddVideo: false,
      videoId: "",
      videoInfo: {}
    });
  }

  handleCancelVideo = () => {
    this.setState({
      canAddVideo: false,
      videoId: "",
      videoInfo: {}
    });
  }

  handleChangeSeconds = (event, index) => {
    let battles = this.state.battles;
    battles[index].seconds = event.target.value;
    this.setState({ battles: battles });
  }

  handleChangeStage = (event, index) => {
    let battles = this.state.battles;
    battles[index].stage = event.target.value;
    this.setState({ battles: battles });
  }

  handleChangeWeapon = (event, index) => {
    let battles = this.state.battles;
    battles[index].weapon = event.target.value;
    this.setState({ battles: battles });
  }

  handleChangeRoomPower = (event, index) => {
    let battles = this.state.battles;
    battles[index].roomPower = event.target.value;
    this.setState({ battles: battles });
  }

  getVideoUrl = () => {
    return "https://www.youtube.com/embed/" + this.state.videoId;
  }

  handleExportVideo = () => {
    fetch(getServerUrl() + "/api/Video/export", {
        headers: {
          'x-user-id': this.props.userId,
          'x-session-id': this.props.sessionId
        }
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        let blob = new Blob([ JSON.stringify(json, null, 2) ], { "type" : "text/plain" });
        let url =  window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display:none";
        a.href = url;
        a.download = "sbi-videos.json"
        a.click();
        window.URL.revokeObjectURL(url);
        a.parentNode.removeChild(a);

        toast.success("エクスポート完了しました。");
      });
  }

  handleImportVideo = () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.style = "display:none";
    input.type = "file";
    input.accept = ".json";
    input.click();
    input.addEventListener("change", () => {
      let reader = new FileReader();
      reader.readAsText(input.files[0], "utf-8");
      reader.onload = async() => {
        let videos = JSON.parse(reader.result);

        for (let i = 0; i < videos.length; i++) {
          let video = videos[i];
          let data = {
            userId: this.props.userId,
            sessionId: this.props.sessionId,
            videoId: video.id,
            battles: video.battles
          };
          console.log(data);
          await fetch(getServerUrl() + "/api/Video", {
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

  // ルール
  handleSelectRule = (rule) => {
    let battle = this.state.nowBattle;
    battle.rule = rule.id;
    battle.ruleName = rule.name
    this.setState({
      nowBattle: battle,
      showRuleModal: false
    });
  }
  handleShowRuleModal = (battle) => {
    this.setState({
      showRuleModal: true,
      nowBattle: battle
    });
  }
  handleCloseRuleModal = () => {
    this.setState({ showRuleModal: false });
  }

  // ステージ
  handleSelectStage = (stage) => {
    let battle = this.state.nowBattle;
    battle.stage = stage.id;
    battle.stageName = stage.name
    this.setState({
      nowBattle: battle,
      showStageModal: false
    });
  }
  handleShowStageModal = (battle) => {
    this.setState({
      showStageModal: true,
      nowBattle: battle
    });
  }
  handleCloseStageModal = () => {
    this.setState({ showStageModal: false });
  }

  // ブキ
  handleSelectWeapon = (weapon) => {
    let battle = this.state.nowBattle;
    battle.weapon = weapon.id;
    battle.weaponName = weapon.name
    this.setState({
      nowBattle: battle,
      showWeaponModal: false
    });
  }
  handleShowWeaponModal = (battle) => {
    this.setState({
      showWeaponModal: true,
      nowBattle: battle
    });
  }
  handleCloseWeaponModal = () => {
    this.setState({ showWeaponModal: false });
  }

  render() {
    return (
      <>
        <RuleModal
          showModal={this.state.showRuleModal}
          handleCloseModal={this.handleCloseRuleModal}
          handleSelect={this.handleSelectRule}
        />

        <StageModal
          showModal={this.state.showStageModal}
          handleCloseModal={this.handleCloseStageModal}
          handleSelect={this.handleSelectStage}
        />

        <WeaponModal
          showModal={this.state.showWeaponModal}
          handleCloseModal={this.handleCloseWeaponModal}
          handleSelect={this.handleSelectWeapon}
        />

        <ChannelModal
          showModal={this.state.showChannelModal}
          handleCloseModal={this.handleCloseChannelModal}
          handleSelect={this.handleSelectChannel}
        />

        <Form>
          {this.state.canAddVideo === false &&
            <>
              <Form.Group className="mb-3">
                <Form.Label>動画ID</Form.Label>
                <Form.Control type="text" value={this.state.videoId} onChange={(e) => this.handleChangeVideoId(e)} />
                <Form.Text className="text-muted">
                  https://www.youtube.com/watch?v=[動画ID]
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="button" onClick={this.handleSearchVideo}>
                検索
              </Button>
            </>
          }

          {this.state.canAddVideo === true &&
            <>
              <Container className="mt-3 mb-3">
                <Row xs={2} md={4} className="g-4">
                  <Col>
                    <Card>
                      <div>
                        <iframe width="100%" src={this.getVideoUrl()} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                      </div>
                      <Card.Body>
                        <Card.Title>{this.state.videoInfo.title}</Card.Title>
                        <Card.Text>
                          投稿日：{toDateStringFromDateTime(this.state.videoInfo.publishedAt)} <br />
                          再生回数：{Number(this.state.videoInfo.viewCount).toLocaleString()}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>

              <h2>試合情報</h2>
              {this.state.battles.map((battle, index) => (
                <Card className="mb-3" key={index}>
                  <Card.Body>
                    <Card.Text>
                      <Container>
                        <Row>
                          <Col>
                            <Card>
                              <Card.Body>
                                <Card.Title>
                                  <div className="d-flex justify-content-between align-items-center">
                                    秒数
                                  </div>
                                </Card.Title>
                                <Card.Text>
                                  <Form.Control type="text" value={battle.seconds} onChange={(e) => this.handleChangeSeconds(e, index)} />
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col>
                            <Card>
                              <Card.Body>
                                <Card.Title>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      ルール
                                    </div>
                                    <div>
                                      <Button variant="primary" type="button" onClick={() => this.handleShowRuleModal(battle)}>
                                        <Search />
                                      </Button>
                                    </div>
                                  </div>
                                </Card.Title>
                                <Card.Text>
                                  {battle.ruleName}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col>
                            <Card>
                              <Card.Body>
                                <Card.Title>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      ステージ
                                    </div>
                                    <div>
                                      <Button variant="primary" type="button" onClick={() => this.handleShowStageModal(battle)}>
                                        <Search />
                                      </Button>
                                    </div>
                                  </div>
                                </Card.Title>
                                <Card.Text>
                                  {battle.stageName}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col>
                            <Card>
                              <Card.Body>
                                <Card.Title>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      ブキ
                                    </div>
                                    <div>
                                      <Button variant="primary" type="button" onClick={() => this.handleShowWeaponModal(battle)}>
                                        <Search />
                                      </Button>
                                    </div>
                                  </div>
                                </Card.Title>
                                <Card.Text>
                                  {battle.weaponName}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col>
                            <Card>
                              <Card.Body>
                                <Card.Title>
                                  <div className="d-flex justify-content-between align-items-center">
                                    部屋パワー
                                  </div>
                                </Card.Title>
                                <Card.Text>
                                  <Form.Control type="text" value={battle.roomPower} onChange={(e) => this.handleChangeRoomPower(e, index)} />
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Text>
                    <Button variant="outline-danger" onClick={() => this.handleRemoveBattle(index)}>
                      削除
                    </Button>
                  </Card.Body>
                </Card>
              ))}

              <Form.Group className="mb-3">
                <Button variant="info" type="button" onClick={this.handleAddBattle}>
                  <Plus />
                </Button>
              </Form.Group>

              <Form.Group className="mb-3">
                <Stack direction="horizontal" gap={3}>
                  <Button variant="primary" type="button" onClick={this.handleSaveVideo}>
                    保存
                  </Button>
                  {(this.props.canDelete && this.state.alreadyExistsVideo) &&
                    <Button variant="danger" type="button" onClick={this.handleRemoveVideo}>
                      削除
                    </Button>
                  }
                  <Button variant="secondary" type="button" onClick={this.handleCancelVideo}>
                    キャンセル
                  </Button>
                </Stack>
              </Form.Group>
            </>
          }

          {this.props.canImportAndExport === true &&
            <Stack direction="horizontal" gap={3} className="mt-5">
              <Button variant="warning" type="button" onClick={this.handleExportVideo}>
                エクスポート
              </Button>
              <Button variant="warning" type="button" onClick={this.handleImportVideo}>
                インポート
              </Button>
            </Stack>
          }
        </Form>

        <h4 className="mt-5">動画一覧</h4>

        <Container className="mt-3">
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                      投稿日（以降）
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <Form.Control type="date" value={this.state.publishedFrom} onChange={(e) => this.handleChangePublishedFrom(e)} />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        チャンネル
                      </div>
                      <div>
                        <Button variant="primary" type="button" onClick={this.handleShowChannelModal}>
                          <Search />
                        </Button>
                      </div>
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <Image roundedCircle height="30px" src={this.state.channelThumbnail} />
                    {this.state.channelName}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        <Container className="mt-3">
          <ListGroup variant="flush">
            {this.state.videos.map((video, index) => (
              <ListGroup.Item key={index}>
                <Row>
                  <Col sm="2">
                    <Image height="80px" src={video.videoInfo.thumbnail} />
                  </Col>
                  <Col>
                    {video.videoInfo.title}
                  </Col>
                  <Col sm="1">
                    {toDateStringFromDateTime(video.videoInfo.publishedAt)}
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
