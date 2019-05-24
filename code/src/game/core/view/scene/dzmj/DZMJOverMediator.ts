module majiang {
	export class DZMJOverMediator extends BaseMediator {
		public static NAME: string = "DZMJOverMediator";
		public type: string = "scene";
		public constructor() {
			super(DZMJOverMediator.NAME);
		}

		public viewComponent: DZMJOverScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_DZMJ_OVER,
				SceneNotify.CLOSE_DZMJ_OVER
			];
		}

		public onRegister() {
			super.onRegister();
		}

		public showViewComponent(nums) {
			this.viewComponent = new DZMJOverScene(nums);
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {

			switch (notification.getName()) {
				case SceneNotify.OPEN_DZMJ_OVER:
					this.showViewComponent(notification.getBody());
					break;
				case SceneNotify.CLOSE_DZMJ_OVER:
					this.closeViewComponent(1);
					break;
			}
		}
	}
}