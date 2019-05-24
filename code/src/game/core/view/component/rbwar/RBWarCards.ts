module rbwar {
	export class RBWarCards extends eui.Component {
		private imageBei: eui.Image;
		private group: eui.Group;
		private valueLabel: eui.BitmapLabel;
		private bigColorImg: eui.Image;
		private smallColorImg: eui.Image;
		public value: number;
		public color: number;
		public number: number;
		public constructor() {
			super();
			this.skinName = new RBWarCardSkin();
		}

		public createChildren() {
			super.createChildren();
		}

		public initWithNum(num: number) {
			
			this.number = num;
			this.color = Math.floor(num / 100);
			this.value = Math.floor(num % 100);
			this.changeImage();
			this.showB2Z();
		}
		/**
		 * 牌面
		 */
		public changeImage() {
			this.valueLabel.text = PukerUtils.number2Puker(this.value);
			this.smallColorImg.source = RES.getRes(`zjh_big_${this.color}_png`);
			if (this.value >= 11 && this.value <= 13) {
				if (this.color == 1 || this.color == 3) {
					this.bigColorImg.source = RES.getRes(`zjh_${this.value}_1_png`);
				} else {
					this.bigColorImg.source = RES.getRes(`zjh_${this.value}_2_png`);
				}
			} else {
				this.bigColorImg.source = RES.getRes(`zjh_big_${this.color}_png`);
			}

			if (this.color == 1 || this.color == 3) {
				this.valueLabel.font = "zjh_poker_blcak_fnt";
			} else {
				this.valueLabel.font = "zjh_poker_red_fnt";
			}
		}

		/**
		 * 背面变正面。
		 */
		public showB2Z() {
			this.imageBei.visible = false;
			this.group.visible = true;
		}

		/**
		 * 正面变背面。
		 */
		public showZ2B() {
			this.imageBei.visible = true;
			this.group.visible = false;
		}

		public selectDown() {
			this.y = 0;
		}

		public selectUp() {
			this.y = - 20;
		}

	}
}