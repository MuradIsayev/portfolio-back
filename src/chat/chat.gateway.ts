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

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('initiate')
  async create(@MessageBody() body: InitiateChatDto) {
    await this.chatService.create(body);
    console.log(
      `${body.userName} with uid ${body.uuid} has joined the guestbook`,
    );
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() body: CreateChatDto) {
    await this.chatService.handleMessage(body);

    const messages = await this.chatService.findAllMessages();

    return this.server.emit('updatedMessages', messages);
  }

  @SubscribeMessage('getAllMessages')
  async getMessage() {
    const messages = await this.chatService.findAllMessages();
    return this.server.emit('allMessages', messages);
  }

  @SubscribeMessage('typing')
  async isTyping(
    @MessageBody() { uuid, isTyping }: TypingChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const [nbOfUsers, userName, typingUsers] =
      await this.chatService.getWhoIsTyping(uuid, isTyping);

    client.broadcast.emit('typing', {
      userName,
      // isTyping,
      allTypingUserIDs: typingUsers,
      nbOfUsers,
    });
  }

  @SubscribeMessage('signout')
  async disconnectGuest(@MessageBody() body: CreateChatDto) {
    await this.chatService.handleDisconnect(body);
    console.log(
      `${body.userName} with uid ${body.uuid} has left the guestbook`,
    );
  }
}
