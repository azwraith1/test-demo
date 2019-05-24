module sdmn {
    export class SDMNMainScene extends game.BaseScene {
        public resizeGroup: eui.Group;
        public scene3: sdmn.SDMNScene3;
        public scene1: sdmn.SDMNScene1;

        public constructor() {
            super();
            this.skinName = "SDMNMainSceneSkin";
        }

        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
            EventManager.instance.addEvent(ServerNotify.s_enterOtherSlotScene, this.enterOtherGame, this);
            EventManager.instance.addEvent(ServerNotify.s_kickGame, this.kickGame, this);
        }

        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
            EventManager.instance.removeEvent(ServerNotify.s_enterOtherSlotScene, this.enterOtherGame, this);
            EventManager.instance.removeEvent(ServerNotify.s_kickGame, this.kickGame, this);
        }

        public createChildrean() {
            super.createChildren();
        }

        public reconnectSuc(e: egret.Event) {
            game.LaohuUtils.auto_times = 0;
            SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
            game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
            game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDMN);
            // game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_CBZZ_AUTO_PANEL);
            // game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_CBZZ_TIPS_PANEL);
            game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
            game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LEAVE_LAOHU_PANEL);
        }

        /**
        * 其他slot游戏
        * @param  {egret.Event} e
        */
        public enterOtherGame(e: egret.Event) {
            let resp = e.data;
            let text: string;
            if (resp.sceneId == 1001) {
                if (resp.isScatter) {
                    text = "您在“大闹天宫”中还有未完成的免费游戏，请先去完成吧";
                } else if (resp.freeTimes) {
                    text = "您在“大闹天宫”中还有" + resp.freeTimes + "次免费游戏,请先去完成吧";
                }
            } else if (resp.sceneId == 1002) {
                if (resp.isScatter) {
                    text = "您在“神雕侠侣”中还有未完成的免费游戏，请先去完成吧";
                } else if (resp.freeTimes) {
                    text = "您在“神雕侠侣”中还有" + resp.freeTimes + "次免费游戏,请先去完成吧";
                }
            }
            else if (resp.sceneId == 1003) {
                if (resp.isScatter) {
                    text = "您在“赤壁之战”中还有未完成的免费游戏，请先去完成吧";
                } else if (resp.freeTimes) {
                    text = "您在“赤壁之战”中还有" + resp.freeTimes + "次免费游戏,请先去完成吧";
                }
            }
            if (resp) {
                Global.alertMediator.addAlert(text, () => {
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDMN);
                    game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
                    game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
                    game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
                }, "", true);
            }
        }
        /**
		 * 超时未下注请出房间
		 */
        private kickGame() {
            let text = "你已超过5分钟局未下注,请重新进入游戏";
            Global.alertMediator.addAlert(text, () => {
                Global.playerProxy.playerData.gold = game.CBZZUtils.ToTalMoney;
                game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
                game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDMN);
                game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
                game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
                game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
            }, "", true);
            return;
        }
    }
}