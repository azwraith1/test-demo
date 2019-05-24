module sangong {
	export class SangongHallMediator extends BaseMediator {
		public static NAME: string = "SangongHallMediator";
		public type: string = "scene";
		public constructor() {
			super(SangongHallMediator.NAME);
		}

		public viweComponent: SangongHallScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_SANGONG_HALL,
				SceneNotify.CLOSE_SANGONG_HALL
			];

		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new SangongGameMediator);
			this.facade.registerMediator(new SangongMatchingMediator);
		}


		/**
	 * 固有写法
	 */
		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			game.UIUtils.changeResize(2);
			this.viewComponent = new SangongHallScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_SANGONG_HALL:
					this.showViewComponent();
					break;
				case SceneNotify.CLOSE_SANGONG_HALL:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}

	}
}