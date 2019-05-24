/**
 * 面板基类
 */
module game {
    export class BaseUI extends eui.Component {
        public pauseHandler: TimeoutHandler = new TimeoutHandler();
        public constructor() {
            super();
            this.touchEnabled = true;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
        }

        protected onAdded() {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            EventManager.instance.addEvent(EventNotify.RUN_BACKEND, this.parseGame, this);
            EventManager.instance.addEvent(EventNotify.RUN_FORTEND, this.remuseGame, this);
        }

        protected onRemoved() {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            EventManager.instance.removeEvent(EventNotify.RUN_BACKEND, this.parseGame, this);
            EventManager.instance.removeEvent(EventNotify.RUN_FORTEND, this.remuseGame, this);
            this.destroy();
        }

        protected createChildren() {
            super.createChildren();
            UIUtils.addButtonScaleEffects(this);
        }

        private parseGame() {
            this.execAllPauseFn(), this.execAllAutoTimeout();
        }


        private remuseGame() {

        }

        public onEnterFrame(delayTime: number): void {
        }

        protected onTouchTap(e: egret.TouchEvent) {
            e.stopPropagation();
        }



        /**
         * 销毁
         */
        protected destroy() {
            this.pauseHandler.destroy();
        }

        /**
         * 添加暂停后调用的函数（后台运行立即执行）
         */
        protected addPauseFn(fn: Function, thisObj) {
            this.pauseHandler.addPauseFn(fn, thisObj);
        }

        /**
         * 移除暂停函数
         */
        protected removePauseFn(fn: Function, thisObj) {
            this.pauseHandler.removePauseFn(fn, thisObj);
        }

        /**
         * 执行所有暂停函数
         */
        protected execAllPauseFn() {
            this.pauseHandler.execAllPauseFn();
        }

        /**
         * 游戏APP暂停调用
         */
        protected onPause() {
            this.pauseHandler.onPause();
        }

        /**
         * 添加延迟函数(后台则立即执行)
         * @param  {} fn
         * @param  {} thisObj
         * @param  {} time
         */
        protected setAutoTimeout(fn, thisObj, time) {
            for (var a = [], n = 3; n < arguments.length; n++) a[n - 3] = arguments[n];
            return (s = this.pauseHandler).setAutoTimeout.apply(s, [fn, thisObj, time].concat(a));
            var s
        }

        /**
         * 清除延迟函数
         * @param  {} timeId
         */
        protected clearAutoTimeout(timeId) {
            this.pauseHandler.clearAutoTimeout(timeId);
        }

        /**
         * 执行延迟函数
         * @param  {} timeId
         */
        protected execAutoTimeout(timeId) {
            this.pauseHandler.execAutoTimeout(timeId);
        }

        /**
         * 执行所有延迟函数
         */
        protected execAllAutoTimeout() {
            this.pauseHandler.execAllAutoTimeout();
        }

        /**
         * 清除所有延迟函数
         */
        protected clearAllAutoTimeout() {
            this.pauseHandler.clearAllAutoTimeout();
        }
    }

}


