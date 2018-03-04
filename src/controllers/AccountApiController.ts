import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@gtm/lib.service.auth';
import { AccountRepositoryTYPE, AccountRepository } from '../repositories/AccountRepository';
import { AccountEntity } from '../entities/AccountEnity';
import { AccountView } from '../views/AccountView';

@injectableSingleton(AccountApiController)
@Route('api/user/v1/account')
export class AccountApiController extends ApiController {
  @inject(AccountRepositoryTYPE) private AccountRepository: AccountRepository;

  /** get all account */
  @Tags('Account') @Security('jwt') @Get('get-all')
  public async getAccounts(): Promise<AccountEntity[]> {
    try {
      let accounts = await this.AccountRepository.find({});
      if (accounts) {
        return Promise.resolve(accounts);
      }
      return Promise.reject("Server error");
    } catch (e) {
      console.log(e);
      return Promise.reject("Server error");
    }
  }

  /** get account by id */
  @Tags('Account') @Security('jwt') @Get('get-by-id')
  public async getById(
    @Query() id: string
  ): Promise<AccountEntity> {
    try {

      let account = await this.AccountRepository.findOneById(id);
      if (account) {
        return Promise.resolve(account);
      }
      return Promise.reject("Account not exist");

    } catch (e) {
      console.log(e);
      return Promise.reject("Account not exist");
    }
  }

  /** get my-account */
  @Tags('Account') @Security('jwt') @Get('my-account')
  public async getMyAccount(
    @Request() req: express.Request
  ): Promise<AccountEntity> {

   try {

    let userId = (<JwtToken>req.user).user;
    let account = await this.AccountRepository.findOne({ userId: userId });
    if (account) {
      return Promise.resolve(account);
    }
    return Promise.reject("Account not exist");

   } catch (e) {
     console.log(e);
     return Promise.reject("User have not account");
   }

  }

  /** add account */
  @Tags('Account') @Security('jwt') @Post('create')
  public async addAccount(
    @Body() account: AccountView
  ): Promise<AccountEntity> {
    try {

      let accountTemp = await this.AccountRepository.find({ userId: account.userId });
      if (accountTemp.length > 0) {
        return Promise.reject("Account is exist");
      }
      let accountToSave = <AccountEntity>account;
      let accountSave = await this.AccountRepository.save(accountToSave);
      if (accountSave) {
        return Promise.resolve(accountSave);
      }
      return Promise.reject("Add fail");

    } catch (e) {
      console.log(e);
      return Promise.reject("Add fail");
    }
  }

}