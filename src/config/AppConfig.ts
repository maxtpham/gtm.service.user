import * as c from "config";
import * as common from "@tm/lib.service";
import * as auth from "@tm/lib.service.auth";

export interface IAppConfig extends c.IConfig, common.IModuleConfig, common.IMongoConfig, auth.IOAuth2Config {
}

var config: IAppConfig = <IAppConfig>c;
export default config;