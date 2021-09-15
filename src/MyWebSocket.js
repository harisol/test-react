/**
 * urutan method yang terpanggil: ([server] is on another project)
 * - [server] wsServer.on('request') - only once at first time or refreshed
 * - [client] componentDidMount()
 * - [client] client.onopen()
 * - [client] showLoginSection()
 * - user press join button
 * - [client] loginUser()
 * - [client] showEditorSection() - automatic triggered because state.username is changed
 * - [client] client.send()
 * - [server] connection.on('message')
 * - [server] sendMessage()
 * - [client] client.onmessage() - online users will recieve message that a user is connected
 * - user typing in editor
 * - [client] onEditorStateChange()
 * - [client] client.send()
 * - [server] connection.on('message')
 * - [server] sendMessage()
 * - [client] client.onmessage()
 * - user close window
 * - [server] connection.on('close')
 * - [server] sendMessage()
 * - [client] client.onmessage() - online users will recieve message that a user is disconnected
 */

import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Identicon from 'react-identicons';
import {
  Navbar,
  NavbarBrand,
  UncontrolledTooltip
} from 'reactstrap';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import './Editor.css';

const client = new W3CWebSocket('ws://127.0.0.1:3001');
const contentDefaultMessage = "Start writing your document here";

export default class MyWebSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsers: [],
      userActivity: [],
      username: null,
      text: ''
    };
  }

  componentDidMount() {
    console.log('componentDidMount is triggered');
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    
    client.onmessage = (message) => {
      console.log('client on message called');
      const dataFromServer = JSON.parse(message.data);
      const stateToChange = {};
      if (dataFromServer.type === "userevent") {
        stateToChange.currentUsers = Object.values(dataFromServer.data.users);
      } else if (dataFromServer.type === "contentchange") {
        stateToChange.text = dataFromServer.data.editorContent || contentDefaultMessage;
      }
      stateToChange.userActivity = dataFromServer.data.userActivity;
      this.setState({
        ...stateToChange
      });
    };
  }

  /* When a user joins, I notify the
  server that a new user has joined to edit the document. */
  logInUser = () => {
    console.log('login user is triggered');
    const username = this.username.value;
    if (!username.trim()) return;

    const data = {
      username
    };

    this.setState({
      ...data
    }, () => {
      client.send(JSON.stringify({
        ...data,
        type: "userevent"
      }));
    });
  };

  /* When content changes, we send the
  current content of the editor to the server. */
  onEditorStateChange = (text) => {
    client.send(JSON.stringify({
      type: "contentchange",
      username: this.state.username,
      content: text
    }));
  };

  showLoginSection = () => (
    <div className="account">
      <div className="account__wrapper">
        <div className="account__card">
          <div className="account__profile">
            <Identicon className="account__avatar" size={64} string="randomness" />
            <p className="account__name">Hello, user!</p>
            <p className="account__sub">Join to edit the document</p>
          </div>
          <input name="username" ref={(input) => { this.username = input; }} className="form-control" />
          <button type="button" onClick={() => this.logInUser()} className="btn btn-primary account__btn">Join</button>
        </div>
      </div>
    </div>
  )

  showEditorSection = () => (
    <div className="main-content">
      <div className="document-holder">
        <div className="currentusers">
          {this.state.currentUsers.map((user, index) => (
            <React.Fragment key={`fragment-${index}`}>
              <span id={user.username} className="userInfo">
                <Identicon className="account__avatar" style={{ backgroundColor: user.randomcolor }} size={40} string={user.username} />
              </span>
              <UncontrolledTooltip placement="top" target={user.username}>
                {user.username}
              </UncontrolledTooltip>
            </React.Fragment>
          ))}
        </div>
        <Editor
          options={{
            placeholder: {
              text: this.state.text ? contentDefaultMessage : ""
            }
          }}
          className="body-editor"
          text={this.state.text}
          onChange={this.onEditorStateChange}
        />
      </div>
      <div className="history-holder">
        <ul>
          {this.state.userActivity.map((activity, index) => <li key={`activity-${index}`}>{activity}</li>)}
        </ul>
      </div>
    </div>
  )

  render() {
    const { username } = this.state;

    return (
      <React.Fragment>
        <Navbar color="light" light>
          <NavbarBrand href="/">Real-time document editor</NavbarBrand>
        </Navbar>
        <div className="container-fluid">
          {username ? this.showEditorSection() : this.showLoginSection()}
        </div>
      </React.Fragment>
    );
  }
}
