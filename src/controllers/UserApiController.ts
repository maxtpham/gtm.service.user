import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response, Delete, Put, } from 'tsoa';
import * as express from 'express';
import { ApiController, AttachmentView, Sort, SortType } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@gtm/lib.service.auth';
import { UserRepository, UserRepositoryTYPE } from '../repositories/UserRepository';
import { MUserView, UserViewLite, UserViewFull, UserViewWithPagination, UserViewDetails, UserRoleView, UserUpdateView, UserStatus, MUserFind, UserAccountView, MFindUserByPhone, StatusFindByPhone } from '../views/MUserView';
import { UserEntity, User, ProfileView, UserRole, UserAccount } from '../entities/UserEntity';
import { MProfileView, MFCMView } from '../views/MProfileView';
import { RoleType } from '../views/RoleView';
import { RoleRepositoryTYPE, RoleRepository } from '../repositories/RoleRepository';
import { Binary } from 'bson';
import { AccountRepositoryTYPE, AccountRepository } from '../repositories/AccountRepository';
import { MAvatarView } from '../views/MAvatarView';

var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

@injectableSingleton(UserApiController)
@Route('api/user/v1/user')
export class UserApiController extends ApiController {
    @inject(UserRepositoryTYPE) private UserRepository: UserRepository;
    @inject(RoleRepositoryTYPE) private RoleRepository: RoleRepository;

