/**
 * 面板基类
 */
module game {
    export class BaseUI extends eui.Component {
        public constructor() {
            super();
            this.touchEnabled = true;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
        }

        protected onAdded() {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        }

        protected onRemoved() {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            this.destroy();
        }

        protected createChildren() {
            super.createChildren();
            UIUtils.addButtonScaleEffects(this);
        }

        public onEnterFrame(delayTime: number): void {
        }

        public destory(callFunc: Function) {

        }


        protected onTouchTap(e: egret.TouchEvent) {
            e.stopPropagation();
        }



        /**
         * 销毁
         */
        protected destroy() {

        }
    }

}


