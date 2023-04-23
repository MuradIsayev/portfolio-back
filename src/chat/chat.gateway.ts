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

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('initiate')
  async create(@MessageBody() body: CreateChatDto, @ConnectedSocket() socket: Socket) {
    await this.chatService.create(body);
    console.log(`${body.userName} with uid ${body.uuid} has joined the guestbook`);
    return this.server.emit('userJoined', socket.id);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() body: CreateChatDto,) {
    return await this.chatService.handleMessage(body);
  }

  @SubscribeMessage('getMessage')
  async getMessage() {
    const messages = await this.chatService.findAllMessages();
    return this.server.emit('userMessage', messages);
  }
}
