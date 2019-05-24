module majiang {
    export class MajiangWatingScene extends game.BaseScene {
        public pmdKey: string = "mjxlch";
        public resizeGroup: eui.Group;
        //玩法
        private wanfaImage: eui.Image;
        //匹配转动group
        private juhuaGroup: eui.Group;
        private rotationImage: eui.Image;
        private timeLabel: eui.Label;

        private backBtn: eui.Button;
        private mineHeader: WidgetHeader;
        private scenceId: number = 0;
        private dizhu: eui.Label;
        private paiQiang: PaiQiangComponent;
        private joinTimeout;
        public constructor() {
            super();
            this.skinName = new majiang.MajiangWaitSceneSkin();
        }

        public async createChildren() {
            super.createChildren();
            this.paiQiang.hidePaiQiang();
            game.AudioManager.getInstance().playBackgroundMusic("playingingame_mp3");
            this.dizhu.bold = true;
            this.dizhu.text = "底注：" + Global.gameProxy.lastGameConfig.diFen;
            this.mineHeader.initWithData(Global.gameProxy.getMineGameData(), "mine");
            egret.Tween.get(this.rotationImage, { loop: true }).to({
                rotation: 360
            }, 3000);
            if (Global.gameProxy.diWen == "mjxlch") {
                this.wanfaImage.source = RES.getRes("xlch_hsz_png");
            } else {
                this.wanfaImage.source = RES.getRes("xzdd_hsz_png");
            }
            this.joinTimeoutStart();
        }

        private async backBtnTouch() {
            // Global.alertMediator.addAlert("是否退出匹配", async () => {
            Global.gameProxy.clearRoomInfo();
            var handler = ServerPostPath.hall_sceneHandler_c_leave;
            let resp1: any = await game.PomeloManager.instance.request(handler, null);
            if (resp1 && resp1.error && resp1.error.code == 0) {
                game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG_MATCH);
                game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
            } else {
                Global.alertMediator.addAlert("退出房间失败", null, null, true);
            }
        }

        private joinTimeoutStart() {
            this.joinTimeout = egret.setTimeout(() => {
                var handler = ServerPostPath.hall_sceneHandler_c_enter;
                delete Global.gameProxy.lastGameConfig['roomId'];
                let data = _.clone(Global.gameProxy.lastGameConfig);
                data['isContinue'] = true;
                game.PomeloManager.instance.request(handler, data);
            }, this, 20000);
        }

        /**
         * 更新金币
         */
        public updateGold() {
            this.mineHeader.updateGold(Global.playerProxy.playerData.gold);
        }

        public onTouchTap(e: egret.TouchEvent) {
            e.stopPropagation();
            switch (e.target) {
                case this.backBtn:
                    this.backBtnTouch();
                    break;
            }
        }

        public onAdded() {
            super.onAdded();
            // EventManager.instance.addEvent(ServerNotify.s_playerEnter, this.playerjoin, this);
            EventManager.instance.addEvent(ServerNotify.s_initHandCards, this.initHandCards, this);
            EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
            EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterResult, this);
            // EventManager.instance.removeEvent(ServerNotify.s_playerEnter, this.playerEnter, this);
        }

        public onRemoved() {
            super.onRemoved();
            egret.clearTimeout(this.joinTimeout);
            // EventManager.instance.removeEvent(ServerNotify.s_playerEnter, this.playerjoin, this);
            EventManager.instance.removeEvent(ServerNotify.s_initHandCards, this.initHandCards, this);
            EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
            EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterResult, this);
            // EventManager.instance.addEvent(ServerNotify.s_quitRoom, this.quitRoom, this);
        }

        private enterResult(e: egret.Event) {
            let data = e.data;
            if (data.code && data.code != 0) {
                Global.alertMediator.addAlert(data.msg, () => {

                }, null, true);
                return;
            }
            // e.data.roomInfo['players'] = this.players;
            // Global.niuniuProxy.setRoomInfo(e.data);
        }

        /**
         * 服务器断开 网会断
         */
        private async reconnectSuc() {
            let matchSuc: boolean = await Global.gameProxy.reconnectRoom() as boolean;
            // LogUtils.logD("roomInfo %j=", roomInfo);
            if (matchSuc) {
                if (Global.gameProxy.roomInfo.playing) {
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG_MATCH);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG);
                }
            }
        }
        /**
         * 发牌
         * 收到发牌的消息跳转界面
         * @param  {egret.Event} e
         */
        public async initHandCards(e: egret.Event) {
            // var resp = e.data as InitHandCardsResp;
            // let roomInfo = Global.gameProxy.roomInfo;
            await Global.gameProxy.req2updateRoom();
            game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG_MATCH);
            game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG, this.scenceId);
            // roomInfo.playing = true;
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
