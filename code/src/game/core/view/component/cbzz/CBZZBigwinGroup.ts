// TypeScript file
module cbzz {
    export class CBZZBigwinGroup extends game.BaseComponent {
        public resizeGroup: eui.Group;
        public maskRect: eui.Rect;
        public winImag: eui.Image;
        public winNum: eui.BitmapLabel;
        public bigwinPanel: eui.Group;
        public bgAni: DBComponent;
        public effectGroup: eui.Group;
        public titleChangeAni: DBComponent;
        public megawinAni: DBComponent;
        public superwinAni: DBComponent;

        public constructor() {
            super();
            this.skinName = "CBZZBigwinSkin";
        }
        public createChildrean() {
            super.createChildren();

        }
        public onAdded() {
            super.onAdded();
        }
        public onRemoved() {
            super.onRemoved();
        }

        private score: number = 0;
        private timer1: egret.Timer;
        private showResultTimeOut: any;
        private testscore: number = 0;
        private isTouched: boolean = false;
        private isPlayingMusic: boolean = false; //是否在播放背景音乐
        /**
         * 分数跳动方法
         * @param  {number} num
         * @param  {Function} callback?
         */
        public showScore(num: number, callback?: Function) {
            this.bgAni = DBComponent.create("cb_bigwinbgani", "cbzz_bigwintitle");
            this.titleChangeAni = DBComponent.create("cb_titleani", "dntg_bigwin_guang");
            this.megawinAni = DBComponent.create("cb_megawin", "cbzz_megawinani");
            this.superwinAni = DBComponent.create("cb_superwin", "cbzz_superwwinani");
            this.maskRect.fillAlpha = 0;
            this.score = num;
            this.timer1 = new egret.Timer(20);
            this.winNum.scaleX = this.winNum.scaleY = 1;

            this.superwinAni.play("", 0);
            this.superwinAni.horizontalCenter = 0;
            this.superwinAni.bottom = 445;
            let index1, index2, index3, time: number = 0; //bigwin,megawin,superwin 累加值
            if (num) {
                if (num >= game.CBZZUtils.bet * game.CBZZUtils.mul * 50 * 15 && num < game.CBZZUtils.bet * game.CBZZUtils.mul * 50 * 30) {
                    index1 = num / 200;
                    time = 8000;
                } else if (num >= (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) * 30 && num < (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) * 50) {
                    index1 = 30 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) / 200;
                    index2 = (num - 30 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) / 500;
                    time = 18000;
                } else if (num >= (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) * 50) {
                    index1 = 30 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) / 200;
                    index2 = 50 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) / 500;
                    index3 = (num - 50 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) / 500;
                    time = 28000;
                }
            }
            this.timer1.start();
            this.showResultTimeOut = egret.setTimeout(() => {
                this.winImag.alpha = this.winNum.alpha = 1;
                egret.Tween.get(this.winNum).to({ scaleX: 1.4, scaleY: 1.4 }, time);
                SoundManager.getInstance().playEffect("cbzz_bigwincombo_mp3");
                SoundManager.getInstance().playEffect("cbzz_winchangemp3_mp3");
                // SoundManager.getInstance().playEffect("cbzz_bigwin_mus1_mp3",true);
                this.effectGroup.visible = true;
                this.bgAni.play("cbzz_bigwintitle1", 0);
                this.bgAni.horizontalCenter = 0;
                this.bgAni.bottom = -200;
                this.effectGroup.addChild(this.bgAni);
                this.bgAni.resetPosition();

                this.titleChangeAni.play("dntg_bigwin_guang", 1);
                this.titleChangeAni.horizontalCenter = 0;
                this.titleChangeAni.bottom = 300;

                this.maskRect.fillAlpha = 0.7;
                this.addGoldDown();
                this.bigwinPanel.visible = true;
                this.bigwinPanel.horizontalCenter = 0;
                this.winImag.source = RES.getRes("cbzz_bigwin_png");
                game.CBZZUtils.bigwinAni1.play("", 0);
                game.CBZZUtils.bigwinAni1.horizontalCenter = 0;
                game.CBZZUtils.bigwinAni1.bottom = -350;
                this.resizeGroup.addChild(game.CBZZUtils.bigwinAni1);
                this.resizeGroup.addChild(this.bigwinPanel);
                this.resizeGroup.addChild(this.winNum);
                this.resizeGroup.addChild(this.winImag);
                this.resizeGroup.addChild(this.titleChangeAni);
                this.titleChangeAni.resetPosition();
                game.CBZZUtils.bigwinAni1.resetPosition();
                game.CBZZUtils.bigwinAni1.touchEnabled = false;
                SoundManager.getInstance().pauseMusic();
                egret.Tween.get(this.winImag).to({ scaleX: 1.1, scaleY: 1.1 }, 200).to({ scaleX: 0.9, scaleY: 0.9 }, 200).to({ scaleX: 1, scaleY: 1 }, 200).call(() => {
                })
            }, this, 1200);

            let is_big, is_mega, is_super: boolean = false;
            this.timer1.addEventListener(egret.TimerEvent.TIMER, () => {
                if (this.testscore < (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) * 30 && this.testscore < num) {
                    this.testscore += index1;
                    //判断是否添加了动画
                    if (!is_big) {
                        this.winImag.source = RES.getRes("cbzz_bigwin_png")
                    }
                    is_big = true;
                    if (this.testscore) {
                        let data = Number(new Big(this.testscore).mul(100));
                        this.winNum.text = NumberFormat.handleFloatDecimal(data, 0) + "";
                    }
                }
                else if (this.testscore < 50 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) && this.testscore >= 30 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) && this.testscore < num) {
                    this.testscore += index2;
                    //判断是否添加了动画
                    if (!is_mega) {
                        this.titleChangeAni.play("dntg_bigwin_guang", 1);
                        this.titleChangeAni.horizontalCenter = 0;
                        this.titleChangeAni.bottom = 300;
                        this.resizeGroup.addChild(this.titleChangeAni);
                        this.titleChangeAni.resetPosition();
                        this.megawinAni.play("", 0);
                        this.megawinAni.horizontalCenter = 0;
                        this.megawinAni.bottom = 455;
                        this.resizeGroup.addChild(this.megawinAni);
                        this.megawinAni.resetPosition();
                        this.winImag.source = RES.getRes("cbzz_megawin_png");
                        SoundManager.getInstance().playEffect("cbzz_winchangemp3_mp3");
                        egret.Tween.get(this.winImag).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50);
                    }
                    is_mega = true;
                    if (this.testscore) {
                        let data = Number(new Big(this.testscore).mul(100));
                        this.winNum.text = NumberFormat.handleFloatDecimal(data, 0) + "";
                    }
                } else if (this.testscore >= 50 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) && this.testscore < num) {
                    this.testscore += index3;
                    //判断是否添加了动画
                    if (!is_super) {
                        game.UIUtils.removeSelf(this.megawinAni);
                        this.titleChangeAni.play("dntg_bigwin_guang", 1);
                        this.titleChangeAni.horizontalCenter = 0;
                        this.titleChangeAni.bottom = 300;
                        this.resizeGroup.addChild(this.titleChangeAni);
                        this.titleChangeAni.resetPosition();

                        SoundManager.getInstance().playEffect("cbzz_winchangemp3_mp3");
                        this.winImag.source = RES.getRes("cbzz_superwin_png");
                        egret.Tween.get(this.winImag).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
                            this.resizeGroup.addChild(this.superwinAni);
                            this.superwinAni.resetPosition();
                        })
                    }
                    is_super = true;
                    if (this.testscore) {
                        let data = Number(new Big(this.testscore).mul(100));
                        this.winNum.text = NumberFormat.handleFloatDecimal(data, 0) + "";
                    }
                } else {
                    //满足条件timer结束，调用callback方法
                    SoundManager.getInstance().stopEffectByName("cbzz_bigwincombo_mp3");
                    SoundManager.getInstance().playEffect("cbzz_bigwincomboend_mp3");
                    // SoundManager.getInstance().stopEffectByName("cbzz_bigwin_mus1_mp3");
                    this.timer1.stop();
                    this.bgAni.play("cbzz_bigwintitle2", 1);
                    this.bgAni.horizontalCenter = 0;
                    this.bgAni.bottom = -200;
                    this.effectGroup.addChild(this.bgAni);
                    this.bgAni.resetPosition();
                    egret.Tween.removeTweens(this.winNum);
                    egret.Tween.get(this.winNum).to({ scaleX: 1.3, scaleY: 1.3 }, 100).to({ scaleX: 1.5, scaleY: 1.5 }, 100).to({ scaleX: 1.4, scaleY: 1.4 }, 80);
                    this.bigwinPanel.visible = false;
                    game.UIUtils.removeSelf(game.CBZZUtils.bigwinAni1);
                    let data = Number(new Big(num).mul(100));
                    this.winNum.text = NumberFormat.handleFloatDecimal(data, 0) + "";
                    this.removeThisPanel(callback);
                    this.isTouched = true;
                    //刚好满足bet的倍数时补加特效
                    if (num == 30 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) {
                        egret.Tween.get(this.winImag).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
                            this.winImag.source = RES.getRes("cbzz_megawin_png");
                        })

                    }
                    if (num == 50 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) {
                        egret.Tween.get(this.winImag).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
                            this.winImag.source = RES.getRes("cbzz_superwin_png");
                        })

                    }
                    if (num >= 30 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) {
                        this.winImag.source = RES.getRes("cbzz_megawin_png");
                    }
                    if (num >= 50 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) {
                        this.winImag.source = RES.getRes("cbzz_superwin_png");
                    }
                }
            }, this);
        }

        /**
        * 点击结束数字跳动
        * @param  {Function} callback?
        */
        public stopShowBigWin(callback?: Function) {
            //禁止重复点击
            if (!this.isTouched) {
                this.isTouched = true;
                SoundManager.getInstance().stopEffectByName("cbzz_bigwincombo_mp3");
                SoundManager.getInstance().playEffect("cbzz_bigwincomboend_mp3");
                egret.clearTimeout(this.showResultTimeOut);
                game.UIUtils.removeSelf(game.CBZZUtils.bigwinAni1);
                this.maskRect.fillAlpha = 0.7;
                this.winImag.alpha = this.winNum.alpha = 1;
                game.UIUtils.removeSelf(this.megawinAni);
                game.UIUtils.removeSelf(this.superwinAni);
                if (this.score == 30 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) {
                    egret.Tween.get(this.winImag).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
                        this.winImag.source = RES.getRes("cbzz_megawin_png");
                    })
                }
                if (this.score == 50 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) {
                    egret.Tween.get(this.winImag).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
                        this.winImag.source = RES.getRes("cbzz_superwin_png");
                    })
                }
                this.timer1.stop();
                egret.Tween.removeTweens(this.winNum);
                // SoundManager.getInstance().stopEffectByName("cbzz_bigwin_mus1_mp3");
                this.bgAni.play("cbzz_bigwintitle2", 1);
                this.bgAni.horizontalCenter = 0;
                this.bgAni.bottom = -200
                this.effectGroup.addChild(this.bgAni);
                this.bgAni.resetPosition();
                egret.Tween.get(this.winNum).to({ scaleX: 1.3, scaleY: 1.3 }, 100).to({ scaleX: 1.5, scaleY: 1.5 }, 100).to({ scaleX: 1.4, scaleY: 1.4 }, 80);
                this.bigwinPanel.visible = false;
                this.removeThisPanel(callback);

                let data = Number(new Big(this.score).mul(100));
                this.winNum.text = NumberFormat.handleFloatDecimal(data, 0) + "";

                if (this.score >= 30 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) {
                    // this.resizeGroup.addChild(this.megawinAni);
                    // this.megawinAni.resetPosition();
                    this.winImag.source = RES.getRes("cbzz_megawin_png");
                }
                if (this.score >= 50 * (game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) {
                    // game.UIUtils.removeSelf(this.megawinAni);
                    // this.resizeGroup.addChild(this.superwinAni);
                    // this.superwinAni.resetPosition();
                    this.winImag.source = RES.getRes("cbzz_superwin_png");
                }
            }
        }

        /**
        * 金币对象池金币效果
        */
        private timer2: egret.Timer;
        private addGoldDown() {
            this.timer2 = new egret.Timer(300);
            this.timer2.addEventListener(egret.TimerEvent.TIMER, () => {
                if (this.bigwinPanel.numChildren < 35) {
                    let gold_right1 = game.GoldDownPanel.createsdLeftGold("sdxl_gold_right1");
                    this.bigwinPanel.addChild(gold_right1);
                    let gold_right2 = game.GoldDownPanel.createsdLeftGold("sdxl_gold_right2");
                    this.bigwinPanel.addChild(gold_right2);
                    let gold_left1 = game.GoldDownPanel.createsdxlGold("sdxl_gold_left1");
                    this.bigwinPanel.addChild(gold_left1);
                    let gold_left2 = game.GoldDownPanel.createsdxlGold("sdxl_gold_left2");
                    this.bigwinPanel.addChild(gold_left2);
                }
            }, this);
            this.timer2.start();
        }

        /**
        * 移除bigwin窗口
        * @param  {Function} callback?
        */
        public removeThisPanel(callback?: Function) {
            ObjectPool.cancelPool("sdxl_gold_right1");
            ObjectPool.cancelPool("sdxl_gold_right2");
            ObjectPool.cancelPool("sdxl_gold_left1");
            ObjectPool.cancelPool("sdxl_gold_left2");
            this.bigwinPanel.removeChildren();
            this.timer2.stop();
            egret.setTimeout(() => {
                SoundManager.getInstance().remuseMusic();
                game.UIUtils.removeSelf(this.megawinAni);
                game.UIUtils.removeSelf(this.superwinAni);
                SoundManager.getInstance().stopEffectByName("cbzz_bigwincombo_mp3");
                SoundManager.getInstance().stopEffectByName("cbzz_bigwincomboend_mp3");
                game.UIUtils.removeSelf(this.bgAni);
                game.UIUtils.removeSelf(this.titleChangeAni);
                //恢复背景音乐      
                this.maskRect.fillAlpha = 0;
                this.winImag.alpha = this.winNum.alpha = 0;
                this.winNum.text = "0";
                this.testscore = 0;
                callback && callback();
                this.removeChildren();
                if (this.parent) {
                    this.parent.removeChild(this);
                }
            }, this, 5000)
        }
    }
}