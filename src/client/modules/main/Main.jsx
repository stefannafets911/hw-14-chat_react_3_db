import React from 'react';
import { UsersTable } from './components/usersTable';
import { Chat } from './components/chat';

import PropTypes from 'prop-types';

const Main = props => {
    const {
        users,
        activeUsers,
        user,
        logOut,
        messages,
        addMessage,
        activeComponent,
        changeActiveModule,
        changeActiveComponent,
    } = props;


    const handleClick = (componentName) => {
        changeActiveComponent(componentName);
    };

    const handleModule = () => {
        logOut();
    };

    return (
        <div className='wrapper'>
            <div className='wrapper__header header'>
                <h1 className='header__title'>Users</h1>
            </div>
            <div className='wrapper__user user'>
                <div className='user__data'>
                    <div className='user__data name' id='nameActive'>Name: {user.name}</div>
                    <div className='user__data email' id='emailActive'>Email: {user.email}</div>
                </div>
                <div className='user__logout'>
                    <button className='user__logout logout' id='logoutBtn' onClick={handleModule}>Log out</button>
                </div>
            </div>
            <div className='wrapper__users users'>
                <div className='users__buttons'>
                    <div className='users__button button-users'>
                        <button className='button-users__btn' id='usersBtn' onClick={() => handleClick('usersTable')}>Users</button>
                    </div>
                    <div className='users__button button-chat'>
                        <button className='button-chat__btn' id='chatBtn' onClick={() => handleClick('chat')}>Chat</button>
                    </div>
                    <div className='users__button users-chat' id='usersChat' />
                </div>
                <div className='users__change' id='usersTable'>
                    {
                        activeComponent === 'usersTable' && (
                            <UsersTable
                                users={users}
                                activeUsers={activeUsers}
                                activeComponent={activeComponent}
                                changeActiveComponent={changeActiveComponent}
                            />
                        )
                    }
                    {
                        activeComponent === 'chat' && (
                            <Chat
                                addMessage={addMessage}
                                messages={messages}
                                user={user}
                            />
                        )
                    }
                </div>
                <div className='users__change' id='chatTable' />
            </div>
        </div>
    );
};

Main.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
    users: PropTypes.array.isRequired,
    logOut: PropTypes.func.isRequired,
    activeUsers: PropTypes.array.isRequired,
    messages: PropTypes.array.isRequired,
    addMessage: PropTypes.func.isRequired,
    activeComponent: PropTypes.string.isRequired,
    changeActiveModule: PropTypes.func.isRequired,
    changeActiveComponent: PropTypes.func.isRequired,
};

export default React.memo(Main);
