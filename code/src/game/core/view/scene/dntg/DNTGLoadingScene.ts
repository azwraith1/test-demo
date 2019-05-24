/**
 * 场景转换时候的资源加载
 */
class DNTGLoadingScene extends game.BaseComponent {
	private static _instance: DNTGLoadingScene;

	private tipLabel: eui.Label;
	private progressBar: eui.Image;

	private callback: Function;

	public resizeGroup: eui.Group;
	public loadingbg: eui.Image;
	public m_pProgressGroup: eui.Group;
	public clickIma: eui.Image;
	public startText: eui.Image;
	private clickGroup2: eui.Group;
	private clickDb: DBComponent;


	public constructor() {
		super();
		if (DNTGLoadingScene._instance) {
			throw new Error("SceneLoading使用单例");
		}

		this.skinName = new DNTGLoadingSkin();

	}



	public static get instance(): DNTGLoadingScene {
		if (!DNTGLoadingScene._instance) {
			DNTGLoadingScene._instance = new DNTGLoadingScene();
		}
		return DNTGLoadingScene._instance;
	}
    /**
     * 加载资源组名，背景图片，回调
     * @param  {string} resGroup
     * @param  {string} bgSource
     * @param  {Function} callback
     */
	public load(resGroup: string, callback: Function) {
		this.resGroup = resGroup;
		this.callback = callback;
		GameLayerManager.gameLayer().loadLayer.addChild(this);
		this.beganLoadResGroup();
	}

	public createChildren() {
		super.createChildren();
		let isPC = NativeApi.instance.IsPC();
		if (isPC) {
			mouse.enable(this.stage);
		}
		this.clickDb = DBComponent.create("dntg_click","click");
		this.clickDb.y = 80;
		this.clickDb.x = 250;
		this.clickGroup2.addChild(this.clickDb);
		this.clickDb.resetPosition();
	}

    /**
     * 开始加载资源
     */
	public beganLoadResGroup() {
		RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadComplete, this);
		RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
		RES.loadGroup(this.resGroup);
	}

	private onResourceLoadComplete(e: RES.ResourceEvent): void {
		if (e.groupName == this.resGroup) {
			RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadComplete, this);
			RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			this.onResourceLoadOver();
		}
	}

    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
	private onResourceProgress(e: RES.ResourceEvent): void {
		if (e.groupName == this.resGroup) {
			var rate = Math.floor(e.itemsLoaded / e.itemsTotal * 100);
			this.progressBar.width = (rate / 100) *629;
		}
	}

	private onResourceLoadOver() {
		this.tipLabel.visible = this.m_pProgressGroup.visible = false;
		this.clickIma.visible = this.startText.visible = true;
		this.showClickAni();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.enterDNTG, this);
	}

	private showClickAni() {
		this.startText.alpha = 1;
		egret.Tween.get(this.startText).to({ alpha: 0 }, 2000).call(() => {
			this.clickDb.play("", 1);
		});
		this.clickDb.callback = () => {
			return this.showClickAni();
		}
	}

	private enterDNTG() {
		this.callback && this.callback();
		game.UIUtils.removeFromParent(this);
		DNTGLoadingScene._instance = null;
		this.startText.alpha = 1;
	}
}