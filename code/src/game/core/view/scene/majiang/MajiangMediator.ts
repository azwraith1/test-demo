module majiang {
	export class MajiangMediator extends BaseMediator {
		public static NAME: string = "MajiangMediator";
		public type: string = "scene";
		public constructor() {
			super(MajiangMediator.NAME);
		}

		public viewComponent: MajiangScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_MAJIANG,
				SceneNotify.CLOSE_MAJIANG,
				SceneNotify.FLUSH_MAJIANG
			];
		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new MajiangMinPaiMediator());
		}

		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			game.UIUtils.changeResize(1);
			this.viewComponent = new MajiangScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_MAJIANG:
					if (ServerConfig.PATH_TYPE == ServerConfig.MINGPAI_TYPE) {
						this.facade.sendNotification(SceneNotify.OPEN_CESI, notification.getBody());
						return;
					}
					LoadingScene.instance.load(["majiang_game"], "majiang_bg_jpg", () => {
						RES.loadGroup("majiang_back");
						this.showViewComponent();
					});
					break;
				case SceneNotify.CLOSE_MAJIANG:
					if (ServerConfig.PATH_TYPE == ServerConfig.MINGPAI_TYPE) {
						this.facade.sendNotification(SceneNotify.CLOSE_CESI, notification.getBody());
						return;
					}
					this.closeViewComponent(1);
					break;
				case SceneNotify.FLUSH_MAJIANG:
					if (this.viewComponent) {
						this.closeViewComponent(1);
						Global.gameProxy.clearRoomInfo();
						this.showViewComponent();
					}
					break;

			}
		}
	}
}