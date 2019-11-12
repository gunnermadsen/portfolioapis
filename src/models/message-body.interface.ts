export interface IMessageBody {
    meetingId: string
    roomId: string
    member: string
    mode: string
    data: any
    sender: string
    receiver: string
    clientId: string
}