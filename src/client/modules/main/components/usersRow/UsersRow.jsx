import React from 'react';

export const UsersRow = (props) => {
    const {
        user,
        activeUsers,
        changeActiveComponent,
    } = props;

    const handleClick = (componentName) => {
        changeActiveComponent(componentName);
    };

    const isActive = activeUsers.find(item => item.user_id === user._id);

    const getClassName = () => {
        if (isActive) {
            return 'table__body-statusActive';
        }

        return 'table__body-statusOffline';
    };

    return (
        <tr className='body'>
            <td className='table__body-centred'>
                <div className={getClassName()} />
            </td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
                <button id='{user._id}' className='private_chat' onClick={() => handleClick('chat')}>Private Chat</button>
            </td>
        </tr>
    );
};
