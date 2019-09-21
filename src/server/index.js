const express = require('express');
const os = require('os');
const WebSocket = require('ws');
const app = express();
const bodyParser = require('body-parser');
const constants = require('./constants');
const mongoose = require('mongoose');
const ChatDAL = require('./dal/chatDAL');
const Schema = mongoose.Schema;

app.use(express.static('dist'));
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

// init WS
const server = new WebSocket.Server({ port: 4000 }, () => {
    console.log('WS server started on port 4000');
});

// Broadcast to all
server.broadcast = (data, ws) => {
    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(data);
        }
    });
};

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.static('public'));
app.use(express.json());

const chatDal = new ChatDAL();
chatDal.initialize();

app.post('/auth', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await chatDal.readUser(email, password);
        // await confirmUserAuth(user);
        // await confirmUserActive(user);
        res.status(200).send(user);
    } catch (e) {
        res.status(403).send(e.message);
    }
});

// const confirmUserActive = (user) => {
//   const message = {
//     type: 'USER_ACTIVE',
//     payload: user,
//   };
//   server.broadcast(JSON.stringify(message), null);
// };
//
// const confirmUserAuth = (user) => {
//   const message = {
//     type: 'USER_CONNECTED',
//     payload: user,
//   };
//   server.broadcast(JSON.stringify(message), null);
// };

app.post('/signInUser', async (request, res) => {
    try {
        const user = await chatDal.createUser(request.body);
        console.log(user);
        res.status(200).send(user);
    } catch (e) {
        res.status(409).send(e.message);
    }
});

app.post('/users', async (request, res) => {
    const users = await chatDal.readAllUsers();
    res.status(200).send(users);
});

const clients = [];

const getClients = () => {
    return clients.map(client => {
        const { user, user_id } = client;
        return {
            user: user,
            user_id: user_id,
        };
    });
};

const sendActiveUsers = () => {
    let activeUsers = {
        type: 'ACTIVE_USERS',
        user: '',
        user_id: '',
        text: getClients(),
        receiver: 'all',
        time: new Date(),
    };
    server.broadcast(JSON.stringify(activeUsers), null);
};

const handleMessage = (message, ws) => {
    const data = JSON.parse(message);
    const time = new Date();
    switch (data.type) {
        case 'USER_MESSAGE':
            server.broadcast(JSON.stringify({ ...data, time: time }), ws);
            //загрузка сообщений в бд, не загружаю системные сообщения
            chatDal.createMessage({ ...data });
            break;
        case 'USER_CONNECT':
            ws.user = data.user;
            ws.user_id = data.user_id;

            let connectMessage = {
                type: 'SERVER_MESSAGE',
                user: '',
                user_id: '',
                text: `${ws.user} join chat`,
                receiver: 'all',
                time: time,
            };
            server.broadcast(JSON.stringify(connectMessage), ws);
            sendActiveUsers();
            break;
        case 'CLOSE':
            let closeMessage = {
                type: 'SERVER_MESSAGE',
                user: '',
                user_id: '',
                text: `${ws.user} left chat`,
                receiver: 'all',
                time: time,
            };
            server.broadcast(JSON.stringify(closeMessage), ws);
            sendActiveUsers();
            break;
        default:
            return;
    }
};

// ws server
server.on('connection', (ws) => {
    let index = clients.push(ws) - 1;

    // загрузка писем из бд
    chatDal.readPublicMessages(ws);

    ws.on('message', (message) => {
        handleMessage(message, ws);
    });

    ws.on('close', () => {
        clients.splice(index, 1);
        handleMessage(JSON.stringify({
            type: 'CLOSE',
        }), ws);
    });
});
