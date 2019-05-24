// TypeScript file
module sdmn {
    export class SDMNBaseIcon extends eui.Component {
        protected icon: eui.Image;
        protected iconbg: eui.Image;
        // protected rect: eui.Rect;
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
        public cbzzIconBg: DBComponent;//sdmn 图标背景1
        public cbzzIconKuang: DBComponent;//sdmn 图标背景2
        public cbzzIconkuangBot: DBComponent; //sdmn 图标底部特效
        public cbzzIconKuangTop: DBComponent;//sdmn 图标上部特效
        public cbzzIconKuangLeft: DBComponent;//sdmn 图标左部特效
        public cbzzIconKuangRight: DBComponent;//sdmn 图标右部特效

        public createChildren() {
            super.createChildren();
            // sdmn图标动画初始化
            this.cbzzIconBg = new DBComponent("cbzz_di");
            this.cbzzIconKuang = new DBComponent("cbzz_kuang");
            this.cbzzIconBg.x = 94;
            this.cbzzIconBg.y = 89;
            this.cbzzIconKuang.x = 94;
            this.cbzzIconKuang.y = 89;
            this.cbzzIconBg.visible = this.cbzzIconKuang.visible = false;
            this.cbzzIconBg.callback = () => {
                game.UIUtils.removeSelf(this.cbzzIconBg);
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
        }
    }
}