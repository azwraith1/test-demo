module rbwar {
	export class RBWarHallMediator extends BaseMediator {
		public static NAME: string = "RBWarHallMediator";
		public type: string = "scene";
		public constructor() {
			super(RBWarHallMediator.NAME);
		}

		public viweComponent: RBWarHallScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_RBWAR_HALL,
				SceneNotify.CLOSE_RBWAR_HALL
			];

		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new RBWarGameMediator());
			this.facade.registerMediator(new rbwar.RBWRecordMediator());
			this.facade.registerMediator(new rbwar.RBWSetMediator());
		}


		/**
	 * 固有写法
	 */
		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			game.UIUtils.changeResize(1);
			this.viewComponent = new RBWarHallScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_RBWAR_HALL:
						this.showViewComponent();
					break;
				case SceneNotify.CLOSE_RBWAR_HALL:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}
	}
}