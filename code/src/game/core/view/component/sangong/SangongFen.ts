module sangong {
	export class SangongFen extends game.BaseUI {
		private sg_bg: eui.Image;
		private beishu: eui.BitmapLabel;
		private niuFen: eui.Image;
		private niuFen_text: eui.BitmapLabel;
		private data: any;
		private dir: any;
		public wancheng: eui.Label;
		private sg_bg0: eui.Image;
		public constructor(data) {
			super();
			this.data = parseInt(data);
			this.skinName = new SangongFenSkin();
		}

		public createChildren() {
			this.beishu.visible = false;
			super.createChildren();
			this.showFen(this.data);

		}

		private showFen(data) {
			this.beishu.letterSpacing = -5;
			switch (data) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					this.sg_bg.x = 10;
					this.sg_bg.source = RES.getRes("sg_06_bg_png");
					this.niuFen_text.font = "sg_06_fnt";
					this.niuFen_text.text = this.showFenshu(data);
					//this.beishu.x = this.niuFen_text.x + this.niuFen_text.width + 5;
					this.beishu.font = "sg_06bei_fnt"
					this.beishu.text = "(1倍)"
					this.niuFenFDSX(this.niuFen_text, this.dir);
					break;
				case 7:
				case 8:
				case 9:
					this.sg_bg.x = 5;
					this.sg_bg.source = RES.getRes("sg_79_bg_png");
					this.niuFen_text.font = "sg_79_fnt";
					this.niuFen_text.text = this.showFenshu(data);
					this.beishu.font = "sg_79bei_fnt"
					this.beishu.text = "(2倍)"
					this.niuFenFDSX(this.niuFen_text, this.dir);
					break;
				case 10:
					this.sg_bg.source = RES.getRes("sg_sg_bg_png");
					this.niuFen.source = RES.getRes("sg_sg_png")
					this.beishu.font = "sg_sgbei_fnt"
					this.beishu.text = "(3倍)"
					this.niuFenFDSX(this.niuFen, this.dir);
					break;
				case 11:
					this.sg_bg.source = RES.getRes("sg_dsg_bg_png");
					this.niuFen.x -= 25;
					this.niuFen.y -= 2;
					let texture = RES.getRes("sg_dsg_png");
					this.niuFen.source = texture;
					this.niuFen.width = texture.textureWidth;
					this.niuFen.height = texture.textureHeight;
					this.beishu.x = this.niuFen.x + this.niuFen.width + 5;
					this.beishu.font = "sg_dsgbei_fnt"
					this.beishu.text = "(4倍)"
					this.niuFenFDSX(this.niuFen, this.dir);
					break;
				case 12:
					this.sg_bg.x = 10;
					this.sg_bg.source = RES.getRes("sg_zz_bg_png");
					this.niuFen.source = RES.getRes("sg_zz_png")
					this.niuFen.y -= 2;
					this.beishu.x = this.niuFen.x + this.niuFen.width + 5;
					this.beishu.font = "sg_zzbei_fnt"
					this.beishu.text = "(5倍)"
					this.niuFenFDSX(this.niuFen, this.dir);
					break;
			}
		}

		private niuFenFDSX(num, dir) {
			game.UIUtils.setAnchorPot(num);
			num.scaleX = num.scaleY = 1.4;
			egret.Tween.get(num).to({ alpha: 1, scaleX: 1.4, scaleY: 1.4 }, 300).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 300).call(() => {
				this.beishu.visible = true;
			})
		}

		private showFenshu(data) {
			switch (data) {
				case 0:
					return "零点";
				case 1:
					return "一点";
				case 2:
					return "二点";
				case 3:
					return "三点";
				case 4:
					return "四点";
				case 5:
					return "五点";
				case 6:
					return "六点";
				case 7:
					return "七点";
				case 8:
					return "八点";
				case 9:
					return "九点";

			}
		}

	}
}