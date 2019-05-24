
module majiang {
	export class MajiangMatchingMediator extends BaseMediator {
		public static NAME: string = "MajiangMatchingMediator";
		public type: string = "scene";
		public constructor() {
			super(MajiangMatchingMediator.NAME);
		}

		public viewComponent: MajiangMatchingScene;
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
			this.viewComponent = new MajiangMatchingScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_MAJIANG_MATCH:
					RotationLoading.instance.load(["majiang_game"], "", () => {
						RES.loadGroup("majiang_back");
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_MAJIANG_MATCH:
					this.closeViewComponent(1);
					break;
			}
		}
	}
}