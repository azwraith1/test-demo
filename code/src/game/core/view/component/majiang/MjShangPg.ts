/*
 * @Author: he bing 
 * @Date: 2018-07-12 14:13:53 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-08-23 18:52:01
 * @Description: 对家牌碰杠渲染赋值
 */

module majiang {
	export class MjShangPg extends BasePGItem {
		public constructor(type, color, lgth, pbg?) {
			super(type, color, lgth, pbg);
			if (lgth == 1) {
				this.skinName = new MjShangPgSkin4();
				this.times = 1;
			} else if (lgth == 2) {
				this.skinName = new MjShangPgSkin3();
				this.times = 2;
			} else if (lgth == 3) {
				this.skinName = new MjShangPgSkin2();
				this.times = 3;
			} else if (lgth == 4) {
				this.skinName = new MjShangPgSkin();
				this.times = 4;
			}
		}

		public createChildren() {
			super.createChildren();
			this.rectGroup.visible = false;
			switch (this.times) {
				case 1:
					this.showType(this.type, 10);
					break;
				case 2:
					this.showType(this.type, 7);
					break;
				case 3:
					this.showType(this.type, 4);
					break;
				case 4:
					this.showType(this.type, 1);
					break;
			}
		}

		/**
		 * 显示第几堆牌
		 */
		public showType(type, time) {
			switch (this.type) {
				case 5://碰
					this.showColor();
					break;
				case 3:
				case 1://明杠
					this.showColor_m();
					break;
				case 2:
				case 4:
					this.image1.source = "top_angang_" + time + "_png";
					this.image2.source = "top_angang_" + (time + 1) + "_png";
					this.image3.source = "top_angang_" + (time + 2) + "_png";
					this.showColor_a();
					break;
			}
		}
		//给碰牌麻将牌的牌面赋值。
		public showColor() {
			this.image4.visible = false;
			this.value4.visible = false;
			this.value1.source = "color_value_" + this.color + "_png";
			this.value2.source = "color_value_" + this.color + "_png";
			this.value3.source = "color_value_" + this.color + "_png";
		}

		//给明杠牌麻将牌的牌面赋值。
		public showColor_m() {
			this.value1.source = "color_value_" + this.color + "_png";
			this.value3.source = "color_value_" + this.color + "_png";
			this.value4.source = "color_value_" + this.color + "_png";
		}



		//碰变杠特有方法
		public showColor_pbg() {
			this.image4.visible = true;
			this.value4.visible = true;
			this.value1.source = "color_value_" + this.color + "_png";
			this.value3.source = "color_value_" + this.color + "_png";
			this.value4.source = "color_value_" + this.color + "_png";
		}


		//给暗杠牌麻将牌的牌面赋值。
		public showColor_a() {
			this.value4.source = "color_value_" + this.color + "_png";
		}

		/**
 * 杠变碰显动画；
 */
		public dianpaoAni() {
			let mc1 = game.MCUtils.getMc("hu_up1");
			let mc2 = game.MCUtils.getMc("hu_up2");
			this.addChild(mc2);
			this.addChild(mc1);
			mc2.scaleX = mc2.scaleX = 1.5;
			mc2.x = this.width / 2;
			mc2.y = this.height / 2;
			mc1.scaleX = mc1.scaleY = 1.5
			mc1.x = this.width / 2;
			mc1.y = this.height / 2 - 20;

			mc1.addEventListener(egret.MovieClipEvent.COMPLETE, () => {
				game.UIUtils.removeSelf(mc1);
				// game.MCUtils.reclaim("hu_up1", mc1);
			}, this);
			mc2.addEventListener(egret.MovieClipEvent.COMPLETE, () => {
				game.UIUtils.removeSelf(mc2);
				// game.MCUtils.reclaim("hu_up2", mc2);
			}, this);
			mc1.play(1);
			mc2.play(1);
		}

	}
}