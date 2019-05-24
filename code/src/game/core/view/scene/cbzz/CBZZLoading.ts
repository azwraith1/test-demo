/*
 * @Author: wangtao 
 * @Date: 2019-05-08 11:04:16 
 * @Last Modified by: wangtao
 * @Last Modified time: 2019-05-08 11:46:32
 * @Description: 
 */
// TypeScript file
class CBZZLoading extends game.BaseComponent {
    private static _instance: CBZZLoading;
    private callback: Function;
    public resizeGroup: eui.Group;
    public loadingBarGroup: eui.Group;
    public processBar: eui.Image;
    public percentLabel: eui.Label;
    public clickGroup: eui.Group;
    private clickDb: DBComponent;
    public clickStart: eui.Image;

    public constructor() {
        super();
        if (CBZZLoading._instance) {
            throw new Error("SceneLoading使用单例");
        }
        this.skinName = new CBZZLaodingSkin();
    }

    public static get instance(): CBZZLoading {
        if (!CBZZLoading._instance) {
            CBZZLoading._instance = new CBZZLoading();
        }
        return CBZZLoading._instance;
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
        this.clickDb = DBComponent.create("cbzz_click","click");
		this.clickDb.x = 250;
		this.clickDb.y = 0;
		this.clickGroup.addChild(this.clickDb);
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
            this.processBar.width = rate / 100 * 762;
            this.percentLabel.text = "正在加载..." + rate + "%";
        }
    }

    private onResourceLoadOver() {
        this.loadingBarGroup.visible = false;
        this.clickGroup.visible = true;
        this.showClickAni();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.enterCBZZ, this);
    }

    private showClickAni() {
		this.clickStart.alpha = 1;
		egret.Tween.get(this.clickStart).to({ alpha: 0 }, 2000).call(() => {
			this.clickDb.play("", 1);
		});
		this.clickDb.callback = () => {
			return this.showClickAni();
		}
	}

    private enterCBZZ() {
        this.callback && this.callback();
        game.UIUtils.removeFromParent(this);
        CBZZLoading._instance = null;
		this.clickStart.alpha = 1;
    }
}