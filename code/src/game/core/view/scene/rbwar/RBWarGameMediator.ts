module rbwar {
	export class RBWarGameMediator extends BaseMediator {
		public static NAME: string = "RBWarGameMediator";
		public type: string = "scene";
		public constructor() {
			super(RBWarGameMediator.NAME);
		}

		public viweComponent: RBWarGameScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_RBWAR_GAME,
				SceneNotify.CLOSE_RBWAR_GAME
			];

		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new RBWarZSMediator());
			this.facade.registerMediator(new rbwar.RbwPlayerListMediator());
			this.facade.registerMediator(new rbwar.RBWHelpPanlMediator());
		}


		/**
	 * 固有写法
	 */
		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			game.UIUtils.changeResize(1);
			this.viewComponent = new RBWarGameScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_RBWAR_GAME:
					RES.loadGroup("rbwar_back");
					this.showViewComponent();
					break;
				case SceneNotify.CLOSE_RBWAR_GAME:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}
	}
}