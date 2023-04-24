import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Guest } from './types';

@Injectable()
export class ChatService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async getGuest(body: CreateChatDto) {
    const guest = await this.redis.get(`guest:${body.uuid}`);

    if (!guest) return null;

    return JSON.parse(guest);
  }

  async setGuest(guest: Guest) {
      if(!guest) throw new NotFoundException('Guest not found');
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
      const allMessages = await this.redis.keys('guest:*');
      const messages = await Promise.all(
        allMessages.map(async (message) => {
          const messageData = await this.redis.get(message);
          return await JSON.parse(messageData);
        }),
      );
      return messages;
    } catch (error) {
      throw new Error('Error finding the message');
    }
  }

  async create(body: CreateChatDto) {
    const currentGuest = await this.getGuest(body);
    if (!currentGuest) {
      const guest: Guest = {
        uuid: body.uuid,
        userName: body.userName,
        messages: [],
        photoURL: body.photoURL,
        isOnline: true,
      };
      await this.setGuest(guest);
    }
    currentGuest.isOnline = true;
    await this.setGuest(currentGuest);
  }

  async handleDisconnect(body: CreateChatDto) {
    const currentGuest = await this.getGuest(body);
    if (!currentGuest) throw new NotFoundException('Guest not found')
    currentGuest.isOnline = false;
    await this.setGuest(currentGuest);
  }
}
