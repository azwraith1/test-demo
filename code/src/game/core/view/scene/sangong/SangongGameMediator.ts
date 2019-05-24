module sangong {
	export class SangongGameMediator extends BaseMediator {
		public static NAME: string = "SangongGameMediator";
		public type: string = "scene";
		public constructor() {
			super(SangongGameMediator.NAME);
		}

		public viweComponent: SangongGameScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_SANGONG_GAME,
				SceneNotify.CLOSE_SANGONG_GAME
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
			egret.MainContext.instance.stage.setContentSize(720, 1280);
			this.viewComponent = new SangongGameScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_SANGONG_GAME:
					RotationLoadingShu.instance.load(["sangong_game"], "", () => {
						RES.loadGroup("sangong_back");
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_SANGONG_GAME:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}

	}
}