module zajinhua {
	export class ZajinhuaMatchingMediator extends BaseMediator {
		public static NAME: string = "ZajinhuaMatchingMediator";
		public type: string = "scene";
		public constructor() {
			super(ZajinhuaMatchingMediator.NAME);
		}

		public viweComponent: ZajinhuaMatchingScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_ZJH_MATCHING,
				SceneNotify.CLOSE_ZJH_MATCHING
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
			this.viewComponent = new ZajinhuaMatchingScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_ZJH_MATCHING:
					RotationLoading.instance.load(["zhajinhua_game"], "", () => {
						RES.loadGroup("zhajinhua_back");
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_ZJH_MATCHING:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}

	}
}