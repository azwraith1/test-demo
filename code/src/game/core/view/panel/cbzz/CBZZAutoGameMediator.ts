/*
 * @Author: wangtao 
 * @Date: 2019-04-08 12:07:23 
 * @Last Modified by:   wangtao 
 * @Last Modified time: 2019-04-08 12:07:23 
 * @Description: 
 */
module cbzz {
    export class CBZZautoGamelMediator extends BaseMediator {
        public static NAME: string = "CBZZautoGamelMediator";
        public type: string = "panel";
        public constructor() {
            super(CBZZautoGamelMediator.NAME);
        }

        public viewComponent: CBZZAutoGamePanel;
        public listNotificationInterests(): Array<any> {
            return [
                PanelNotify.OPEN_CBZZ_AUTO_PANEL,
                PanelNotify.CLOSE_CBZZ_AUTO_PANEL
            ];
        }

        public onRegister() {
            super.onRegister();
            this.facade.registerMediator(new sdxl.SDXLGameMediator());

        }

        public showViewComponent() {
            if (this.viewComponent) {
                return;
            }
            this.viewComponent = new CBZZAutoGamePanel();
            var sceneLayer = GameLayerManager.gameLayer().panelLayer;
            sceneLayer.addChild(this.viewComponent);
        }

        public handleNotification(notification: puremvc.INotification): void {
            switch (notification.getName()) {
                case PanelNotify.OPEN_CBZZ_AUTO_PANEL:
                    this.showViewComponent();
                    break;
                case PanelNotify.CLOSE_CBZZ_AUTO_PANEL:
                    this.closeViewComponent(1);
                    break;
            }
        }
    }
}