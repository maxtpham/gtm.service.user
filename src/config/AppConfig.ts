import * as c from "config";
import * as common from "@gtm/lib.service";
import * as auth from "@gtm/lib.service.auth";
import { IOAuth2Config } from "../oauth2/config";

var config: IAppConfig = <IAppConfig>c;
export default config;

export interface IAppConfig extends c.IConfig, common.IModuleConfig, common.IMongoConfig, IOAuth2Config {
    /** Default to 15 minutes (900s), 30d (30d x 24h x 3600s = 2592000s) */
    sessionExpires?: number;

    /** Map all the service Url, if null the rootUrl will be used instead */
    services?: { [key: string]: string };
}

if (!config.services) {
    config.services = {};
}
