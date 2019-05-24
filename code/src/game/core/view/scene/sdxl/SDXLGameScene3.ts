/*
 * @Author: wangtao 
 * @Date: 2019-04-09 10:30:03 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 14:58:33
 * @Description: 
 */
// TypeScript file
module sdxl {
    export class SDXLGameScene3 extends game.BaseComponent {
        public resizeGroup: eui.Group;
        public free20: eui.Image;
        public free20Text: eui.Image;
        public free15: eui.Image;
        public free15Text: eui.Image;
        public free10: eui.Image;
        public free10Text: eui.Image;
        public free5: eui.Image;
        public free5Text: eui.Image;
        public scroller: sdxl.SDXLScroller;
        public freeGroup20: eui.Group;
        public freeGroup15: eui.Group;
        public freeGroup10: eui.Group;
        public freeGroup5: eui.Group;
        public freeTimeLabel: eui.BitmapLabel;
        public freeWinLabel: eui.BitmapLabel;
        public selectGroup: eui.Group;
        public xlnImag: eui.Image;
        public ygImag: eui.Image;
        public winGroup: eui.Group;
        public freeBg2: eui.Image;
        private freeMulGroup: eui.Group;
        private freeMul1: eui.BitmapLabel;
        private freeMul2: eui.BitmapLabel;
        private freeMul3: eui.BitmapLabel;
        private bei_1: eui.Image;
        private bei_2: eui.Image;
        private bei_3: eui.Image;
        private freeGroup3: eui.Group;
        private selectTipsIma: eui.Image;
        private freeGroup2: eui.Group;

