// TypeScript file
module game {
    export class LaohuAutoGame extends BaseComponent implements egret.IEventDispatcher {
        private close_btn: eui.Image;
        private auto_5: eui.Button;
        private auto_10: eui.Button;
        private auto_25: eui.Button;
        private auto_50: eui.Button;
        private auto_100: eui.Button;
        private start_auto_play: eui.Button;
        private oneMax: eui.HSlider;
        private totalAdd: eui.HSlider;
        private totalWin: eui.HSlider;
        private totalWin_num: eui.Label;
        private max_num: eui.Label;
        private totalAdd_num: eui.Label;
        public hstiao: egret.Bitmap;
        private select_kuang: eui.Image;
        private select_ima: eui.Image;
        private auto_wuqiong: eui.Button;
        private free_times_20: eui.Button;
        private free_times_15: eui.Button;
        private free_times_10: eui.Button;
        private free_times_5: eui.Button;
        public constructor() {
            super();
            this.skinName = new FreeGameSetSkin();
            this.init();
        }
        public init() {
            var colorMatrix = [
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.start_auto_play.filters = [colorFlilter];
            this.start_auto_play.touchEnabled = false;
            this.oneMax.maximum = parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 *540 + "");
            this.oneMax.minimum = 0;
            this.totalAdd.maximum = LaohuUtils.ToTalMoney;
            this.totalAdd.minimum = (LaohuUtils.bet * 50) * LaohuUtils.mul;
            this.totalWin.maximum = parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 *540 + "");
            this.totalWin.minimum = 0;
            this.totalAdd_num.text = 0 + "";
            this.max_num.text = 0 + "";
            this.totalWin_num.text = 0 + "";
            LaohuUtils.oneMax = 0;
            LaohuUtils.totalAdd = 0;
            LaohuUtils.totalWin = 0;
            this.oneMax.addEventListener(eui.UIEvent.CHANGE, this.changeHandler1, this);
            this.totalAdd.addEventListener(eui.UIEvent.CHANGE, this.changeHandler2, this);
            this.totalWin.addEventListener(eui.UIEvent.CHANGE, this.changeHandler3, this);
            this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close_autoGamePanel, this);
            this.auto_5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.autoTime_5, this);
            this.auto_10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.autoTime_10, this);
            this.auto_25.addEventListener(egret.TouchEvent.TOUCH_TAP, this.autoTime_25, this);
            this.auto_50.addEventListener(egret.TouchEvent.TOUCH_TAP, this.autoTime_50, this);
            this.auto_100.addEventListener(egret.TouchEvent.TOUCH_TAP, this.autoTime_100, this);
            this.auto_wuqiong.addEventListener(egret.TouchEvent.TOUCH_TAP, this.autoTimeWuqiong, this);
            this.start_auto_play.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startPlay, this);
            this.select_kuang.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectFreeStop, this);
            this.free_times_20.addEventListener(egret.TouchEvent.TOUCH_TAP, this.free_20, this);
            this.free_times_15.addEventListener(egret.TouchEvent.TOUCH_TAP, this.free_15, this);
            this.free_times_10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.free_10, this);
            this.free_times_5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.free_5, this);
        }

        private changeHandler1(evt: eui.UIEvent) {
            if (evt.target.value) {
                LaohuUtils.oneMax = evt.target.value;
                this.max_num.text = NumberFormat.handleFloatDecimal(evt.target.value) + "";
            } else {
                this.max_num.text = 0 + "";
            }
        }
        private changeHandler2(evt: eui.UIEvent) {
            if (evt.target.value) {
                LaohuUtils.totalAdd = evt.target.value;
                this.totalAdd_num.text = NumberFormat.handleFloatDecimal(evt.target.value) + "";
            } else {
                this.totalAdd_num.text = 0 + "";
            }
        }
        private changeHandler3(evt: eui.UIEvent) {
            if (evt.target.value) {
                LaohuUtils.totalWin = evt.target.value;
                this.totalWin_num.text = NumberFormat.handleFloatDecimal(evt.target.value) + "";
            } else {
                this.totalWin_num.text = 0 + "";
            }
        }

        public close_autoGamePanel() {
            game.LaohuUtils.free_time_times = 0;
            game.LaohuUtils.isAutoGame = false;
            game.LaohuUtils.totalAdd = 0;
            game.LaohuUtils.oneMax = 0;
            game.LaohuUtils.totalWin = 0;
            game.LaohuUtils.auto_times = 0;
            SoundManager.getInstance().playEffect("button_dntg_mp3");
            AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
            // EventManager.instance.dispatch(EventNotify.AUTO_GAME);
        }
        private autoTime_5() {
            var colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.start_auto_play.filters = [colorFlilter];
            this.start_auto_play.touchEnabled = true;
            this.auto_5.currentState = "down";
            this.auto_10.currentState = this.auto_25.currentState = this.auto_50.currentState = this.auto_100.currentState = this.auto_wuqiong.currentState = "up";
            LaohuUtils.auto_times = 5;
            LaohuUtils.auto_time = 5;
        }
        private autoTime_10() {
            var colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.start_auto_play.filters = [colorFlilter];
            this.start_auto_play.touchEnabled = true;
            this.auto_10.currentState = "down";
            this.auto_5.currentState = this.auto_25.currentState = this.auto_50.currentState = this.auto_100.currentState = this.auto_wuqiong.currentState = "up";
            LaohuUtils.auto_times = 10;
            LaohuUtils.auto_time = 10;
        }
        private autoTime_25() {
            var colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.start_auto_play.filters = [colorFlilter];
            this.start_auto_play.touchEnabled = true;
            this.auto_25.currentState = "down";
            this.auto_10.currentState = this.auto_5.currentState = this.auto_50.currentState = this.auto_100.currentState = this.auto_wuqiong.currentState = "up";
            LaohuUtils.auto_times = 25;
            LaohuUtils.auto_time = 25;
        }
        private autoTime_50() {
            var colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.start_auto_play.filters = [colorFlilter];
            this.start_auto_play.touchEnabled = true;
            this.auto_50.currentState = "down";
            this.auto_10.currentState = this.auto_25.currentState = this.auto_5.currentState = this.auto_100.currentState = this.auto_wuqiong.currentState = "up";
            LaohuUtils.auto_times = 50;
            LaohuUtils.auto_time = 50;
        }
        private autoTime_100() {
            var colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.start_auto_play.filters = [colorFlilter];
            this.start_auto_play.touchEnabled = true;
            this.auto_100.currentState = "down";
            this.auto_10.currentState = this.auto_25.currentState = this.auto_50.currentState = this.auto_5.currentState = this.auto_wuqiong.currentState = "up";
            LaohuUtils.auto_times = 100;
            LaohuUtils.auto_time = 100;
        }
        private autoTimeWuqiong() {
            var colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.start_auto_play.filters = [colorFlilter];
            this.start_auto_play.touchEnabled = true;
            this.auto_wuqiong.currentState = "down";
            this.auto_10.currentState = this.auto_25.currentState = this.auto_50.currentState = this.auto_5.currentState = this.auto_100.currentState = "up";
            LaohuUtils.auto_times = 999999999;
            LaohuUtils.auto_time = 999999999;
        }

        private startPlay() {
            AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
            EventManager.instance.dispatch(EventNotify.AUTO_GAME);
        }
        private selectFreeStop() {
            this.select_ima.visible = true;
            LaohuUtils.stopAuto = true;
            this.select_ima.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.select_ima.visible = false; LaohuUtils.stopAuto = false; }, this)
        }
        private free_20() {
            LaohuUtils.free_time_times = 20;
            this.free_times_20.currentState = "down";
            this.free_times_15.currentState = this.free_times_10.currentState = this.free_times_5.currentState = "up";
        }
        private free_15() {
            LaohuUtils.free_time_times = 15;
            this.free_times_15.currentState = "down";
            this.free_times_20.currentState = this.free_times_10.currentState = this.free_times_5.currentState = "up";
        }

        private free_10() {
            LaohuUtils.free_time_times = 10;
            this.free_times_10.currentState = "down";
            this.free_times_15.currentState = this.free_times_20.currentState = this.free_times_5.currentState = "up";
        }
        private free_5() {
            LaohuUtils.free_time_times = 5;
            this.free_times_5.currentState = "down";
            this.free_times_15.currentState = this.free_times_10.currentState = this.free_times_20.currentState = "up";
        }
    }
}