import { MessageEntity } from "../entities/MessageEntity";

export interface MessageViewWithPagination {
    messages: MessageEntity[];
    totalItems: number;
}

export interface MessageView {
    userId: string;
    toUserId: string;
    content: string;
    delivered?: Date;
}
