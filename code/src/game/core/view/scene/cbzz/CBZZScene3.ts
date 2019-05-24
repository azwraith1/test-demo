/*
 * @Author: wangtao 
 * @Date: 2019-05-07 17:48:53 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 17:49:15
 * @Description: 
 */
module cbzz {
    export class CBZZScene3 extends game.BaseScene {
        public resizeGroup: eui.Group;
        public freeGroup: eui.Group;
        public scroller: cbzz.CBZZScroller;
        public freeMulGroup: eui.Group;
        public freeMulbei1: eui.Image;
        public freeMulbei2: eui.Image;
        public freeMulbei3: eui.Image;
        public freeMul1: eui.BitmapLabel;
        public freeMul2: eui.BitmapLabel;
        public freeMul3: eui.BitmapLabel;
        public freeWinGroup: eui.Group;
        public freeTimesLabel: eui.BitmapLabel;
        public freeWin: eui.BitmapLabel;
        public selectGroup: eui.Group;
        public group20: eui.Group;
        public group15: eui.Group;
        public group10: eui.Group;
        public group5: eui.Group;
        public totalgroup: eui.Group;
        public totalwinPanel: eui.Image;
        public totalWin: eui.BitmapLabel;
        public peachgroup: eui.Group;
        public lineScoreGroup: eui.Group;
        public lineNum: eui.BitmapLabel;
        public effectGroup1: eui.Group;
        public effectGroup2: eui.Group;

