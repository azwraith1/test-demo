// TypeScript file
module game {
    export class slotHallSence extends game.BaseHallScene {
        public hallId: string = "slot";
        public pmdKey: string = "slot";
        /**
		 * 头像前缀
		 */
        public headerFront: string = "hall_header";
        /**
		 * 记录界面的通知
		 */
        public RECORD_NOTIFY: string = PanelNotify.OPEN_DNTG_RECORD_PANEL;
        /**
		 * 进入正确匹配的通知
		 */
        public MATCHING_NOTIFY: string = "";
        /**
		 * 设置界面的通知
		 */
        public SETTING_NOTIFY: string = null;
        /**
		 * 需要加载的资源组
		 */
        public loadGroups: string[] = [];

        private centerGroup: eui.Group;
        /**
		 * 背景音乐
		 */
        public bgMusic: string = "lhj_hall_bgm_mp3";
        /**
		 * 关闭当前界面的通知
		 */
        public CLOSE_NOTIFY: string = SceneNotify.CLOSE_LAOHUJI_HALL;
        /**
		 * 帮助界面的通知
		 */
        public HELP_NOTIFY: string = PanelNotify.OPEN_HELP_SHU;
        public nameLabel: eui.Label;//玩家姓名
        public headerImage: eui.Image;//头像

        public lhjhall_back_btn: eui.Button;
        public lhjhall_record_btn: eui.Button;
        public lhjhall_addgold: eui.Button;
        public fullScreenBtn: eui.Button;
        public lhjhall_setting_btn: eui.Button;
        public goldLabel: eui.Label;
        
        public hall_scroller: eui.Scroller;
        public view_group: eui.Group;
        public gameBtn1: eui.Button;
        public gameBtn2: eui.Button;
        private gameBtn3: eui.Button;
        private gameBtn4: eui.Button;
        public buttonKuangAni: DBComponent;
        private touchMoveFlag: boolean = false;
        private headGroup: eui.Group;
        private scrollerGroup: eui.Group;

        private hallBgAni1: DBComponent;
        private hallBgAni2: DBComponent;
        private iconSaoGuang: DBComponent;
        private iconSaoGuang2: DBComponent;
        private iconSaoGuang3: DBComponent;
        public constructor() {
            super();
            this.skinName = new LaohuHallSkin();
        }

