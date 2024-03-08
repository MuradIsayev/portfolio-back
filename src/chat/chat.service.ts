import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Guest } from './types';
import * as dayjs from 'dayjs';
import { InitiateChatDto } from './dto/initiate-chat.dto';

@Injectable()
export class ChatService {
  private typingUsers: Set<string> = new Set(); // Set to store unique user IDs
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async getGuest(body: CreateChatDto) {
    const guest = await this.redis.get(`guest:${body.uuid}`);

    if (!guest) return;

    return JSON.parse(guest);
  }

  async getGuestById(uuid: string) {
    const guest = await this.redis.get(`guest:${uuid}`);

    if (!guest) throw new NotFoundException('Guest could not be found by ID');

    return JSON.parse(guest);
  }

  async setGuest(guest: Guest) {
    if (!guest) throw new NotFoundException('Guest not found');
    await this.redis.set(`guest:${guest.uuid}`, JSON.stringify(guest));
  }

  async handleMessage(uuid: string, message: string) {
    const currentGuest = await this.getGuestById(uuid);

    const newMessage = {
      createdAt: new Date().toISOString(),
      message: message,
    };

    currentGuest.messages.push(newMessage);
    await this.setGuest(currentGuest);
  }

  async getWhoIsTyping(uuid: string, isTyping: boolean) {
    const typingUsers = Array.from(this.typingUsers);

    const guest = await this.getGuestById(uuid);

    const userName = guest.userName;

    if (isTyping) {
      this.typingUsers.add(uuid);
    } else {
      this.typingUsers.delete(uuid);
    }

    const nbOfUsers = typingUsers.length;

    return [nbOfUsers, userName, typingUsers];
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

  async handleDisconnect(uuid: string) {
    const currentGuest = await this.getGuestById(uuid);

    this.typingUsers.delete(currentGuest.uuid);

    currentGuest.isOnline = false;

    await this.setGuest(currentGuest);
  }
}
