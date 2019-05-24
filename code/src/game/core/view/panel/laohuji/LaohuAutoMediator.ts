// TypeScript file
module game{
    export class LaohuAutoMediator extends BaseMediator{
        public static NAME: string = "LaohuAutoMediator";
		public type: string = "panel";
		public constructor() {
			super(LaohuAutoMediator.NAME);
		}

		public viewComponent: LaohuAutoGame;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_LAOHU_AUTO_PANEL,
				PanelNotify.CLOSE_LAOHU_AUTO_PANEL
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
			this.viewComponent = new LaohuAutoGame();
			var sceneLayer = GameLayerManager.gameLayer().panelLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_LAOHU_AUTO_PANEL:
					this.showViewComponent();
					break;
				case PanelNotify.CLOSE_LAOHU_AUTO_PANEL:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}