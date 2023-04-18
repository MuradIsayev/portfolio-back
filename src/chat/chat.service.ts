import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ChatService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async setMessage(body: CreateChatDto) {
    try {
      await this.redis.set(`message:${body.userName}`, JSON.stringify(body));
    } catch (error) {
      throw new Error('Error saving the message');
    }
  }

  async handleMessage(body: CreateChatDto) {
    await this.setMessage(body);
  }

  async findAllMessages() {
    try {
      const allMessages = await this.redis.keys('message:*');
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
}
