class BDZHallSceneMediator extends BaseMediator {
	public static NAME: string = "BDZHallSceneMediator";
	public type: string = "scene";
	public constructor() {
		super(BDZHallSceneMediator.NAME);
	}

	public viweComponent: BDZHallScene;
	public listNotificationInterests(): Array<any> {
		return [
			SceneNotify.OPEN_BDZ_HALL,
			SceneNotify.CLOSE_BDZ_HALL
		];

	}

	public onRegister() {
		super.onRegister();
		this.facade.registerMediator(new BDZMatchingSceneMediator());
		this.facade.registerMediator(new BDZGameSceneMediator());
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
		this.viewComponent = new BDZHallScene();
		var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
		sceneLayer.addChild(this.viewComponent);
	}

	public handleNotification(notification: puremvc.INotification): void {
		switch (notification.getName()) {
			case SceneNotify.OPEN_BDZ_HALL:
				this.showViewComponent();
				break;
			case SceneNotify.CLOSE_BDZ_HALL:
				if (this.viewComponent) {
					// game.UIUtils.changeResize(1);
					this.closeViewComponent(1);
				}
				break;
		}

	}

}