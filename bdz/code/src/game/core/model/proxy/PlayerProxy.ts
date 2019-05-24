/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:26:48 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2019-02-26 17:40:45
 * @Description: 玩家数据代理模块，所以玩家相关数据都从这里获取
 */
module game {
    export class PlayerProxy extends ResourceProxyBase {
        public static NAME: string = "PlayerProxy";
        public playerData: PlayerInfoBean;
        public playerStatus: PlayerStatusEnum = PlayerStatusEnum.IDLE;
        public token: string;
        public gametoken: string;
        public init() {
            Global.playerProxy = this;
        }

        public updatePlayerGold(gold) {
            this.playerData.gold = gold;
        }

        public async updatePlayerInfo(callback) {
            let gatePath = ServerConfig.PATH_CONFIG.http_header + ServerConfig.PATH_CONFIG.http_server + ":" + ServerConfig.PATH_CONFIG.http_port;
            let data = { token: Global.playerProxy.token };
            let resp: any = await Global.netProxy.sendRequestAsync(gatePath + "/gate/clientApi/getPlayerInfo", data);
            this.playerData = resp.data;
            callback && callback();
        }

    }
}