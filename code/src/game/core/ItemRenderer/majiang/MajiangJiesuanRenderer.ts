module majiang {
	export class MajiangJiesuanRenderer extends game.BaseUI {
		private data;
		private dongzuoxiang: eui.Label;
		private beishu: eui.Label;
		private fen: eui.Label;
		//牌动作，吹风，下雨之类的。
		private dongzuo;
		//分
		private fenshu: number;
		public constructor(data) {
			super();
			this.data = data;
			this.skinName = new MajiangJiesuan();
		}

		protected createChildren(): void {
			super.createChildren();
			let num = this.data;
			for (let i in num) {
				//产生的动作，分正值和负值
				if (i === "type") {
					this.dongzuo = num[i];
				} else if (i === "info") {
					for (let j in num[i]) {
						let values = num[i][j];
						if (j === "gainGold") {
							if (this.dongzuo == 6) {
								this.dongzuoxiang.text = "呼叫转移";
							} else {
								this.dongzuoxiang.text = MajiangUtils.getBiliTypeStr(this.dongzuo, values, num["info"]["from"]);
							}
							this.dongzuoxiang.textColor = this.socreW2L(values);
							if (values > 0) {
								this.fen.text = "+" + NumberFormat.formatGold_scence(values);
								this.fen.textColor = this.socreW2L(values);
							} else {
								this.fen.text = NumberFormat.formatGold_scence(values);
								this.fen.textColor = this.socreW2L(values);
							}
							this.fenshu = NumberFormat.formatGold_scence(values);
						} else if (j === "gangType") {
							if (this.dongzuo == 6) {
								this.dongzuoxiang.text = "呼叫转移";
							} else {
								this.dongzuoxiang.text = MajiangUtils.getGangTypeStr(values, this.fenshu);
							}
							this.dongzuoxiang.textColor = this.socreW2L(this.fenshu);
						}
					}
				}

			}
		}

		/**
		 * 判断分数正负颜色
		 */
		public socreW2L(nums) {
			if (nums >= 0) {
				return 0xfff729;
			} else {
				return 0xffffff;
			}
		}
	}
}