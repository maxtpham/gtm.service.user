import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response, Delete, Put, } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@gtm/lib.service.auth';
import { UserRepository, UserRepositoryTYPE } from '../repositories/UserRepository';
import { MUserView, UserViewLite, UserViewFull } from '../views/MUserView';
import { UserEntity, User, ProfileView } from '../entities/UserEntity';
import { MProfileView, UserProfile } from '../views/MProfileView';

@injectableSingleton(UserApiController)
@Route('api/user/v1/user')
export class UserApiController extends ApiController {
    @inject(UserRepositoryTYPE) private UserRepository: UserRepository;

    /** Get all user with profiles */
    @Tags('User') @Security('jwt') @Get('/get-user-profiles')
    public async getUserProfiles(): Promise<MProfileView[]> {
        let users = await this.UserRepository.find({});
        if (users) {
            return Promise.resolve(UserProfile.toProfileViews(users));
        }
        return Promise.reject(`Not found.`);
    }

    /** Update user with profiles */
    @Tags('User') @Security('jwt') @Post('/update-user-profiles')
    public async updateUserProfiles(
        @Body() profile: MProfileView,
    ): Promise<MProfileView> {

        let users = await this.UserRepository.findOne({ _id: profile.id });
        if(!users) {
            return Promise.reject("User not exist");
        }

        let userToSave: UserEntity = users;
        if(profile.name) userToSave.name = profile.name;
        if(profile.birthday) userToSave.birthday = profile.birthday;
        if(profile.address) userToSave.address = profile.address;
        if(profile.location) userToSave.location = profile.location;
        if(profile.phone) userToSave.phone = profile.phone;
        if(profile.email) userToSave.email = profile.email;
        if(profile.language) userToSave.language = profile.language;
        if(profile.gender) userToSave.gender = profile.gender;
        if(profile.timezone) userToSave.timezone = profile.timezone;

        let userSave = await this.UserRepository.findOneAndUpdate({ _id: profile.id },userToSave);

        if (userSave) {
            return Promise.resolve(UserProfile.toProfileView(userSave));
        }
        return Promise.reject(`Not found.`);
    }

     /** Update user with profiles */
     @Tags('User') @Security('jwt') @Post('/update-user-phone')
     public async updateUserPhone(
         @Body() profile: MProfileView,
     ): Promise<MProfileView> {
 
         let users = await this.UserRepository.findOne({ _id: profile.id });
         if(!users) {
             return Promise.reject("User not exist");
         }
 
         let userToSave: UserEntity = users;
         if(profile.phone) userToSave.phone = profile.phone;
         let userSave = await this.UserRepository.findOneAndUpdate({ _id: profile.id },userToSave);
 
         if (userSave) {
             return Promise.resolve(UserProfile.toProfileView(userSave));
         }
         return Promise.reject(`Not found.`);
     }

    /** Get all user lite */
    @Tags('User') @Security('jwt') @Get('/get-user-lite')
    public async getUserLite(): Promise<MUserView[]> {
        let userEntity = await this.UserRepository.find({});
        if (userEntity) {
            return Promise.resolve(this.UserRepository.buildClientUsers(userEntity));
        }
        return Promise.reject(`Not found.`);
    }

    /** Get user by Id */
    @Tags('User') @Security('jwt') @Get('/getById/{id}')
    public async getById(id: string): Promise<MUserView> {
        let userEntity = await this.UserRepository.findOneById(id);
        if (userEntity) {
            return Promise.resolve(this.UserRepository.buildClientUser(userEntity));
        }
        return Promise.reject(`Not found.`);
    }

    @Tags('User') @Security('jwt') @Get('/getByUserName')
    public async getUserByName(
        @Query() userName: string,
    ): Promise<MUserView[]> {
        let userEntity = await this.UserRepository.getByName(userName);
        if (userEntity) {
            return Promise.resolve(this.UserRepository.buildClientUsers(userEntity));
        }
        return Promise.reject(`Not found.`);
    }

    @Tags('User') @Security('jwt') @Get('/profile')
    public async getProfileCurrent(@Request() req: express.Request): Promise<ProfileView> {
        let userEntity = await this.UserRepository.findOneById((<JwtToken>req.user).user);
        if (userEntity) {
            return Promise.resolve(User.toProfileView(userEntity));
        }
        return Promise.reject(`Not found`);
    }

    @Tags('User') @Security('jwt') @Post('/profile')
    public async updateProfileCurrent(@Body() profileView: ProfileView, @Request() req?: express.Request): Promise<ProfileView> {
        let userEntity = await this.UserRepository.findOneAndUpdate({ _id: (<JwtToken>req.user).user }, profileView);
        if (!userEntity) {
            return Promise.reject('Not found');
        }
        if (userEntity instanceof Error) {
            return Promise.reject(<Error>userEntity);
        }
        return Promise.resolve(User.toProfileView(userEntity));
    }
}