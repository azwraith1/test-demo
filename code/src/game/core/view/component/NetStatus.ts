class NetStatus extends eui.Component {
	private ycImage: eui.Image;
	private ping: number;
	private countLabel: eui.Label;
	private ycGroup1: eui.Group;
	private ycGroup2: eui.Group;
	private outTimeout;
	public constructor() {
		super();
		this.skinName = new NetStatusSkin();
	}

	public createChildren() {
		super.createChildren();
		this.ycGroup1.addEventListener(egret.TouchEvent.TOUCH_END, this.ycGroup1Touch, this);
	}

	private ycGroup1Touch() {
		egret.clearTimeout(this.outTimeout);
		if (!this.ycGroup2.visible) {
			this.outTimeout = egret.setTimeout(() => {
				this.ycGroup2.visible = false;
			}, this, 2000);
		}
		this.ycGroup2.visible = !this.ycGroup2.visible;
	}

	public changePings(ping: number) {
		this.ping = ping;
		if (ping <= 200) {
			this.countLabel.textColor = 0X00CC00;
			this.ycImage.source = RES.getRes("main_yc1_png");
		} else if (ping <= 400) {
			this.countLabel.textColor = 0Xf2ca0d;
			this.ycImage.source = RES.getRes("main_yc2_png");
		} else if (ping <= 600) {
			this.countLabel.textColor = 0Xf2ca0d;
			this.ycImage.source = RES.getRes("main_yc3_png");
		} else if (ping <= 1000) {
			this.countLabel.textColor = 0Xea0101;
			this.ycImage.source = RES.getRes("main_yc4_png");
		} else {
			this.countLabel.textColor = 0Xea0101;
			this.ycImage.source = RES.getRes("main_yc5_png");
		}
		this.countLabel.text = "延迟 " + this.ping + "ms";
	}


	public changePositions(top, bottom, left, right) {
		let parent = this.parent;
		game.UIUtils.removeSelf(this);
		this.top = top;
		this.bottom = bottom;
		this.left = left;
		this.right = right;
		parent.addChild(this);
	}

	public changePositionVH(verticalCenter, horizontalCenter) {
		this.verticalCenter = verticalCenter;
		this.horizontalCenter = horizontalCenter;
		this.top = null;
		this.bottom = null;
		this.left = null;
		this.right = null;
	}
}