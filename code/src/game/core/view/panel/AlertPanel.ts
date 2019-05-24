/**
 * 
 */

module game {
    export class AlertPanel extends BaseComponent {
        private tipsText: string;
        private labelTxt: eui.Label;

        private btnOk: eui.Button;
        private btnNo: eui.Button;
        private onlyOkBtn: boolean;
        private okCallback: Function;
        private noCallback: Function;
        public constructor(tipContentData: any) {
            super();
            this.tipsText = tipContentData.tips;
            this.okCallback = tipContentData.okCallback || null;
            this.noCallback = tipContentData.noCallback || null;
            this.onlyOkBtn = tipContentData.onlyOkBtn || false;
            if(GameConfig.CURRENT_ISSHU && AlertShuSkin){
                this.skinName = new AlertShuSkin();
                return;
            }
            this.skinName = new AlertSkin();
        }

        public onTouchTap(e: egret.TouchEvent) {
            switch (e.target) {
                case this.btnOk:
                    this.btnOkTouchEnded();
                    break;
                case this.btnNo:
                    this.btnNoTouchEnded();
                    break;
            }
            e.stopPropagation();
        }


        public btnNoTouchEnded() {
            if (this.noCallback) {
                this.noCallback();
            }
            this.btnNo.touchEnabled = false;
            AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_ALERT);
        }

        public btnOkTouchEnded() {
            if (this.okCallback) {
                this.okCallback();
            }
            this.btnOk.touchEnabled = false;
            AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_ALERT);
        }

        protected createChildren() {
            super.createChildren();
            this.labelTxt && (this.labelTxt.text = this.tipsText);
            if (this.onlyOkBtn) {
                this.btnOk.horizontalCenter = 0;
                this.btnNo.visible = false;
            }
        }

        public onAdded() {
            super.onAdded();
        }

        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(EventNotify.EVENT_RESIZE, this.eventResize, this);
        }


    }
}