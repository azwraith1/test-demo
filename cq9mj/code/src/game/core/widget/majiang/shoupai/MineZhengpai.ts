module majiang {
	export class MineZhengpai extends eui.Component{
		private colorImage: eui.Image;
		public constructor() {
			super();
			// this.skinName = new majiang.MineZhengPaiSkin();
		}

		public changeColor(color){
			this.colorImage.source = RES.getRes("color_value_"+ color + "_png");
		}
	}
}