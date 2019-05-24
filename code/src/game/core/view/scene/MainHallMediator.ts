class MainHallMediator extends BaseMediator {
	public static NAME: string = "MainHallMediator";
	public type: string = "scene";
	public constructor() {
		super(MainHallMediator.NAME);
	}

	public viewComponent: any;
	public listNotificationInterests(): Array<any> {
		return [
			SceneNotify.OPEN_MAIN_HALL,
			SceneNotify.CLOSE_MAIN_HALL
		];

	}


	public onRegister() {
		super.onRegister();
		this.facade.registerMediator(new majiang.DZMJHallMediator());
		this.facade.registerMediator(new majiang.MajiangHallMediator());
		this.facade.registerMediator(new niuniu.NiuniuHallMediator());
		this.facade.registerMediator(new sangong.SangongHallMediator());
		this.facade.registerMediator(new rbwar.RBWarHallMediator());
		this.facade.registerMediator(new HelpShuMediator());
		this.facade.registerMediator(new HelpMediator());
		this.facade.registerMediator(new SettingMediator());
		this.facade.registerMediator(new game.LaohujiHallMediator());
		this.facade.registerMediator(new game.CloseLaohuMediator());
		this.facade.registerMediator(new rbwar.RBWarHallMediator());
		this.facade.registerMediator(new zajinhua.ZajinhuaHallSceneMediator());
		this.facade.registerMediator(new bjle.BJLGameSceneMediator());
		this.facade.registerMediator(new bjle.BJLHallSceneMediator());
	}


	/**
	 * 固有写法
	 */
	public showViewComponent() {
		game.UIUtils.changeResize(1);
		if (this.viewComponent) {
			return;
		}
		this.viewComponent = new MainHallScene();
		var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
		sceneLayer.addChild(this.viewComponent);
	}


	public handleNotification(notification: puremvc.INotification): void {
		switch (notification.getName()) {
			case SceneNotify.OPEN_MAIN_HALL:
				this.showViewComponent();
				break;
			case SceneNotify.CLOSE_MAIN_HALL:
				this.closeViewComponent(1);
				break;
		}

	}
}