        public createChildren() {
            super.createChildren();
            let isPC = NativeApi.instance.IsPC();
            if (isPC) {
                mouse.enable(this.stage);
                this.gameBtn3.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.thirdAni, this);
                this.gameBtn3.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.removeThirdAni, this);
                this.gameBtn1.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.dntgbtnAni, this);
                this.gameBtn1.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.removeDntgbtnAni, this);
                this.gameBtn2.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.testBtnAni, this);
                this.gameBtn2.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.removetestBtnAni, this);
                // this.gameBtn4.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.gameBtn4Ani, this);
                // this.gameBtn4.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.removegameBtn4Ani, this);
            }
            this.slotHallAni();
            this.hall_scroller.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => { }, this);
            this.hall_scroller.addEventListener(egret.TouchEvent.TOUCH_MOVE, () => { this.touchMoveFlag = true }, this);
            this.hall_scroller.addEventListener(egret.TouchEvent.TOUCH_END, () => { this.touchMoveFlag = false }, this);
            // this.goldLabel.text = NumberFormat.handleFloatDecimal(Global.playerProxy.playerData.gold) + "";
            if (this.gameBtn1.x >= 0) {
                this.gameBtn4.alpha = 0.7;
            }
            this.lhjhall_back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.back2Hall, this);
            // this.gameBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.open_dntg, this);
            this.lhjhall_setting_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.setting, this);
            this.hall_scroller.addEventListener(egret.Event.CHANGE, this.checkPosition, this);
        }

        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);
            EventManager.instance.addEvent(EventNotify.CHANG_PLAYER_HEADER, this.changHeader, this);
            this.addSaoguang();
        }

        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);
            EventManager.instance.removeEvent(EventNotify.CHANG_PLAYER_HEADER, this.changHeader, this);
        }
        /**
         * 玩家头像
         * @param  {egret.Event} e
         */
        private changHeader(e: egret.Event) {
			let data = e.data;
			this.headerImage.source = `${this.headerFront}_${data.sex}_${data.figureUrl}_png`;
			Global.playerProxy.playerData.figure_url = data.figureUrl;
			Global.playerProxy.playerData.sex = data.sex;
		}
        /**
         * slot大厅特效
         */
        public slotHallAni(){
            this.hallBgAni1 = new DBComponent("slot_hall_ani1");
            this.hallBgAni1.horizontalCenter = 0;
            this.hallBgAni1.bottom = 0;
            this.hallBgAni1.play("", 0);
            this.hallBgAni1.touchEnabled = false;
            this.resizeGroup.addChild(this.hallBgAni1);
            this.hallBgAni1.resetPosition();
            this.hallBgAni2 = new DBComponent("slot_hall_ani2");
            this.hallBgAni2.touchEnabled = false;
            this.hallBgAni2.horizontalCenter = 0;
            this.hallBgAni2.bottom = 0;
            this.hallBgAni2.play("", 0);
            this.hallBgAni2.touchEnabled = false;
            this.resizeGroup.addChild(this.hallBgAni2);
            this.resizeGroup.addChild(this.headGroup);
            this.resizeGroup.addChild(this.scrollerGroup);
            this.resizeGroup.addChild(this['ycGroup']);
            this.hallBgAni2.resetPosition();


            this.hall_scroller.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => { }, this);
            this.hall_scroller.addEventListener(egret.TouchEvent.TOUCH_MOVE, () => { this.touchMoveFlag = true }, this);
            this.hall_scroller.addEventListener(egret.TouchEvent.TOUCH_END, () => { this.touchMoveFlag = false }, this);
            let playerInfo = Global.playerProxy.playerData;
            this.updateGold();
            // this.goldLabel.text = NumberFormat.handleFloatDecimal(Global.playerProxy.playerData.gold) + "";
            this.goldLabel.text = NumberFormat.formatGold(Global.playerProxy.playerData.gold) + "";
            if (this.gameBtn1.x >= 0) {
                this.gameBtn4.alpha = 0.7;
            }
            this.lhjhall_back_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.back2Hall, this);
            // this.gameBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.open_dntg, this);
            this.lhjhall_setting_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.setting, this);
            this.hall_scroller.addEventListener(egret.Event.CHANGE, this.checkPosition, this);
            SoundManager.getInstance().playMusic("lhj_hall_bgm_mp3");
        }
        /**
         * 大厅图标上扫光特效
         */
        public addSaoguang() {
            this.iconSaoGuang = DBComponent.create("iconSaoGuang", "slot_hall_saoguang");
            this.iconSaoGuang2 = DBComponent.create("iconSaoGuang2", "slot_hall_saoguang");
            this.iconSaoGuang3 = DBComponent.create("iconSaoGuang3", "slot_hall_saoguang");
            this.iconSaoGuang.play("", 1);
            this.iconSaoGuang2.play("", 1);
            this.iconSaoGuang3.play("", 1);
            this.iconSaoGuang.horizontalCenter = 0;
            this.iconSaoGuang.bottom = 177;
            this.gameBtn1.addChild(this.iconSaoGuang);
            this.iconSaoGuang.resetPosition();
            this.iconSaoGuang2.horizontalCenter = 0;
            this.iconSaoGuang2.bottom = 177;
            this.gameBtn2.addChild(this.iconSaoGuang2);
            this.iconSaoGuang2.resetPosition();
            this.iconSaoGuang3.horizontalCenter = 0;
            this.iconSaoGuang3.bottom = 177;
            this.gameBtn3.addChild(this.iconSaoGuang3);
            this.iconSaoGuang3.resetPosition();
            this.iconSaoGuang.touchEnabled = this.iconSaoGuang2.touchEnabled = this.iconSaoGuang3.touchEnabled = false;
            this.iconSaoGuang.callback = () => {
                egret.setTimeout(this.addSaoguang, this, 3000)
            }

        }
        /**
         * 第三个游戏悬浮特效
         */
        private thirdAni() {
            this.buttonKuangAni = new DBComponent("kuang_light");
            this.buttonKuangAni.play("", -1);
            this.addChild(this.buttonKuangAni);
            this.buttonKuangAni.horizontalCenter = 77;
            this.buttonKuangAni.bottom = -230;
            this.gameBtn3.addChild(this.buttonKuangAni);
        }
        /**
         * 移除第三个游戏悬浮特效
         */
        private removeThirdAni() {
            if (this.buttonKuangAni && this.buttonKuangAni.parent) {
                this.buttonKuangAni.parent.removeChild(this.buttonKuangAni);
            }
        }
        /**
         * dntg悬浮特效
         */
        private dntgbtnAni() {
            this.buttonKuangAni = new DBComponent("kuang_light");
            this.buttonKuangAni.play("", -1);
            this.buttonKuangAni.horizontalCenter = 77;
            this.buttonKuangAni.bottom = -230;
            this.gameBtn1.addChild(this.buttonKuangAni);
        }
        /**
         * 神雕侠侣特效移除
         */
        private removetestBtnAni() {
            if (this.buttonKuangAni && this.buttonKuangAni.parent) {
                this.buttonKuangAni.parent.removeChild(this.buttonKuangAni);
            }
        }
        /**
         * 四大美女悬浮特效
         */
        private gameBtn4Ani() {
            this.buttonKuangAni = new DBComponent("kuang_light");
            this.buttonKuangAni.play("", -1);
            this.buttonKuangAni.horizontalCenter = 81;
            this.buttonKuangAni.bottom = -215;
            this.gameBtn4.addChild(this.buttonKuangAni);
        }
        /**
         * 移除四大美女特效
         */
        private removegameBtn4Ani() {
            if (this.buttonKuangAni && this.buttonKuangAni.parent) {
                this.buttonKuangAni.parent.removeChild(this.buttonKuangAni);
            }
        }
        /**
         * 神雕侠侣特效
         */
        private testBtnAni() {
            this.buttonKuangAni = new DBComponent("kuang_light");
            this.buttonKuangAni.play("", -1);
            this.buttonKuangAni.horizontalCenter = -3;
            this.buttonKuangAni.bottom = 5;
            this.gameBtn2.addChild(this.buttonKuangAni);
            this.buttonKuangAni.resetPosition();
        }
        /**
         * 移除dntg特效
         */
        private removeDntgbtnAni() {
            if (this.buttonKuangAni && this.buttonKuangAni.parent) {
                this.buttonKuangAni.parent.removeChild(this.buttonKuangAni);
            }
        }

        /**
		 * 进入匹配或者重新获取数据
		 * @param  {egret.Event} e?
		 */
        public async enterScene(event) {
        }
        /**
		 * 渲染hallScene
		 */
        public showHallBars() {
        }

        /**
         * @param  {egret.TouchEvent} e
         */
        public onTouchTap(e: egret.TouchEvent) {
            if (this.touchMoveFlag) return;
            switch (e.target) {
                case this.gameBtn1:
                    this.dntgBtnTouch();
                    break;
                case this.lhjhall_record_btn:
                    this.showRecord();
                    break;
                case this.gameBtn2:
                    this.sdxlBtnTouch();
                    break;
                case this.gameBtn3:
                    // if (ServerConfig.PATH_TYPE == PathTypeEnum.DEMO_TEST || ServerConfig.PATH_TYPE == PathTypeEnum.NEI_TEST) {
                    this.cbzzBtnTouch();
                    // } else {
                    //     Global.alertMediator.addAlert("暂未开放，敬请期待", "", "", true);
                    // }
                    break;
                case this.gameBtn4:
                    Global.alertMediator.addAlert("暂未开放，敬请期待", "", "", true);
                    break;
                case this.fullScreenBtn:
                    game.UIUtils.fullscreen(this.resizeGroup);
                    break;

            }
        }
        /**
         * 游戏记录
         */
        private showRecord() {
            AppFacade.getInstance().sendNotification(PanelNotify.OPEN_DNTG_RECORD_PANEL);
        }

        /**
         * 进入dntg游戏
         */
        private dntgBtnTouch() {
            //
            RotationLoading.instance.load(["dntg_hall"], "", () => {
                game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
                DNTGLoadingScene.instance.load("dntg_game", () => {
                    RES.loadGroup("dntg_back")
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DNTG);
                });

            });
        }
        /**
         * 进入sdxl游戏
         */
        private sdxlBtnTouch() {
            RotationLoading.instance.load(["sdxl_hall"], "", () => {
                game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
                SDXLLoadingScene.instance.load("sdxl_game", () => {
                    RES.loadGroup("sdxl_back");
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_SDXL);
                });

            });
        }
        /**
         * 进入cbzz游戏
         */
        private cbzzBtnTouch() {
            RotationLoading.instance.load(["cbzz_hall"], "", () => {
                game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
                RES.loadGroup("cbzz_back");
                CBZZLoading.instance.load("cbzz_game", () => {
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_CBZZ);
                });

            });
        }

        /**
         * 返回大厅
         */
        private back2Hall() {
            game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
            game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
        }

        private open_dntg() {
            RotationLoading.instance.load(["dntg_hall"], "", () => {
                game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
                DNTGLoadingScene.instance.load("dntg_game", () => {
                    RES.loadGroup("dntg_back")
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LAOHU_GAME);
                });
            });
        }

        /**
         * 大厅设置
         */
        private setting() {
            AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING);
        }
        /**
         * scroller移动置灰处理
         */
        private checkPosition() {
            let s = this.hall_scroller.viewport.scrollH;
            if (s <= 130) {
                this.gameBtn4.alpha = 0.7;
                this.gameBtn1.alpha = 1;
            } else {
                this.gameBtn1.alpha = 0.7
                this.gameBtn4.alpha = 1;
            }
        }


    }
}