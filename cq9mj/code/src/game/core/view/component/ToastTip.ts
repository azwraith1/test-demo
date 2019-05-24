/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:28:12 
 * @Last Modified by:   Li MengChan 
 * @Last Modified time: 2018-06-25 14:28:12 
 * @Description: 提示
 */
module game {
    export class ToastTip extends eui.Group {
        private static _pool: ToastTip[] = [];

        private label: eui.Label;
        private bg: eui.Image;

        public constructor() {
            super();
            this.touchChildren = false;
            this.touchEnabled = false;
            var bg: eui.Image = new eui.Image("log_itembg_png");
            bg.scale9Grid = new egret.Rectangle(25, 25, 1, 1);
            this.addChild(bg);
            bg.horizontalCenter = 0;
            bg.verticalCenter = 0;
            this.bg = bg;
            var tf: eui.Label = new eui.Label();
            tf.textAlign = "center";
            tf.lineSpacing = 5;
            tf.maxWidth = 450;
            tf.textColor = 0x440E3B;
            tf.horizontalCenter = 0;
            tf.verticalCenter = 0;
            this.label = tf;
            this.addChild(tf);
        }

        private updateTxt(txt: string, isHtml: boolean) {
            this.label.text = txt;
            this.label.x = -this.label.width / 2;
            this.label.y = 20;
            this.bg.width = this.label.width + 30;
            this.bg.height = this.label.height + 24;
        }

        static popTip(txt: string, time: number = 1000, isHtml: boolean = false) {
            var tip: ToastTip;
            if (ToastTip._pool.length > 0) {
                tip = ToastTip._pool.pop();
                tip.alpha = 1;
            } else {
                tip = new ToastTip();
            }
            tip.updateTxt(txt, isHtml);
            tip.x = (GameConfig.curWidth() - tip.bg.width) / 2;
            tip.y = (GameConfig.curHeight() - tip.bg.height) / 2;
            GameLayerManager.gameLayer().effectLayer.addChild(tip);
            egret.Tween.get(tip).to({ y: tip.y - 50 }, 100, egret.Ease.backOut)
                .wait(300)
                .to({ y: tip.y - 180, alpha: 0 }, 2000)
                .call(() => {
                    UIUtils.removeSelf(tip);
                    if (ToastTip._pool.length < 50) {
                        ToastTip._pool.push(tip);
                    }
                });
        }
    }
}