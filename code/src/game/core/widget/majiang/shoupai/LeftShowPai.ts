/*
 * @Author: he bing 
 * @Date: 2018-07-24 18:00:09 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2019-01-14 18:21:34
 * @Description: 左方玩家胡牌后，显示手中的牌
 */

module majiang {
	export class LeftShowPai extends eui.Component {
		//手上的的牌的花色
		private colorArr;
		private colorArr1 = [];
		//1代表胡牌对局未结束，2胡牌对局结束。大家一起展示。
		private value;
		private leftHuShow: eui.Group;
		private leftHuShow_color: eui.Group;
		private leftHuShow_bei: eui.Group;

		private points: any = {};

		public constructor(arr, stus) {
			super();
			this.colorArr = arr;
			this.value = stus;
			this.skinName = new LeftHuShowSkin();
		}

		public createChildren() {
			super.createChildren();
			// for(let i = 0; i < this.leftHuShow.numChildren; i++){
			// 	if(!this.points['color']){
			// 		this.points['color'] = {};
			// 	}
			// 	let child = this.leftHuShow.getChildAt(i);
			// 	this.points['color'][i] = {x : child.x, y: child.y};
			// 	if(!this.points['di']){
			// 		this.points['di'] = {};
			// 	}
			// 	let child1 = this.leftHuShow_color.getChildAt(i);
			// 	this.points['di'][i] = {x : child1.x, y: child1.y};
			// }

			if (this.value == 1) {
				this.show();
			} else if (this.value == 2) {
				this.showColors();
			}
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
			if (this.value == 1) {
				this.leftHuShow_bei.visible = true;
				for (let i = 0; i < this.colorArr.length; i++) {
					this.leftHuShow_bei.getChildAt(i).visible = true;
				}
			} else if (this.value == 2) {
				let imgs: eui.Image;
				this.leftHuShow.visible = true;
				for (let i = 0; i <= 13; i++) {
					let color = this.colorArr1[i];
					imgs = this['color' + i] as eui.Image;
					if(color){	
						this['image' + i].visible = true;
						imgs.source = RES.getRes("color_value_" + this.colorArr1[i] + "_png");
					}else{
						this['image' + i].visible = false;
						imgs.source = "";
					}
				}
			}
		}


		/**
	 * 出牌，碰牌，杠牌
	 */
		public chuPais(card) {
			this.chushihuashuju();
			this.shoupaifz(card);
		}
		/**
		 * 碰牌
		 */
		public pengPai(card) {
			this.chushihuashuju();
			this.shoupaifz(card);
		}
		/**
		 * 摸牌
		 */
		public moPais(cards) {
			this.chushihuashuju();
			this.shoupaifz(cards, 1);
		}
		/**
		 * zhimo
		 */

		public zhimo(cards) {
			this.chushihuashuju();
			let card = _.initial(cards);
			this.shoupaifz(card);
		}
		/**
		 * 摸，出牌赋值
		 */
		private shoupaifz(colorArrs, numbers?) {
			try {
				let imgs: eui.Image;
				this.leftHuShow.visible = true;
				for (let i = 0; i < colorArrs.length; i++) {
					this.leftHuShow.getChildAt(i).visible = true;
					this.leftHuShow_color.getChildAt(i).visible = true;
					imgs = this.leftHuShow_color.getChildAt(i) as eui.Image;
					imgs.source = RES.getRes("color_value_" + colorArrs[i] + "_png");

				}
			} catch (e) {
				LogUtils.logI("cuol")
			}

		}



		public huansanzhang(cards) {
			for (let i = 0; i < cards.length; i++) {
				for (let j = 0; j < this.arrysValues.length; j++) {
					if (cards[i] == this.arrysValues[j]) {
						this.arrysValues.splice(j, 1)
					}
				}
			}

			this.chushihuashuju();
			this.shoupaifz(this.arrysValues);
		}
		/**
		 * 初始化给牌赋值。
		 */
		private arrysValues = [];
		public initArr(cards) {
			this.arrysValues = [];
			this.chushihuashuju();
			let imgs: eui.Image;
			for (let key in cards) {
				let nums = cards[key];
				for (let i = 0; i < nums; i++) {
					this.arrysValues.push(key);
				}
			}
			this.leftHuShow.visible = true;
			for (let i = 0; i < this.arrysValues.length; i++) {
				this.leftHuShow.getChildAt(i).visible = true;
				this.leftHuShow_color.getChildAt(i).visible = true;
				imgs = this.leftHuShow_color.getChildAt(i) as eui.Image;
				imgs.source = RES.getRes("color_value_" + this.arrysValues[i] + "_png");
			}
		}

		/**
	 * 值设空
	 */
		private chushihuashuju() {
			this.leftHuShow.visible = false;
			for (let i = 0; i < 14; i++) {
				this.leftHuShow.getChildAt(i).visible = false;
				this.leftHuShow_color.getChildAt(i).visible = false;
			}
		}

		private gaidongArr = [];
		public clearGaidong() {
			while (this.gaidongArr.length > 0) {
				let index = this.gaidongArr.pop();
				let di = this['image' + index];
				let color = this['color' + index];
				di.x -= 20;
				color.x -= 20;
			}

		}

		public updateShoupaiByArr(cardsArr, queType = 0){
			this.colorArr1 = cardsArr;	
			this.show();
		}

		private updateShoupai(card){
			this.colorArr = card;
			this.colorArr1 = [];
			this.showColors();
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
					x: di.x + 20
				}, 200)
				egret.Tween.get(color).to({
					x: color.x + 20
				}, 200)
			}else{
				di.x += 20;
				color.x += 20;
				egret.Tween.get(di).wait(1000).to({
					x: di.x - 20
				}, 200)
				egret.Tween.get(color).wait(1000).to({
					x: color.x - 20
				}, 200)
			}
		}

	}
}