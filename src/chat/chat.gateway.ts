import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server } from 'socket.io';
import { InitiateChatDto } from './dto/initiate-chat.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('initiate')
  async create(@MessageBody() body: InitiateChatDto) {
    await this.chatService.create(body);
    console.log(
      `${body.userName} with uid ${body.uuid} has joined the guestbook`,
    );
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: CreateChatDto) {
    return await this.chatService.handleMessage(body);
  }

  @SubscribeMessage('getMessage')
  async getMessage() {
    const messages = await this.chatService.findAllMessages();
    return this.server.emit('userMessage', messages);
  }

  @SubscribeMessage('signout')
  async disconnectGuest(@MessageBody() body: CreateChatDto) {
    await this.chatService.handleDisconnect(body);
    console.log(
      `${body.userName} with uid ${body.uuid} has left the guestbook`,
    );
  }
}
