import { MessageEntity } from "../entities/MessageEntity";

export interface MessageViewWithPagination {
    messages: MessageDetailView[];
    totalItems: number;
}

export interface MessageDetailView {
    id: string;
    userId: string;
    userName: string;
    toUserId: string;
    toUserName: string;
    content: string;
    delivered: number;
    created: number;
    updated: number;
}

export interface MessageView {
    userId: string;
    toUserId: string;
    content: string;
    delivered?: number;
}
