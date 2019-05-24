module niuniu {
	export class NiuniuNewFen extends game.BaseUI {
		private beishu: eui.BitmapLabel;
		private niuFen: eui.Image;
		private niuFen_text: eui.BitmapLabel;
		private data: any;
		public wancheng: eui.Label;
		public constructor(data) {
			super();
			this.data = parseInt(data);
			this.skinName = new NiuniuNewFenSkin();
		}

		public createChildren() {
			super.createChildren();
			this.showFen(this.data);

		}


		private visibles(nums) {
			this.niuFen.visible = this.niuFen_text.visible = this.beishu.visible = nums == 1 ? true : false;
			this.wancheng.visible = nums == 1 ? false : true;
		}

		private showFen(data) {
			switch (data) {
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
					this.niuFen_text.x = 41;
					this.beishu.x = 115;
					this.niuFen_text.font = "nns_12345_fnt";
					this.niuFen_text.text = this.showFenshu(data);
					this.beishu.font = "nns_12345bei_fnt"
					this.beishu.text = "(1倍)"
					this.niuFenFDSX(this.niuFen_text);
					return;
				case 6:
				case 7:
				case 8:
				case 9:
					this.niuFen_text.x = 38;
					this.niuFen_text.y = 4;
					this.beishu.x = 113;
					this.niuFen_text.font = "nns_6789_fnt";
					this.niuFen_text.text = this.showFenshu(data);
					this.beishu.font = "nns_6789bei_fnt"
					this.beishu.text = "(2倍)"
					this.niuFenFDSX(this.niuFen_text);
					return;
				case 10:
					this.beishu.x = 113;
					let startDb10 = new DBComponent("niuniu_partten10");
					startDb10.callback = () => {
					}
					this.addChild(startDb10);
					startDb10.x = 123;
					startDb10.y = 23;
					startDb10.playDefault(1);
					this.beishu.font = "nns_45hbei_fnt"
					this.beishu.text = "(3倍)"
					return;
				case 11:
				case 12:
					this.niuFen_text.x = 23;
					this.beishu.x = 133;
					this.niuFen_text.font = "nns_nn45h_fnt";
					this.niuFen_text.text = this.showFenshu(data);
					this.niuFen_text.letterSpacing = -11;
					this.beishu.letterSpacing = -4;
					this.beishu.font = "nns_45hbei_fnt"
					this.beishu.text = "(4倍)"
					this.niuFenFDSX(this.niuFen_text);
					return;
				case 13:
					this.beishu.x = 115;
					let startDb13 = new DBComponent("niuniu_partten13");
					startDb13.callback = () => {
					}
					this.addChild(startDb13);
					startDb13.x = 123;
					startDb13.y = 23;
					startDb13.playDefault(1);
					this.beishu.font = "nns_zdbei_fnt"
					this.beishu.text = "(5倍)"
					return;
				case 14:
					this.beishu.x = 126.5;
					let startDb = new DBComponent("niuniu_partten14");
					startDb.callback = () => {
					}
					this.addChild(startDb);
					startDb.x = 115;
					startDb.y = 23;
					startDb.playDefault(1);
					this.beishu.font = "nns_fivebei_fnt"
					this.beishu.text = "(6倍)"
					return;
				case 0:
					this.niuFen.source = RES.getRes("nns_pt0_png")
					this.niuFen.x = 70;
					this.niuFen.y = 4;
					this.beishu.text = "";
					this.niuFenFDSX(this.niuFen);
					return;
			}
		}

		private niuFenFDSX(num) {
			game.UIUtils.setAnchorPot(num);
			egret.Tween.get(num).to({ alpha: 0, scaleX: 0, scaleY: 0 }, 50).to({ alpha: 1, scaleX: 1.4, scaleY: 1.4 }, 300).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 300)
		}

		private showFenshu(data) {
			switch (data) {
				case 1:
					return "牛一";
				case 2:
					return "牛二";
				case 3:
					return "牛三";
				case 4:
					return "牛四";
				case 5:
					return "牛五";
				case 6:
					return "牛六";
				case 7:
					return "牛七";
				case 8:
					return "牛八";
				case 9:
					return "牛九";
				case 10:
					return "牛牛";
				case 11:
					return "四花牛";
				case 12:
					return "五花牛";

			}
		}

	}
}