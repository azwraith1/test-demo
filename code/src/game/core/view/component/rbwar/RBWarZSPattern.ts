module rbwar {
	export class RBWarZSPattern extends eui.Component{
		private dbImage: eui.Image;
		private contentLabel: eui.Label;
		public constructor() {
			super();
			this.skinName = new RBWarZSPatternSkin();
		}

		public createChildren(){
			super.createChildren();
		}

		public showContent(label){
			this.contentLabel.text = label;
		}

		public initModel(colorType: boolean){
			if(!colorType){
				this.dbImage.source = RES.getRes("rbw_qs_db4_png")
				this.contentLabel.textColor = 0xffffff;
			}else{
				this.dbImage.source = RES.getRes("rbw_qs_db2_png")
				this.contentLabel.textColor = 0x552409;
			}
		}

	}
}