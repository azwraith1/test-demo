// TypeScript file\
/**
 * 更换玩家头像类
 */
class UserHeader extends game.BaseComponent {
    private headerList: eui.List;
    private headerGroup: eui.Group;
    public resizeGroup: eui.Group;
    private boyGroup: eui.Group;
    private girlGroup: eui.Group;
    private closeBtn: eui.Button;
    //1-4
    private boy_1: eui.Image;
    //1-4
    private girl_1: eui.Image;
    private close_rect: eui.Rect;
    private choseSex: number;
    private choseUrl: number;
    public constructor() {
        super();
        this.skinName = new UserHeaderSkin();

    }

    protected createChildren() {
        super.createChildren();
        this.choseSex = Number(Global.playerProxy.playerData.sex);
        this.choseUrl = Number(Global.playerProxy.playerData.figure_url);
        this.choseBorG(this.choseSex);
        this.ImagesList(this.choseSex);
        egret.setTimeout(() => {
            this.lock = true;
        }, this, 1000);
    }


    public onAdded() {
        super.onAdded();
        EventManager.instance.addEvent(EventNotify.CHANG_PLAYER, this.rbwarTouch, this);
    }

    public onRemoved() {
        super.onRemoved()
        EventManager.instance.removeEvent(EventNotify.CHANG_PLAYER, this.rbwarTouch, this);
    }


    private data: any
    public rbwarTouch(e: egret.Event) {
        this.data = e.data;
        this.choseUrl = this.data.figureUrl;
        this.showTouchValue(this.choseUrl);
        EventManager.instance.dispatch(EventNotify.CHANG_PLAYER_HEADER, this.data);
    }

    /**
     * 用户选择的头像，那个对应的头像发亮。
     */
    private showTouchValue(value) {
        let header: UserheaderBar;
        for (let i = 0; i < this.imageList.length; i++) {
            header = this.imageList[i];
            header.setTouchon(value);
        }

    }

    private lock: boolean = false;
    public async onTouchTap(e: egret.TouchEvent) {
        e.stopPropagation();
        switch (e.target) {
            case this.closeBtn:
            case this.close_rect:
                this.close_rect.visible = false;
                game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_HEADER);
                if (!this.data) {
                    return;
                }
                /**
                 * 这个向服务器发送请求。
                 */
                let gatePath = ServerConfig.PATH_CONFIG.http_header + ServerConfig.PATH_CONFIG.http_server + ":" + ServerConfig.PATH_CONFIG.http_port;
                let json = { token: Global.playerProxy.token, figureUrl: this.data.figureUrl, sex: this.data.sex };
                let resp: any = await Global.netProxy.sendRequestAsync(gatePath + "/gate/clientApi/setPlayerinfo", json);
                if (resp.error) {
                    Global.alertMediator.addAlert("修改失败", () => {
                    }, null, true);
                    this.showTouchValue(0);
                    let json1 = { figureUrl: this.choseUrl, sex: this.choseSex };
                    EventManager.instance.dispatch(EventNotify.CHANG_PLAYER_HEADER, json1);
                    this.headers.defut();
                } else {
                    Global.playerProxy.playerData.figure_url = this.data.figureUrl;
                    Global.playerProxy.playerData.sex = this.data.sex;
                }
                break;
            case this.boyGroup:
                majiang.MajiangUtils.playClick();
                this.choseBorG(1);
                this.ImagesList(1);
                break;
            case this.girlGroup:
                majiang.MajiangUtils.playClick();
                this.choseBorG(2);
                this.ImagesList(2);
                break;
        }
    }

    /**
     * 选择男或者女
     */
    private choseBorG(num) {
        if (num == 2) {
            for (let i = 1; i <= 4; i++) {
                let boy = this["boy_" + i] as eui.Image;
                let girl = this["girl_" + i] as eui.Image;
                boy.visible = i <= 2 ? true : false;
                girl.visible = i <= 2 ? false : true;
            }
        } else {
            for (let i = 1; i <= 4; i++) {
                let boy = this["boy_" + i] as eui.Image;
                let girl = this["girl_" + i] as eui.Image;
                boy.visible = i <= 2 ? false : true;
                girl.visible = i <= 2 ? true : false;
            }
        }
    }

    private imageList = [];
    private headers: UserheaderBar;

    /**
     * 渲染头像组
     * sex:根据性别1男2女
     */
    private ImagesList(sex) {
        this.imageList = [];
        this.headerGroup.removeChildren();
        let header: UserheaderBar;
        for (let i = 1; i <= 10; i++) {
            header = new UserheaderBar();
            header.setContent(i, sex);
            if (this.data) {
                if (this.choseUrl == i && this.data.sex == sex) {
                    this.headers = header;
                    header.defut();
                }
            } else {
                if (this.choseUrl == i && this.choseSex == sex) {
                    this.headers = header;
                    header.defut();
                }
            }
            this.headerGroup.addChild(header);
            this.imageList.push(header)
        }
    }


}