// TypeScript file
class PMDComponent extends game.BaseUI {
    private publicNoticeLable: eui.Label;
    private publicNoticeBg: eui.Image;
    private publicNoticeBgLaBa: eui.Image;
    private rects: eui.Rect;
    private static _instance: PMDComponent;
    public static currentRunningScene: string = "";
    private currentPMD: PMDBean;
    public mainGroup: eui.Group;
    public constructor() {
        super();
        if (PMDComponent._instance) {
            throw new Error("DateTimer使用单例");
        }
        this.skinName = new PublicNoticeComponentGameSkin();
    }

    public static get instance(): PMDComponent {
        if (!PMDComponent._instance) {
            PMDComponent._instance = new PMDComponent();
        }
        return PMDComponent._instance;
    }

    public async createChildren() {
        super.createChildren();
        this.visible = false;
        this.scaleY = 0;
        this.rects.visible = true;
        this.publicNoticeLable.mask = this.rects;//定义遮罩。
    }

    public onAdded() {
        super.onAdded();
        EventManager.instance.addEvent(ServerNotify.s_broadcast, this.paomadeng, this);

    }

    public onRemoved() {
        super.onRemoved();
        EventManager.instance.removeEvent(ServerNotify.s_broadcast, this.paomadeng, this);
    }


    private timer: number;
    private enable: number;
    private paomadeng(e: egret.Event) {
        let data = e.data;
        if (!data) {
            return;
        }
        if (data.enable == 0) {
            this.showCloseAni();
            PMDFactory.instance.deleteMsg();
            this.runTime = 0;
            return;
        }
        if (data.expire_time * 1000 < game.DateTimeManager.instance.now) {
            this.showCloseAni();
            PMDFactory.instance.deleteMsg();
            this.runTime = 0;
            return;
        }
        if (data.type == 2) {
            if (data.gameId == "mjxzdd") {
                data.gameId = "mjxlch";
            }
            if (data.gameId != PMDComponent.currentRunningScene) {
                return;
            }
        }
        let pmd = new PMDBean();
        pmd.type = data.type;
        pmd.key = data.gameId;
        if (data.type == 1) {
            pmd.text = '<font color="#FEDD00" size="22"   >' + data.content + '</font>';
            pmd.time = 3;
            pmd.time2 = 15000;
        } else if (data.type == 2) {
            let template = data.template;
            let content = data.content;
            let money = content.gold.toFixed(2);
            let sceneName = '<font color="#FEDD00" size="22"   >' + content.sceneName + '</font>'
            let nameFont = '<font color="#FEDD00" size="22"   >' + content.nickname + '</font>'
            let gold = '<font color="#FEDD00" size="22"   >' + money + '</font>'
            template = template.replace("{%nickname%}", nameFont);
            template = template.replace("{%sceneName%}", sceneName);
            template = template.replace("{%gold%}", gold);
            pmd.text = template;
            pmd.time = 1;
            pmd.time2 = 8000;
        }
        PMDFactory.instance.addPMD(pmd);
    }

    private showAni() {
        if (this.runTime > 0) {
            this.publicNoticeLable.x = 450;
            this.movieLable();
        } else {
            PMDFactory.instance.goNext();
            let size = PMDFactory.instance.getSize();
            if (size < 1) {
                this.showCloseAni();
            }
        }
    }

    public showCloseAni() {
        egret.Tween.removeTweens(this);
        egret.Tween.get(this).to({ scaleY: 0 }, 100, egret.Ease.bounceInOut).call(() => {
            this.visible = false;
        });
    }

    private runTime: number;
    public show(pmdData) {
        if (pmdData.text == undefined) {
            return;
        }
        this.currentPMD = pmdData;
        this.publicNoticeLable.textFlow = (new egret.HtmlTextParser).parser(pmdData.text);// ;
        this.runTime = pmdData.time;
        this.showAni();
    }

    public movieLable() {
        egret.Tween.removeTweens(this);
        if (!this.visible) {
            this.scaleY = 0;
            this.visible = true;
        }
        egret.Tween.get(this).to({ scaleY: 1 }, 100, egret.Ease.bounceInOut).call(() => {
            egret.Tween.get(this.publicNoticeLable).to({ x: this.rects.x - this.publicNoticeLable.width }, this.currentPMD.time2).call(() => {
                this.publicNoticeLable.x = 450;
                this.runTime--;
                this.showAni();
            });
        }, this);


    }
}