import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: CreateChatDto) {
    return await this.chatService.handleMessage(body);
  }

  @SubscribeMessage('getMessage')
  async getMessage() {
    const messages = await this.chatService.findAllMessages();
    return this.server.emit('userMessage', messages);
  }
}
