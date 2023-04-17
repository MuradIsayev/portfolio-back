import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService,
    @InjectRedis() private readonly redis: Redis) {}

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() body: CreateChatDto) {
    console.log(socket.listenerCount('message'));
    this.server.emit('message', body.message);
    await this.redis.set('key', 'value', 'EX', 10);
    return body;
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }
}
