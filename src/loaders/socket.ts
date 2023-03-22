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
    Logger.info(`✅ Socket is listening on ${process.env.PORT}`);

    socket.on('disconnect', () => {
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

        socket.emit('edit-page', { pages });
        socket.join(String(_id));
      } catch (err) {
        console.log(err);
      }
    });
  });
};

export default onSocket;
