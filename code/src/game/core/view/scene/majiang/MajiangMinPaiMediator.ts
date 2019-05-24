module majiang {
	export class MajiangMinPaiMediator extends BaseMediator {
		public static NAME: string = "MajiangMinPaiMediator";
		public type: string = "scene";
		public constructor() {
			super(MajiangMinPaiMediator.NAME);
		}

		public viewComponent: MajiangMinPaiScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_CESI,
				SceneNotify.CLOSE_CESI
			];

		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new MajiangMatchingMediator());
			this.facade.registerMediator(new HelpMediator());
			this.facade.registerMediator(new SettingMediator());
			this.facade.registerMediator(new GameRecordMediator())
		}


		/**
		 * 固有写法
		 */
		public showViewComponent(body) {
			if (this.viewComponent) {
				return;
			}
			this.viewComponent = new MajiangMinPaiScene(body);
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}


		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_CESI:
					this.showViewComponent(notification.getBody());
					break;
				case SceneNotify.CLOSE_CESI:
					this.closeViewComponent(1);
					break;
			}

		}
	}
}