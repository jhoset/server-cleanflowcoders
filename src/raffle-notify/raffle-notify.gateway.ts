import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';


@WebSocketGateway({ cors: true })
export class RaffleNotifyGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RaffleNotifyGateway.name);
  @WebSocketServer() server;
  afterInit(server: any): any {
    this.logger.log("Websocket Server Initialized");
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.log(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  onNotifyRaffleUpdate(client: any, payload: any): Observable<WsResponse<any>> | any {
    this.server.emit('message', payload);
  }
}
