module majiang {
    export class DZMJMatchingScene extends game.BaseMatchingScene {
        public pmdKey: string = "mjxlch";
        public bgMusic: string = "playingingame_mp3";
        public GAME_ID: string = "dzmj";
        //玩法
        private wanfaImage: eui.Image;
        private dizhu: eui.Label;
        private paiQiang: PaiQiangComponent;
        private players = {};
        /**
		 * 关闭匹配通知
		 */
        public CLOSE_NOTIFY: string = SceneNotify.CLOSE_DZMJ_MATCHING;

		/**
		 * 打开游戏大厅
		 */
        public GAME_HALL_NOTIFY: string = SceneNotify.OPEN_DZMJ_HALL;

		/**
		 * 进入游戏通知
		 */
        public GAME_SCENE_NOTIFY: string = SceneNotify.OPEN_DZMJ;

        /**
         * 记录界面的通知
         */
        public RECORD_NOTIFY: string;

		/**
		 * 帮助界面的通知
		 */
        public HELP_NOTIFY: string;

		/**
		 * 设置界面的通知
		 */
        public SETTING_NOTIFY: string;


        public constructor() {
            super();
            this.skinName = new MajiangMatchingSceneSkin();
        }

        public async createChildren() {
            super.createChildren();
            this.paiQiang.hidePaiQiang();
            this.dizhu.text = "底注：" + Global.gameProxy.lastGameConfig.diFen;
            this.wanfaImage.source = RES.getRes("wanfa_dzmj_png");
        }

        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(ServerNotify.s_startNewRound, this.s_startNewRound, this);
            EventManager.instance.addEvent(ServerNotify.s_initHandCards, this.initHandCards, this);
            EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterResult, this);
            EventManager.instance.addEvent(ServerNotify.s_playerEnter, this.playerEnter, this);
            EventManager.instance.addEvent(ServerNotify.s_playInitHua, this.s_playInitHua, this);
        }

        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(ServerNotify.s_startNewRound, this.s_startNewRound, this);
            EventManager.instance.removeEvent(ServerNotify.s_initHandCards, this.initHandCards, this);
            EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterResult, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerEnter, this.playerEnter, this);
            EventManager.instance.removeEvent(ServerNotify.s_playInitHua, this.s_playInitHua, this);
        }

        private s_playInitHua(e: egret.Event) {
            let data = e.data;
            for (let key in data) {
                let huaArr = data[key];
                if (!game.Utils.valueEqual(key, Global.gameProxy.getMineIndex())) {
                    let playerData = Global.gameProxy.getPlayerByIndex(key);
                    playerData.initHuaCards = huaArr;
                }
            }
            game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
            game.AppFacade.getInstance().sendNotification(this.GAME_SCENE_NOTIFY);
        }

        private s_startNewRound(e: egret.Event) {
            let data = e.data;
            Global.gameProxy.roomInfo.dealer = data.dealer;
        }

        private playerEnter(e: egret.Event) {
            let data = e.data;
            this.players[data.playerIndex] = data.player;
            Global.gameProxy.updatePlayer(data.playerIndex, data.player);
        }

        private enterResult(e: egret.Event) {
            this.allowBack = false;
            let data = e.data;
            if (data.code && data.code != 0) {
                Global.alertMediator.addAlert(data.msg, () => {

                }, null, true);
                return;
            }
            Global.gameProxy.setRoomInfo(e.data);
            Global.gameProxy.roomInfo.playing = true;
        }


        /**
         * 发牌
         * 收到发牌的消息跳转界面
         * @param  {egret.Event} e
         */
        public async initHandCards(e: egret.Event) {
            // var resp = e.data as InitHandCardsResp;
            let data = e.data;
            let roomInfo = Global.gameProxy.roomInfo;
            let hua = data.hua;
            // await Global.gameProxy.req2updateRoom();
            let mineData = Global.gameProxy.getMineGameData();
            mineData.cards = data.cards;
            for (let key in roomInfo.players) {
                if (!game.Utils.valueEqual(key, Global.gameProxy.getMineIndex())) {
                    let playerData = roomInfo.players[key];
                    if (game.Utils.valueEqual(key, roomInfo.dealer)) {
                        playerData.cardNum = 14;
                    } else {
                        playerData.cardNum = 13;
                    }
                }
            }
            mineData.initHuaCards = [];
            mineData.huaNewCards = [];
            for (let i = 0; i < hua.length; i++) {
                let huaData = hua[i];
                mineData.initHuaCards.push(huaData.hua);
                if (Math.floor(huaData.newCard) / 10 != 5) {
                    mineData.huaNewCards.push(huaData.newCard);
                }
            }
        }

        /**
         * 开始游戏
         */
        public startNewRound(e: egret.Event) {
            Global.gameProxy.roomInfo.setRoundData(e.data);
        }

        /**
         * 玩家加入
         * @param  {egret.Event} e
         */
        public playerjoin(e: egret.Event) {
            let resp: any = e.data;
            Global.gameProxy.joinPlayer(resp.playerIndex, resp.player);
        }
    }
}
