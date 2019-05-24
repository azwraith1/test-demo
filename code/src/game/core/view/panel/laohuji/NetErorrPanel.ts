
module game{
    export class NetErorrPanel extends BaseComponent{
        private sure_btn: eui.Button;
        public constructor(){
            super();
            this.skinName = new NetErorrSkin();
            this.init();
        }
        public init(){
            this.sure_btn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
                AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_NETERORR_PANEL);
            },this);
        }
    }
}