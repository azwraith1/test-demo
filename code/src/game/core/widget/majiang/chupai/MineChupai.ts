module majiang {
	export class MineChupai extends BaseChupai {
		public bgImage: eui.Image;
		public colorImage: eui.Image;
		private index;
		private record;
		private defaultSrouce = "7";
		public direction: string = "mine";
		public constructor(value) {
			super();
			this.value = value;
			this.skinName = new MineChupaiSkin();
		}

		public createChildren() {
			super.createChildren();
			this.colorImage.source = RES.getRes("color_value_" + this.value + "_png");
		}

		/**
		 * 设置牌的值。
		 */
		public setByRecord(record) {
			this.record = record;
			this.x = record.x;
			this.y = record.y;
			if (this.record.source) {
				this.bgImage.source = RES.getRes(this.record.source);
			}
		}

		public initWithIndex(index) {
			switch (index % 7) {
				case 0:
					this.colorImage.skewX = -2
					break
				case 1:
				case 2:
				case 3:
				case 4:
					this.colorImage.skewX = 2;
					break;
				case 5:
					this.colorImage.skewX = -1;
					break;
				case 6:
					this.colorImage.skewX = -1;
					break;
			}
			this.bgImage1.source = this.bgImage.source = RES.getRes("mine_chupai_" + index + "_png");
		}

		/**
		 * 设置牌面值的位置方向。
		 */
		public settingColors(index) {
			switch (index % 7) {
				case 1:
					// case 8:
					// case 15:
					this.colorImage.skewX = 4;
					break;
				case 2:
					// case 9:
					// case 16:
					this.colorImage.skewX = 3;
					break;
				case 3:
					// case 10:
					// case 17:
					this.colorImage.skewX = 2;
					break;
				case 4:
					// case 11:
					// case 18:
					this.colorImage.skewX = 1;
					break;
				case 5:
					// case 12:
					// case 19:
					this.colorImage.skewX = 0;
					break;
				case 6:
					// case 13:
					// case 20:
					this.colorImage.skewX = -1;
					break;
				case 0:
					// case 14:
					// case 21:
					this.colorImage.skewX = -2;
					break;
			}
		}
	}
}