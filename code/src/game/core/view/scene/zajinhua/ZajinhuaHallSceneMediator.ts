module zajinhua {
	export class ZajinhuaHallSceneMediator extends BaseMediator {
		public static NAME: string = "ZajinhuaHallSceneMediator";
		public type: string = "scene";
		public constructor() {
			super(ZajinhuaHallSceneMediator.NAME);
		}

		public viweComponent: ZajinhuaHallScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_ZJHSELECT,
				SceneNotify.CLOSE_ZJHSELECT
			];

		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new zajinhua.ZajinhuaGameMediator());
			this.facade.registerMediator(new zajinhua.ZajinhuaMatchingMediator());
			this.facade.registerMediator(new zajinhua.ZajinhuaHelpMediator());
			this.facade.registerMediator(new zajinhua.ZajinhuaRecordMediator());
			this.facade.registerMediator(new zajinhua.ZajinhuaSetMediator());
		}


		/**
	 * 固有写法
	 */
		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			game.UIUtils.changeResize(1);
			//egret.MainContext.instance.stage.setContentSize(720, 1280);
			this.viewComponent = new ZajinhuaHallScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_ZJHSELECT:
					this.showViewComponent();
					break;
				case SceneNotify.CLOSE_ZJHSELECT:
					if (this.viewComponent) {
						this.closeViewComponent(1);
					}
					break;
			}

		}

	}
}