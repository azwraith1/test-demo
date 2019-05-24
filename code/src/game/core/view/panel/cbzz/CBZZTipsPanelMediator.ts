// TypeScript file
module cbzz{
    export class CBZZTipsPanelMediator extends BaseMediator{
        public static NAME: string = "CBZZTipsPanelMediator";
		public type: string = "panel";
		public constructor() {
			super(CBZZTipsPanelMediator.NAME);
		}

		public viewComponent: CBZZTipsPanel;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_CBZZ_TIPS_PANEL,
				PanelNotify.CLOSE_CBZZ_TIPS_PANEL
			];
		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new cbzz.CBZZGameMediator());
			
		}

		public showViewComponent() {
			if(this.viewComponent){
				return;
			}
			this.viewComponent = new CBZZTipsPanel();
			var sceneLayer = GameLayerManager.gameLayer().panelLayer;
			sceneLayer.addChild(this.viewComponent);
		}	

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_CBZZ_TIPS_PANEL:
					this.showViewComponent();
					break;
				case PanelNotify.CLOSE_CBZZ_TIPS_PANEL:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}