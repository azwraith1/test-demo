module majiang {
	export class TopChupai extends BaseChupai {
		public bgImage: eui.Image;
		public colorImage: eui.Image;
		private index;
		private record;
		public direction: string = "top";
		public constructor(value) {
			super();
			this.value = value;
			this.skinName = new TopChupaiSkin();
		}

		public createChildren() {
			super.createChildren();
			this.colorImage.source = RES.getRes("color_value_" + this.value + "_png");

		}


		private defaultSrouce: number = 7;
		public setByRecord(record) {
			this.record = record;
			this.x = record.x;
			this.y = record.y;
			if (this.record.source) {
				this.bgImage.source = RES.getRes(this.record.source);
			}
		}

		public initWithIndex(index) {
			this.bgImage.source = RES.getRes("top_chupai_" + index + "_png");
		}

		public settingColors(index) {
			this.colorImage.y = this.colorImage.y + 0.5;
			switch (index % 7) {
				case 1:
					// case 8:
					// case 15:
					this.colorImage.skewX = 177;
					this.colorImage.x = this.colorImage.x + 0.5;

					break;
				case 2:
					// case 9:
					// case 16:
					this.colorImage.skewX = 178;
					break;
				case 3:
					// case 10:
					// case 17:
					this.colorImage.skewX = 179;
					break;
				case 4:
					// case 11:
					// case 18:
					this.colorImage.skewX = 180;
					this.colorImage.x = this.colorImage.x - 0.5;
					break;
				case 5:
					// case 12:
					// case 19:
					this.colorImage.skewX = 181;
					this.colorImage.x = this.colorImage.x - 1;
					break;
				case 6:
					// case 13:
					// case 20:
					this.colorImage.skewX = 182;
					this.colorImage.x = this.colorImage.x - 1;
					break;
				case 0:
					// case 14:
					// case 21:
					this.colorImage.skewX = 183;
					this.colorImage.x = this.colorImage.x - 2;
					break;
			}
		}
	}
}