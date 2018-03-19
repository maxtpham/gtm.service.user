import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class SwaggerUiHandler {
    private homePath: string = require('swagger-ui-dist').getAbsoluteFSPath();
    private rootUrl: string;
    private baseUrl: string;
    private staticHandler: express.Handler;
    private index_html: string;
    private swagger_ui_bundle_js: string;
    private defaultSwaggerConfigUrl: string;

    constructor(rootUrl: string, baseUrl: string, defaultSwaggerConfigUrl: string) {
        this.rootUrl = rootUrl;
        this.baseUrl = baseUrl;
        this.staticHandler = express.static(this.homePath);
        this.defaultSwaggerConfigUrl = defaultSwaggerConfigUrl;
    }

    public getRoot(req: express.Request, res: express.Response, next: express.NextFunction): any {
        if (req.originalUrl === this.baseUrl) {
            // Redirect '/swagger' -> '/swagger/' to let browser to request for the correct related resources url
            res.redirect(this.baseUrl + '/');
        } else {
            return this.getIndex(req, res, next);
        }
    }

    public getIndex(req: express.Request, res: express.Response, next: express.NextFunction): any {
        if (this.index_html) {
            res.send(this.index_html)
        } else {
            const localIndex = path.join(__dirname, '../ui/index.html');
            fs.exists(localIndex, (exists: boolean) => {
                fs.readFile(exists ? localIndex : path.join(this.homePath, 'index.html'), (err, data) => {
                    if (err) {
                        res.status(404).send(err);
                    } else {
                        res.send(this.index_html = exists ? data.toString() : this.processFileIndex(data.toString()));
                    }
                });
            });
        }
    }

    public getSwaggerUiBundle(req: express.Request, res: express.Response, next: express.NextFunction): any {
        if (this.swagger_ui_bundle_js) {
            res.send(this.swagger_ui_bundle_js)
        } else {
            const localIndex = path.join(__dirname, '../ui/swagger-ui-bundle.js');
            fs.exists(localIndex, (exists: boolean) => {
                fs.readFile(exists ? localIndex : path.join(this.homePath, 'swagger-ui-bundle.js'), (err, data) => {
                    if (err) {
                        res.status(404).send(err);
                    } else {
                        res.send(this.swagger_ui_bundle_js = exists ? data.toString() : this.processSwaggerUiBundle(data.toString()));
                    }
                });
            });
        }
    }

    public getStaticHandler(): express.RequestHandler {
        return this.staticHandler;
    }
    
    private processFileIndex(source: string): string {
        return source
        // Parameters
        .replace('layout: "StandaloneLayout"', `
            layout: "StandaloneLayout",
            url: "${this.defaultSwaggerConfigUrl}",
            oauth2RedirectUrl: "${this.rootUrl}${this.baseUrl}/redirect",
            displayRequestDuration: true
        `);
    }
    
    private processSwaggerUiBundle(source: string): string {
        return source
        // Supports for submmit cookies along with OAuth2 token request
        .replace('delete t.headers["Content-Type"]),', `delete t.headers["Content-Type"]),t.credentials='same-origin',`);
    }
}