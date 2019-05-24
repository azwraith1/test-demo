module bjle {
	export class BJLGameSceneMediator extends BaseMediator {
		public static NAME: string = "BJLGameSceneMediator";
		public type: string = "scene";
		public constructor() {
			super(BJLGameSceneMediator.NAME);
		}

		public viweComponent: BJLGameScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_BJLGAME,
				SceneNotify.CLOSE_BJLGAME
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
			//egret.MainContext.instance.stage.setContentSize(720, 1280);
			this.viewComponent = new BJLGameScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_BJLGAME:
					//this.showViewComponent();
					RotationLoading.instance.load(["bjl_game"], "", () => {
					//RES.loadGroup("bjl_game");
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_BJLGAME:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}

	}
}