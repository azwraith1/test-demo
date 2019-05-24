module majiang {
    export class MajiangTestScene extends game.BaseComponent {
        private mainGroup: eui.Group;
        private shoupais: MineShoupai[] = [];
        private enterBtn: eui.Button;
        private cacelBtn: eui.Button;
        public constructor() {
            super();
            this.skinName = new MajiangTestSkin();
        }

        public createChildren() {
            super.createChildren();
            this.mainGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.mainGroupTouchEnded, this);
        }


        /**
         * 
         */
        public async initData() {
            let resp: any = await Global.pomelo.request("game.mjHandler.c_gmGetPublicCards", null);
            let cardArr = resp.cards;
            for (var i = 0; i < cardArr.length; i++) {
                let card = new MineShoupai(cardArr[i]);
                card.touchEnabled = false;
                this.shoupais.push(card);
                this.mainGroup.addChild(card);
                card.removeTouch();
            }
        }

        private touchOn: MineShoupai;
        public mainGroupTouchEnded(e: egret.TouchEvent) {
            let x = e.stageX;
            let y = e.stageY;
            let po = new egret.Point(x, y);
            let findMj = _.find(this.shoupais, (shoupai) => {
                let rect = new egret.Rectangle(shoupai.x, shoupai.y, shoupai.width, shoupai.height);
                return rect.containsPoint(po);
            })
            if (findMj) {
                if (this.touchOn) {
                    if (this.touchOn == findMj) {
                        this.touchOn.alpha = 1;
                        this.touchOn = null;
                        return;
                    }
                    //对换
                    let value1 = this.touchOn.value;
                    let value2 = findMj.value;
                    this.touchOn.resetValue(value2);
                    findMj.resetValue(value1);
                    this.touchOn.alpha = 1;
                    findMj.alpha = 1;
                    this.touchOn = null;
                } else {
                    findMj.alpha = 0.5;
                    this.touchOn = findMj;
                }
            }
        }

        public onTouchTap(e: egret.TouchEvent) {
            e.stopPropagation();
            switch (e.target) {
                case this.enterBtn:
                    this.enterBtnTouch();
                    break;
                case this.cacelBtn:
                    game.UIUtils.removeSelf(this);
                    break;
            }
        }

        public async enterBtnTouch() {
            let arr = [];
            for (var i = 0; i < this.shoupais.length; i++) {
                arr.push(this.shoupais[i].value);
            }
            let data = { cards: arr };
            let resp: any = await Global.pomelo.request("game.mjHandler.c_gmSetPublicCards", data);
            if (resp.error.code == 0) {
                TipsCompoment.instance.show("设置成功");
                game.UIUtils.removeSelf(this);
            }
        }
    }
}
