module game {
    export class CloseLaohuPanel extends eui.Component {
        leave_btn: eui.Button;
        cancel_leave_btn: eui.Button;

        public constructor() {
            super();
            this.skinName = new CloseLaohuPanelSkin();
        }
        protected childrenCreated() {
            this.leave_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.quitRoom, this);
            this.cancel_leave_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                SoundManager.getInstance().playEffect("button_dntg_mp3");
                AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LEAVE_LAOHU_PANEL);
            }, this);
        }

        private async quitRoom() {
            this.leave_btn.touchEnabled = false;
            SoundManager.getInstance().playEffect("button_dntg_mp3");
            var quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
            if (quitResp) {
                if (quitResp.error && quitResp.error.code != 0) {
                    let text = quitResp.error.msg
                    Global.alertMediator.addAlert(text, () => {
                    }, null, true);

                    return;
                }
                game.LaohuUtils.free_time_times = 0;
                game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = 0;
                game.LaohuUtils.stopAuto = false;
                Global.gameProxy.clearRoomInfo();
                if (quitResp.gold) {
                    Global.playerProxy.playerData.gold = quitResp.gold;
                }
                AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LEAVE_LAOHU_PANEL);
                AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LAOHUJI_HALL);
                AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDXL);
                AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_CBZZ);
                // AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_LAOHU_GAME);
                AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DNTG);

                return;
            }
            let text = GameConfig.GAME_CONFIG['long_config']['10002'].content
            Global.alertMediator.addAlert(text, () => {
            }, null, true);
        }
    }
}