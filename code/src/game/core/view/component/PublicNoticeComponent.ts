class PublicNoticeComponent extends game.BaseUI {
	private publicNoticeLable: eui.Label;
	private publicNoticeBg: eui.Image;
	private publicNoticeBgLaBa: eui.Image;
	private rects: eui.Rect;
	public constructor() {
		super();
		this.skinName = new PublicNoticeComponentSkin();
	}

	public async createChildren() {
		super.createChildren();
	}

	public onAdded() {
		super.onAdded();

	}

	public onRemoved() {
		super.onRemoved();

	}


	private timer: number;
	private enable: number;
	private paomadeng(e: egret.Event) {
		let resp = e.data;
		if (!resp) {
			return;
		}
		this.publicNoticeLable.text = resp.content;
		this.timer = Number(resp.expire_time) * 1000;
		this.enable = resp.enable;
		if (this.enable == 0) {
			this.closeNotice(2)
			this.movieLable(2);
		} else {
			this.movieLable(1);
		}
	}

	private movieLable(num) {
		if (game.DateTimeManager.instance.now < this.timer) {
			egret.Tween.removeTweens(this.publicNoticeLable);
			if (num == 1) {
				egret.Tween.get(this.publicNoticeBg).to({ visible: false }, 50).to({ visible: true }, 200).call(() => {
					this.publicNoticeLable.visible = true;
					this.publicNoticeBgLaBa.visible = true;
					this.rects.visible = true;
					this.publicNoticeLable.mask = this.rects;//定义遮罩。
					//egret.Tween.get(this.publicNoticeBgLaBa, { loop: true }).to({ visible: false }, 150).to({ visible: true }, 150);
					egret.Tween.get(this.publicNoticeLable, { loop: true }).to({ x: 650 }, 50).to({ x: this.rects.x - this.publicNoticeLable.width }, 15000);
					egret.setTimeout(() => {
						this.closeNotice(num);
					}, this, 45000);
				})
			} else {
				this.timer = this.timer / 1000;
			//	egret.Tween.get(this.publicNoticeBgLaBa, { loop: true }).to({ visible: false }, 150).to({ visible: false }, 150);
				egret.Tween.get(this.publicNoticeBg).to({ visible: false }, 50).to({ visible: false }, 200).call(() => {
					this.publicNoticeLable.visible = false;
					this.publicNoticeBgLaBa.visible = false;
					this.rects.visible = false;
					this.publicNoticeLable.mask = this.rects;//定义遮罩。
					this.closeNotice(num);
				})
			}

		}

	}

	private closeNotice(num) {
		this.publicNoticeLable.visible = false;
		this.publicNoticeBgLaBa.visible = false;
		this.publicNoticeBg.visible = false;
		if (num == 1) {
			var idTime: number = egret.setTimeout(() => {
				this.movieLable(1);
			}, this, 60000);
		}

	}
}