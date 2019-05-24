class TipsCompoment extends eui.Component {
	private static _instance: TipsCompoment;
	private _cache: HashMap<string, any> = new HashMap<string, any>();
	public constructor() {
		super();
		if (TipsCompoment._instance) {
			throw new Error("DateTimer使用单例");
		}
		this.skinName = new TipsSkin();
	}

	public static get instance(): TipsCompoment {
		if (!TipsCompoment._instance) {
			TipsCompoment._instance = new TipsCompoment();
		}
		return TipsCompoment._instance;
	}

	public createChildren() {
		super.createChildren();
		this.textLabel.textColor = 0XFFFFFF;
	}

	private resizeGroup: eui.Group;

	private textLabel: eui.Label;
	public show(txt) {
		this.x = 0;
		this.rotation = 0;
		this.textLabel.text = txt;
		egret.Tween.removeTweens(this);
		if (!this.parent) {
			GameLayerManager.gameLayer().panelLayer.addChild(this);
		}
		this.visible = true;
		this.y = - this.height;
		this.resizeGroup.width = this.width = GameConfig.curWidth();
		egret.Tween.get(this).to({
			y: 0
		}, 200).wait(5000).to({
			y: - this.height
		}, 200).call(() => {
			this.visible = false;
		})
	}
}