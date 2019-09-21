import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Login extends Component {
    static propTypes = {
        addActiveUser: PropTypes.func,
        changeActiveModule: PropTypes.func.isRequired,
        changeActiveComponent: PropTypes.func.isRequired,
        handleLogin: PropTypes.func.isRequired,
    };

    state = {
        email: '',
        password: '',
    };

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
    };

    handleClick = () => {
        this.setState(state => ({
            ...state,
            email: '',
            password: '',
        }));
        this.signUp();
        // this.props.changeActiveModule('main');
        // this.props.changeActiveComponent('usersTable');
    };

    handleLoginClick = (moduleName) => {
        this.props.changeActiveModule(moduleName);
    };

    signUp = () => {
        fetch('/auth', {
            method: 'POST', // или 'PUT'
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(this.state), // data может быть типа `string` или {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then((response) => {
                    this.props.handleLogin(response);
                    this.props.changeActiveModule('main');
                    this.props.changeActiveComponent('usersTable');
                },
                (error) => {
                    console.log(`Ошибка авторизации:${error}`);
                });
    };
    // не очень понимаю как тут правильно отловить ошибку, жалуется на ошибки в then

    render() {
        return (
            <div className='container' id='container'>
                <div className='container__button' action='#'>
                    <button className='button__log-in button' onClick={() => this.handleLoginClick('login')}>Log In
                    </button>
                    <button className='button__sign-in button' onClick={() => this.handleLoginClick('signIn')}>Sign In
                    </button>
                </div>
                <form className='container-log-in' id='logIn' onSubmit={this.handleSubmit}>
                    <div className='form__log-in log-in'>

                        <div className='log-in__Email form_block'>
                            <label htmlFor='email_log' className='input-label'>e-mail</label>
                            <input
                                type='email_log'
                                id='email'
                                placeholder='Email'
                                required
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className='log-in__password form_block'>
                            <label htmlFor='password_log' className='input-label'>password</label>
                            <input
                                type='password'
                                id='password'
                                placeholder='Password'
                                required
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <div className='form__buttonSubmit buttonSubmit'>
                        <button
                            className='buttonSubmit__log-in submit__button'
                            id='submitBtn'
                            onClick={this.handleClick}
                        >
                            Submit
                        </button>
                    </div>
                    <div className='form__error' id='error'/>
                </form>
            </div>
        );
    }
}
