module bjle {
	export class BJLCmBtn extends eui.Component {
		private dbImage: eui.Image;
		private lightImage: eui.Image;
		private valueLabel: eui.BitmapLabel;

		public index: number;
		public value: number;
		public constructor(isNew: boolean) {
			super();
			if (isNew) {
				this.skinName = new BJLCmSkin();
			}
		}

		public createChildren() {
			super.createChildren();
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchOn, this);
		}

		private touchOn() {
			EventManager.instance.dispatch(EventNotify.RBWAR_CM_TOUCH, this.value);
		}

		/**
		 * 根据筹码的值的大小修改值的大小
		 */
		public setContent(value) {
			this.value = value;
			if (value < 1000) {
				this.valueLabel.scaleX = this.valueLabel.scaleY = 1;
			} else if (value >= 1000 && value < 10000) {
				this.valueLabel.scaleX = this.valueLabel.scaleY = 0.8;
			} else {
				this.valueLabel.scaleX = this.valueLabel.scaleY = 0.7;
			}

			this.valueLabel.text = value;

		}

		/**
		 * 筹码设值
		 */
		public setIndex(index) {
			this.index = index;
			this.dbImage.source = RES.getRes(`bjle_cm_${index}_png`);
		}

		public setTouchon(value) {
			this.lightImage.visible = this.value == value;
		}
	}
}