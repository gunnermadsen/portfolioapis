import { SocketController, OnConnect, ConnectedSocket, OnDisconnect, OnMessage, MessageBody, SocketIO, SocketId, SocketRequest, SocketRooms } from 'socket-controllers'
import { IMessageBody } from '../../models/message-body.interface'
import { Logger } from '@overnightjs/logger'

@SocketController()
export class MeetingsSocketController {

    private standbyClients: { [id: string]: string[] } = {}

    @OnConnect()
    public connection(@SocketId() socketId: string) {
        Logger.Info(`client connected on socketId: ${socketId}`)
    }

    @OnDisconnect()
    public disconnect() {
        Logger.Err("client disconnected")
    }

    @OnMessage('signal')
    public signal(@ConnectedSocket() socket: SocketIO.Socket, @MessageBody() message: IMessageBody, @SocketId() socketId: string) {
        socket.join(message.roomId)
        // Logger.Warn(`Accessing SocketID: ${socketId} from signal event handler`)
        // Logger.Info(`${message.sender} has sent socketID of ${message.roomId}`)

        // During the signaling process, we will pass messages to the intended recipient using their socket id.
        // This will ensure that the correct ICE candidate informaiton reaches its intended destination, 
        // and will help prevent errors while attempting to add ice candidates on the client.

        socket.broadcast.to(message.roomId).emit('signal', message)
    }
    
    @OnMessage('standby')
    public standby(@ConnectedSocket() socket: SocketIO.Socket, @MessageBody() message: IMessageBody, @SocketId() socketId: string, @SocketIO() io: SocketIO.Server) {
        const room = message.roomId != null ? message.roomId : message.meetingId
        socket.join(room)

        const roomCount = socket.adapter.rooms[message.meetingId].length

        // once a client connects with a socket id in the message, 
        // emit the 'ready' event to the appropriate client
        if (roomCount > 1 && message.roomId) {

            // two or more memebrs are ready send the host (or client)'s socket id to the guest (or host)
            socket.broadcast.to(room).emit('ready', {...message, mode: 'signaling' })
            // io.of(`/${message.meetingId}`).emit('ready', { ...message, mode: 'signaling' })

            this.standbyClients[message.meetingId] = []
        } 
        // else if (roomCount > 2 && message.roomId) {
        //     io.in(room).emit('ready', { ...message, mode: 'signaling' })
        // }
        else {

            // the meeting host (or client) just connected, send its socket id to the guest (or host)
            // this event triggers the _addMember method on the client
            socket.to(message.meetingId).emit('standby', { ...message, roomId: socketId })
        }
    }

    @OnMessage('timer')
    public timer(@ConnectedSocket() socket: SocketIO.Socket, @MessageBody() message: IMessageBody, @SocketId() socketId: string, @SocketIO() io: SocketIO.Server) {
        socket.join(message.meetingId)
        // const client = this.standbyClients[message.meetingId].find((clientId: string) => clientId === message.clientId)
        
        if (this.standbyClients[message.meetingId].length >= 2) {
            io.in(message.meetingId).emit('timer', { ...message, mode: "starttimer" })
            // delete this.standbyClients[message.meetingId]
        } 
        else {
            this.standbyClients[message.meetingId].push(message.clientId)
            console.log(this.standbyClients[message.meetingId])
        }
    }

    @OnMessage('filetransfer')
    public upload(@ConnectedSocket() socket: SocketIO.Socket, @MessageBody() message: IMessageBody, @SocketId() socketId: string) {
        socket.join(message.roomId)

        socket.to(message.roomId).emit('filetransfer', message)
    }

}