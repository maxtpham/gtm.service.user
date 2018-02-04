// import { inject } from 'inversify';
// import { injectableSingleton } from "@tm/lib.common";
// import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response, Delete, Put } from 'tsoa';
// import * as express from 'express';
// import { ApiController } from "@tm/lib.service";
// import config from './../config/AppConfig';
// import { Security, Tags } from "tsoa";
// import { JwtToken } from '@tm/lib.service.auth';
// import { MessageRepository, MessageRepositoryTYPE } from '../repositories/MessageRepository';
// import { MessageView, MessageViewWithPagination } from '../views/MessageView';
// import { MessageEntity } from '../entities/MessageEntity';

// @injectableSingleton(MessageApiController)
// @Route('api/user/v1/Message')
// export class MessageApiController extends ApiController {
//     @inject(MessageRepositoryTYPE) private MessageRepository: MessageRepository;

//     /** Get Messages */
//     @Tags('Message') @Security('jwt') @Get()
//     public async getEntities( @Query() query?: string, @Query() pageNumber?: number, @Query() itemCount?: number)
//         : Promise<MessageViewWithPagination> {
//         let queryToEntities = !!query ? { code: query, scope: query, deleted: null } : { deleted: null };
//         let Messages = await this.MessageRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5);
//         if (Messages) {
//             let MessageTotalItem = await this.MessageRepository.find({});
//             let MessageViews = <MessageViewWithPagination>{ Messages, totalItems: MessageTotalItem.length };
//             return Promise.resolve(MessageViews);
//         }
//         return Promise.reject(`Not found.`);
//     }

//     /** Get Message by Id */
//     @Tags('Message') @Security('jwt') @Get('{id}')
//     public async getEntity(id: string): Promise<MessageEntity> {
//         let Message = await this.MessageRepository.findOneById(id);
//         if (Message) {
//             return Promise.resolve(Message);
//         }
//         return Promise.reject(`Not found.`);
//     }

//     /** Create New Message */
//     @Tags('Message') @Security('jwt') @Post()
//     public async createEntity( @Body() MessageView: MessageView): Promise<MessageEntity> {
//         let Message = await this.MessageRepository.save(<MessageEntity>{ name: MessageView.code, scope: MessageView.scope });
//         if (Message) {
//             return Promise.resolve(await this.MessageRepository.findOneById(Message._id));
//         }
//         if (Message instanceof Error) {
//             return Promise.reject('Error');
//         }
//     }

//     /** Update Message */
//     @Tags('Message') @Security('jwt') @Put('{id}')
//     public async updateEntity(id: string, @Body() MessageView: MessageView): Promise<MessageEntity> {
//         let Message = await this.MessageRepository.findOneAndUpdate({ _id: id }, <MessageEntity>{ name: MessageView.code, scope: MessageView.scope });
//         if (Message) {
//             return Promise.resolve(await this.MessageRepository.findOneById(Message._id));
//         }
//         if (Message instanceof Error) {
//             return Promise.reject('Error');
//         }
//     }

//     /** Delete Message */
//     @Tags('Message') @Security('jwt') @Delete('{id}')
//     public async deleteEntity(id: string): Promise<void> {
//         let Message = await this.MessageRepository.findOneAndUpdate({ _id: id }, { deleted: new Date() });
//         if (Message) {
//             return Promise.resolve();
//         }
//         return Promise.reject(`Not found.`);
//     }
// }