// TypeScript file
module game{
    export class DNTGGameMediator extends BaseMediator{
        public static NAME: string = "DNTGGameMediator";
		public type: string = "scene";
		public constructor() {
			super(DNTGGameMediator.NAME);
		}

		// public viewComponent: dntg.DNTGMainScene;
		public viewComponent: dntg.DNTGMainScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_DNTG,
				SceneNotify.CLOSE_DNTG
			];
		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new MainHallMediator());
			this.facade.registerMediator(new SettingMediator());
		}

		public showViewComponent() {
			this.viewComponent = new dntg.DNTGMainScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_DNTG:
					this.showViewComponent();
					break;
				case SceneNotify.CLOSE_DNTG:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}