        public freeTimes: number; //免费游戏次数
        private ygAni: DBComponent;//杨过入场特效
        private touchGuangAni: DBComponent;//杨过小龙女之间特效
        private xlnAni: DBComponent;//小龙女特效
        private commomScore: eui.BitmapLabel;
        private FreeMulAni: DBComponent; //免费游戏倍数特效
        private isReconnect: boolean = true;//是否为掉线后重新连接
        private selectAni1: DBComponent;
        private selectAni2: DBComponent;
        public constructor() {
            super();
            // this.skinName = new SDXLGameScene3Skin();
        }

        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
            EventManager.instance.addEvent(EventNotify.SDXL_START_FREE_GAME, this.startFreeGame, this);
            EventManager.instance.addEvent(EventNotify.SDXL_ENTER_FREE_GAME, this.enterFreeGame, this);
        }

        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
            EventManager.instance.removeEvent(EventNotify.SDXL_START_FREE_GAME, this.startFreeGame, this);
            EventManager.instance.removeEvent(EventNotify.SDXL_ENTER_FREE_GAME, this.enterFreeGame, this);
        }

        public createChildren() {
            super.createChildren();
            // this.addSakuraDown();
            // this.addSakuraHeadDown();
            this.ygAni = DBComponent.create("ygAni", "sdxl_yg");
            this.xlnAni = DBComponent.create("xlnAni", "sdxl_xln");
            this.FreeMulAni = DBComponent.create("FreeMulAni", "sdxl_mul_diguang");
            this.selectAni1 = DBComponent.create("selectAni1", "sdxl_select_ani1");
            this.selectAni2 = DBComponent.create("selectAni2", "sdxl_select_ani2");

            // this.ygAni = new DBComponent("sdxl_yg");
            // this.xlnAni = new DBComponent("sdxl_xln");
            // this.FreeMulAni = new DBComponent("sdxl_mul_diguang");
            // this.selectAni1 = new DBComponent("sdxl_select_ani1");
            // this.selectAni2 = new DBComponent("sdxl_select_ani2");

            this.selectAni1.touchEnabled = false;
            this.selectAni2.touchEnabled = false;
            this.ygAni.touchEnabled = this.xlnAni.touchEnabled = false;
            this.xlnAni.horizontalCenter = 265;
            this.ygAni.horizontalCenter = -269;
            this.xlnAni.bottom = 10;
            this.ygAni.bottom = -58;
            this.ygAni.visible = this.xlnAni.visible = true;
            this.commomScore = new eui.BitmapLabel();
            this.commomScore.font = "sdxl_wingold_fnt";
            this.commomScore.verticalCenter = 0;
            this.commomScore.horizontalCenter = 0;
            this.scroller.showFreeFirst(3);
        }
        /**
         * 添加鼠标监听事件
         */
        private addMouseOn() {
            let isPC = NativeApi.instance.IsPC();
            if (isPC) {
                this.free20.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.free5Ani, this);
                this.free20.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.free5Ani, this);
                this.free15.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.free10Ani, this);
                this.free15.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.free10Ani, this);
                this.free10.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.free15Ani, this);
                this.free10.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.free15Ani, this);
                this.free5.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.free20Ani, this);
                this.free5.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.free20Ani, this);
            }
        }
        private removeMouseOn() {
            let isPC = NativeApi.instance.IsPC();
            if (isPC) {
                this.free20.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.free5Ani, this);
                this.free20.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.free5Ani, this);
                this.free15.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.free10Ani, this);
                this.free15.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.free10Ani, this);
                this.free10.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.free15Ani, this);
                this.free10.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.free15Ani, this);
                this.free5.removeEventListener(mouse.MouseEvent.MOUSE_OVER, this.free20Ani, this);
                this.free5.removeEventListener(mouse.MouseEvent.MOUSE_OUT, this.free20Ani, this);
            }
        }
        /**
         * 20次免费游戏鼠标动画
         */
        private free5Ani() {
            this.selectAni1.bottom = 112;
            this.selectAni1.horizontalCenter = -466;
            this.selectAni1.play("", 0);
            this.selectGroup.addChild(this.selectAni1);
            this.selectAni1.resetPosition();
        }
        /**
        * 15次免费游戏鼠标动画
        */
        private free10Ani() {
            this.selectAni1.bottom = 112;
            this.selectAni1.horizontalCenter = -165;
            this.selectAni1.play("", 0);
            this.selectGroup.addChild(this.selectAni1);
            this.selectAni1.resetPosition();
        }
        /**
        * 10次免费游戏鼠标动画
        */
        private free15Ani() {
            this.selectAni1.bottom = 112;
            this.selectAni1.horizontalCenter = 150;
            this.selectAni1.play("", 0);
            this.selectGroup.addChild(this.selectAni1);
            this.selectAni1.resetPosition();
        }
        /**
        * 5次免费游戏鼠标动画
        */
        private free20Ani() {
            this.selectAni1.bottom = 112;
            this.selectAni1.horizontalCenter = 475;
            this.selectAni1.play("", 0);
            this.selectGroup.addChild(this.selectAni1);
            this.selectAni1.resetPosition();
        }
        /**
         * 进入免费场景再开始免费游戏
         */
        private enterFreeGame() {
            this.addMouseOn();
            this.addSakuraDown();
            this.addSakuraHeadDown();
            this.isReconnect = false;
            this.touchGuangAni = DBComponent.create("touchGuangAni", "sdxl_freegame_guang");
            // this.touchGuangAni = new DBComponent("sdxl_freegame_guang");
            this.touchGuangAni.bottom = 230;
            this.touchGuangAni.horizontalCenter = 80;
            this.ygAni.touchEnabled = this.xlnAni.touchEnabled = false;
            game.SDXLUtils.scene = 3;
            this.ygImag.visible = this.xlnImag.visible = true;
            egret.Tween.get(this.xlnImag).to({ right: 0 }, 2000);
            egret.Tween.get(this.ygImag).to({ left: 70 }, 2000).call(() => {
                this.ygImag.visible = this.xlnImag.visible = false;
                this.touchGuangAni.play("sdxl_freegame_guang", 1);
                this.resizeGroup.addChild(this.sakuraFlow);
                this.ygAni.visible = this.xlnAni.visible = true;
                this.resizeGroup.addChild(this.xlnAni);
                this.resizeGroup.addChild(this.ygAni);
                this.ygAni.resetPosition();
                this.xlnAni.resetPosition();
                this.xlnAni.play("sdxl_xln", 0);
                this.ygAni.play("sdxl_yg", 0);
                this.resizeGroup.addChild(this.touchGuangAni);
                this.resizeGroup.addChild(this.sakuraFlowHead);
                egret.setTimeout(() => {
                    this.selectGroup.visible = true;
                    this.freeGroup5.visible = this.freeGroup10.visible = this.freeGroup15.visible = this.freeGroup20.visible = true;
                    this.resizeGroup.addChild(this.selectGroup);
                    // SoundManager.getInstance().playEffect("sdxl_scatin_dntg_mp3");
                    if (game.LaohuUtils.free_time_times) {
                        switch (game.LaohuUtils.free_time_times + "") {
                            case "20":
                                this.selectFreeBonus(0);
                                break;
                            case "15":
                                this.selectFreeBonus(1);
                                break;
                            case "10":
                                this.selectFreeBonus(2);
                                break;
                            case "5":
                                this.selectFreeBonus(3);
                                break;
                        }
                    }
                }, this, 1500)
            });
        }
        /**
        * @param  {} name
        * 创建big名的花瓣动画
        */
        public createsdLeftGold(name, effectname) {
            let sakura = ObjectPool.produce(name, null);
            if (!sakura) {
                sakura = new DBComponent(effectname)
                sakura.scaleY = 1;
                sakura.scaleX = 1;
            }
            sakura.callback = () => {
                game.UIUtils.removeSelf(sakura);
                ObjectPool.reclaim(name, sakura);
            }
            sakura.play("big_sakura", 1);
            sakura.x = Math.ceil(Math.random() * 1280);
            sakura.y = Math.ceil(Math.random() * 200);
            sakura.touchEnabled = false;
            sakura.touchChildren = false;
            return sakura;
        }
        /**
       * @param  {} name
       * 创建mid名的花瓣动画
       */
        public createMidSakura(name, effectname) {
            let sakura = ObjectPool.produce(name, null);
            if (!sakura) {
                sakura = new DBComponent(effectname)
                sakura.scaleY = 1;
                sakura.scaleX = 1;
            }
            sakura.callback = () => {
                game.UIUtils.removeSelf(sakura);
                ObjectPool.reclaim(name, sakura);
            }
            sakura.play("mid_sakura", 1);
            sakura.x = Math.ceil(Math.random() * 1280);
            sakura.y = Math.ceil(Math.random() * 200);
            sakura.touchEnabled = false;
            sakura.touchChildren = false;
            return sakura;
        }
        /**
       * @param  {} name
       * 创建small名的花瓣动画
       */
        public createSmallSakura(name, effectname) {
            let sakura = ObjectPool.produce(name, null);
            if (!sakura) {
                sakura = new DBComponent(effectname)
                sakura.scaleY = 1;
                sakura.scaleX = 1;
            }
            sakura.callback = () => {
                game.UIUtils.removeSelf(sakura);
                ObjectPool.reclaim(name, sakura);
            }
            sakura.play("small_sakura", 1);
            sakura.x = Math.ceil(Math.random() * 1280);
            sakura.y = Math.ceil(Math.random() * 200);
            sakura.touchEnabled = false;
            sakura.touchChildren = false;
            return sakura;
        }
        /**
        * 金币对象池金币效果
        */
        public sakuraFlow: eui.Component; //金币掉落的金币对象池资源组
        public sakuraFlowHead: eui.Component;
        public timer2: egret.Timer;
        public timer3: egret.Timer;
        /**
         * 后置花瓣飘落
         */
        private addSakuraDown() {
            this.sakuraFlow = new eui.Component();
            this.timer2 = new egret.Timer(200);
            this.timer2.addEventListener(egret.TimerEvent.TIMER, () => {
                if (this.sakuraFlow.numChildren < 15) {
                    let gold_right1 = this.createsdLeftGold("back_sakura", "sdxl_sakura");
                    this.sakuraFlow.addChild(gold_right1);
                    let gold_right2 = this.createMidSakura("back_sakura", "sdxl_sakura");
                    this.sakuraFlow.addChild(gold_right2);
                    let gold_right3 = this.createSmallSakura("back_sakura", "sdxl_sakura");
                    this.sakuraFlow.addChild(gold_right3);
                }
            }, this);
            this.timer2.start();
        }

        /**
         * 前置花瓣飘落效果
         */
        private addSakuraHeadDown() {
            this.sakuraFlowHead = new eui.Component();
            this.timer3 = new egret.Timer(200);
            this.timer3.addEventListener(egret.TimerEvent.TIMER, () => {
                if (this.sakuraFlowHead.numChildren < 15) {
                    let gold_right1 = this.createsdLeftGold("head_sakura", "sdxl_sakura");
                    this.sakuraFlowHead.addChild(gold_right1);
                    let gold_right2 = this.createMidSakura("head_sakura", "sdxl_sakura");
                    this.sakuraFlowHead.addChild(gold_right2);
                    let gold_right3 = this.createSmallSakura("head_sakura", "sdxl_sakura");
                    this.sakuraFlowHead.addChild(gold_right3);
                }
            }, this);
            this.timer3.start();
        }
        /**
         * @param  {egret.TouchEvent} e
         */
        protected onTouchTap(e: egret.TouchEvent) {
            if (game.LaohuUtils.free_time_times) {
                this.free5.touchEnabled = this.free10.touchEnabled = this.free15.touchEnabled = this.free20.touchEnabled = false;
                return;
            }
            switch (e.target) {
                case this.free20:
                    this.selectFreeBonus(0);
                    break;
                case this.free15:
                    this.selectFreeBonus(1);
                    break;
                case this.free10:
                    this.selectFreeBonus(2);
                    break;
                case this.free5:
                    this.selectFreeBonus(3);
                    break;
            }
        }
        public isSelect: boolean = false; //是否选择完免费游戏
        /**
         * 选择免费游戏次数
         * @param  {number} times
         */
        public async selectFreeBonus(times: number) {
            //防止重复点击
            if (!this.isSelect) {
                SoundManager.getInstance().playEffect("sdxl_freegame3_dntg_mp3");
                this.isSelect = true;
                game.SDXLUtils.FreeTimeMul = [];
                let data2 = { "bonusIndex": times };
                let resp: any = await Global.pomelo.request(ServerPostPath.game_slotHandler_c_selectBonusGame, data2);
                this.freeTimes = resp.freeGameTimes;
                game.LaohuUtils.freeTimes = this.freeTimes;
                game.LaohuUtils.freeWin = 0;
                this.freeTimeLabel.text = this.freeTimes + "";
                for (let i = 0; i < resp.freeGameMuls.length; i++) {
                    game.SDXLUtils.FreeTimeMul.push(resp.freeGameMuls[i]);
                }
                this.freeMul1.text = game.SDXLUtils.FreeTimeMul[0] + "";
                this.freeMul2.text = game.SDXLUtils.FreeTimeMul[1] + "";
                this.freeMul3.text = game.SDXLUtils.FreeTimeMul[2] + "";
                switch (times) {
                    case 0:
                        this.selectAni2.bottom = 125;
                        this.selectAni2.horizontalCenter = -466;
                        this.selectAni2.play("", 1);
                        this.selectGroup.addChild(this.selectAni2);
                        this.selectAni2.resetPosition();
                        this.removeMouseOn();
                        game.UIUtils.removeSelf(this.selectAni1);
                        this.selectAni2.callback = () => {
                            this.freeGroup10.visible = this.freeGroup15.visible = this.freeGroup5.visible = false;
                            egret.Tween.get(this.freeGroup20).to({ x: 507 }, 500).call(() => {
                                egret.Tween.get(this.free20).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
                                    egret.setTimeout(() => {
                                        egret.Tween.get(this.selectGroup).to({ y: 720 }, 1000).call(() => {
                                            egret.setTimeout(() => {
                                                this.startFreeGame();
                                            }, this, 800)
                                        })
                                    }, this, 800);
                                })
                            })
                        }
                        break;
                    case 1:
                        this.selectAni2.bottom = 125;
                        this.selectAni2.horizontalCenter = -166;
                        this.selectAni2.play("", 1);
                        this.selectGroup.addChild(this.selectAni2);
                        this.selectAni2.resetPosition();
                        this.removeMouseOn();
                        game.UIUtils.removeSelf(this.selectAni1);
                        this.selectAni2.callback = () => {
                            this.freeGroup20.visible = this.freeGroup10.visible = this.freeGroup5.visible = false;
                            egret.Tween.get(this.freeGroup15).to({ x: 507 }, 500).call(() => {
                                egret.Tween.get(this.free15).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
                                    egret.setTimeout(() => {
                                        egret.Tween.get(this.selectGroup).to({ y: 720 }, 1000).call(() => {
                                            egret.setTimeout(() => {
                                                this.startFreeGame();
                                            }, this, 800)
                                        })
                                    }, this, 800);
                                })
                            })
                        }
                        break;
                    case 2:
                        this.selectAni2.bottom = 125;
                        this.selectAni2.horizontalCenter = 148;
                        this.selectAni2.play("", 1);
                        this.selectGroup.addChild(this.selectAni2);
                        this.selectAni2.resetPosition();
                        this.removeMouseOn();
                        game.UIUtils.removeSelf(this.selectAni1);
                        this.selectAni2.callback = () => {
                            this.freeGroup20.visible = this.freeGroup15.visible = this.freeGroup5.visible = false;
                            egret.Tween.get(this.freeGroup10).to({ x: 507 }, 500).call(() => {
                                egret.Tween.get(this.free10).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
                                    egret.setTimeout(() => {
                                        egret.Tween.get(this.selectGroup).to({ y: 720 }, 1000).call(() => {
                                            egret.setTimeout(() => {
                                                this.startFreeGame();
                                            }, this, 800)
                                        })
                                    }, this, 800);
                                })
                            })
                        }
                        break;
                    case 3:
                        this.selectAni2.bottom = 125;
                        this.selectAni2.horizontalCenter = 475;
                        this.selectAni2.play("", 1);
                        this.selectGroup.addChild(this.selectAni2);
                        this.selectAni2.resetPosition();
                        this.removeMouseOn();
                        game.UIUtils.removeSelf(this.selectAni1);
                        this.selectAni2.callback = () => {
                            this.freeGroup20.visible = this.freeGroup15.visible = this.freeGroup10.visible = false;
                            egret.Tween.get(this.freeGroup5).to({ x: 507 }, 500).call(() => {
                                egret.Tween.get(this.free5).to({ scaleX: 1, scaleY: 1 }, 100).call(() => {
                                    egret.setTimeout(() => {
                                        egret.Tween.get(this.selectGroup).to({ y: 720 }, 1000).call(() => {
                                            egret.setTimeout(() => {
                                                this.startFreeGame();
                                            }, this, 800)
                                        })
                                    }, this, 800);
                                })
                            })
                        }
                        break;
                }
            }
        }
        /**
         * 直接开始免费游戏
         */
        private startFreeGame() {
            game.UIUtils.removeSelf(this.selectAni1);
            //是否为重连
            if (this.isReconnect) {
                this.freeGroup3.bottom = this.freeGroup3.top = 0;
                this.freeGroup3.visible = true;
                game.SDXLUtils.scene = 3;
                this.selectGroup.visible = false;
                this.ygAni.visible = this.xlnAni.visible = false;
                this.visible = true;
                this.winGroup.visible = true;
                this.freeMulGroup.visible = true;
                this.freeTimes = game.SDXLUtils.freeTimes;
                this.freeWin = game.SDXLUtils.freeWin;
                this.freeWinLabel.text = this.freeWin + "";
                game.UIUtils.removeSelf(this.sakuraFlowHead);
                this.freeGroup2.addChild(this.freeGroup3);
                this.freeMul1.text = game.SDXLUtils.FreeTimeMul[0] + "";
                this.freeMul2.text = game.SDXLUtils.FreeTimeMul[1] + "";
                this.freeMul3.text = game.SDXLUtils.FreeTimeMul[2] + "";
                if (game.SDXLUtils.freeWin) {
                    this.freeWin = game.SDXLUtils.freeWin;
                    this.freeWinLabel.text = game.SDXLUtils.freeWin + "";
                } else {
                    this.freeWin = 0;
                }
                egret.setTimeout(this.startFreeRun, this, 500);
            } else {
                game.SDXLUtils.scene = 3;
                this.selectGroup.visible = false;
                this.ygAni.visible = this.xlnAni.visible = false;
                this.ygImag.visible = this.xlnImag.visible = true;
                this.visible = true;
                this.freeTimes = game.LaohuUtils.freeTimes;
                this.freeWin = game.LaohuUtils.freeWin;
                this.freeWinLabel.text = this.freeWin + "";
                this.sakuraFlowHead.removeChildren();
                game.UIUtils.removeSelf(this.sakuraFlowHead);
                ObjectPool.cancelPool("head_sakura");

                this.freeGroup2.addChild(this.sakuraFlow);
                this.freeGroup2.addChild(this.freeGroup3);
                egret.Tween.get(this.ygImag).to({ left: -628 }, 800);
                egret.Tween.get(this.xlnImag).to({ right: -739 }, 800).call(() => {
                    egret.Tween.get(this.freeGroup3).to({ bottom: 0, top: 0 }, 1000).call(() => {
                        this.freeGroup3.visible = true;
                        this.winGroup.visible = true;
                        this.freeMulGroup.visible = true;
                        egret.setTimeout(this.startFreeRun, this, 500);
                    });
                });
            }
            game.LaohuUtils.speed = 70;
            SoundManager.getInstance().playMusic("sdxl_freespinbackground_mus_dntg_mp3");
        }
        /**
         * 移除上次转动展示动画
         */
        private removeLastAni() {
            if (this.winGold > 0) {
                game.UIUtils.removeSelf(this.commomScore);
                this.scroller.removeIconHui([[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]]);
            }
            this.scroller.stopIconDb();
        }
        private freeGameTimeOut: any; //免费游戏自动转动的timeout
        /**
         * 开始自动游戏
         */
        private isSendMessage: boolean = false; //防止重复发送免费游戏消息
        private startFreeRun() {
            if (!this.isSendMessage) {
                this.removeLastAni();
                if (this.freeTimes <= 0) {
                    this.freeTimeLabel.text = 0 + "";
                    LogUtils.logD(this.freeTimes + "   freetime")
                    this.showTotalwin();
                    return;
                }
                this.isSendMessage = true;
                this.freeTimes -= 1;
                this.freeTimeLabel.text = this.freeTimes + "";
                this.scroller.run();
                SoundManager.getInstance().playEffect("sdxl_reel_mp3", true);
                this.messageSend();
                egret.setTimeout(() => { this.isSendMessage = false }, this, 600);
            }
        }
        private showAtr: Array<Array<number>>; //结束转动展示的数组
        private bonusAtr: Array<Array<number>>;//中奖图标数组
        private winGold: number; //中奖金额 
        private freeMulIndex: number;//免费游戏中奖倍数 
        private freeWin: number = 0;//免费游戏总赢取
        /**
         * 发送c_bet消息
         */
        private async messageSend() {
            this.showAtr = [];
            this.bonusAtr = [];
            this.winGold = 0;
            let data2 = { "spinType": 1, "bet": game.SDXLUtils.bet, "multiple": game.SDXLUtils.mul, "lineCount": 243, "activityId": 0 };
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
            this.freeWin += this.winGold;
            game.SDXLUtils.ToTalMoney = resp2.own_gold;
            egret.setTimeout(() => {
                this.scroller.runResult(this.showAtr);
            }, this, 300)
        }
        /**
         * @param  {egret.Event} e
         * 转轴转动结束
         */
        private scrollerEnd(e: egret.Event) {
            let data = e.data;
            if (data.sceneIndex != 3) {
                return;
            }
            let index = e.data.index;
            switch (index) {
                case 5:
                    SoundManager.getInstance().stopEffectByName("sdxl_reel_mp3");
                    SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
                    if (this.winGold > 0) {
                        if (this.winGold < (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) * 15) egret.setTimeout(() => { game.UIUtils.removeSelf(this.commomScore); this.removeLastAni(); }, this, 1600);
                        this.freeGameTimeOut = egret.setTimeout(this.startFreeRun, this, 2000);
                    } else {
                        this.freeGameTimeOut = egret.setTimeout(this.startFreeRun, this, 1000);
                    }
                    this.addFreeBonusAni();
                    this.freeWinLabel.text = NumberFormat.handleFloatDecimal(this.freeWin) + "";
                    break;
                case 4:
                    SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
                    break;
                case 3:
                    SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
                    break;
                case 2:
                    SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
                    break;
                case 1:
                    SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
                    break;
            }
        }
        private bigWinPanel: SDXLBigWinGroup; //bigwin窗口
        /**
         * 免费游戏中奖连线
         */
        private addFreeBonusAni() {
            if (this.winGold >= (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) * 15) {
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
                            egret.clearTimeout(this.freeGameTimeOut);
                            this.freeGameTimeOut = egret.setTimeout(() => {
                                this.startFreeRun();
                            }, this, 2000);
                        });
                    }
                    this.bigWinPanel = new SDXLBigWinGroup();
                    this.bigWinPanel.showPanel();
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
                        this.freeGameTimeOut = egret.setTimeout(this.startFreeRun, this, 1710);
                        game.UIUtils.removeSelf(this.bigWinPanel);
                    })
                    this.resizeGroup.addChild(this.bigWinPanel);
                }
            } else {
                if (this.bonusAtr.length > 0 && this.winGold > 0) {
                    SoundManager.getInstance().playEffect("sdxl_win_dntg_mp3");
                    this.scroller.setIconHui();
                    this.scroller.removeIconHui(this.bonusAtr);
                    this.scroller.addBonusAni(this.bonusAtr, this.winGold);
                    this.commomScore = new eui.BitmapLabel();
                    this.commomScore.font = "sdxl_wingold_fnt";
                    let data = Number(new Big(this.winGold).mul(100));
                    this.commomScore.text = NumberFormat.handleFloatDecimal(data) + "";
                    this.commomScore.textAlign = "center";
                    this.commomScore.verticalCenter = 0;
                    this.commomScore.horizontalCenter = 0;
                    this.scroller.addChild(this.commomScore);
                }
                // }
            }
            if (this.winGold > 0) {
                if (this.freeMulIndex == 0) {
                    this.FreeMulAni.horizontalCenter = -140;
                    this.FreeMulAni.play("", 1);
                    this.FreeMulAni.callback = () => {
                        game.UIUtils.removeSelf(this.FreeMulAni);
                    }
                    this.freeMulGroup.addChild(this.FreeMulAni);
                    this.FreeMulAni.resetPosition();
                    this.freeMulGroup.addChild(this.bei_1);
                    this.freeMulGroup.addChild(this.freeMul1);
                    egret.Tween.get(this.bei_1).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                    egret.Tween.get(this.freeMul1).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                } else if (this.freeMulIndex == 1) {
                    this.FreeMulAni.horizontalCenter = 30;
                    this.FreeMulAni.play("", 1);
                    this.FreeMulAni.callback = () => {
                        game.UIUtils.removeSelf(this.FreeMulAni);
                    }
                    this.freeMulGroup.addChild(this.FreeMulAni);
                    this.FreeMulAni.resetPosition();
                    this.freeMulGroup.addChild(this.bei_2);
                    this.freeMulGroup.addChild(this.freeMul2);
                    egret.Tween.get(this.bei_2).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                    egret.Tween.get(this.freeMul2).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                } else if (this.freeMulIndex == 2) {
                    this.FreeMulAni.horizontalCenter = 160;
                    this.FreeMulAni.play("", 1);
                    this.FreeMulAni.callback = () => {
                        game.UIUtils.removeSelf(this.FreeMulAni);
                    }
                    this.freeMulGroup.addChild(this.FreeMulAni);
                    this.FreeMulAni.resetPosition();
                    this.freeMulGroup.addChild(this.bei_3);
                    this.freeMulGroup.addChild(this.freeMul3);
                    egret.Tween.get(this.bei_3).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                    egret.Tween.get(this.freeMul3).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 300);
                }
            }

        }
        private winPanel: eui.Group;
        private maskRect: eui.Rect;
        private winNum: eui.BitmapLabel;

        /**
         * 免费游戏结束进入普通游戏
         */
        private showTotalwin() {
            //场景初始化
            this.freeBg2.visible = this.scroller.visible = true;
            game.UIUtils.removeSelf(this.xlnAni); game.UIUtils.removeSelf(this.ygAni);
            this.winPanel.visible = true;
            this.addMouseOn();
            this.freeGroup3.visible = false;
            this.freeGroup3.bottom = this.freeGroup3.top = 720;
            this.selectGroup.y = 358;
            this.isSendMessage = false
            this.ygImag.left = -628;
            this.xlnImag.right = -739;
            this.free5.scaleX = this.free5.scaleY = this.free10.scaleX = this.free10.scaleY = this.free15.scaleX = this.free15.scaleY = this.free20.scaleX = this.free20.scaleY = 1;
            this.freeGroup5.x = 984;
            this.freeGroup10.x = 654;
            this.freeGroup15.x = 350;
            this.freeGroup20.x = 42;
            this.isSelect = false;
            this.free5.touchEnabled = this.free10.touchEnabled = this.free15.touchEnabled = this.free20.touchEnabled = true;
            //创建bigwin窗口
            SoundManager.getInstance().playEffect("sdxl_scatwin_dntg_mp3");
            //创建窗口遮罩
            this.winNum.text = NumberFormat.handleFloatDecimal(this.freeWin) + "";
            game.LaohuUtils.freeWin = this.freeWin;
            //发送退出免费游戏消息
            egret.setTimeout(() => {
                if (!this.isReconnect) {
                    this.timer2.stop();
                    this.timer3.stop();
                    this.sakuraFlow.removeChildren();
                }
                this.isReconnect = true;
                this.freeWin = 0;
                this.winPanel.visible = false;
                game.UIUtils.removeSelf(this.sakuraFlow);
                ObjectPool.cancelPool("back_sakura");
                EventManager.instance.dispatch(EventNotify.SDXL_QUIT_FREE_GAME);
            }, this, 2500)
        }
    }
}