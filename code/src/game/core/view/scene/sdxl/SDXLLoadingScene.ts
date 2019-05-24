// TypeScript file
class SDXLLoadingScene extends game.BaseComponent {
    private static _instance: SDXLLoadingScene;
    public resizeGroup: eui.Group;
	public m_pProgressGroup: eui.Group;
    public loadingPrograssBar: eui.Image;
    public clickGroup2: eui.Group;
    public clickIma: eui.Image;
    public startText: eui.Image;
    private callback: Function;
	private clickDb: DBComponent;
	private tipsLabel: eui.Label;

    public constructor() {
        super();
        if (SDXLLoadingScene._instance) {
			throw new Error("SceneLoading使用单例");
		}
        this.skinName = new SDXLLoadingSkin();
    }

    public static get instance(): SDXLLoadingScene {
		if (!SDXLLoadingScene._instance) {
			SDXLLoadingScene._instance = new SDXLLoadingScene();
		}
		return SDXLLoadingScene._instance;
	}

    public load(resGroup: string, callback: Function) {
		this.resGroup = resGroup;
		this.callback = callback;
		GameLayerManager.gameLayer().loadLayer.addChild(this);
		this.beganLoadResGroup();
	}

    public onAdded() {
        super.onAdded();
    }

    public createChildren() {
        super.createChildren();
		this.clickDb = DBComponent.create("sdxl_click","click");
		this.clickDb.x = 250;
		this.clickDb.y = 80;
		this.clickGroup2.addChild(this.clickDb);
		this.clickDb.resetPosition();
    }

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

    private onResourceProgress(e: RES.ResourceEvent): void {
		if (e.groupName == this.resGroup) {
			var rate = Math.floor(e.itemsLoaded / e.itemsTotal * 100);
			this.loadingPrograssBar.width = rate / 100 * 679;
		}
	}

	private onResourceLoadOver() {
		this.startText.alpha = 1;
		this.tipsLabel.visible = this.m_pProgressGroup.visible = false;
		this.clickIma.visible = this.startText.visible = true;
		this.showClickAni();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.enterSDXL, this);
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

	private async enterSDXL() {
		this.callback && this.callback();
		game.UIUtils.removeFromParent(this);
		SDXLLoadingScene._instance = null;
		this.startText.alpha = 1;
	}
}