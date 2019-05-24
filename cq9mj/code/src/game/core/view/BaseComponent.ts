/**
 * 面板基类
 */
module game {
    export class BaseComponent extends eui.Component {
        protected resGroup: string;
        public resizeGroup: eui.Group;
        public constructor() {
            super();
            this.width = GameConfig.curWidth();
            this.height = GameConfig.curHeight();
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
        }

        protected onAdded() {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            if (this.resizeGroup) {
                EventManager.instance.addEvent(EventNotify.EVENT_RESIZE, this.eventResize, this);
            }
            EventManager.instance.addEvent(ServerNotify.s_payGold, this.updateGold, this);
          
        }

        public updateGold() {
            if (this['goldLabel']) {
                this['goldLabel'].text = NumberFormat.fNumber(Global.playerProxy.playerData.gold);
                if(this['goldGroup']){
                    this['goldGroup'].width = (this['goldLabel'].width * this['goldLabel'].scaleX) + 80;
                }
            }
        }


        protected onRemoved() {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            if (this.resizeGroup) {
                EventManager.instance.removeEvent(EventNotify.EVENT_RESIZE, this.eventResize, this);
            }
            EventManager.instance.removeEvent(ServerNotify.s_payGold, this.updateGold, this);
        }

        protected createChildren() {
            super.createChildren();
            if (this.resizeGroup) {
                this.eventResize();
            }
            UIUtils.addButtonScaleEffects(this);
            this.bindTouchEnded(this);
        }

        public onEnterFrame(delayTime: number): void {
        }

        public destory(callFunc: Function) {
            egret.Tween.get(this).to({
                alpha: 0
            }, 200).call(function () {
                if (callFunc) {
                    callFunc();
                }
            }, this);
        }

        /**
         * 
         * 
        * 显示动画完成后
        */
        protected onShowAnimateOver() {

        }

        protected onTouchTap(e: egret.TouchEvent) {
        }

        public bindTouchEnded(p: egret.DisplayObjectContainer) {
            if (!p) return;
            // if (p.name && this[p.name + "TouchEnded"]) {
            //     p.addEventListener(egret.TouchEvent.TOUCH_END, this[p.name + "TouchEnded"], this);
            // }
            var len = p.numChildren;
            for (var i = 0; i < len; i++) {
                var ch: egret.DisplayObjectContainer = <egret.DisplayObjectContainer>p.getChildAt(i);
                this.bindTouchEnded(ch);

            }
        }

        /**
         * 销毁
         */
        protected destroy() {
            if (this.resGroup) {
                // RES.destroyRes(this.resGroup);
            }
        }

        /**
         * 适配代码
         */
        public eventResize() {
            if (this.resizeGroup) {
                game.UIUtils.fullscreen(this.resizeGroup);
            }
        }
    }

}


