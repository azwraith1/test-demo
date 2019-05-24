module majiang {
	export class RightChupai extends BaseChupai {
		public bgImage: eui.Image;
		public colorImage: eui.Image;
		//行数
		private row;
		//列数
		private col;
		private record;
		private index: number;
		public direction: string = "right";
		public constructor(value, row, col) {
			super();
			this.row = row;
			this.col = col;
			this.value = value;
			this.skinName = new RightChupaiSkin();
		}

		public createChildren() {
			super.createChildren();
			this.colorImage.source = RES.getRes("color_value_" + this.value + "_png");
		}

		/**
		 * 根据之前记录的坐标绘制
		 * @param  {} record
		 */
		public setByRecord(record) {
			this.record = record;
			this.x = record.x;
			this.y = record.y;
			if (this.record.source) {
				this.bgImage1.source = this.bgImage.source = RES.getRes(this.record.source);
			}
		}

		public useBgSouce() {
			this.bgImage1.source = this.bgImage.source = RES.getRes("right_chupai_21_png");
		}

		public settingColors(index) {
			this.colorImage.width = this.colorImage.width - 2;
			this.colorImage.height = this.colorImage.height - 2;
			this.colorImage.x = this.colorImage.x + 2;
			this.colorImage.y = this.colorImage.y - 2;
			switch (index) {
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
					this.colorImage.skewX = -90;
					this.colorImage.skewY = 265;
					break;
				case 8:
				case 9:
				case 10:
				case 11:
				case 12:
				case 13:
				case 14:
					this.colorImage.skewX = -90;
					this.colorImage.skewY = 265;
					break;
				case 15:
				case 16:
				case 17:
				case 18:
				case 19:
				case 20:
				case 21:
					this.colorImage.skewX = -90;
					this.colorImage.skewY = 264;
					break;
			}
		}
	}
}