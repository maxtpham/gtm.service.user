import { inject } from 'inversify';
import { TYPE, controller, httpGet, httpPost, requestParam, queryParam, requestBody } from 'inversify-express-utils';
import * as express from 'express';
import * as jwt from "jsonwebtoken";

import config from './../config/AppConfig';
import { injectableNamed } from "@tm/lib.common";
import { WebController } from "@tm/lib.service";
import { JwtToken, IOAuth2Config } from '@tm/lib.service.auth';
import { SessionRepository, SessionRepositoryTYPE } from '../repositories/SessionRepository';
import { AuthService, AuthServiceTYPE } from '../services/AuthService';

interface JwtSession {
    id: string;
}

@controller('/web/auth')
export class AuthWebController extends WebController {

    @inject(SessionRepositoryTYPE) private SessionRepository: SessionRepository;
    @inject(AuthServiceTYPE) private AuthService: AuthService;

    /**
     * Check loggedin status
     */
    @httpPost('/session')
    public postSession(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.json((req.cookies && req.user && (<JwtToken>req.user).session) ? { ...<JwtToken>req.user, _jwt: req.cookies.jwt } : undefined);
    }

    /**
     * Web public the book link to user in form: https://www.mybestbook.net//web/auth/to?uri=mybestbook.net://smarttime/st1.workbook?param=value&token={TOKEN}
     * Then the request will generate new token then redirect user to mybestbook.net://smarttime/st1.workbook?param=value&token={TOKEN}
     * {TOKEN} = jwtSign({sessionid})
     */
    private buildTokenUrl(req: express.Request, res: express.Response, next: express.NextFunction, cb: (res: express.Response, tokenUrl: string) => void) {
        if ((req.cookies && req.user && (<JwtToken>req.user).session)) {
            if (!!req.query.uri) {
                const uri = decodeURIComponent(req.query.uri);
                if (uri.indexOf('{TOKEN}') >= 0) {
                    try {
                        const token: string = jwt.sign(<JwtSession>{id: (<JwtToken>req.user).session }, (<IOAuth2Config>config).jwt.secret, { expiresIn: 5000 });
                        //console.log('##########################################################', uri.replace('{TOKEN}', token));
                        //res.redirect(302, 'mybestbook.net://' + uri.replace('{TOKEN}', token));
                        cb(res, (uri.indexOf('://') >= 0 ? '' : 'mybestbook.net://') + uri.replace('{TOKEN}', token))
                    } catch (e) {
                        next(e);
                    }
                } else {
                    res.status(404).send('Not found');
                }
            } else {
                res.status(404).send('Not found');
            }
        } else {
            res.status(401).send('Unauthorized');
        }
    }

    @httpGet('/to')
    public getTo(req: express.Request, res: express.Response, next: express.NextFunction) {
        this.buildTokenUrl(req, res, next, (res, tokenUrl) => {
            res.redirect(302, tokenUrl);
        });
    }

    @httpPost('/to')
    public postTo(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
        this.buildTokenUrl(req, res, next, (res, tokenUrl) => {
            res.send(tokenUrl);
        });
    }

    /** GET /jwt?t={TOKEN} to convert the TOKEN (another encoded of sessionId) from the /to function above to jwt token for App client to continue to communicate with server under the requesting web user */
    @httpGet('/jwt')
    public async getJwt(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        if (!!req.query.t) {
            let session;
            try {
                session = <JwtSession>jwt.verify(req.query.t, (<IOAuth2Config>config).jwt.secret);
            } catch (err) {
                console.error('Invalid session', err);
                res.status(401).send('Unauthorized');
            }
            if (session) {
                try {
                    const sessionEntity = await this.SessionRepository.findOneById(session.id);
                    const jwtToken = this.AuthService.toJwtToken(sessionEntity);
                    const cookieValue = jwt.sign(jwtToken, (<IOAuth2Config>config).jwt.secret, { expiresIn: Math.round((jwtToken.expires - Date.now()) / 1000) });
                    res.send(cookieValue);
                } catch (e) {
                    console.error(`Error while building the jwt token from userSession: ${session.id}`, e);
                    next(e);
                }
            }
        } else {
            res.status(404).send('Not found');
        }
    }
}