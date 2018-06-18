"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const path = require("path");
class SwaggerUiHandler {
    constructor(rootUrl, baseUrl, defaultSwaggerConfigUrl) {
        this.homePath = require('swagger-ui-dist').getAbsoluteFSPath();
        this.rootUrl = rootUrl;
        this.baseUrl = baseUrl;
        this.staticHandler = express.static(this.homePath);
        this.defaultSwaggerConfigUrl = defaultSwaggerConfigUrl;
    }
    getRoot(req, res, next) {
        if (req.originalUrl === this.baseUrl) {
            // Redirect '/swagger' -> '/swagger/' to let browser to request for the correct related resources url
            res.redirect(this.baseUrl + '/');
        }
        else {
            return this.getIndex(req, res, next);
        }
    }
    getIndex(req, res, next) {
        if (this.index_html) {
            res.send(this.index_html);
        }
        else {
            const localIndex = path.join(__dirname, '../ui/index.html');
            fs.exists(localIndex, (exists) => {
                fs.readFile(exists ? localIndex : path.join(this.homePath, 'index.html'), (err, data) => {
                    if (err) {
                        res.status(404).send(err);
                    }
                    else {
                        res.send(this.index_html = exists ? data.toString() : this.processFileIndex(data.toString()));
                    }
                });
            });
        }
    }
    getSwaggerUiBundle(req, res, next) {
        if (this.swagger_ui_bundle_js) {
            res.header("Content-Type", "text/javascript").send(this.swagger_ui_bundle_js);
        }
        else {
            const localIndex = path.join(__dirname, '../ui/swagger-ui-bundle.js');
            fs.exists(localIndex, (exists) => {
                fs.readFile(exists ? localIndex : path.join(this.homePath, 'swagger-ui-bundle.js'), (err, data) => {
                    if (err) {
                        res.status(404).send(err);
                    }
                    else {
                        res.header("Content-Type", "text/javascript").send(this.swagger_ui_bundle_js = exists ? data.toString() : this.processSwaggerUiBundle(data.toString()));
                    }
                });
            });
        }
    }
    getStaticHandler() {
        return this.staticHandler;
    }
    processFileIndex(source) {
        return source
            // Parameters
            .replace('layout: "StandaloneLayout"', `
            layout: "StandaloneLayout",
            url: "${this.defaultSwaggerConfigUrl}",
            oauth2RedirectUrl: "${this.rootUrl}${this.baseUrl}/redirect",
            displayRequestDuration: true
        `);
    }
    processSwaggerUiBundle(source) {
        return source
            // Supports for submmit cookies along with OAuth2 token request
            .replace('delete t.headers["Content-Type"]),', `delete t.headers["Content-Type"]),t.credentials='same-origin',`);
    }
}
exports.SwaggerUiHandler = SwaggerUiHandler;
