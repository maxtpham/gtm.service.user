import { MessageEntity } from "../entities/MessageEntity";

export interface MessageViewWithPagination {
    messages: MessageDetailView[];
    totalItems: number;
}

export interface MessageViewWithPaginationApp {
    messages: MessageDetailViewApp[];
}

export interface MessageViewWithPaginationAnUserApp {
    userId: string;
    userName: string;
    messages: MessageDetailView[];
}

export interface MessageDetailViewApp {
    userId: string,
    userName: string,
    messageDetailView: MessageDetailView[],
}

export interface MessageDetailView {
    id: string;
    userId: string;
    userName: string;
    toUserId: string;
    toUserName: string;
    content: string;
    delivered: number;
    announced?: boolean;    
    created: number;
    updated: number;
}

export interface MessageView {
    userId: string;
    toUserId: string;
    content: string;
    delivered?: number;
    announced?: boolean;
}
