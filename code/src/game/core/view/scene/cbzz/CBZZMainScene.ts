/*
 * @Author: wangtao 
 * @Date: 2019-05-20 10:59:56 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 17:48:46
 * @Description: 
 */
module cbzz {
    export class CBZZMainScene extends game.BaseScene {
        public resizeGroup: eui.Group;
        public scene3: cbzz.CBZZScene3;
        public scene1: cbzz.CBZZScene1;
        public effectGroup: eui.Group;

        private tofreeAni: DBComponent;
        public bgMusic: string = null;
        public constructor() {
            super();
            this.skinName = new CBZZMainSceneSkin();
        }

        public createChildren() {
            super.createChildren();
            this.tofreeAni = DBComponent.create("cb_tofree", "cbzz_tofree_ani");
        }

        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
            EventManager.instance.addEvent(ServerNotify.s_enterOtherSlotScene, this.enterOtherGame, this);
            EventManager.instance.addEvent(EventNotify.CBZZ_ENTER_FREE_GAME_SCENE, this.enterFreeGame, this);
            EventManager.instance.addEvent(EventNotify.CBZZ_QUIT_FREE_GAME, this.quitFreeGame, this);
            EventManager.instance.addEvent(ServerNotify.s_kickGame, this.kickGame, this);
            EventManager.instance.addEvent(EventNotify.CBZZ_START_FREE_GAME_SCENE, this.startfreeGame, this);
        }

        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
            EventManager.instance.removeEvent(ServerNotify.s_enterOtherSlotScene, this.enterOtherGame, this);
            EventManager.instance.removeEvent(EventNotify.CBZZ_ENTER_FREE_GAME_SCENE, this.enterFreeGame, this);
            EventManager.instance.removeEvent(EventNotify.CBZZ_QUIT_FREE_GAME, this.quitFreeGame, this);
            EventManager.instance.removeEvent(ServerNotify.s_kickGame, this.kickGame, this);
            EventManager.instance.removeEvent(EventNotify.CBZZ_START_FREE_GAME_SCENE, this.startfreeGame, this);
        }

        private async reconnectSuc(e: egret.Event) {
            game.LaohuUtils.auto_times = 0;
            SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
            game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
            game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_CBZZ);
            game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_CBZZ_AUTO_PANEL);
            game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_CBZZ_TIPS_PANEL);
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
            if (resp) {
                Global.alertMediator.addAlert(text, () => {
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_CBZZ);
                    game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
                    game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_CBZZ_TIPS_PANEL);
                    game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
                    game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
                    // game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SDXL_AUTO_PANEL);
                }, "", true);
            }
        }
        /**
         * 免费游戏入场
         */
        private enterFreeGame() {
            SoundManager.getInstance().playEffect("cbzz_freesel_mp3");
            this.tofreeAni.play("", 1);
            this.tofreeAni.horizontalCenter = 0;
            this.tofreeAni.bottom = -280;
            this.effectGroup.addChild(this.tofreeAni);
            this.tofreeAni.resetPosition();
            this.effectGroup.visible = true;
            egret.setTimeout(() => {
                this.scene3.visible = true;
                this.scene1.visible = false;
            }, this, 300)
            this.tofreeAni.callback = () => {
                game.UIUtils.removeSelf(this.tofreeAni);
                this.effectGroup.visible = false;
                EventManager.instance.dispatch(EventNotify.CBZZ_ENTER_FREE_GAME);
            }

        }
        /**
         * 退出免费游戏
         */
        private quitFreeGame() {
            this.scene3.visible = false;
            this.scene1.visible = true;
            EventManager.instance.dispatch(EventNotify.CBZZ_ENTER_COMMOM_GAME);
        }
        /**
		 * 超时未下注请出房间
		 */
        private kickGame() {
            let text = "你已超过5分钟局未下注,请重新进入游戏";
            Global.alertMediator.addAlert(text, () => {
                Global.playerProxy.playerData.gold = game.CBZZUtils.ToTalMoney;
                game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
                game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_CBZZ);
                game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
                game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_CBZZ_TIPS_PANEL);
                game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
                game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
                // game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
            }, "", true);
            return;
        }

        /**
		 * 直接进入免费游戏
		 */
        private startfreeGame() {
            // this.scene3.visible = true;
            // this.scene3.bottom = this.scene3.top = 0;
            this.scene1.visible = false;
            this.scene3.visible = true;
            EventManager.instance.dispatch(EventNotify.CBZZ_START_FREE_GAME);
        }
    }
}