// TypeScript file
module game{
    export class TipsPanelMediator extends BaseMediator{
        public static NAME: string = "TipsPanelMediator";
		public type: string = "panel";
		public constructor() {
			super(TipsPanelMediator.NAME);
		}

		public viewComponent: TipsPanel;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_LAOHUGAME_TIPS,
				PanelNotify.CLOSE_LAOHUGAME_TIPS
			];
		}

		public onRegister() {
			super.onRegister();
			// this.facade.registerMediator(new majiang.MjiangSelectMediator());
			
		}

		public showViewComponent() {
			if(this.viewComponent){
				return;}
			this.viewComponent = new TipsPanel();
			var sceneLayer = GameLayerManager.gameLayer().panelLayer;
			this.viewComponent.height = GameConfig.curHeight();
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_LAOHUGAME_TIPS:
					this.showViewComponent();
					break;
				case PanelNotify.CLOSE_LAOHUGAME_TIPS:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}