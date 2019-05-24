/*
 * @Author: he bing 
 * @Date: 2018-07-24 17:59:54 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2019-01-14 18:23:18
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
					this.colorArr1.push(Number(key));
				}
			}
			this.show();
		}

		private show() {
			if (this.value == 2) {
				let imgs: eui.Image;
				this.mineHuShow.visible = true;
				for (let i = 0; i <= 13; i++) {
					let color = this.colorArr1[i];
					imgs = this['color' + i] as eui.Image;
					if (color) {
						this['image' + i].visible = true;
						imgs.source = RES.getRes("color_value_" + this.colorArr1[i] + "_png");
					} else {
						this['image' + i].visible = false;
						imgs.source = "";
					}
				}
			}
		}

		private gaidongArr = [];
		public clearGaidong() {
			while (this.gaidongArr.length > 0) {
				let index = this.gaidongArr.pop();
				let di = this['image' + index];
				let color = this['color' + index];
				di.y += 20;
				color.y += 20;
			}

		}

		private updateShoupai(card) {
			this.colorArr = card;
			this.colorArr1 = [];
			this.showColors();
		}


		public updateShoupaiByArr(cardsArr, queType = 0) {
			this.colorArr1 = cardsArr;
			this.show();
		}

		private findSelectIndex(card){
			let arr = _.clone(this.colorArr1);
			for(let i = 0; i < arr.length; i++){
				if(arr[i] == card && this.gaidongArr.indexOf(i) == -1){
					return i;
				}
			};
			return -1;
		}

		private selectUpOrDown(card, up) {
			let index = this.findSelectIndex(card);
			this.gaidongArr.push(index);
			let di = this['image' + index];
			let color = this['color' + index];
			if (up) {
				egret.Tween.get(di).to({
					y: di.y - 20
				}, 200)
				egret.Tween.get(color).to({
					y: color.y - 20
				}, 200)
			} else {
				di.y -= 20;
				color.y -= 20;
				egret.Tween.get(di).wait(1000).to({
					y: di.y + 20
				}, 200)
				egret.Tween.get(color).wait(1000).to({
					y: color.y + 20
				}, 200)
			}
		}
	}
}