/**
 * 场景转换时候的资源加载
 */
class LoadingScene extends game.BaseComponent {
    private static _instance: LoadingScene;
    private tipLabel: eui.Label;
    private progressBar: eui.Image;
    private callback: Function;
    private loadingbg: eui.Image;
    private resGroups: string[];
    private totalLoader: number = 0;;
    private currentLoader: number = 0;
    public constructor() {
        super();
        if (LoadingScene._instance) {
            throw new Error("SceneLoading使用单例");
        }

        this.skinName = new LoadingSkin();
    }

    public static get instance(): LoadingScene {
        if (!LoadingScene._instance) {
            LoadingScene._instance = new LoadingScene();
        }
        return LoadingScene._instance;
    }
    /**
     * 加载资源组名，背景图片，回调
     * @param  {string} resGroup
     * @param  {string} bgSource
     * @param  {Function} callback
     */
    public load(resGroup: string[], bgSource: string, callback: Function) {
        this.resGroups = resGroup;
        this.totalLoader = RESUtils.getGroupTotal(this.resGroups);
        this.currentLoader = 0;
        this.resGroups = resGroup;
        this.callback = callback;
        this.loadingbg.source = RES.getRes(bgSource);
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
        this.resGroup = this.resGroups.pop();
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
            if (this.resGroups.length > 0) {
                this.beganLoadResGroup();
            } else {
                this.onResourceLoadOver();
            }
        }
    }

    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(e: RES.ResourceEvent): void {
        if (e.groupName == this.resGroup) {
            var rate = Math.floor(e.itemsLoaded / e.itemsTotal * 100);
            this.progressBar.scaleX = rate / 100;
        }
    }

    private onResourceLoadOver() {
        game.UIUtils.removeFromParent(this);
        this.callback && this.callback();
    }
}