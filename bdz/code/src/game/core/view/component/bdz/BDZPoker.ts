class BDZPoker extends game.BaseUI {
	public value: number;
	public color: number;
	public number: number;
	private beiImage: eui.Image;
	private zhengGroup: eui.Group;
	private valueLabel: eui.BitmapLabel;
	private bigColorImg: eui.Image;
	private smallColorImg: eui.Image;
	private poker_m: eui.Image;
	public selected: boolean = false;
	private yuanXIndex: number;
	public constructor() {
		super();
		this.touchEnabled = false;
		this.touchChildren = false;
		if (!this.skinName) {
			this.skinName = new BDZPokerSkin();
		}
	}

	public createChildren() {
		super.createChildren();
		game.UIUtils.setAnchorPot(this.beiImage);
		game.UIUtils.setAnchorPot(this.zhengGroup);
		this.yuanXIndex = this.y;
	}

	public initWithNum(num: number) {
		this.number = num;
		this.color = Math.floor(num / 100);
		this.value = Math.floor(num % 100);
		this.changeImage();
		//this.showB2Z();
	}
	/**
	 * 牌面
	 */
	public changeImage() {
		this.valueLabel.text = PokerUtils.number2Puker(this.value);
		this.smallColorImg.source = RES.getRes(`common_poper_color_${this.color}_png`);
		if (this.value >= 11 && this.value <= 13) {
			if (this.color == 1 || this.color == 3) {
				this.bigColorImg.source = RES.getRes(`common_poper_${this.value}_1_png`);
			} else {
				this.bigColorImg.source = RES.getRes(`common_poper_${this.value}_2_png`);
			}
		} else {
			this.bigColorImg.source = RES.getRes(`common_poper_color_${this.color}_png`);
		}

		if (this.color == 1 || this.color == 3) {
			this.valueLabel.font = "common_poker_black_fnt";
		} else {
			this.valueLabel.font = "common_poker_red_fnt";
		}
	}


	public onTouchTap(e: egret.TouchEvent) {
		EventManager.instance.dispatch(EventNotify.BDZ_CARD_TOUCH, this.name);
	}

	/**
	 * 背面变正面。
	 */
	public showB2Z() {
		this.beiImage.visible = false;
		this.zhengGroup.visible = true;

	}

	/**
	 * 正面变背面。
	 */
	public showZ2B() {
		this.beiImage.visible = true;
		this.zhengGroup.visible = false;
	}

	public selectDown() {
		this.y = this.yuanXIndex;
		this.selected = false;
		return this.selected;
	}

	public selectUp() {
		this.y = this.yuanXIndex - 20;
		this.selected = true;
		return this.selected;
	}

	public showMb(value) {
		this.poker_m.visible = 1 == value ? false : true;
	}


	public pokerB2ZAni1() {
		this.zhengGroup.scaleX = 0;
		this.zhengGroup.visible = true;
		egret.Tween.get(this.beiImage).to({ scaleX: 0 }, 150, egret.Ease.sineIn).call(() => {
			this.beiImage.scaleX = 1; this.beiImage.visible = false;
			this.zhengGroup.scaleX = this.zhengGroup.scaleY = 1.05;
			egret.Tween.get(this.zhengGroup).to({ scaleX: 1, scaleY: 1 }, 150, egret.Ease.sineIn);
		});
	}

	public pokerB2ZAni2() {
		this.zhengGroup.scaleX = 0;
		this.zhengGroup.visible = true;
		egret.Tween.get(this.beiImage).to({ scaleX: 0 }, 200, egret.Ease.sineIn).call(() => {
			this.beiImage.scaleX = 1; this.beiImage.visible = false;
			egret.Tween.get(this.zhengGroup).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineIn);
		});
	}
}