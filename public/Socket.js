import { CLIENT_VERSION } from './Constants.js';

const socket = io('http://54.180.122.123:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
let stage = null;
let items = null;
socket.on('response', (data) => {
  console.log(data);
  stage = data.stage;
  if(stage.score == "Infinity"){
    stage.score = Infinity;
  }
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
  stage = data.stage;
  items = data.items;
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

const searchItem = (id) => {
  const item = items.filter(item=>item.id===id)
  return item[0]
}

export { sendEvent, getStage, searchItem };
