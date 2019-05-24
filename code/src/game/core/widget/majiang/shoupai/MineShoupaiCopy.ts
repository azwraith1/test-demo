module majiang {
	export class MineShoupaiCopy extends eui.Component {
		public colorImage: eui.Image;
		private value;
		public constructor(colorValue) {
			super();
			this.value = colorValue;
			this.skinName = new MineShoupaiSkin();
		}

		public createChildren() {
			super.createChildren();
			this.touchEnabled = true;
			this.colorImage.source = RES.getRes("color_value_" + this.value + "_png");
		}
	}
}