// TypeScript file
module game{
    export class NetErorrMediator extends BaseMediator{
        public static NAME: string = "NetErorrMediator";
		public type: string = "panel";
		public constructor() {
			super(NetErorrMediator.NAME);
		}

		public viewComponent: NetErorrPanel;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_NETERORR_PANEL,
				PanelNotify.CLOSE_NETERORR_PANEL
			];
		}

		public onRegister() {
			super.onRegister();
			// this.facade.registerMediator(new majiang.MjiangSelectMediator());
			
		}

		public showViewComponent() {
			this.viewComponent = new NetErorrPanel();
			var sceneLayer = GameLayerManager.gameLayer().panelLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_NETERORR_PANEL:
					this.showViewComponent();
					break;
				case PanelNotify.CLOSE_NETERORR_PANEL:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}