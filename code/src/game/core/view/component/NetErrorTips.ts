class NetErrorTips extends game.BaseComponent {
	public static _instance: NetErrorTips;
	private tipsText: string;
	private labelTxt: eui.Label;
	private btnOk: eui.Button;
	private btnNo: eui.Button;
	private onlyOkBtn: boolean;
	private okCallback: Function;
	private noCallback: Function;
	public constructor() {
		super();
		if (GameConfig.CURRENT_ISSHU && AlertShuSkin) {
			this.skinName = new AlertShuSkin();
			return;
		}
		this.skinName = new AlertSkin();
	}

	public static get instance(): NetErrorTips {
		if (!NetErrorTips._instance) {
			NetErrorTips._instance = new NetErrorTips();
			NetErrorTips._instance.name = "NetErrorTips";
			NetErrorTips._instance.visible = false;
			GameLayerManager.gameLayer().maskLayer.addChild(NetErrorTips._instance);
		}
		return NetErrorTips._instance;
	}

	public createChildren() {
		super.createChildren();
		this.btnNo.visible = false;
		this.btnOk.horizontalCenter = 0;
		this.btnOk.addEventListener(egret.TouchEvent.TOUCH_END, this.btnOkTouch, this);
	}

	public show(content) {
		this.labelTxt.text = content;
		this.visible = true;
	}

	public hide() {
		this.visible = false;
	}

	public btnOkTouch() {
		FrameUtils.flushWindow();
	}
}
