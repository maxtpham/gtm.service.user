import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response, Delete, Put } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@gtm/lib.service.auth';
import { MessageRepository, MessageRepositoryTYPE } from '../repositories/MessageRepository';
import { MessageView, MessageViewWithPagination, MessageDetailView, MessageViewWithPaginationApp, MessageDetailViewApp, MessageViewWithPaginationAnUserApp } from '../views/MessageView';
import { MessageEntity } from '../entities/MessageEntity';
import { UserRepositoryTYPE, UserRepository } from '../repositories/UserRepository';

@injectableSingleton(MessageApiController)
@Route('api/user/v1/Message')
export class MessageApiController extends ApiController {
    @inject(MessageRepositoryTYPE) private MessageRepository: MessageRepository;
    @inject(UserRepositoryTYPE) private UserRepository: UserRepository;

    /** Get Messages */
    @Tags('Message') @Security('jwt') @Get()
    public async getEntities(@Query() from?: string, @Query() to?: string, @Query() pageNumber?: number, @Query() itemCount?: number)
        : Promise<MessageViewWithPagination> {
        let queryToEntities = this.MessageRepository.buildQuery(from, to);
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
                    userName: user ? (user.phone ? user.name + ' - ' + user.phone : user.name) : '',
                    toUserId: mes.toUserId,
                    toUserName: toUser ? (toUser.phone ? toUser.name + ' - ' + toUser.phone : toUser.name) : '',
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
    @Tags('Message') @Security('jwt') @Get('/getbyid/{id}')
    public async getEntity(id: string): Promise<MessageEntity> {
        let Message = await this.MessageRepository.findOneById(id);
        if (Message) {
            return Promise.resolve(Message);
        }
        return Promise.reject(`Not found.`);
    }

    /** Get List Messages For App*/
    @Tags('Message') @Security('jwt') @Get('/getforapp')
    public async getListMessageForApp(
        @Request() req?: express.Request,
    )
        : Promise<MessageViewWithPaginationApp> {
        let userId = (<JwtToken>req.user).user;
        let messages = await this.MessageRepository.find({});

        if (messages) {
            let users = await this.UserRepository.find({ deleted: null });

            let messageWithUser: MessageDetailViewApp[] = [];
            messages.map(mes => {
                let user = users.find(u => u._id == mes.userId);
                let toUser = users.find(u => u._id == mes.toUserId);
                if (mes.userId === userId || mes.toUserId === userId) {
                    var userOther: string;

                    if (mes.userId !== userId) {
                        userOther = mes.userId
                    } else {
                        userOther = mes.toUserId
                    }

                    let infoUserOther = users.find(u => u._id == userOther);


                    if (messageWithUser.length === 0) {
                        messageWithUser.push({
                            userId: userOther,
                            userName: infoUserOther ? (infoUserOther.phone ? infoUserOther.name + ' - ' + infoUserOther.phone : infoUserOther.name) : '',
                            messageDetailView: [{
                                id: mes._id,
                                userId: mes.userId,
                                userName: user ? (user.phone ? user.name + ' - ' + user.phone : user.name) : '',
                                toUserId: mes.toUserId,
                                toUserName: toUser ? (toUser.phone ? toUser.name + ' - ' + toUser.phone : toUser.name) : '',
                                content: mes.content,
                                delivered: mes.delivered,
                                created: mes.created,
                                updated: mes.updated
                            }]
                        })
                    } else {

                        var findUser = messageWithUser.find(u => u.userId == userOther);
                        if (findUser == undefined) {
                            messageWithUser.push({
                                userId: userOther,
                                userName: toUser ? (toUser.phone ? toUser.name + ' - ' + toUser.phone : toUser.name) : '',
                                messageDetailView: [{
                                    id: mes._id,
                                    userId: mes.userId,
                                    userName: user ? (user.phone ? user.name + ' - ' + user.phone : user.name) : '',
                                    toUserId: mes.toUserId,
                                    toUserName: toUser ? (toUser.phone ? toUser.name + ' - ' + toUser.phone : toUser.name) : '',
                                    content: mes.content,
                                    delivered: mes.delivered,
                                    created: mes.created,
                                    updated: mes.updated
                                }]
                            })
                        } else {
                            for (var i = 0; i < messageWithUser.length; i++) {
                                if (userOther === messageWithUser[i].userId.toString()) {

                                    messageWithUser[i].messageDetailView.push({
                                        id: mes._id,
                                        userId: mes.userId,
                                        userName: user ? (user.phone ? user.name + ' - ' + user.phone : user.name) : '',
                                        toUserId: mes.toUserId,
                                        toUserName: toUser ? (toUser.phone ? toUser.name + ' - ' + toUser.phone : toUser.name) : '',
                                        content: mes.content,
                                        delivered: mes.delivered,
                                        created: mes.created,
                                        updated: mes.updated
                                    })
                                    break;
                                } else {
                                }
                            }
                        }
                    }
                }
            })

            let messageDetailViewsApp = <MessageViewWithPaginationApp>{ messages: messageWithUser };
            return Promise.resolve(messageDetailViewsApp);
        }
        return Promise.reject(`Not found.`);
    }

    /** Get List Messages with an user for App*/
    @Tags('Message') @Security('jwt') @Get('/getforanuserapp')
    public async getListMessageOfUser(
        @Query() userIdToGetMessage: string,
        @Request() req?: express.Request,
    )
        : Promise<MessageViewWithPaginationAnUserApp> {
        let userId = (<JwtToken>req.user).user;
        let messages = await this.MessageRepository.find({});
        let users = await this.UserRepository.find({ deleted: null });
        let user = users.find(u => u._id == userId);
        let userHaveMessage = users.find(u => u._id == userIdToGetMessage);
        console.log(userHaveMessage);
        if (messages) {
            let messageDetailView: MessageDetailView[] = [];

            messages.map(mes => {
                if (mes.userId === userId || mes.toUserId === userId) {
                    if (mes.userId === userIdToGetMessage) {
                        messageDetailView.push({
                            id: mes._id,
                            userId: userIdToGetMessage,
                            userName: userHaveMessage ? (userHaveMessage.phone ? userHaveMessage.name + ' - ' + userHaveMessage.phone : user.name) : '',
                            toUserId: mes.toUserId,
                            toUserName: user ? (user.phone ? user.name + ' - ' + user.phone : user.name) : '',
                            content: mes.content,
                            delivered: mes.delivered,
                            created: mes.created,
                            updated: mes.updated
                        })
                    } else if (mes.toUserId === userIdToGetMessage) {
                        messageDetailView.push({
                            id: mes._id,
                            userId: userId,
                            userName: user ? (user.phone ? user.name + ' - ' + user.phone : user.name) : '',
                            toUserId: userIdToGetMessage,
                            toUserName: userHaveMessage ? (userHaveMessage.phone ? userHaveMessage.name + ' - ' + userHaveMessage.phone : userHaveMessage.name) : '',
                            content: mes.content,
                            delivered: mes.delivered,
                            created: mes.created,
                            updated: mes.updated
                        })
                    }
                }
            })

            let messageDetailViewsApp = <MessageViewWithPaginationAnUserApp>{ userId: userIdToGetMessage, userName: userHaveMessage.name, messages: messageDetailView };
            return Promise.resolve(messageDetailViewsApp);
        }
        return Promise.reject(`Not found.`);
    }

    /** Get Messages to notification*/
    @Tags('Message') @Security('jwt') @Get("get-message-to-notification")
    public async getMessageToNotification(
        @Request() req?: express.Request,
    ): Promise<MessageViewWithPagination> {
        let userId = (<JwtToken>req.user).user;
        let messages = await this.MessageRepository.find({});
        if (messages) {
            let users = await this.UserRepository.find({ deleted: null });
            let messageDetailView: MessageDetailView[] = [];
            let messsageUpdate: MessageView;
            messages.map(mes => {
                let user = users.find(u => u._id == mes.userId);
                let toUser = users.find(u => u._id == mes.toUserId);

                if (mes.toUserId === userId) {
                    if (mes.announced === false) {
                        messageDetailView.push({
                            id: mes._id,
                            userId: mes.userId,
                            userName: user ? (user.phone ? user.name + ' - ' + user.phone : user.name) : '',
                            toUserId: mes.toUserId,
                            toUserName: toUser ? (toUser.phone ? toUser.name + ' - ' + toUser.phone : toUser.name) : '',
                            content: mes.content,
                            delivered: mes.delivered,
                            created: mes.created,
                            updated: mes.updated
                        });
                        messsageUpdate = {
                            userId: mes.userId,
                            toUserId: mes.toUserId,
                            content: mes.content,
                            delivered: mes.delivered,
                            announced: true,
                        }
                        this.updateEntity(mes._id, messsageUpdate);
                    }
                }
            })
            let messageDetailViews = <MessageViewWithPagination>{ messages: messageDetailView, totalItems: messageDetailView.length };
            return Promise.resolve(messageDetailViews);
        }
        return Promise.reject(`Not found.`);
    }

    /** Create New Message */
    @Tags('Message') @Security('jwt') @Post()
    public async createEntity(
        @Body() messageView: MessageView,
        @Request() req: express.Request,
    ): Promise<MessageEntity> {
        let userId = (<JwtToken>req.user).user;
        let message = await this.MessageRepository.save(<MessageEntity>{ userId: userId, toUserId: messageView.toUserId, content: messageView.content, delivered: messageView.delivered, announced: messageView.announced });
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
        let message = await this.MessageRepository.findOneAndUpdate({ _id: id }, <MessageEntity>{ userId: messageView.userId, toUserId: messageView.toUserId, content: messageView.content, delivered: messageView.delivered, announced: messageView.announced });
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