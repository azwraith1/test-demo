// TypeScript file
module sdxl {
    export class SDXLBaseIcon extends eui.Component {
        protected icon: eui.Image;
        protected rect: eui.Rect;
        protected value: number;
        protected iconKey: string = "sdxl";
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

        public sdxlIconBg: DBComponent;//sdxl 图标背景1
        public sdxlIconKuang: DBComponent;//sdxl 图标背景2

        public createChildren() {
            super.createChildren();
            this.rect.fillAlpha = 0.5;
            this.rect.visible = false;
            // 神雕图标动画初始化
            this.sdxlIconBg = new DBComponent("sdxl_icon_di");
            this.sdxlIconKuang = new DBComponent("sdxl_kuang");
            this.sdxlIconBg.x = this.sdxlIconKuang.x = 93;
            this.sdxlIconBg.y = this.sdxlIconKuang.y = 89;
            this.sdxlIconBg.visible = false;
            this.sdxlIconKuang.visible = false;
            this.sdxlIconBg.callback = () => {
                game.UIUtils.removeSelf(this.sdxlIconBg);
                game.UIUtils.removeSelf(this.sdxlIconKuang);
            };
            this.sdxlIconKuang.callback = () => {

            }
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
            this.scatterGuang.x = 93;
            this.scatterGuang.y = 88.5;
            this.scatterGuang.play("", 1);
            this.addChild(this.scatterGuang);
        }
        public addScatter1(str: string) {
            this.scatterGuang = new DBComponent(str);
            this.scatterGuang.x = 93;
            this.scatterGuang.y = 88.5;
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
		 * sd 图标特效播放
		 */
        public showSdDbComponet() {
            this.addChild(this.sdxlIconKuang);
            this.addChild(this.icon);
            this.sdxlIconBg.play1("", 1);
            this.sdxlIconKuang.play1("", 0);
            if (this.value <= 6) {
                if (!this.dbComp) {
                    this.dbComp = new DBComponent("sdxl_" + `icon_${this.value}`);
                    this.dbComp.callback = () => {
                        if (this.dbComp) {
                            this.dbComp.visible = false;
                            this.icon.visible = true;
                        }
                    }
                    this.dbComp.x = 93;
                    this.dbComp.y = 88.5;
                } else {
                    this.dbComp.visible = true;
                }
                this.icon.visible = false;
                this.addChild(this.dbComp);
                this.addChild(this.sdxlIconKuang);
                // this.addChild(this.icon);
                this.dbComp.play1("", 1);
            }
            else {
                this.addChild(this.sdxlIconBg);
                this.addChild(this.icon);
                this.addChild(this.sdxlIconKuang);
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
            game.UIUtils.removeSelf(this.sdxlIconBg);
            game.UIUtils.removeSelf(this.sdxlIconKuang);
        }
    }
}