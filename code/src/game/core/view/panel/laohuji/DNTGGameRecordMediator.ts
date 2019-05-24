// TypeScript file
module dntg{
    export class DNTGGameRecordMediator extends BaseMediator{
        public static NAME: string = "DNTGGameRecordMediator";
		public type: string = "panel";
		public constructor() {
			super(DNTGGameRecordMediator.NAME);
		}

		public viewComponent: DNTGGameRecordPanel;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_DNTG_RECORD_PANEL,
				PanelNotify.CLOSE_DNTG_RECORD_PANEL
			];
		}

		public onRegister() {
			super.onRegister();
		}

		public showViewComponent() {
			this.viewComponent = new DNTGGameRecordPanel();
			var sceneLayer = GameLayerManager.gameLayer().panelLayer;
			sceneLayer.addChild(this.viewComponent);
		}	

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_DNTG_RECORD_PANEL:
					this.showViewComponent();
					break;
				case PanelNotify.CLOSE_DNTG_RECORD_PANEL:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}