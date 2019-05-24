module cbzz {
    export class CBZZTipsPanel extends game.BaseComponent {
        public resizeGroup: eui.Group;
        public group1: eui.Group;
        public right1: eui.Button;
        public group2: eui.Group;
        public left1: eui.Button;
        public left2: eui.Button;
        public right2: eui.Button;
        public group3: eui.Group;
        public payList: eui.Group;
        public closeBtn3: eui.Button;
        public closeBtn2: eui.Button;
        public closeBtn1: eui.Button;
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
            this.skinName = "CBZZTipsSkin";
        }

        public createChildren() {
            super.createChildren();
            this.initData();
        }

        public onAdded() {
            super.onAdded();
        }
        public onRemoved() {
            super.onRemoved();
        }
        protected onTouchTap(e: egret.TouchEvent) {
            switch (e.target) {
                case this.right1:
                    this.group1.visible = this.group3.visible = false;
                    this.group2.visible = true;
                    break;
                case this.right2:
                    this.group1.visible = this.group2.visible = false;
                    this.group3.visible = true;
                    break;
                case this.left1:
                    this.group2.visible = this.group3.visible = false;
                    this.group1.visible = true;
                    break;
                case this.left2:
                    this.group3.visible = this.group1.visible = false;
                    this.group2.visible = true;
                    break;
                case this.closeBtn3:case this.closeBtn1: case this.closeBtn2:
                    game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_CBZZ_TIPS_PANEL);
                    break;
            }
        }

        public initData() {
            let data
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(2000));
            this.pay3_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(200));
            this.pay3_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(20));
            this.pay3_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(1500));
            this.pay4_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(150));
            this.pay4_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(15));
            this.pay4_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(750));
            this.pay5_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(125));
            this.pay5_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(12));
            this.pay5_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(500));
            this.pay6_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(100));
            this.pay6_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(10));
            this.pay6_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(200));
            this.pay7_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(30));
            this.pay7_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(8));
            this.pay7_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(200));
            this.pay8_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(30));
            this.pay8_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(8));
            this.pay8_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(150));
            this.pay9_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(20));
            this.pay9_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(5));
            this.pay9_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(150));
            this.pay10_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(20));
            this.pay10_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(5));
            this.pay10_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(100));
            this.pay11_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(15));
            this.pay11_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(2));
            this.pay11_3.text = NumberFormat.handleFloatDecimal(data) + "";

            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(100));
            this.pay12_5.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(15));
            this.pay12_4.text = NumberFormat.handleFloatDecimal(data) + "";
            data = Number(new Big(game.CBZZUtils.mul * game.CBZZUtils.bet).mul(2));
            this.pay12_3.text = NumberFormat.handleFloatDecimal(data) + "";
        }
    }
}