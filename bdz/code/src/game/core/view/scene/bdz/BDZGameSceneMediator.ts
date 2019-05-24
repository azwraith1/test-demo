class BDZGameSceneMediator extends BaseMediator {
	public static NAME: string = "BDZGameSceneMediator";
	public type: string = "scene";
	public constructor() {
		super(BDZGameSceneMediator.NAME);
	}

	public viewComponent: BDZGameScene;
	public listNotificationInterests(): Array<any> {
		return [
			SceneNotify.OPEN_BDZ_GAME,
			SceneNotify.CLOSE_BDZ_GAME
		];
	}
	/**
	 * 这里是注册的意思
	 */
	public onRegister() {
		super.onRegister();
	}

	public showViewComponent() {
		if (this.viewComponent) {
			return;
		}
		this.viewComponent = new BDZGameScene();
		var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
		sceneLayer.addChild(this.viewComponent);
	}

	public handleNotification(notification: puremvc.INotification): void {
		switch (notification.getName()) {
			case SceneNotify.OPEN_BDZ_GAME:
				this.showViewComponent();
				break;
			case SceneNotify.CLOSE_BDZ_GAME:
				this.closeViewComponent(1);
				break;
		}
	}
}