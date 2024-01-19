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
import { InitiateChatDto } from './dto/initiate-chat.dto';
import { TypingChatDto } from './dto/typing-chat.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;

  private typingUsers: Set<string> = new Set(); // Set to store unique user IDs
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

  @SubscribeMessage('typing')
  async isTyping(
    @MessageBody() { uuid, isTyping }: TypingChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userName = await this.chatService.getGuestNameById(uuid);

    if (isTyping) {
      this.typingUsers.add(uuid);
    } else {
      this.typingUsers.delete(uuid);
    }

    const typingUsers = Array.from(this.typingUsers);

    const nbOfUsers = typingUsers.length;

    client.broadcast.emit('typing', { userName, isTyping, nbOfUsers });
  }

  @SubscribeMessage('signout')
  async disconnectGuest(@MessageBody() body: CreateChatDto) {
    await this.chatService.handleDisconnect(body);
    this.typingUsers.delete(body.uuid);
    console.log(
      `${body.userName} with uid ${body.uuid} has left the guestbook`,
    );
  }
}
