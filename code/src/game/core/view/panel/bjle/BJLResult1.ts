module bjle {
	export class BJLResult1 extends eui.Component {
		private zx_quan: eui.Image;
		private zx_xiaoyuan: eui.Image;
		private zx_xiegang: eui.Image;
		private zx_hexiegang: eui.Image;
		public constructor() {
			super();
			this.skinName = new BJLResultSkin1();
		}

		public createChildren() {
			super.createChildren();
		}


		public initNums(i, j, ishe?) {
			switch (j) {
				case 2://大路
					this.show2(i, ishe);
					break;
				case 3://大眼路
					this.show3(i);
					break;
				case 4://小眼路
					this.show4(i);
					break;
				case 5://甲由路
					this.show5(i);
					break;
				case 6://庄闲问路
					break;
			}
		}

		//数据格式定义：1庄赢，5闲赢，9和局。
		private show2(j, ishe?) {
			if (j == 1) {
				this.zx_quan.visible = true;
				this.zx_quan.source = RES.getRes("bjl_red_big_quan_png");
			}
			if (j == 5) {
				this.zx_quan.visible = true;
				this.zx_quan.source = RES.getRes("bjl_blue_big_quan_png");
			}
			if (j == 9) {
				this.zx_hexiegang.visible = true;
				this.zx_hexiegang.visible = RES.getRes("bjl_blue_xie_png");
			}
		}

		//大眼路
		private show3(j) {
			if (j == 1) {
				this.zx_xiaoyuan.visible = true;
				this.zx_xiaoyuan.source = RES.getRes("bjl_red_quan_png");
			}
			if (j == 2) {
				this.zx_xiaoyuan.visible = true;
				this.zx_xiaoyuan.source = RES.getRes("bjl_blue_quan_png");
			}
		}

		//小眼路
		private show4(j) {
			if (j == 1) {
				this.zx_xiaoyuan.visible = true;
				this.zx_xiaoyuan.source = RES.getRes("bjl_red_dian_png");
			}
			if (j == 2) {
				this.zx_xiaoyuan.visible = true;
				this.zx_xiaoyuan.source = RES.getRes("bjl_blue_dian_png");
			}
		}

		//甲由路
		private show5(j) {
			if (j == 1) {
				this.zx_xiegang.visible = true;
				this.zx_xiegang.source = RES.getRes("bjl_red_small_xie_png");
			}
			if (j == 2) {
				this.zx_xiegang.visible = true;
				this.zx_xiegang.source = RES.getRes("bjl_blue_small_xie_png");
			}
		}
	}
}