/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';

import Logger from './logger';
import Page from '../models/Page';
import { PageType } from '../types';
import { corsOptions } from './express';
import { debounce } from '../api/helper/debounce';

const onSocket = (server: any) => {
  const io = new Server(server, {
    cors: corsOptions,
  });

  // 어떤 방에 어떤 유저가 들어있는지
  const users = {} as any;
  const socketRoom = {} as any;
  const MAXIMUM = 2;

  io.on('connection', (socket) => {
    console.log(`${socket.id} user connected`);
    Logger.info(`✅ Socket is listening on ${process.env.PORT}`);

    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', socket.id);
      // socket.removeAllListeners();
      // 방을 나가게 된다면 socketRoom과 users의 정보에서 해당 유저를 지워줍니다.
      const roomID = socketRoom[socket.id];

      if (users[roomID]) {
        users[roomID] = users[roomID].filter(
          (user: any) => user.id !== socket.id,
        );
        if (users[roomID].length === 0) {
          delete users[roomID];
          return;
        }
      }
      delete socketRoom[socket.id];
      socket.broadcast.to(users[roomID]).emit('user_exit', { id: socket.id });
    });

    socket.on('error', (error) => {
      console.error(error);
    });

    socket.on('get-page', async (page: PageType) => {
      try {
        if (!page) return;
        const { _id, title, desc, creator } = page;

        await Page.findOneAndUpdate(
          { _id: { $in: _id } },
          { $set: { title, desc } },
        ).lean();

        const pages = await Page.find<PageType>({ creator }).lean();

        socket.join(String(_id));
        socket.emit('edit-page', { pages });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('shared-page', async (page: PageType) => {
      try {
        if (!page) return;
        const { _id, title, desc, writingUser } = page;

        await Page.findOneAndUpdate(
          { _id: { $in: _id } },
          { $set: { title, desc } },
        ).lean();

        socket.join(String(_id));
        socket.broadcast
          .to(String(_id))
          .emit('receive-changes', { _id, title, desc, writer: writingUser });
      } catch (error) {
        socket.broadcast.emit('receive-changes', error);
      }
    });

    // 유저 profile 위치(y좌표) 통신
    socket.on(
      'get-position',
      (info: { id: string; image: string; email: string; posY: string }) => {
        socket.join(String(info.id));

        socket.broadcast.to(String(info.id)).emit('pos-changes', info);
      },
    );

    socket.on('send-textareaHeight', (height) => {
      socket.broadcast.emit('get-textareaHeight', height);
    });

    // WebRTC
    socket.on('join_room', (data) => {
      // 방이 기존에 생성되어 있다면
      if (users[data.room]) {
        // 현재 입장하려는 방에 있는 인원수
        const currentRoomLength = users[data.room].length;
        if (currentRoomLength === MAXIMUM) {
          // 인원수가 꽉 찼다면 돌아갑니다.
          socket.to(socket.id).emit('room_full');
          return;
        }

        // 여분의 자리가 있다면 해당 방 배열에 추가해줍니다.
        users[data.room] = [...users[data.room], { id: socket.id }];
      } else {
        // 방이 존재하지 않다면 값을 생성하고 추가해줍시다.
        users[data.room] = [{ id: socket.id }];
      }
      console.log(users);
      socketRoom[socket.id] = data.room;

      // 입장
      socket.join(data.room);

      // 입장하기 전 해당 방의 다른 유저들이 있는지 확인하고
      // 다른 유저가 있었다면 offer-answer을 위해 알려줍니다.
      const others = users[data.room].filter(
        (user: any) => user.id !== socket.id,
      );
      console.log(others);

      if (others.length) {
        io.sockets.to(socket.id).emit('all_users', others);
      }
    });

    socket.on('offer', (sdp, roomName) => {
      // offer를 전달받고 다른 유저들에게 전달해 줍니다.
      socket.to(roomName).emit('getOffer', sdp);
    });

    socket.on('answer', (sdp, roomName) => {
      // answer를 전달받고 방의 다른 유저들에게 전달해 줍니다.
      socket.to(roomName).emit('getAnswer', sdp);
    });

    socket.on('candidate', (candidate, roomName) => {
      // candidate를 전달받고 방의 다른 유저들에게 전달해 줍니다.
      socket.to(roomName).emit('getCandidate', candidate);
    });
  });
};

export default onSocket;
