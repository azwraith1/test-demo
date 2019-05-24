/*
 * @Author: he bing 
 * @Date: 2018-07-12 14:13:42 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-08-23 18:51:31
 * @Description: 左边杠牌。
 */

module majiang {
	export class MjLeftPg extends eui.Component {
		private nuberTime = [];//传了几个不同的花色。最多4种
		private times;//那堆牌。
		private type;
		public color;
		private pbg;
		private p_1: eui.Image;
		private p_2: eui.Image;
		private p_3: eui.Image;
		private p_4: eui.Image;
		private p_1_img: eui.Image;
		private p_2_img: eui.Image;
		private p_3_img: eui.Image;
		private p_4_img: eui.Image;
		private leftRectGroup: eui.Rect;
		public constructor(type, color, lgth, pbg?) {
			super();
			this.type = type;
			this.color = color;
			this.pbg = pbg;
			if (lgth == 1) {
				this.skinName = new MjLeftPgSkin();
				this.times = 1;
			} else if (lgth == 2) {
				this.skinName = new MjLeftPgSkin2();
				this.times = 2;
			} else if (lgth == 3) {
				this.skinName = new MjLeftPgSkin3();
				this.times = 3;
			} else if (lgth == 4) {
				this.skinName = new MjLeftPgSkin4();
				this.times = 4;
			}
		}

		public createChildren() {
			super.createChildren();
			this.leftRectGroup.visible = false;
			switch (this.times) {
				case 1:
					this.showType(this.type, 1);
					break;
				case 2:
					this.showType(this.type, 4);
					break;
				case 3:
					this.showType(this.type, 7);
					break;
				case 4:
					this.showType(this.type, 10);
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
					this.p_1_img.source;
					this.p_2_img.source;
					this.p_3_img.source;
					this.p_4_img.source;
					this.showColor_m();
					break;
				case 2:
				case 4:
					this.p_1.source = "left_angang_" + time + "_png";
					this.p_2.source = "left_angang_" + (time + 1) + "_png";
					this.p_3.source = "left_angang_" + (time + 2) + "_png";
					this.showColor_a();
					break;
			}
		}

		//给碰牌麻将牌的牌面赋值。
		public showColor() {
			this.p_4.visible = false;
			this.p_4_img.visible = false;
			this.p_1_img.source = "color_value_" + this.color + "_png";
			this.p_2_img.source = "color_value_" + this.color + "_png";
			this.p_3_img.source = "color_value_" + this.color + "_png";
		}

		//给明杠牌麻将牌的牌面赋值。
		public showColor_m() {
			this.p_1_img.source = "color_value_" + this.color + "_png";
			this.p_3_img.source = "color_value_" + this.color + "_png";
			this.p_4_img.source = "color_value_" + this.color + "_png";

		}

		//碰变杠
		public showColor_pbg() {
			this.p_4.visible = true;
			this.p_4_img.visible = true;
			this.p_1_img.source = "color_value_" + this.color + "_png";
			this.p_3_img.source = "color_value_" + this.color + "_png";
			this.p_4_img.source = "color_value_" + this.color + "_png";
		}

		//给暗杠牌麻将牌的牌面赋值。
		public showColor_a() {
			this.p_4_img.source = "color_value_" + this.color + "_png";
		}

		public showRect(value) {
			if (value == 0) {
				this.leftRectGroup.visible = false;
			} else {
				this.leftRectGroup.visible = true;
			}
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