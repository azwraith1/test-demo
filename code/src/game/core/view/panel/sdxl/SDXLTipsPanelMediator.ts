// TypeScript file
module sdxl{
    export class SDXLTipsPanelMediator extends BaseMediator{
        public static NAME: string = "SDXLTipsPanelMediator";
		public type: string = "panel";
		public constructor() {
			super(SDXLTipsPanelMediator.NAME);
		}

		public viewComponent: SDXLTipsPanel;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_SDXL_TIPS,
				PanelNotify.CLOSE_SDXL_TIPS
			];
		}

		public onRegister() {
			super.onRegister();
			// this.facade.registerMediator(new majiang.MjiangSelectMediator());
			
		}

		public showViewComponent() {
			if(this.viewComponent){
				return;
			}
			this.viewComponent = new SDXLTipsPanel();
			var sceneLayer = GameLayerManager.gameLayer().panelLayer;
			sceneLayer.addChild(this.viewComponent);
		}	

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_SDXL_TIPS:
					this.showViewComponent();
					break;
				case PanelNotify.CLOSE_SDXL_TIPS:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}