    /** Export all users */
    @Tags('User') @Security({'jwt': ['admin']}) @Get('/profiles/export')
    public async exportProfiles(): Promise<ProfileView[]> {
        return await this.UserRepository.exportProfiles();
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

    @Tags('User') @Security('jwt') @Get('/get-by-user-name')
    public async getUserByName(
        @Query() userName: string,
    ): Promise<MUserView[]> {
        let userEntity = await this.UserRepository.getByName(userName);
        if (userEntity) {
            return Promise.resolve(this.UserRepository.buildClientUsers(userEntity));
        }
        return Promise.reject(`Not found.`);
    }

    /**Get lend user for app */
    @Tags('User') @Security('jwt') @Get('/get-lender-for-app')
    public async getLenderUserForApp(
        @Query() find: string,
    ): Promise<MUserView[]> {

        let queries = {
            $and: [
                {
                    roles: { $elemMatch: { code: RoleType[RoleType.Lender] } }
                },
                {
                    $or: [
                        { email: RegExp(find) },
                        { phone: RegExp(find) },
                        { name: RegExp(find) }
                    ],
                }
            ]
        };
        let userEntity = await this.UserRepository.find(queries);
        if (userEntity) {
            return Promise.resolve(this.UserRepository.buildClientUsers(userEntity));
        }
        return Promise.reject(`Not found.`);
    }

    @Tags('User') @Security('jwt') @Get('/find-user')
    public async findUser(
        @Query() find: string
    ): Promise<MUserView[]> {
        let userEntity = [];
        userEntity = await this.UserRepository.find({
            $or: [
                { email: RegExp(find) },
                { phone: RegExp(find) },
                { name: RegExp(find) }
            ]
        });
        if (userEntity) {
            return Promise.resolve(this.UserRepository.buildClientUsers(userEntity));
        }
        return Promise.reject(`Not found.`);
    }

    @Tags('User') @Security('jwt') @Get('/find-user-by-phone')
    public async findUserByPhone(
        @Query() find: string
    ): Promise<MFindUserByPhone> {
        let userEntity = await this.UserRepository.find({ phone: RegExp(find) });
        if (userEntity.length > 1) {
            let userFind: MFindUserByPhone = {
                status: StatusFindByPhone.Exception,
                user: null,
            }
            return userFind;
        }
        if (userEntity.length <= 0) {
            let userFind: MFindUserByPhone = {
                status: StatusFindByPhone.Fail,
                user: null,
            }
            return userFind;
        }
        if (userEntity.length === 1) {
            let userFind: MFindUserByPhone = {
                status: StatusFindByPhone.Success,
                user: {
                    id: userEntity[0]._id,
                    birthday: userEntity[0].birthday,
                    email: userEntity[0].email,
                    gender: userEntity[0].gender,
                    houseHolder: userEntity[0].profileDefault ? userEntity[0].profileDefault.houseHolder : "",
                    name: userEntity[0].name,
                    phone: userEntity[0].phone
                },
            }
            return userFind;
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

    @Tags('User') @Security('jwt') @Get('/profile-for-mobile')
    public async getProfileCurrentForMobile(@Request() req: express.Request): Promise<ProfileView> {
        let userEntity = await this.UserRepository.findOneById((<JwtToken>req.user).user);
        if (userEntity) {
            return Promise.resolve(User.toProfileViewForMobile(userEntity));
        }
        return Promise.reject(`Not found`);
    }

    @Tags('User') @Security('jwt') @Post('/profile')
    public async updateProfileCurrent(@Body() profileView: ProfileView, @Request() req?: express.Request): Promise<ProfileView> {
        const { roles, code, provider, active, ...updatingProfileView } = profileView;
        console.log(updatingProfileView);
        let oldUserEntity = await this.UserRepository.findOneAndUpdate({ _id: (<JwtToken>req.user).user }, { ...updatingProfileView, updated: Date.now() });
        if (!oldUserEntity) {
            return Promise.reject('Not found');
        }
        if (oldUserEntity instanceof Error) {
            return Promise.reject(<Error>oldUserEntity);
        }
        return Promise.resolve(User.toProfileView(await this.UserRepository.findOneById((<JwtToken>req.user).user)));
    }

    /** Update user with profiles */
    @Tags('User') @Security('jwt') @Post('/update-user-profiles')
    public async updateUserProfiles(
        @Body() profile: MProfileView,
        @Request() req: express.Request
    ): Promise<ProfileView> {

        let userProfile = await this.UserRepository.findOne({ _id: (<JwtToken>req.user).user });
        if (!userProfile) {
            return Promise.reject("User not exist");
        }

        const { job, bankRate, note, infos, name, identityCard, address, birthday, gender, localtion, phone, houseHolder } = profile;

        userProfile.profileDefault = {
            bankRate: bankRate || (userProfile.profileDefault ? userProfile.profileDefault.bankRate : 0),
            job: job || (userProfile.profileDefault ? userProfile.profileDefault.job : ''),
            infos: infos || (userProfile.profileDefault ? userProfile.profileDefault.infos : ''),
            note: note || (userProfile.profileDefault ? userProfile.profileDefault.note : ''),
            identityCard: identityCard || (userProfile.profileDefault ? userProfile.profileDefault.identityCard : ''),
            houseHolder: houseHolder || (userProfile.profileDefault ? userProfile.profileDefault.houseHolder : ''),
        }
        userProfile.name = name || userProfile.name;
        userProfile.birthday = birthday || userProfile.birthday;
        userProfile.address = address || userProfile.address;
        userProfile.gender = gender || userProfile.gender;
        userProfile.location = localtion || (userProfile.location || { x: 0, y: 0 });
        userProfile.phone = phone || userProfile.phone;

        userProfile.updated = new Date().getTime();

        let userSave = await this.UserRepository.update({ _id: (<JwtToken>req.user).user }, userProfile);
        if (userSave) {
            return Promise.resolve(User.toProfileViewForMobile(await this.UserRepository.findOneById(userProfile._id)));
        }
        return Promise.reject(`Not found.`);
    }

    /** setFCMForMobile */
    @Tags('User') @Security('jwt') @Post('/set-fcm-for-mobile')
    public async setFCMForMobile(
        @Body() fcms: MFCMView,
        @Request() req: express.Request
    ): Promise<string> {

        let users = await this.UserRepository.findOne({ _id: (<JwtToken>req.user).user });
        if (!users) {
            return Promise.reject("User not exist");
        }

        users.fcmToken = fcms.fcmToken;
        users.updated = new Date().getTime();

        let userSave = await this.UserRepository.update({ _id: (<JwtToken>req.user).user }, users);
        if (userSave) {
            return Promise.resolve("Tạo FCM thành công");
        }
        return Promise.reject(`Tạo FCM không thành công`);
    }

    /** getFCMForMobile */
    @Tags('User') @Security('jwt') @Get('/get-fcm-for-mobile')
    public async getFCMForMobile(
        @Query() userId: string,
    ): Promise<MFCMView> {

        let users = await this.UserRepository.findOne({ _id: userId });
        if (!users) {
            return Promise.reject("User not exist");
        }

        if (users.fcmToken) {
            let fcmView: MFCMView = {
                fcmToken: users.fcmToken,
            };
            return Promise.resolve(fcmView);
        }
        return Promise.reject(`Chưa Tạo FCM`);
    }

    /** Update user with profiles */
    @Tags('User') @Security('jwt') @Post('/update-avatar')
    public async updateAvatar(
        @Body() avatar: MAvatarView,
        @Request() req: express.Request
    ): Promise<UserEntity> {

        try {
            let users = await this.UserRepository.findOne({ _id: (<JwtToken>req.user).user });
            if (!users) {
                return Promise.reject("User not exist");
            }

            let bf = new Buffer(avatar.data.toString(), "base64");

            let av: AttachmentView = {
                media: avatar.media,
                data: new Binary(bf, Binary.SUBTYPE_BYTE_ARRAY)
            };

            users.avatar = av;
            users.updated = new Date().getTime();

            let userSave = await this.UserRepository.findOneAndUpdate({ _id: (<JwtToken>req.user).user }, users);
            if (userSave) {
                console.log("Update avartar success " + userSave._id);
                return Promise.resolve(userSave);
            }

        } catch (e) {
            console.log(e);
            Promise.reject(`User not exist`);
        }

    }

    /** Get users with pagination */
    @Tags('User') @Security('jwt') @Get('/entities')
    public async getEntities(@Query() status?: string, @Query() userId?: string,
        @Query() pageNumber?: number, @Query() itemCount?: number,
        @Query() sortName?: string, @Query() sortType?: number,
    )
        : Promise<UserViewWithPagination> {
        let queryToEntities = this.UserRepository.buildQuery(status, userId);
        let sort: Sort = { name: sortName, type: <SortType>sortType || -1 };
        let users = await this.UserRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5, sort);
        if (users) {
            let userTotalItems = await this.UserRepository.find(queryToEntities);
            let userDetailViews: UserViewDetails[] = [];
            await Promise.all(users.map(async user => {
                userDetailViews.push(User.toDetailViews(user));
            }))
            let userViews = <UserViewWithPagination>{ users: userDetailViews, totalItems: userTotalItems.length };
            return Promise.resolve(userViews);
        }
        return Promise.reject(`Not found.`);
    }

    /** Get user details by Id */
    @Tags('User') @Security('jwt') @Get('/details/{id}')
    public async getDetailViewById(id: string): Promise<UserViewDetails> {
        let userEntity = await this.UserRepository.findOneById(id);
        if (userEntity) {
            return Promise.resolve(User.toDetailViews(userEntity));
        }
        return Promise.reject(`Not found.`);
    }

    /** Create or update User Role */
    @Tags('User') @Security('jwt') @Post('/create-or-update-role')
    public async createOrUpdateUserRole(@Body() userRoleView: UserRoleView, @Request() req: express.Request): Promise<ProfileView> {
        try {
            let user = await this.UserRepository.findOneById(userRoleView.userId);
            if (!user) {
                return Promise.reject("User does not exist");
            }

            if (!(userRoleView.roleType in RoleType)) {
                return Promise.reject(`Role type ${userRoleView.roleType} does not exist`);
            }

            let roleLookup = await this.RoleRepository.getRoleByType(RoleType[userRoleView.roleType]);
            let userUpdated;
            if (user.roles && user.roles.some(us => us.code == RoleType[userRoleView.roleType])) {
                // Update if this role is existed and updated in role entity
                user.roles.map(ur => {
                    if (ur.id == roleLookup.id) {
                        ur.id = roleLookup.id,
                            ur.code = roleLookup.code
                    }
                });
            }
            else { // Create new role
                user.roles.push({ id: roleLookup.id, code: roleLookup.code });
            }
            user.isFirstLogin = false;
            userUpdated = await this.UserRepository.findOneAndUpdate({ _id: userRoleView.userId }, user);
            if (userUpdated) {
                return Promise.resolve(User.toProfileView(await this.UserRepository.findOneById(userRoleView.userId)));
            }
            return Promise.reject('Not found.');
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /** Update user details */
    @Tags('User') @Security('jwt') @Post('/update-user-details/{userId}')
    public async updateUserDetail(
        userId: string,
        @Body() userDetails: UserUpdateView,
        @Request() req: express.Request
    ): Promise<UserEntity> {
        try {
            let user = await this.UserRepository.findOneById(userId);
            if (!user) {
                return Promise.reject('User is not found.');
            }

            if (user.status == UserStatus.Active && userDetails.status == UserStatus.New) {
                return Promise.reject(`Can not update user status ${UserStatus[user.status]} to ${UserStatus[userDetails.status]}`);
            }

            user.active = userDetails.status == UserStatus.New ? null : (userDetails.status == UserStatus.Active ? true : false);
            user.status = userDetails.status;
            user.name = userDetails.name || user.name;
            user.phone = userDetails.phone || user.phone;
            user.birthday = userDetails.birthday || user.birthday;
            user.roles = userDetails.role || user.roles;
            user.email = userDetails.email || user.email;
            user.address = userDetails.address || user.address;
            user.gender = userDetails.gender || user.gender;
            user.updated = Date.now();
            let userToUpdate = await this.UserRepository.findOneAndUpdate({ _id: userId }, user);
            if (user) {
                return Promise.resolve(await this.UserRepository.findOneById(userId));
            }

        } catch (error) {
            console.log(error);
            Promise.reject(error);
        }
    }

    /** Get user account */
    @Tags('User') @Security('jwt') @Get('/get-user-account/{userId}')
    public async getUserAccount(
        @Request() req: express.Request,
        userId: string,
    ): Promise<UserAccount> {
        let userAccount = await this.UserRepository.findAndGetOneById(userId, 'account');
        if (!userAccount.account) {
            return Promise.reject('User account not found');
        }
        return Promise.resolve(User.toUserAccountView(userAccount));
    }

    /** Update user account */
    @Tags('User') @Security('jwt') @Post('/update-user-account/{userId}')
    public async updateUserAccount(
        @Request() req: express.Request,
        userId: string,
        @Body() userAccountView: UserAccountView,
        @Query() type?: string,
    ): Promise<UserAccount> {
        try {
            let userAccount = await this.UserRepository.findAndGetOneById(userId, 'account');
            if (!userAccount.account) {
                return Promise.reject('User account not found');
            }

            if (userAccountView.bonus && userAccount.account.bonus != userAccountView.bonus) {
                userAccount.account.bonus = userAccountView.bonus;
            }
            if (type == 'Deposit') {
                userAccount.account.balance = userAccountView && userAccountView.balance ? (userAccount.account.balance + userAccountView.balance) : userAccount.account.balance;
                userAccount.account.balanceGold = userAccount.account.balanceGold ? (userAccount.account.balanceGold + userAccountView.balanceGold) : userAccountView.balanceGold;
            }

            if (type == 'WithDraw') {
                if (userAccountView.balance > userAccount.account.balance && userAccountView.balanceGold > userAccount.account.balanceGold) {
                    return Promise.reject(`The account balance ${userAccount.account.balance} is not enough to perform this transaction`);
                }
                userAccount.account.balance = userAccountView && userAccountView.balance ? (userAccount.account.balance - userAccountView.balance) : userAccount.account.balance;
                userAccount.account.balanceGold = userAccount.account.balanceGold ? (userAccount.account.balanceGold - userAccountView.balanceGold) : userAccountView.balanceGold;
            }

            userAccount.updated = Date.now();
            let userUpdated = await this.UserRepository.findOneAndUpdate({ _id: userId }, userAccount);
            if (userUpdated) {
                return Promise.resolve(User.toUserAccountView(await this.UserRepository.findAndGetOneById(userId, 'account')));
            }
        } catch (e) {
            console.log(e);
            Promise.reject(e);
        }
    }

}