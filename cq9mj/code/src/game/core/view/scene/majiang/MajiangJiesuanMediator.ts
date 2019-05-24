module majiang {
	export class MajiangJiesuanMediator extends BaseMediator {

		public static NAME: string = "MajiangJiesuanMediator";
		public type: string = "scene";
		public constructor() {
			super(MajiangJiesuanMediator.NAME);
		}

		public viewComponent: MajiangJiesuanScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_JIESUAN,
				SceneNotify.CLOSE_JIESUAN
			];
		}

		public onRegister() {
			super.onRegister();
		}

		public showViewComponent(nums) {

			this.viewComponent = new MajiangJiesuanScene(nums);
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {

			switch (notification.getName()) {
				case SceneNotify.OPEN_JIESUAN:
					this.showViewComponent(notification.getBody());
					break;
				case SceneNotify.CLOSE_JIESUAN:
					this.closeViewComponent(1);
					break;
			}
		}
	}
}