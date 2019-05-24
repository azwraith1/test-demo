// TypeScript file
module cbzz {
    export class CBZZBaseIcon extends eui.Component {
        protected icon: eui.Image;
        protected iconbg: eui.Image;
        protected rect: eui.Rect;
        protected value: number;
        protected iconKey: string = "cbzz";
        public dbComp: DBComponent;

        public changeSource(source) {
            this.icon.source = RES.getRes(source);
        }

        public changeSouceByValue(value) {
            this.value = value;
            this.icon.source = RES.getRes(`${this.iconKey}_icon _${value}_png`);
        }
        public changeSourceByNameValue(iconKey: string, value) {
            this.value = value;
            this.iconKey = iconKey;
            this.icon.source = RES.getRes(`${this.iconKey}_icon_${value}_png`);
        }
        // public showRect(){
        //     this.rect.visible =true;
        // }
        // public hideRect(){
        //     this.rect.visible = false;
        // }

        public cbzzIconBg: DBComponent;//cbzz 图标背景1
        public cbzzIconKuang: DBComponent;//cbzz 图标背景2
        public cbzzIconkuangBot: DBComponent; //cbzz图标底部特效
        public cbzzIconKuangTop: DBComponent;//cbzz图标上部特效
        public cbzzIconKuangLeft: DBComponent;//cbzz图标左部特效
        public cbzzIconKuangRight: DBComponent;//cbzz图标右部特效

        public createChildren() {
            super.createChildren();
            // this.rect.fillAlpha = 0.5;
            // this.rect.visible = false;
            // 神雕图标动画初始化
            this.cbzzIconBg = new DBComponent("cbzz_di");
            this.cbzzIconKuang = new DBComponent("cbzz_kuang");
            // this.cbzzIconkuangBot = new DBComponent("cbzz_kuang_bot");
            // this.cbzzIconKuangLeft = new DBComponent("cbzz_kuang_left");
            // this.cbzzIconKuangRight = new DBComponent("cbzz_kuang_right");
            // this.cbzzIconKuangTop = new DBComponent("cbzz_kuang_top");
            this.cbzzIconBg.x = 94;
            this.cbzzIconBg.y = 89;
            this.cbzzIconKuang.x = 94;
            this.cbzzIconKuang.y = 89;
            // this.cbzzIconKuangTop.x = 89
            // this.cbzzIconkuangBot.x = 89;
            // this.cbzzIconKuangTop.y = 94;
            // this.cbzzIconkuangBot.y = 99;
            // this.cbzzIconKuangLeft.y = 94
            // this.cbzzIconKuangRight.y = 94;
            // this.cbzzIconKuangLeft.x = 84;
            // this.cbzzIconKuangRight.x = 94;
            this.cbzzIconBg.visible = this.cbzzIconKuang.visible = false;
            // this.cbzzIconKuang.visible = this.cbzzIconKuangLeft.visible = this.cbzzIconKuangRight.visible = this.cbzzIconKuangTop.visible = this.cbzzIconkuangBot.visible = false;
            this.cbzzIconBg.callback = () => {
                game.UIUtils.removeSelf(this.cbzzIconBg);
                // game.UIUtils.removeSelf(this.cbzzIconKuang);
            };
        }

        public scatterGuang: DBComponent;
		/**
		 * @param  {string} str
		 * 添加sdxl scatter特效
		 */
        public addScatter(str: string) {
            this.scatterGuang = new DBComponent(str);
            if (str == "sdxl_icon_2") {
                this.icon.visible = false;
                this.scatterGuang.callback = () => { this.icon.visible = true; game.UIUtils.removeSelf(this.scatterGuang); };
            }
            this.scatterGuang.x = 94;
            this.scatterGuang.y = 89;
            this.scatterGuang.play("", 1);
            this.addChild(this.scatterGuang);
        }
        /**
         * scaterxiaoguo 
         * @param  {string} str
         */
        public addScatter1(str: string) {
            this.scatterGuang = new DBComponent(str);
            this.scatterGuang.x = 94;
            this.scatterGuang.y = 89;
            this.scatterGuang.play("", 1);
            this.addChild(this.scatterGuang);
        }


        public hideDbComponent() {
            if (this.dbComp) {
                this.dbComp.stop();
                game.UIUtils.removeSelf(this.dbComp);
                this.dbComp = null;
            }
            egret.Tween.removeTweens(this.icon);
            this.icon.scaleX = this.icon.scaleY = 1;
            this.icon.visible = true;
        }


        /**
         * 中奖动画添加
         * @param  {number} dir1? 上方特效
         * @param  {number} dir2? 下方特效
         * @param  {number} dir3? 左边特效
         * @param  {number} dir4? 右边特效
         */
        public showSdDbComponet(dir1?: number, dir2?: number, dir3?: number, dir4?: number) {
            this.addChild(this.cbzzIconKuang);

            // if (dir1) {
            //     this.cbzzIconKuangTop.play("", 0);
            //     this.addChild(this.cbzzIconKuangTop)
            // }
            // if (dir2) {
            //     this.cbzzIconkuangBot.play("", 1);
            //     this.addChild(this.cbzzIconkuangBot)
            // } if (dir3) {
            //     this.cbzzIconKuangLeft.play("", 1);
            //     this.addChild(this.cbzzIconKuangLeft)
            // } if (dir4) {
            //     this.cbzzIconKuangRight.play("", 1);
            //     this.addChild(this.cbzzIconKuangRight)
            // }
            this.addChild(this.icon);
            this.cbzzIconBg.play("", 1);
            this.cbzzIconKuang.play1("", 1);
            if (this.value <= 8) {
                if (!this.dbComp) {
                    this.dbComp = new DBComponent("cbzz_" + `icon_${this.value}`);
                    this.dbComp.callback = () => {
                        if (this.dbComp) {
                            this.dbComp.visible = false;
                            this.icon.visible = true;
                        }
                    }
                    this.dbComp.x = 94;
                    this.dbComp.y = 89;
                } else {
                    this.dbComp.visible = true;
                }
                this.icon.visible = false;
                this.addChild(this.dbComp);
                this.addChild(this.cbzzIconBg);
                // this.addChild(this.sdxlIconKuang);
                // this.addChild(this.icon);
                this.dbComp.play1("", 1);
            }
            else {
                this.addChild(this.cbzzIconKuang);
                this.addChild(this.iconbg);
                this.addChild(this.cbzzIconBg);
                this.addChild(this.icon);
                this.icon.visible = true;
            }
        }

        /**
         * 图标置灰
         */
        public setIconHui() {
            var colorMatrix = [
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.icon.filters = [colorFlilter];
        }
        /**
         * 图标置灰还原
         */
        public resetIconHui() {
            var colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.icon.filters = [colorFlilter];
        }

        public stopDbComponet() {
            egret.Tween.removeTweens(this.icon);
            this.icon.scaleX = this.icon.scaleY = 1;
            this.icon.visible = true;
            if (this.dbComp) {
                this.dbComp.visible = false;
                game.UIUtils.removeSelf(this.dbComp);
                this.dbComp = null;
            }
            this.stopKuangDB();
        }


        public stopKuangDB() {
            game.UIUtils.removeSelf(this.cbzzIconBg);
            game.UIUtils.removeSelf(this.cbzzIconKuang);
            // game.UIUtils.removeSelf(this.cbzzIconKuangLeft);
            // game.UIUtils.removeSelf(this.cbzzIconKuangRight);
            // game.UIUtils.removeSelf(this.cbzzIconKuangTop);
            // game.UIUtils.removeSelf(this.cbzzIconkuangBot);
        }
    }
}