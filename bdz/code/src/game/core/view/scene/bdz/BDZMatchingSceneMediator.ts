class BDZMatchingSceneMediator extends BaseMediator {
	public static NAME: string = "BDZMatchingSceneMediator";
	public type: string = "scene";
	public constructor() {
		super(BDZMatchingSceneMediator.NAME);
	}

	public viweComponent: BDZMatchingScene;
	public listNotificationInterests(): Array<any> {
		return [
			SceneNotify.OPEN_BDZ_MATCHING,
			SceneNotify.CLOSE_BDZ_MATCHING
		];

	}

	public onRegister() {
		super.onRegister();
		
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
		this.viewComponent = new BDZMatchingScene();
		var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
		sceneLayer.addChild(this.viewComponent);
	}

	public handleNotification(notification: puremvc.INotification): void {
		switch (notification.getName()) {
			case SceneNotify.OPEN_BDZ_MATCHING:
				this.showViewComponent();
				break;
			case SceneNotify.CLOSE_BDZ_MATCHING:
				if (this.viewComponent) {
					// game.UIUtils.changeResize(1);
					this.closeViewComponent(1);
				}
				break;
		}

	}

}