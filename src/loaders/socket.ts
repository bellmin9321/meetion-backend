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

    socket.on(
      'shared-page',
      debounce(async (page: PageType) => {
        if (!page) return;
        const { _id, title, desc, editor } = page;

        await Page.findOneAndUpdate(
          { _id: { $in: _id } },
          { $set: { title, desc } },
        ).lean();

        socket.join(String(_id));
        socket.broadcast
          .to(String(_id))
          .emit('receive-changes', { _id, title, desc, editor });
      }, 800),
    );

    socket.on(
      'get-position',
      (info: { id: string; image: string; email: string; posY: string }) => {
        socket.join(String(info.id));
        socket.broadcast.to(String(info.id)).emit('pos-changes', info);
      },
    );
  });
};

export default onSocket;
