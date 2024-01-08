import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Guest } from './types';
import * as dayjs from 'dayjs';
import { InitiateChatDto } from './dto/initiate-chat.dto';

@Injectable()
export class ChatService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async getGuest(body: CreateChatDto) {
    const guest = await this.redis.get(`guest:${body.uuid}`);

    if (!guest) return;

    return JSON.parse(guest);
  }

  async setGuest(guest: Guest) {
    if (!guest) throw new NotFoundException('Guest not found');
    await this.redis.set(`guest:${guest.uuid}`, JSON.stringify(guest));
  }

  async handleMessage(body: CreateChatDto) {
    const currentGuest = await this.getGuest(body);
    if (!currentGuest) throw new NotFoundException('Guest not found');
    const message = {
      createdAt: new Date().toISOString(),
      message: body.message,
    };
    currentGuest.messages.push(message);
    await this.setGuest(currentGuest);
  }

  async findAllMessages() {
    try {
      const allMessages = [];
      const guests = await this.redis.keys('guest:*');
      const guestsData = await Promise.all(
        guests.map(async (guest) => {
          const messageData = await this.redis.get(guest);
          const parsedMessages = await JSON.parse(messageData);

          return parsedMessages;
        }),
      );

      guestsData.forEach((guestData) => {
        guestData.messages.forEach((m) => {
          allMessages.push({
            userName: guestData?.userName,
            photoURL: guestData?.photoURL,
            message: m?.message,
            createdAt: m?.createdAt,
            isOnline: guestData?.isOnline,
          });
        });
      });

      allMessages.sort((a, b) => {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      allMessages.forEach((m) => {
        m.createdAt = dayjs(m.createdAt).format('HH:mm DD/MM/YYYY');
      });

      return allMessages.slice(-50).reverse();
    } catch (error) {
      throw new Error('Error finding the message');
    }
  }

  async create(body: InitiateChatDto) {
    const currentGuest = await this.getGuest(body);

    if (!currentGuest) {
      const guest: Guest = {
        uuid: body.uuid,
        userName: body.userName,
        messages: [],
        photoURL: body.photoURL,
        isOnline: body.isOnline,
      };

      await this.setGuest(guest);
    } else {
      currentGuest.isOnline = true;
      await this.setGuest(currentGuest);
    }
  }

  async handleDisconnect(body: CreateChatDto) {
    const currentGuest = await this.getGuest(body);

    if (!currentGuest) throw new NotFoundException('Guest not found');
    console.log(currentGuest);
    currentGuest.isOnline = false;
    console.log(currentGuest);
    await this.setGuest(currentGuest);
  }
}
