/**
 * 场景转换时候的资源加载
 */
class RotationLoading extends game.BaseComponent {
    private static _instance: RotationLoading;
    private callback: Function;
    private rotationImage: eui.Image;
    private progressLabel: eui.Label;
    public constructor() {
        super();
        if (RotationLoading._instance) {
            throw new Error("SceneLoading使用单例");
        }
        this.skinName = new RotationLoadingSkin();
    }

    public static get instance(): RotationLoading {
        if (!RotationLoading._instance) {
            RotationLoading._instance = new RotationLoading();
        }
        return RotationLoading._instance;
    }
    /**
     * 加载资源组名，背景图片，回调
     * @param  {string} resGroup
     * @param  {string} bgSource
     * @param  {Function} callback
     */
    public load(resGroup: string, bgSource: string, callback: Function) {
        this.width = GameConfig.curWidth();
         this.height = GameConfig.curHeight();
          this.progressLabel.text = "0%";
        // game.UIUtils.changeResize(1);
        egret.Tween.removeTweens(this);
        egret.Tween.get(this.rotationImage, {loop: true}).to({
            rotation: this.rotationImage.rotation + 360
        }, 1500);
        this.resGroup = resGroup;
        this.callback = callback;
        GameLayerManager.gameLayer().loadLayer.addChild(this);
        this.beganLoadResGroup();
    }

    public createChildren() {
        super.createChildren();
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
            this.progressLabel.text = rate + "%";
        }
    }

    private onResourceLoadOver() {
        egret.Tween.removeTweens(this.rotationImage);
        game.UIUtils.removeFromParent(this);
        this.callback && this.callback();
    }
}