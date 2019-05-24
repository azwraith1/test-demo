module majiang {
	export class DZMJGameMediator extends BaseMediator {
		public static NAME: string = "DZMJGameMediator";
		public type: string = "scene";
		public constructor() {
			super(DZMJGameMediator.NAME);
		}

		public viewComponent: DZMJGameScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_DZMJ,
				SceneNotify.CLOSE_DZMJ,
				SceneNotify.FLUSH_DZMJ
			];
		}

		public onRegister() {
			super.onRegister();
		}

		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			game.UIUtils.changeResize(1);
			this.viewComponent = new DZMJGameScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_DZMJ:
					LoadingScene.instance.load(["majiang_game"], "majiang_bg_jpg", () => {
						RES.loadGroup("dzmj_back");
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_DZMJ:
					this.closeViewComponent(1);
					break;
				case SceneNotify.FLUSH_DZMJ:
					if (this.viewComponent) {
						this.closeViewComponent(1);
						// Global.gameProxy.clearRoomInfo();
						this.showViewComponent();
					}
					break;
			}
		}
	}
}