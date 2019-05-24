module bjle {
	export class BJLHallSceneMediator extends BaseMediator {
		public static NAME: string = "BJLHallSceneMediator";
		public type: string = "scene";
		public constructor() {
			super(BJLHallSceneMediator.NAME);
		}

		public viweComponent: BJLHallScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_BJLHALL,
				SceneNotify.CLOSE_BJLHALL
			];

		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new BJLGameSceneMediator());

		}


		/**
	 * 固有写法
	 */
		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			game.UIUtils.changeResize(2);
			this.viewComponent = new BJLHallScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_BJLHALL:
					RotationLoading.instance.load(["bjl_hall"], "", () => {
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_BJLHALL:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}
	}
}