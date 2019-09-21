import React, { Component } from 'react';
import './app.less';

import Main from './modules/main/Main.jsx';
import Login from './modules/login/Login.jsx';
import Signin from './modules/signin/SignIn.jsx';

let ws = null;

export default class App extends Component {
    state = {
        _activeUsers: [],
        _messages: [],
        _allUsers: [],
        _user: {},
        _receiver: '',
        activeModule: 'login',
        activeComponent: 'login',
    };

    changeActiveComponent = (componentName) => {
        this.setState(state => ({
            ...state,
            activeComponent: componentName,
        }));
    };

    addUsers = (users) => {
        console.log(users);
        this.setState(state => ({
            ...state,
            _allUsers: [...state._allUsers, ...users],
        }));
    };

    addUser = (user) => {
        console.log(user);
        this.setState(state => ({
            ...state,
            _allUsers: [...state._allUsers, user],
        }));
    };

    handleLogin = (user) => {
        this.setState(state => ({
            ...state,
            _user: user,
        }));

        this.initWs();
    };

    logOut = () => {
        if (ws) {
            ws.close();
            ws = null;
        }

        this.changeActiveModule('login');
    };

    addMessage = (text) => {
        const message = {
            type: 'USER_MESSAGE',
            username: this.state._user.name,
            text,
            user_id: this.state._user._id,
            receiver: 'all',
            time: new Date(),
        };

        this.setState(state => ({
            ...state,
            _messages: [...state._messages, message],
        }));

        this.sendMessage(message);
    };

    //добавляем сообщения из базы и чужие сообщения
    addMessageFromDB = (messageObj) => {
        switch (messageObj.type) {
            case 'ACTIVE_USERS':
                this.setState(state => ({
                    ...state,
                    _activeUsers: messageObj.text,
                }));
                break;
            default:
                this.setState(state => ({
                    ...state,
                    _messages: [...state._messages, messageObj],
                }));
        }

        console.log('addMessageFromDB', messageObj);
        // const message = {
        //     // _id: 'message id',
        //     user: messageObj.user,
        //     text: messageObj.text,
        //     user_id: 'user id',
        //     receiver: 'all',
        //     time: messageObj.time,
        // };
        //
        // this.setState(state => ({
        //     ...state,
        //     _messages: [...state._messages, messageObj],
        // }));
    };

    changeActiveModule = moduleName => {
        this.setState(state => ({
            ...state,
            activeModule: moduleName,
        }));
    };

    componentDidMount() {
        this.getAllUsers();
        // this.chatWebsocket();
    }

    getAllUsers = () => {
        fetch('/users', {
            method: 'POST', // или 'PUT'
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(this.state), // data может быть типа `string` или {object}!
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .then((response) => {
                    this.addUsers(response);
                },
                (error) => {
                    alert(`Error:${error}`);
                });
    };

    // addWebsocketMessage = (message) => {
    //   this.setState(state => ({ _messages: [message, ...state._messages] }));
    // };
    //
    // chatWebsocket = () => {
    //   let ws = null;
    //   ws = new WebSocket('ws://localhost:4000');
    //
    //   const sendMessage = (data) => {
    //     ws.send(JSON.stringify(data));
    //   };

    initWs = () => {
        if (ws) {
            ws.close();
        }

        ws = new WebSocket('ws://localhost:4000');
        // console.log('test ws');
        ws.onopen = () => {
            console.log('onopen');
            this.sendMessage({
                type: 'USER_CONNECT',
                user: this.state._user.name,
                user_id: this.state._user._id,
                text: '',
                receiver: 'all',
                time: new Date(),
            });
        };

        ws.onmessage = message => {
            this.addMessageFromDB(JSON.parse(message.data));
        };

        ws.onclose = () => {
            // console.log('onclose', 2);
        };
    };

    sendMessage = (data) => {
        console.log('sendMessage', data);
        ws.send(JSON.stringify(data));
    };

    changeActiveModule = (moduleName) => {
        this.setState(state => ({
            ...state,
            activeModule: moduleName,
        }));
    };

    render() {
        const { activeModule } = this.state;

        return (
            <div className='wrapper-login'>
                <div id='loader'>
                    <progress id='progress_loader' value='0' max='100'/>
                    <output htmlFor='progress_loader'/>
                </div>
                {
                    activeModule === 'signIn' &&
                    <Signin
                        changeActiveModule={this.changeActiveModule}
                        addUser={this.addUser}
                    />

                }
                {
                    activeModule === 'login' &&
                    <Login
                        changeActiveModule={this.changeActiveModule}
                        changeActiveComponent={this.changeActiveComponent}
                        handleLogin={this.handleLogin}
                    />

                }
                {
                    activeModule === 'main' &&
                    <Main
                        users={this.state._allUsers}
                        logOut={this.logOut}
                        activeUsers={this.state._activeUsers}
                        user={this.state._user}
                        messages={this.state._messages}
                        activeComponent={this.state.activeComponent}
                        changeActiveModule={this.changeActiveModule}
                        changeActiveComponent={this.changeActiveComponent}
                        addMessage={this.addMessage}
                    />

                }
            </div>
        );
    }
}
