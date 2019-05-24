module zajinhua {
	export class ZajinhuaGameMediator extends BaseMediator {
		public static NAME: string = "ZajinhuaGameMediator";
		public type: string = "scene";
		public constructor() {
			super(ZajinhuaGameMediator.NAME);
		}

		public viweComponent: ZajinhuaGameScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_ZJHGAME,
				SceneNotify.CLOSE_ZJHGAME
			];

		}

		public onRegister() {
			super.onRegister();
		}


		/**
	 * 固有写法
	 */
		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			game.UIUtils.changeResize(1);
			//egret.MainContext.instance.stage.setContentSize(720, 1280);
			this.viewComponent = new ZajinhuaGameScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_ZJHGAME:
					RotationLoading.instance.load(["zhajinhua_game"], "", () => {
						RES.loadGroup("zhajinhua_back");
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_ZJHGAME:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}

	}
}