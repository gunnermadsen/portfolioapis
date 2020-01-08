import { SocketController, OnConnect, ConnectedSocket, OnDisconnect, OnMessage, MessageBody, SocketIO, SocketId, SocketRequest, SocketRooms } from 'socket-controllers'
import { IMessageBody } from '../../models/message-body.interface'
import { Logger } from '@overnightjs/logger'
import * as uuid from 'uuid'

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
    public signal(@SocketIO() io: SocketIO.Server, @ConnectedSocket() socket: SocketIO.Socket, @MessageBody() message: IMessageBody, @SocketId() socketId: string) {
        socket.join(message.clientId)
        Logger.Info(`**** Client connection id: '${message.clientId}', joined room: '${message.roomId}', mode is: '${message.mode}'`)
        // Logger.Warn(`Accessing SocketID: ${socketId} from signal event handler`)
        // Logger.Info(`${message.sender} has sent socketID of ${message.roomId}`)

        // During the signaling process, we will pass messages to the intended recipient using their socket id.
        // This will ensure that the correct ICE candidate informaiton reaches its intended destination, 
        // and will help prevent errors while attempting to add ice candidates on the client.

        if (message.mode === 'hangup' && this.standbyClients[message.meetingId].length >= 2) {
            this.standbyClients[message.meetingId] = []
        }

        // Logger.Info(`**** Sending message to clientId connection: '${message.clientId}' with room id: '${message.roomId}'`)
        socket.to(message.clientId).emit('signal', message)
    }
    
    @OnMessage('standby')
    public standby(@ConnectedSocket() socket: SocketIO.Socket, @MessageBody() message: IMessageBody, @SocketId() socketId: string, @SocketIO() io: SocketIO.Server) {
        const room = message.clientId != null ? message.clientId : message.meetingId
        socket.join(room)

        // when we need to send ice candidate information,
        // we just join the room id that is passed to the 
        // server from the client based on the room id we generated, 
        // then we can ensure we are sending the ice candidate info
        // to the correct meeting participant

        // Workflow:
        //      - Client A joins a room using the meeting id, 
        //        has an id generated, then broadcasts the 
        //        client id to all members that are in the room.
        //      - Client B joins the meeting id room,
        //        and the room now consists of two users.
        //      - Client B leaves the room named after the meeting id,
        //        and joins the room named after the client id. 


        const roomCount = socket.adapter.rooms[message.meetingId].length

        // const connectionCount = socket.adapter.rooms[message.clientId].length
        // once a client connects with a socket id in the message, 
        // emit the 'ready' event to the appropriate client
        
        if (roomCount > 1 && message.clientId) {

            socket.join(message.clientId)

            const idealRoomCount = socket.adapter.rooms[message.clientId].length

            const doesRoomExist = Object.keys(socket.adapter.rooms).find((key: string) => key === message.clientId)

            if (idealRoomCount > 1 && doesRoomExist) {
                // two or more members are ready. send the host (or client)'s socket id to the guest (or host)
                socket.to(message.clientId).emit('ready', { ...message, mode: 'signaling' })
                // io.of(`/${message.meetingId}`).emit('ready', { ...message, mode: 'signaling' })
    
                this.standbyClients[message.meetingId] = []
            } else {
                socket.to(message.meetingId).emit('standby', { ...message, roomId: socketId })
            }

        } 
        else {
            const clientId = uuid.v4()

            // the meeting host (or client) just connected, send its socket id to the guest (or host)
            // this event triggers the _addMember method on the client
            socket.to(message.meetingId).emit('standby', { ...message, roomId: socketId, clientId: clientId })
            
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