export interface ChatMessage {
    senderName: string,
    senderId: string,
    receiverName: string,
    receiverId: string,
    message: string,
    createdOn: Date,
    chatId?: string, // ? denotes it is optional field
}