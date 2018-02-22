import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response, Delete, Put } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@gtm/lib.service.auth';
import { MessageRepository, MessageRepositoryTYPE } from '../repositories/MessageRepository';
import { MessageView, MessageViewWithPagination, MessageDetailView } from '../views/MessageView';
import { MessageEntity } from '../entities/MessageEntity';
import { UserRepositoryTYPE, UserRepository } from '../repositories/UserRepository';

@injectableSingleton(MessageApiController)
@Route('api/user/v1/Message')
export class MessageApiController extends ApiController {
    @inject(MessageRepositoryTYPE) private MessageRepository: MessageRepository;
    @inject(UserRepositoryTYPE) private UserRepository: UserRepository;

    /** Get Messages */
    @Tags('Message') @Security('jwt') @Get()
    public async getEntities(@Query() query?: string, @Query() pageNumber?: number, @Query() itemCount?: number, @Query() from?: string, @Query() to?: string)
        : Promise<MessageViewWithPagination> {
        let queryToEntities = this.MessageRepository.buildQuery(query, from, to);
        let messages = await this.MessageRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5);
        if (messages) {
            let messageTotalItems = await this.MessageRepository.find(queryToEntities);
            let users = await this.UserRepository.find({ deleted: null });
            let messageDetailView: MessageDetailView[] = [];
            messages.map(mes => {
                let user = users.find(u => u._id == mes.userId);
                let toUser = users.find(u => u._id == mes.toUserId);

                messageDetailView.push({
                    id: mes._id,
                    userId: mes.userId,
                    userName: user ? user.name : '',
                    toUserId: mes.toUserId,
                    toUserName: toUser ? toUser.name : '',
                    content: mes.content,
                    delivered: mes.delivered,
                    created: mes.created,
                    updated: mes.updated
                });
            })
            let messageDetailViews = <MessageViewWithPagination>{ messages: messageDetailView, totalItems: messageTotalItems.length };
            return Promise.resolve(messageDetailViews);
        }
        return Promise.reject(`Not found.`);
    }

    /** Get Message by Id */
    @Tags('Message') @Security('jwt') @Get('{id}')
    public async getEntity(id: string): Promise<MessageEntity> {
        let Message = await this.MessageRepository.findOneById(id);
        if (Message) {
            return Promise.resolve(Message);
        }
        return Promise.reject(`Not found.`);
    }

    /** Create New Message */
    @Tags('Message') @Security('jwt') @Post()
    public async createEntity(@Body() messageView: MessageView): Promise<MessageEntity> {
        let message = await this.MessageRepository.save(<MessageEntity>{ userId: messageView.userId, toUserId: messageView.toUserId, content: messageView.content, delivered: messageView.delivered });
        if (message) {
            return Promise.resolve(await this.MessageRepository.findOneById(message._id));
        }
        if (message instanceof Error) {
            return Promise.reject('Error');
        }
    }

    /** Update Message */
    @Tags('Message') @Security('jwt') @Put('{id}')
    public async updateEntity(id: string, @Body() messageView: MessageView): Promise<MessageEntity> {
        let message = await this.MessageRepository.findOneAndUpdate({ _id: id }, <MessageEntity>{ userId: messageView.userId, toUserId: messageView.toUserId, content: messageView.content, delivered: messageView.delivered });
        if (message) {
            return Promise.resolve(await this.MessageRepository.findOneById(message._id));
        }
        if (message instanceof Error) {
            return Promise.reject('Error');
        }
    }

    /** Delete Message */
    @Tags('Message') @Security('jwt') @Delete('{id}')
    public async deleteEntity(id: string): Promise<void> {
        let message = await this.MessageRepository.findOneAndUpdate({ _id: id }, { s: Date.now() });
        if (message) {
            return Promise.resolve();
        }
        return Promise.reject(`Not found.`);
    }
}