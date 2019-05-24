module majiang {
	export class DZMJMatchingMediator extends BaseMediator {
		public static NAME: string = "DZMJMatchingMediator";
		public type: string = "scene";
		public constructor() {
			super(DZMJMatchingMediator.NAME);
		}

		public viewComponent: DZMJMatchingScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_DZMJ_MATCHING,
				SceneNotify.CLOSE_DZMJ_MATCHING
			];
		}

		public onRegister() {
			super.onRegister();
		}

		public showViewComponent() {
			this.viewComponent = new DZMJMatchingScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_DZMJ_MATCHING:
					RotationLoading.instance.load(["majiang_game"], "", () => {
						RES.loadGroup("dzmj_back");
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_DZMJ_MATCHING:
					this.closeViewComponent(1);
					break;
			}
		}
	}
}