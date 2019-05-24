module rbwar {
	export class RBWarQSText extends eui.Component{
		private textImage: eui.Label;
		public dbImage: eui.Image;
		public constructor() {
			super();
		}

		public createChildren(){
			super.createChildren();
		}

		public showText(text){
			this.textImage.text = text;
		}

		public changeBg(luckWin){
			if(!luckWin){
				this.textImage.textColor = 0xFFFFFF;
				this.dbImage.source = RES.getRes("rb_qs_bar_png");
			}else{
				this.textImage.textColor = 0x552409;
				this.dbImage.source = RES.getRes("rb_qs_bar2_png");
			}
		}

		public changeTongsha(){
			this.textImage.textColor = 0xFFFFFF;
			this.dbImage.source = RES.getRes("rb_qs_bar3_png");
			this.textImage.text = "对七";
		}
	}
}