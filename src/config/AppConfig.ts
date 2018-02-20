import * as c from "config";
import * as common from "@gtm/lib.service";
import * as auth from "@gtm/lib.service.auth";

export interface IAppConfig extends c.IConfig, common.IModuleConfig, common.IMongoConfig, auth.IOAuth2Config {
    /** Default to 15 minutes (900s), 30d (30d x 24h x 3600s = 2592000s) */
    sessionExpires?: number;
}

var config: IAppConfig = <IAppConfig>c;
export default config;