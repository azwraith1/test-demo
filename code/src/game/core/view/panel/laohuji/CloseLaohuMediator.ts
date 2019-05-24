// TypeScript file
module game{
    export class CloseLaohuMediator extends BaseMediator{
        public static NAME: string = "CloseLaohuMediator";
		public type: string = "panel";
		public constructor() {
			super(CloseLaohuMediator.NAME);
		}

		public viewComponent: CloseLaohuPanel;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_LEAVE_LAOHU_PANEL,
				PanelNotify.CLOSE_LEAVE_LAOHU_PANEL
			];
		}

		public onRegister() {
			super.onRegister();
            this.facade.registerMediator(new LaohujiHallMediator());
            this.facade.registerMediator(new CloseLaohuMediator());
			// this.facade.registerMediator(new majiang.MjiangSelectMediator());
			
		}

		public showViewComponent() {
			if(this.viewComponent){
				return;
			}
			this.viewComponent = new CloseLaohuPanel();
			var sceneLayer = GameLayerManager.gameLayer().panelLayer;
			sceneLayer.addChild(this.viewComponent);
		}	

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_LEAVE_LAOHU_PANEL:
					this.showViewComponent();
					break;
				case PanelNotify.CLOSE_LEAVE_LAOHU_PANEL:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}