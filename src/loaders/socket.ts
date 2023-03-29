/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';

import Logger from './logger';
import Page from '../models/Page';
import { PageType } from '../types';
import { corsOptions } from './express';

const onSocket = (server: any) => {
  const io = new Server(server, {
    cors: corsOptions,
  });

  io.on('connection', (socket) => {
    console.log(`${socket.id} user connected`);
    Logger.info(`✅ Socket is listening on ${process.env.PORT}`);

    socket.on('disconnect', () => {
      socket.removeAllListeners();
      console.log('클라이언트 접속 해제', socket.id);
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

    socket.on('shared-page', (page: PageType) => {
      if (!page) return;
      const { _id, title, desc } = page;

      socket.broadcast.emit('receive-changes', { _id, title, desc });
    });

    socket.on(
      'get-position',
      (info: { image: string; email: string; posY: string }) => {
        socket.broadcast.emit('pos-changes', info);
      },
    );
  });
};

export default onSocket;
