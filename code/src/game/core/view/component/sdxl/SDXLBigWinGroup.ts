/*
 * @Author: wangtao 
 * @Date: 2019-04-19 15:57:39 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 15:01:09
 * @Description: 
 */
// TypeScript file
module sdxl {
    export class SDXLBigWinGroup extends game.BaseComponent {
        public resizeGroup: eui.Group;
        public fillMask: eui.Rect;
        public bigwinIma: eui.Image;
        public bigwinGold: eui.BitmapLabel;
        private timer: egret.Timer;
        public testShowNum: number = 0;

        public diFire: DBComponent; //bigwin底部火光特效
        public score: number = 0; //中奖分数 
        public megaWinAni: DBComponent; //megawin字上特效
        public superWinAni: DBComponent; //superwin字上特效
        // public sakura: DBComponent; //字体变化时樱花特效
        public goldGuang: DBComponent; //金币底下光

        public constructor() {
            super();
            this.skinName = new SDXLBigWinGroupSkin();
        }
        public onAdded() {
            super.onAdded();
        }
        public onRemoved() {
            super.onRemoved();
        }

        public createChildren() {
            super.createChildren();

        }
        private isPlayingMusic: boolean = false; //是否在播放背景音乐
        private showResultTimeout: any;
        /**
         * @param  {number} score
         * @param  {Function} callback?
         * 展示分数跳动
         */
        public showScore(score: number, callback?: Function) {
            this.fillMask.fillAlpha = 0;
            this.diFire = DBComponent.create("diFire", "huoguang");
            this.megaWinAni = DBComponent.create("megaWinAni", "sdxl_megawinani");
            this.superWinAni = DBComponent.create("superWinAni", "sdxl_superwinani");
            this.goldGuang = DBComponent.create("goldGuang", "sdxl_bigwin_diguang");
            this.goldGuang.touchEnabled = false;
            game.SDXLUtils.sakura.touchEnabled = false;
            this.goldGuang.horizontalCenter = 680;
            this.goldGuang.bottom = -75;

            this.megaWinAni.touchEnabled = false;
            this.bigwinIma.source = RES.getRes("sdxl_bigwin_png");
            this.score = score;
            this.testShowNum = 0;
            this.timer = new egret.Timer(20);
            this.fillMask.touchEnabled = false;
            this.bigwinGold.textAlign = "center";

            let index1, index2, index3: number = 0; //bigwin,megawin,superwin 累加值
            if (score) {
                if (score >= game.SDXLUtils.bet * game.SDXLUtils.mul * 50 * 15 && score < game.SDXLUtils.bet * game.SDXLUtils.mul * 50 * 30) {
                    index1 = score / 200;
                } else if (score >= (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) * 30 && score < (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) * 50) {
                    index1 = 30 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) / 200;
                    index2 = (score - 30 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) / 350;
                } else if (score >= (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) * 50) {
                    index1 = 30 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) / 200;
                    index2 = 50 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) / 350;
                    index3 = (score - 50 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) / 350;
                }
            }
            this.timer.start();
            this.showResultTimeout = egret.setTimeout(() => {
                this.fillMask.touchEnabled = true;
                this.fillMask.fillAlpha = 0.7;
                this.bigwinIma.anchorOffsetX = this.bigwinIma.width / 2;
                this.bigwinIma.anchorOffsetY = this.bigwinIma.height / 2;
                this.diFire.play("fire_small", 0);
                this.diFire.horizontalCenter = 640;
                this.diFire.bottom = -365;
                this.diFire.scaleX = 2;
                this.diFire.scaleY = 2;
                this.diFire.touchEnabled = false;
                this.addGoldDown();
                this.goldDown.visible = true;
                this.goldDown.horizontalCenter = 0;
                this.goldGuang.play("", 0);
                this.resizeGroup.addChild(this.goldGuang);
                this.resizeGroup.addChild(this.diFire);
                this.resizeGroup.addChild(this.goldDown);
                this.resizeGroup.addChild(this.bigwinGold);
                this.resizeGroup.addChild(this.bigwinIma);
                this.bigwinIma.alpha = 1;
                this.bigwinGold.alpha = 1;
                egret.Tween.get(this.bigwinGold).to({ scaleX: 1, scaleY: 1 }, 200).call(() => {
                    game.SDXLUtils.sakura.horizontalCenter = 0;
                    game.SDXLUtils.sakura.bottom = 200;
                    game.SDXLUtils.sakura.play("", 1);
                    this.resizeGroup.addChild(game.SDXLUtils.sakura);                                       
                    SoundManager.getInstance().playEffect("sdxl_winchangemp3_mp3");
                    game.SDXLUtils.sakura.resetPosition();
                    SoundManager.getInstance().playEffect("sdxl_bigwincombo_mp3");
                    SoundManager.getInstance().pauseMusic();
                });
                egret.Tween.get(this.bigwinIma).to({ scaleX: 1, scaleY: 1, y: this.bigwinIma.y }, 200)
                    .to({ scaleX: 0.8, scaleY: 0.8 }, 200)
                    .to({ scaleX: 1.1, scaleY: 1.1 }, 150)
                    .to({ scaleX: 1, scaleY: 1 }, 150);
            }, this, 1200);
            let is_big, is_mega, is_super: boolean = false;
            this.timer.addEventListener(egret.TimerEvent.TIMER, () => {
                if (this.testShowNum < (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) * 30 && this.testShowNum < score) {
                    this.testShowNum += index1;
                    //判断是否添加了动画
                    if (!is_big) {
                        this.bigwinIma.source = RES.getRes("sdxl_bigwin_png")

                    }
                    is_big = true;
                    if (this.testShowNum) {
                        let data = Number(new Big(this.testShowNum).mul(100));
                        this.bigwinGold.text = NumberFormat.handleFloatDecimal(data, 0) + "";
                    }
                }
                else if (this.testShowNum < 50 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) && this.testShowNum >= 30 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) && this.testShowNum < score) {
                    this.testShowNum += index2;
                    //判断是否添加了动画
                    if (!is_mega) {
                        game.SDXLUtils.sakura.horizontalCenter = 0;
                        game.SDXLUtils.sakura.bottom = 200;
                        game.SDXLUtils.sakura.play("", 1);
                        this.resizeGroup.addChild(game.SDXLUtils.sakura);
                        game.SDXLUtils.sakura.resetPosition();
                        SoundManager.getInstance().playEffect("sdxl_winchangemp3_mp3");
                        this.bigwinIma.source = RES.getRes("sdxl_megawin_png");
                        egret.Tween.get(this.bigwinIma).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50)
                        this.resizeGroup.addChild(this.bigwinGold);
                        this.resizeGroup.addChild(this.bigwinIma);
                        this.megaWinAni.horizontalCenter = 0;
                        this.megaWinAni.bottom = 470;
                        this.megaWinAni.play("", 0);
                        this.resizeGroup.addChild(this.megaWinAni);
                        this.megaWinAni.resetPosition();
                    }
                    is_mega = true;
                    if (this.testShowNum) {
                        let data = Number(new Big(this.testShowNum).mul(100));
                        this.bigwinGold.text = NumberFormat.handleFloatDecimal(data, 0) + "";
                    }
                } else if (this.testShowNum >= 50 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) && this.testShowNum < score) {
                    this.testShowNum += index3;
                    //判断是否添加了动画
                    if (!is_super) {
                        game.SDXLUtils.sakura.horizontalCenter = 0;
                        game.SDXLUtils.sakura.bottom = 200;
                        game.SDXLUtils.sakura.play("", 1);
                        this.resizeGroup.addChild(game.SDXLUtils.sakura);
                        SoundManager.getInstance().playEffect("sdxl_winchangemp3_mp3");
                        game.SDXLUtils.sakura.resetPosition();
                        game.UIUtils.removeSelf(this.megaWinAni);
                        this.bigwinIma.source = RES.getRes("sdxl_superwin_png");
                        this.resizeGroup.addChild(this.bigwinGold);
                        this.resizeGroup.addChild(this.bigwinIma);
                        this.superWinAni.horizontalCenter = 0;
                        this.superWinAni.bottom = 458;
                        this.superWinAni.play("", 0);
                        this.resizeGroup.addChild(this.superWinAni);
                        this.superWinAni.resetPosition();
                    }
                    is_super = true;
                    if (this.testShowNum) {
                        let data = Number(new Big(this.testShowNum).mul(100));
                        this.bigwinGold.text = NumberFormat.handleFloatDecimal(data, 0) + "";
                    }
                } else {
                    //满足条件timer结束，调用callback方法
                    SoundManager.getInstance().stopEffectByName("sdxl_bigwincombo_mp3");
                    SoundManager.getInstance().playEffect("sdxl_bigwincomboend_mp3");
                    this.timer.stop();
                    this.goldDown.visible = false;
                    game.UIUtils.removeSelf(this.goldGuang);
                    let data = Number(new Big(score).mul(100));
                    this.bigwinGold.text = NumberFormat.handleFloatDecimal(data, 0) + "";
                    this.removeThisPanel(callback);
                    this.isTouched = true;
                    //刚好满足bet的倍数时补加特效
                    if (score == 30 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) {
                        egret.Tween.get(this.bigwinIma).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
                            this.bigwinIma.source = RES.getRes("sdxl_megawin_png");
                        })

                    }
                    if (score == 50 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) {
                        egret.Tween.get(this.bigwinIma).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
                            this.bigwinIma.source = RES.getRes("sdxl_superwin_png");
                        })

                    }
                    if (score >= 30 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) {
                    }
                    if (score >= 50 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) {
                        this.bigwinIma.source = RES.getRes("sdxl_superwin_png");
                    }
                }
            }, this)
        }

        /**
		 * 金币对象池金币效果
		 */
        public goldDown: eui.Group; //金币掉落的金币对象池资源组
        private timer2: egret.Timer;
        private addGoldDown() {
            this.timer2 = new egret.Timer(300);
            this.timer2.addEventListener(egret.TimerEvent.TIMER, () => {
                if (this.goldDown.numChildren < 35) {
                    let gold_right1 = game.GoldDownPanel.createsdLeftGold("sdxl_gold_right1");
                    this.goldDown.addChild(gold_right1);
                    let gold_right2 = game.GoldDownPanel.createsdLeftGold("sdxl_gold_right2");
                    this.goldDown.addChild(gold_right2);
                    let gold_left1 = game.GoldDownPanel.createsdxlGold("sdxl_gold_left1");
                    this.goldDown.addChild(gold_left1);
                    let gold_left2 = game.GoldDownPanel.createsdxlGold("sdxl_gold_left2");
                    this.goldDown.addChild(gold_left2);
                }
            }, this);
            this.timer2.start();
        }
        private isTouched: boolean = false;
        /**
         * 点击结束数字跳动
         * @param  {Function} callback?
         */
        public stopShowBigWin(callback?: Function) {
            //禁止重复点击
            if (!this.isTouched) {
                this.isTouched = true;
                egret.clearTimeout(this.showResultTimeout);
                game.UIUtils.removeSelf(this.diFire);
                game.UIUtils.removeSelf(this.goldGuang);
                SoundManager.getInstance().stopEffectByName("sdxl_bigwincombo_mp3");
                SoundManager.getInstance().playEffect("sdxl_bigwincomboend_mp3");
                game.UIUtils.removeSelf(this.megaWinAni);
                game.UIUtils.removeSelf(this.superWinAni);
                this.fillMask.touchEnabled = true;
                this.fillMask.fillAlpha = 0.7;
                this.bigwinIma.alpha = this.bigwinGold.alpha = 1;
                this.diFire.play("fire_small", 0);
                this.diFire.horizontalCenter = 640;
                this.diFire.bottom = -365;
                this.diFire.scaleX = 2;
                this.diFire.scaleY = 2;
                this.diFire.touchEnabled = false;
                this.goldGuang.play("", 0);
                this.resizeGroup.addChild(this.diFire);
                this.resizeGroup.addChild(this.bigwinGold);
                this.resizeGroup.addChild(this.bigwinIma);
                SoundManager.getInstance().playEffect("sdxl_bigwincomboend_mp3");
                if (this.score == 30 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) {
                    egret.Tween.get(this.bigwinIma).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
                        this.bigwinIma.source = RES.getRes("sdxl_megawin_png");
                    })
                }
                if (this.score == 50 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) {
                    egret.Tween.get(this.bigwinIma).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
                        this.bigwinIma.source = RES.getRes("sdxl_superwin_png");
                    })
                }
                this.timer.stop();
                this.goldDown.visible = false;
                ObjectPool.cancelPool("sdxl_gold_right1");
                ObjectPool.cancelPool("sdxl_gold_right2");
                ObjectPool.cancelPool("sdxl_gold_left1");
                ObjectPool.cancelPool("sdxl_gold_left2");
                game.UIUtils.removeSelf(this.goldGuang);
                SoundManager.getInstance().stopEffectByName("sdxl_bigwincombo_mp3");
                this.removeThisPanel(callback);

                let data = Number(new Big(this.score).mul(100));
                this.bigwinGold.text = NumberFormat.handleFloatDecimal(data, 0) + "";

                if (this.score >= 30 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) {
                    this.bigwinIma.source = RES.getRes("sdxl_megawin_png");
                }
                if (this.score >= 50 * (game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) {
                    this.bigwinIma.source = RES.getRes("sdxl_superwin_png");
                    game.UIUtils.removeSelf(this.megaWinAni);
                }
            }
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
            this.goldDown.removeChildren();
            this.isTouched = true;
            this.timer2.stop();
            egret.setTimeout(() => {
                game.UIUtils.removeSelf(this.diFire);
                game.UIUtils.removeSelf(this.megaWinAni);
                game.UIUtils.removeSelf(this.superWinAni);
                //恢复音效
                SoundManager.getInstance().remuseMusic();
                SoundManager.getInstance().stopEffectByName("sdxl_bigwincomboend_mp3");
                SoundManager.getInstance().stopEffectByName("sdxl_bigwincombo_mp3");
                //恢复背景音乐
                // if (this.isPlayingMusic) {
                // 	game.AudioManager.getInstance().isPlayMusic = true;
                // }
                this.fillMask.fillAlpha = 0;
                this.bigwinIma.alpha = this.bigwinGold.alpha = 0;
                this.bigwinGold.text = "0";
                this.testShowNum = 0;
                callback && callback();
                this.removeChildren();
                if (this.parent) {
                    this.parent.removeChild(this);
                }
            }, this, 4000)
        }

        public showPanel() {
            this.visible = true;
        }
    }
}