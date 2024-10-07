import { getUsers, removeUser } from '../models/user.model.js';
import { createStage, getStage } from '../models/stage.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { getGameAssets } from '../init/assets.js';

export const handleConnection = (socket, userUUID) => {
  console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
  console.log('Current users:', getUsers());

  // 스테이지 빈 배열 생성
  createStage(userUUID);

  // 필요 데이터 불러오기
  const { items } = getGameAssets();

  socket.emit('connection', { uuid: userUUID, stage: getStage(userUUID), items: items.data});
};

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
};

export const handleEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }
  socket.emit('response', response);
};
