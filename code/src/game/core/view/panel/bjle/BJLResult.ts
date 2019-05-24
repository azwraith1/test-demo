module bjle {
	export class BJLResult extends eui.Component {
		private zx_w2l: eui.Image;
		private z_dui: eui.Image;
		private x_dui: eui.Image;
		public constructor() {
			super();
			this.skinName = new BJLResultSkin();
		}

		public createChildren() {
			super.createChildren();
		}

		public initNums(i) {
			switch (i) {
				case 1:
				case 2:
				case 3:
				case 4:
					this.zx_w2l.visible = true;
					this.zx_w2l.source = RES.getRes("bjl_zxh_1_png");
					this.show1(i);
					break;
				case 5:
				case 6:
				case 7:
				case 8:
					this.zx_w2l.visible = true;
					this.zx_w2l.source = RES.getRes("bjl_zxh_2_png");
					this.show1(i - 4);
					break;
				case 9:
				case 10:
				case 11:
				case 12:
					this.zx_w2l.visible = true;
					this.zx_w2l.source = RES.getRes("bjl_zxh_3_png");
					this.show1(i - 8);
					break;

			}
		}

		private show1(j) {
			if (j == 2) {
				this.z_dui.visible = true;
				this.z_dui.source = RES.getRes("bjl_red_dian_png");
			}
			if (j == 3) {
				this.x_dui.visible = true;
				this.x_dui.source = RES.getRes("bjl_blue_dian_png");
			}
			if (j == 4) {
				this.z_dui.visible = true;
				this.z_dui.source = RES.getRes("bjl_red_dian_png");
				this.x_dui.visible = true;
				this.x_dui.source = RES.getRes("bjl_blue_dian_png");
			}
		}
	}
}