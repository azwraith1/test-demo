
module majiang {
	export class MajiangWatingMediator extends BaseMediator {
		public static NAME: string = "MajiangWatingMediator";
		public type: string = "scene";
		public constructor() {
			super(MajiangWatingMediator.NAME);
		}

		public viewComponent: MajiangWatingScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_MAJIANG_MATCH,
				SceneNotify.CLOSE_MAJIANG_MATCH
			];
		}

		public onRegister() {
			super.onRegister();
		}

		public showViewComponent() {
			this.viewComponent = new MajiangWatingScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_MAJIANG_MATCH:
					

					this.showViewComponent();
					break;
				case SceneNotify.CLOSE_MAJIANG_MATCH:
					this.closeViewComponent(1);
					break;
			}
		}
	}
}