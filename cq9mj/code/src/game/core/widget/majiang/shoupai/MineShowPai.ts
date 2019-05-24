/*
 * @Author: he bing 
 * @Date: 2018-07-24 17:59:54 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:22:40
 * @Description: 展示自己胡牌后，显示手中的牌
 */

module majiang {
	export class MineShowPai extends eui.Component {
		//手上的的牌的花色
		private colorArr;
		private colorArr1 = [];
		//1代表胡牌对局未结束，2胡牌对局结束。大家一起展示。
		private value;
		private mineHuShow: eui.Group;
		private mineHuShow_color: eui.Group;
		public constructor(arr, stus) {
			super();
			this.colorArr = arr;
			this.value = stus;
			this.skinName = new MineHuShowSkin();
		}

		public createChildren() {
			super.createChildren();
			this.showColors();

		}

		private showColors() {
			for (let key in this.colorArr) {
				let nums = this.colorArr[key];
				for (let i = 0; i < nums; i++) {
					this.colorArr1.push(key);
				}
			}
			this.show();
		}

		private show() {
			if (this.value == 2) {
				let imgs: eui.Image;
				this.mineHuShow.visible = true;
				for (let i = 0; i < this.colorArr1.length; i++) {
					this.mineHuShow.getChildAt(i).visible = true;
					imgs = this.mineHuShow_color.getChildAt(i) as eui.Image;
					imgs.source = RES.getRes("color_value_" + this.colorArr1[i] + "_png");
				}
			}
		}
	}
}