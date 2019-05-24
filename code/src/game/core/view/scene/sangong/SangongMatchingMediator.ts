module sangong {
	export class SangongMatchingMediator extends BaseMediator {
		public static NAME: string = "SangongMatchingMediator";
		public type: string = "scene";
		public constructor() {
			super(SangongMatchingMediator.NAME);
		}

		public viweComponent: SangongMatchingScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_SANGONG_WATING,
				SceneNotify.CLOSE_SANGONG_WATING
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
			game.UIUtils.changeResize(2);
			this.viewComponent = new SangongMatchingScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_SANGONG_WATING:
					RotationLoadingShu.instance.load(["sangong_game"], "", () => {
						RES.loadGroup("sangong_back");
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_SANGONG_WATING:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}
	}
}