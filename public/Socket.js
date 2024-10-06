import { CLIENT_VERSION } from './Constants.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
let stage = null;
socket.on('response', (data) => {
  console.log(data);
  stage = data.stage;
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
  stage = data.stage;
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

const getStage = () => {
  return stage
}

export { sendEvent, getStage };
