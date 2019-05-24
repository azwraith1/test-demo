module zajinhua {
	export class ZajinhuaYzBtn extends game.BaseUI {
		private dbImage: eui.Image;
		private valueLabel: eui.BitmapLabel;

		public index: number;
		public value: number;
		private values = [];
		public constructor(isNew: boolean) {
			super();
			if (isNew) {
				this.skinName = new ZajinhuaYZBtn();
			}
		}

		public createChildren() {
			super.createChildren();

		}
		public onRemoved() {
			super.onRemoved();
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchOn, this);
		}

		public addTouchOn() {
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchOn, this);
		}

		private touchOn() {
			EventManager.instance.dispatch(EventNotify.ZJH_CM_TOUCH, this.value);
		}


		public setContent(value) {
			this.value = value;
			if (value < 100) {
				this.valueLabel.scaleX = this.valueLabel.scaleY = 0.9;
			} else if (value >= 100 && value < 1000) {
				this.valueLabel.scaleX = this.valueLabel.scaleY = 0.8;
			} else {
				this.valueLabel.scaleX = 0.7; this.valueLabel.scaleY = 0.8;
			}
			this.valueLabel.text = value;
		}

		public setIndex(index) {
			this.index = index;
			this.dbImage.source = RES.getRes(`zjh_cm${index}_png`);

		}

		public setTouchon(value) {
			//this.lightImage.visible = 1 == value;
			this.touchEnabled = 1 == value;
		}
	}
}