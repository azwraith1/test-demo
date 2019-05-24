// TypeScript file
module sdxl {
    export class SDXLTipsPanel extends game.BaseComponent {
        public resizeGroup: eui.Group;
        public tipGroup1: eui.Group;
        public closeBtn1: eui.Image;
        public right1: eui.Button;
        public tipGroup2: eui.Group;
        public closeBtn2: eui.Image;
        public right2: eui.Button;
        public left1: eui.Button;
        public tipGroup3: eui.Group;
        public left2: eui.Button;
        public closeBtn3: eui.Image;
        public payList: eui.Group;
        public pay3_5: eui.Label;
        public pay3_4: eui.Label;
        public pay3_3: eui.Label;
        public pay4_5: eui.Label;
        public pay4_4: eui.Label;
        public pay4_3: eui.Label;
        public pay5_5: eui.Label;
        public pay5_4: eui.Label;
        public pay5_3: eui.Label;
        public pay6_5: eui.Label;
        public pay6_4: eui.Label;
        public pay6_3: eui.Label;
        public pay7_5: eui.Label;
        public pay7_4: eui.Label;
        public pay7_3: eui.Label;
        public pay8_5: eui.Label;
        public pay8_4: eui.Label;
        public pay8_3: eui.Label;
        public pay9_5: eui.Label;
        public pay9_4: eui.Label;
        public pay9_3: eui.Label;
        public pay10_5: eui.Label;
        public pay10_4: eui.Label;
        public pay10_3: eui.Label;
        public pay11_5: eui.Label;
        public pay11_4: eui.Label;
        public pay11_3: eui.Label;
        public pay12_5: eui.Label;
        public pay12_4: eui.Label;
        public pay12_3: eui.Label;


        public constructor() {
            super();
            this.skinName = new SDXLTipsSkin();
            this.initData();
        }
        public

        public onAdded() {
            super.onAdded();
        }

        public onRemoved() {
            super.onRemoved();
        }

        public onTouchTap(e: egret.TouchEvent) {
            switch (e.target) {
                case this.right1:
                    SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
                    this.turnRight1();
                    break;
                case this.right2:
                    SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
                    this.turnRight2();
                    break;
                case this.left1:
                    SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
                    this.turnLeft1();
                    break;
                case this.left2:
                    SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
                    this.turnLeft2();
                    break;
                case this.closeBtn1:
                case this.closeBtn2:
                case this.closeBtn3:
                    SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
                    game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SDXL_TIPS);
                    break;
            }
        }

        private turnRight1() {
            this.tipGroup1.visible = this.tipGroup3.visible = false;
            this.tipGroup2.visible = true;
        }

        private turnRight2() {
            this.tipGroup1.visible = this.tipGroup2.visible = false;
            this.tipGroup3.visible = true;
        }

        private turnLeft1() {
            this.tipGroup2.visible = this.tipGroup3.visible = false;
            this.tipGroup1.visible = true;
        }

        private turnLeft2() {
            this.tipGroup3.visible = this.tipGroup1.visible = false;
            this.tipGroup2.visible = true;
        }

        public initData() {
            let data
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(2000));
            this.pay3_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(200));
            this.pay3_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(20));
            this.pay3_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(1500));
            this.pay4_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(150));
            this.pay4_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(15));
            this.pay4_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(750));
            this.pay5_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(125));
            this.pay5_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(12));
            this.pay5_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(500));
            this.pay6_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(100));
            this.pay6_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(10));
            this.pay6_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(200));
            this.pay7_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(30));
            this.pay7_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(8));
            this.pay7_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(200));
            this.pay8_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(30));
            this.pay8_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(8));
            this.pay8_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(150));
            this.pay9_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(20));
            this.pay9_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(5));
            this.pay9_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(150));
            this.pay10_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(20));
            this.pay10_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(5));
            this.pay10_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(100));
            this.pay11_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(15));
            this.pay11_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(2));
            this.pay11_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(100));
            this.pay12_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(15));
            this.pay12_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.SDXLUtils.mul * game.SDXLUtils.bet).mul(2));
            this.pay12_3.text = NumberFormat.handleFloatDecimal(data) + "";
        }
    }
}