import React from 'react';
import PropTypes from 'prop-types';

export const ChatMessage = (props) => {
    const {message, user} = props;

    ChatMessage.propTypes = {
        users: PropTypes.array.isRequired,
        messages: PropTypes.string.isRequired,
    };

    const getClassName = () => {
        if (message.type !== 'USER_MESSAGE') {
            return 'system-message';
        }

        if (user.name === message.username) {
            return 'outgoing';
        }

        return 'incoming';
    };

    // if (message._id !== message.user_id) {
        return (
            <div className={getClassName()}>{message.username}: {message.text}</div>
        );
    // }

    // return (
    //     <div className={getClassName()}>{message.text}</div>
    // );
};