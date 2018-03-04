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
import { AccountView, MAccountView } from '../views/AccountView';

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

  /** add balance of account */
  @Tags('Account') @Security('jwt') @Post('add-balance')
  public async addBalance(
    @Request() req: express.Request,
    @Body() accountView: MAccountView
  ): Promise<AccountEntity> {

   try {

    let account = await this.AccountRepository.findOne({ userId: accountView.userId });
    if (!account) {
      return Promise.reject("Account not exist");
    }

    let accountToSave = <AccountEntity> accountView;
    accountToSave.updated = new Date().getTime();
    accountToSave.balance = account.balance + accountView.balance;
    let accountSave = await this.AccountRepository.findOneAndUpdate({ _id: account._id}, accountToSave);

    if (accountSave) {
      return Promise.resolve(accountSave);
    }
    return Promise.reject("Add balance fail");

   } catch (e) {
     console.log(e);
     return Promise.reject("User have not account");
   }

  }

  /** remove balance of account */
  @Tags('Account') @Security('jwt') @Post('remove-balance')
  public async removeBalance(
    @Request() req: express.Request,
    @Body() accountView: MAccountView
  ): Promise<AccountEntity> {

   try {

    let account = await this.AccountRepository.findOne({ userId: accountView.userId });
    if (!account) {
      return Promise.reject("Account not exist");
    }

    let accountToSave = <AccountEntity> accountView;
    if(account.balance <= 0) {
      return Promise.reject("Account empty balance");
    }
    if (account.balance < accountView.balance) {
      return Promise.reject("please check balance again");
    }
    accountToSave.balance = account.balance - accountView.balance;
    accountToSave.updated = new Date().getTime();
    let accountSave = await this.AccountRepository.findOneAndUpdate({ _id: account._id}, accountToSave);

    if (accountSave) {
      return Promise.resolve(accountSave);
    }
    return Promise.reject("Add balance fail");

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