        private freeBgAni1: DBComponent; //免费游戏背景动画
        private freeMulAni: DBComponent;//免费游戏倍数底下特效
        private bonusmouseon: DBComponent//免费次数悬浮效果
        private bonusSelect1: DBComponent//免费次数选择效果1
        private bonusSelect2: DBComponent//免费次数选择效果2
        private bgAni1: DBComponent;
        private bigWinPanel: CBZZBigwinGroup;
        public bgMusic: string;
        public constructor() {
            super();
            this.skinName = new CBZZScene3Skin();
        }
        /**
         * 场景创建
         */
        public createChildren() {
            super.createChildren();
            let isPC = NativeApi.instance.IsPC();
            if (isPC) {
                mouse.enable(this.stage);
                this.addMouseOnEvent();
            }
            this.freeBgAni1 = DBComponent.create("freeBgAni", "cbzz_freebg_ani1");
            this.bgAni1 = DBComponent.create("cbzz_bg", "cbzz_bg_ani1");
            this.bgAni1.horizontalCenter = 0; this.bgAni1.bottom = 300;
            this.bgAni1.play("", 0);
            this.freeBgAni1.play("", 0);
            this.freeBgAni1.horizontalCenter = 0; this.freeBgAni1.bottom = -10;
            this.effectGroup2.addChild(this.freeBgAni1);
            this.effectGroup1.addChild(this.freeBgAni1);
            this.effectGroup1.addChild(this.bgAni1);
            this.bgAni1.resetPosition();
            this.freeBgAni1.touchEnabled = false;
            this.freeMulAni = DBComponent.create("cbfreemulani", "cbzz_freemul_ani");
            this.bonusmouseon = DBComponent.create("cb_bonusmouseon", "cbzz_sle_mouseon");
            this.bonusSelect1 = DBComponent.create("cb_bonusSelect1", "cbzz_sel_bon_ani1");
            this.bonusSelect2 = DBComponent.create("cb_bonusSelect2", "cbzz_sel_bon_ani2");
            this.bonusmouseon.touchEnabled = false;
            this.freeBgAni1.resetPosition();
            this.scroller.showFreeFirst(3);
        }
        /**
         * 场景添加
         */
        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
            EventManager.instance.addEvent(EventNotify.CBZZ_ENTER_FREE_GAME, this.enterFreeGame, this);
            EventManager.instance.addEvent(EventNotify.CBZZ_START_FREE_GAME, this.startFreeGame, this);
        }
        /**
         * 场景移除
         */
        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
            EventManager.instance.removeEvent(EventNotify.CBZZ_ENTER_FREE_GAME, this.enterFreeGame, this);
            EventManager.instance.removeEvent(EventNotify.CBZZ_START_FREE_GAME, this.startFreeGame, this);
        }
        /**
         * 添加鼠标悬浮效果
         */
        public addMouseOnEvent() {
            this.group20.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.add20mouseon, this);
            this.group15.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.add15mouseon, this);
            this.group10.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.add10mouseon, this);
            this.group5.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.add5mouseon, this);
            this.group20.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.add20mouseon2, this);
            this.group15.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.add15mouseon2, this);
            this.group10.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.add10mouseon2, this);
            this.group5.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.add5mouseon2, this);
        }
        /**
         * 添加20次免费游戏鼠标特效
         */
        private add20mouseon() {
            this.bonusmouseon.play("", 0);
            this.bonusmouseon.horizontalCenter = -5;
            this.bonusmouseon.bottom = 315;
            this.group20.addChild(this.bonusmouseon);
            this.bonusmouseon.resetPosition();
        }
        /**
         * 移除20次免费游戏鼠标特效
         */
        private add20mouseon2() {
            game.UIUtils.removeSelf(this.bonusmouseon);
        }
        /**
         * 添加15次免费游戏鼠标特效
         */
        private add15mouseon() {
            this.bonusmouseon.play("", 0);
            this.bonusmouseon.horizontalCenter = -5;
            this.bonusmouseon.bottom = 315;
            this.group15.addChild(this.bonusmouseon);
            this.bonusmouseon.resetPosition();
        }
        /**
         * 移除15次免费游戏鼠标特效
         */
        private add15mouseon2() {
            game.UIUtils.removeSelf(this.bonusmouseon);
        }
        /**
         * 添加10次免费游戏鼠标特效
         */
        private add10mouseon() {
            this.bonusmouseon.play("", 0);
            this.bonusmouseon.horizontalCenter = -5;
            this.bonusmouseon.bottom = 315;
            this.group10.addChild(this.bonusmouseon);
            this.bonusmouseon.resetPosition();
        }
        /**
         * 移除10次免费游戏鼠标特效
         */
        private add10mouseon2() {
            game.UIUtils.removeSelf(this.bonusmouseon);
        }
        /**
         * 添加5次免费游戏鼠标特效
         */
        private add5mouseon() {
            this.bonusmouseon.play("", 0);
            this.bonusmouseon.horizontalCenter = -5;
            this.bonusmouseon.bottom = 315;
            this.group5.addChild(this.bonusmouseon);
            this.bonusmouseon.resetPosition();
        }
        /**
         * 移除5次免费游戏鼠标特效
         */
        private add5mouseon2() {
            game.UIUtils.removeSelf(this.bonusmouseon);
        }
        /**
         * 点击事件
         * @param  {egret.TouchEvent} e
         */
        public onTouchTap(e: egret.TouchEvent) {
            if (game.LaohuUtils.free_time_times != 0) {
                this.group5.touchEnabled = this.group10.touchEnabled = this.group15.touchEnabled = this.group20.touchEnabled = false;
                return;
            }
            switch (e.target) {
                case this.group5:
                    this.selectPeachs(3);
                    break;
                case this.group10:
                    this.selectPeachs(2);
                    break;
                case this.group15:
                    this.selectPeachs(1);
                    break;
                case this.group20:
                    this.selectPeachs(0);
                    break;
            }
        }
        /**
         * 进入免费游戏效果
         */
        private enterFreeGame() {
            SoundManager.getInstance().playMusic("cbzz_seltbackground_mus_mp3");
            if (game.LaohuUtils.free_time_times != 0) {
                switch (game.LaohuUtils.free_time_times + "") {
                    case "20":
                        this.selectPeachs(0);
                        break;
                    case "15":
                        this.selectPeachs(1);
                        break;
                    case "10":
                        this.selectPeachs(2);
                        break;
                    case "5":
                        this.selectPeachs(3);
                        break;
                }
            }
        }

        private isSelected: boolean = false; //防止重复选择
        private freeTimes: number; //免费游戏次数
        /**
         * 发送选择桃子index
         * @param  {number} index
         */
        private async selectPeachs(index: number) {
            if (!this.isSelected) {
                this.isSelected = true;
                let data2 = { "bonusIndex": index };
                let resp: any = await Global.pomelo.request(ServerPostPath.game_slotHandler_c_selectBonusGame, data2);
                this.freeTimes = resp.freeGameTimes;
                game.CBZZUtils.freeTimes = this.freeTimes;
                game.CBZZUtils.freeWin = 0;
                this.freeTimesLabel.text = this.freeTimes + "";
                for (let i = 0; i < resp.freeGameMuls.length; i++) {
                    game.CBZZUtils.FreeTimeMul.push(resp.freeGameMuls[i]);
                }
                this.freeMul1.text = resp.freeGameMuls[0] + "";
                this.freeMul2.text = resp.freeGameMuls[1] + "";
                this.freeMul3.text = resp.freeGameMuls[2] + "";
                this.isReconnect = false;
                this.group20.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.add20mouseon, this);
                this.group15.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.add15mouseon, this);
                this.group10.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.add10mouseon, this);
                this.group5.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.add5mouseon, this);
                switch (index) {
                    case 0:
                        this.select20();
                        break;
                    case 1:
                        this.select15();
                        break;
                    case 2:
                        this.select10();
                        break;
                    case 3:
                        this.select5();
                        break;
                }
            }
        }
        /**
         * 选择20次免费游戏播放效果
         */
        private select20() {
            this.bonusSelect1.play("", 1);
            this.bonusSelect2.play("", 0);
            this.bonusSelect2.horizontalCenter = -5;
            this.bonusSelect1.horizontalCenter = -5;
            this.bonusSelect1.bottom = 225;
            this.bonusSelect2.bottom = 200;
            this.group20.addChild(this.bonusSelect1);
            this.bonusSelect1.resetPosition();
            this.group20.addChild(this.bonusSelect2);
            this.bonusSelect2.resetPosition();
            SoundManager.getInstance().playEffect("cbzz_freegame3_mp3");
            this.bonusSelect1.callback = () => {
                egret.Tween.get(this.group15).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200)
                egret.Tween.get(this.group10).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200)
                egret.Tween.get(this.group5).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200);
            };

            egret.setTimeout(() => {
                game.UIUtils.removeSelf(this.bonusSelect2);
                this.selectGroup.visible = false;
                this.resizeGroup.addChild(this.freeWinGroup);
                this.startFreeGame();
            }, this, 4000);
        }
        /**
         * 选择15次免费游戏播放效果
         */
        private select15() {
            this.bonusSelect1.play("", 1);
            this.bonusSelect2.play("", 0);
            this.bonusSelect2.horizontalCenter = -5;
            this.bonusSelect1.horizontalCenter = -5;
            this.bonusSelect1.bottom = 225;
            this.bonusSelect2.bottom = 200;
            this.group15.addChild(this.bonusSelect1);
            this.bonusSelect1.resetPosition();
            this.group15.addChild(this.bonusSelect2);
            SoundManager.getInstance().playEffect("cbzz_freegame3_mp3");
            this.bonusSelect2.resetPosition();
            this.bonusSelect1.callback = () => {
                egret.Tween.get(this.group20).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200)
                egret.Tween.get(this.group10).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200)
                egret.Tween.get(this.group5).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200);

            };
            egret.setTimeout(() => {
                game.UIUtils.removeSelf(this.bonusSelect2);
                this.selectGroup.visible = false;
                this.resizeGroup.addChild(this.freeWinGroup);
                this.startFreeGame();
            }, this, 4000);
        }
        /**
         * 选择10次免费游戏播放效果
         */
        private select10() {
            this.bonusSelect1.play("", 1);
            this.bonusSelect2.play("", 0);
            this.bonusSelect2.horizontalCenter = -5;
            this.bonusSelect1.horizontalCenter = -5;
            this.bonusSelect1.bottom = 225;
            this.bonusSelect2.bottom = 200;
            this.group10.addChild(this.bonusSelect1);
            this.bonusSelect1.resetPosition();
            this.group10.addChild(this.bonusSelect2);
            this.bonusSelect2.resetPosition();
            SoundManager.getInstance().playEffect("cbzz_freegame3_mp3");
            this.bonusSelect1.callback = () => {
                egret.Tween.get(this.group15).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200)
                egret.Tween.get(this.group20).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200)
                egret.Tween.get(this.group5).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200);

            };
            egret.setTimeout(() => {
                game.UIUtils.removeSelf(this.bonusSelect2);
                this.selectGroup.visible = false;
                this.resizeGroup.addChild(this.freeWinGroup);
                this.startFreeGame();
            }, this, 4000);
        }
        /**
         * 选择5次免费游戏播放效果
         */
        private select5() {
            this.bonusSelect1.play("", 1);
            this.bonusSelect2.play("", 0);
            this.bonusSelect2.horizontalCenter = -5;
            this.bonusSelect1.horizontalCenter = -5;
            this.bonusSelect1.bottom = 225;
            this.bonusSelect2.bottom = 200;
            this.group5.addChild(this.bonusSelect1);
            this.bonusSelect1.resetPosition();
            this.group5.addChild(this.bonusSelect2);
            this.bonusSelect2.resetPosition();
            SoundManager.getInstance().playEffect("cbzz_freegame3_mp3");
            this.bonusSelect1.callback = () => {
                egret.Tween.get(this.group15).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200)
                egret.Tween.get(this.group10).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200)
                egret.Tween.get(this.group20).to({ top: -(GameConfig.CURRENT_HEIGHT), bottom: GameConfig.CURRENT_HEIGHT }, 200);
            };
            egret.setTimeout(() => {
                game.UIUtils.removeSelf(this.bonusSelect2);
                this.selectGroup.visible = false;
                this.resizeGroup.addChild(this.freeWinGroup);
                this.startFreeGame();
            }, this, 4000);

        }

        private isReconnect: boolean = true; //判断是否为断线重连
        /**
         * 移除选择动画和重连直接开始游戏的动画
         */
        private startFreeGame() {
            SoundManager.getInstance().playMusic("cbzz_freespinbackground_mus_mp3");
            if (!this.isReconnect) {
                egret.setTimeout(this.playFreeGame, this, 1500);
            } else {
                this.freeMul1.text = game.CBZZUtils.FreeTimeMul[0] + "";
                this.freeMul2.text = game.CBZZUtils.FreeTimeMul[1] + "";
                this.freeMul3.text = game.CBZZUtils.FreeTimeMul[2] + "";
                this.freeWins = game.LaohuUtils.freeWin;
                this.freeWin.text = NumberFormat.handleFloatDecimal(this.freeWins) + "";
                this.freeTimes = game.LaohuUtils.freeTimes;
                this.freeTimesLabel.text = this.freeTimes + "";
                this.selectGroup.visible = false;
                egret.setTimeout(this.playFreeGame, this, 1500);
            }
        }

        private commomScore: eui.BitmapLabel; //中奖连线分数
        /**
         * 移除上次旋转动画
         */
        private removeLastAni() {
            if (this.winGold > 0) {
                this.lineScoreGroup.visible = false;
                this.scroller.removeIconHui([[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]]);
            }
            this.scroller.stopIconDb();
        }

        private isMessaged: boolean = false; //防止重复发送免费旋转消息
        /**
         * 免费游戏旋转，次数判断
         */
        private playFreeGame() {
            //防止重复发消息
            if (!this.isMessaged) {
                this.removeLastAni();
                if (this.freeTimes <= 0) {
                    this.freeTimesLabel.text = 0 + "";
                    LogUtils.logD(this.freeTimes + "   freetime")
                    this.showTotalwin();
                    return;
                }
                this.isMessaged = true;
                this.freeTimes -= 1;
                this.freeTimesLabel.text = this.freeTimes + "";
                SoundManager.getInstance().playEffect("cbzz_reel_mp3", true);
                this.scroller.run();
                this.messageSend();
                egret.setTimeout(() => { this.isMessaged = false }, this, 600);
            }
        }

        private showAtr: Array<Array<number>>;
        private bonusAtr: Array<Array<number>>;//中奖图标数组
        private winGold: number; //中奖金额 
        private freeMulIndex: number;//免费游戏中奖倍数 
        private freeWins: number = 0;//免费游戏总赢取
        /**
         * 发送免费游戏旋转消息
         */
        private async messageSend() {
            this.showAtr = [];
            this.bonusAtr = [];
            this.winGold = 0;
            let data2 = { "spinType": 1, "bet": game.CBZZUtils.bet, "multiple": game.CBZZUtils.mul, "lineCount": 243, "activityId": 0 };
            let resp2: any = await Global.pomelo.request(ServerPostPath.game_slotHandler_c_bet, data2);
            let resp1: any = resp2.spinRes;
            if (resp1.rmIndex) {
                for (let i in resp1.rmIndex) {
                    this.bonusAtr.push(resp1.rmIndex[i]);
                }
            } else {
                this.bonusAtr = [];
            }
            this.winGold = resp2.winCount;
            this.freeMulIndex = resp1.freeMulIndex;
            this.showAtr = [resp1.matrix[0], resp1.matrix[1], resp1.matrix[2], resp1.matrix[3], resp1.matrix[4]];
            this.freeWins += this.winGold;
            game.CBZZUtils.ToTalMoney = resp2.own_gold;
            egret.setTimeout(() => {
                this.scroller.runResult(this.showAtr);
            }, this, 300)
        }

        private freeGameTimeOut: any;
        /**
         * 各个转轴结束监听
         * @param  {egret.Event} e
         */
        private scrollerEnd(e: egret.Event) {
            let data = e.data;
            //场景id判断
            if (data.sceneIndex != 3) {
                return;
            }
            let index = e.data.index;
            switch (index) {
                case 5:
                    SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
                    SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                    //是否中奖
                    if (this.winGold > 0) {
                        if (this.winGold < (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) * 15) egret.setTimeout(() => { this.lineScoreGroup.visible = false; this.removeLastAni(); }, this, 1600);
                        this.freeGameTimeOut = egret.setTimeout(this.playFreeGame, this, 2000);
                    } else {
                        this.freeGameTimeOut = egret.setTimeout(this.playFreeGame, this, 1000);
                    }
                    this.addFreeBonusAni();
                    this.freeWin.text = NumberFormat.handleFloatDecimal(this.freeWins) + "";
                    break;
                case 4:
                    SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                    break;
                case 3:
                    SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                    break;
                case 2:
                    SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                    break;
                case 1:
                    SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                    break;
            }
        }
        /**
         * 免费游戏中奖连线
         */
        private addFreeBonusAni() {
            //判断是否为bigwin
            if (this.winGold >= (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) * 15) {
                egret.clearTimeout(this.freeGameTimeOut);
                if (this.bonusAtr.length > 0 && this.winGold > 0) {
                    let func = () => {
                        if (!this.bigWinPanel.touchEnabled) return;
                        this.bigWinPanel.touchEnabled = false;
                        this.bigWinPanel.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);
            			/**
            			 * bigwin结束窗口效果
            			 */
                        this.bigWinPanel.stopShowBigWin(() => {
                            this.scroller.stopIconDb();
                            this.scroller.setIconHui();
                            this.scroller.removeIconHui(this.bonusAtr);
                            this.scroller.addBonusAni(this.bonusAtr, this.winGold);
                            this.addTittleMul();
                            egret.clearTimeout(this.freeGameTimeOut);
                            this.freeGameTimeOut = egret.setTimeout(() => {
                                this.playFreeGame();
                            }, this, 2000);
                        });
                    }
                    this.bigWinPanel = new CBZZBigwinGroup();
                    this.bigWinPanel.touchEnabled = false;
                    egret.setTimeout(() => {
                        this.bigWinPanel.touchEnabled = true;
                        this.bigWinPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, func, this)
                    }, this, 1500);
            		/**
            		 * bigwin窗口
            		 * @param score,callback?
            		 */
                    this.bigWinPanel.showScore(this.winGold, () => {
                        this.scroller.setIconHui();
                        this.scroller.removeIconHui(this.bonusAtr);
                        this.scroller.addBonusAni(this.bonusAtr, this.winGold);
                        this.addTittleMul();
                        this.freeGameTimeOut = egret.setTimeout(this.playFreeGame, this, 1710);
                        game.UIUtils.removeSelf(this.bigWinPanel);
                    })
                    this.resizeGroup.addChild(this.bigWinPanel);
                }
            }
            //普通中奖
            else if (this.bonusAtr.length > 0 && this.winGold > 0) {
                SoundManager.getInstance().playEffect("cbzz_win_mp3");
                this.scroller.setIconHui();
                this.scroller.removeIconHui(this.bonusAtr);
                this.scroller.addBonusAni(this.bonusAtr, this.winGold);
                let data = Number(new Big(this.winGold).mul(100));
                this.lineNum.text = NumberFormat.handleFloatDecimal(data) + "";
                this.lineScoreGroup.visible = true;
                this.addTittleMul();
            }
            // }

        }
        /**
         * 提出的免费游戏倍数特效
         */
        private addTittleMul() {
            if (this.winGold > 0) {
                if (this.freeMulIndex == 0) {
                    this.freeMulAni.horizontalCenter = -230;
                    this.freeMulAni.bottom = -50;
                    this.freeMulAni.play("", 3);
                    this.freeMulAni.callback = () => {
                        game.UIUtils.removeSelf(this.freeMulAni);
                    }
                    this.freeMulGroup.addChild(this.freeMulAni);
                    this.freeMulAni.resetPosition();
                    this.freeMulGroup.addChild(this.freeMulbei1);
                    this.freeMulGroup.addChild(this.freeMul1);
                    egret.Tween.get(this.freeMulbei1).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                    egret.Tween.get(this.freeMul1).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                } else if (this.freeMulIndex == 1) {
                    this.freeMulAni.horizontalCenter = 0;
                    this.freeMulAni.play("", 3);
                    this.freeMulAni.bottom = -50;
                    this.freeMulAni.callback = () => {
                        game.UIUtils.removeSelf(this.freeMulAni);
                    }
                    this.freeMulGroup.addChild(this.freeMulAni);
                    this.freeMulAni.resetPosition();
                    this.freeMulGroup.addChild(this.freeMulbei2);
                    this.freeMulGroup.addChild(this.freeMul2);
                    egret.Tween.get(this.freeMulbei2).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                    egret.Tween.get(this.freeMul2).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                } else if (this.freeMulIndex == 2) {
                    this.freeMulAni.horizontalCenter = 230;
                    this.freeMulAni.play("", 3);
                    this.freeMulAni.bottom = -50;
                    this.freeMulAni.callback = () => {
                        game.UIUtils.removeSelf(this.freeMulAni);
                    }
                    this.freeMulGroup.addChild(this.freeMulAni);
                    this.freeMulAni.resetPosition();
                    this.freeMulGroup.addChild(this.freeMulbei3);
                    this.freeMulGroup.addChild(this.freeMul3);
                    egret.Tween.get(this.freeMulbei3).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                    egret.Tween.get(this.freeMul3).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                }
            }
        }
        private isPlayingMusic: boolean = false;
        /**
         * 免费游戏结束，初始化免费游戏场景
         */
        private showTotalwin() {
            this.group5.top = this.group20.top = this.group10.top = this.group15.top = 0;
            this.group5.bottom = this.group20.bottom = this.group10.bottom = this.group15.bottom = 0;
            this.group5.touchEnabled = this.group10.touchEnabled = this.group15.touchEnabled = this.group20.touchEnabled = true;
            this.isSelected = false;
            this.totalgroup.visible = true;
            this.resizeGroup.addChild(this.totalgroup);
            this.freeGroup.addChild(this.freeWinGroup);
            game.CBZZUtils.freeWin = this.freeWins;
            this.addMouseOnEvent();
            this.totalWin.text = NumberFormat.handleFloatDecimal(this.freeWins) + "";

            SoundManager.getInstance().pauseMusic();
            SoundManager.getInstance().playEffect("cbzz_scatwin_mp3");
            egret.setTimeout(() => {
                //恢复背景音乐
                SoundManager.getInstance().remuseMusic();
                this.freeWins = 0;
                this.freeWin.text = 0 + "";
                EventManager.instance.dispatch(EventNotify.CBZZ_QUIT_FREE_GAME);
                this.selectGroup.visible = true;
                this.totalgroup.visible = false;
            }, this, 8000);
        }
    }
}