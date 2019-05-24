/*
 * @Author: li mengchan 
 * @Date: 2018-10-24 14:02:31 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-11-22 17:51:55
 * @Description: 自己的手牌
 */
module sangong {
	export class SangongCardList2 extends game.BaseUI {
		private card0: SangongCard;
		private card1: SangongCard;
		private card2: SangongCard;
		private touchonList: SangongCard[] = [];
		public constructor() {
			super();
			this.skinName = new SangongCardListSkin2();
		}

		public createChildren() {
			super.createChildren();
			// this.alphaIs0();
			// this.cardAnimation();

		}

		/**
		 * 显示牌的背面
		 */
		public renderByList1(listData) {
			for (let i = 0; i < listData.length; i++) {
				let card = this['card' + i] as SangongCard;
				card.showZ2B();
			}
		}

		public renderByList2(num) {
			for (let i = 0; i < num; i++) {
				let card = this['card' + i] as SangongCard;
				card.showZ2B();
			}
		}




		public renderByList(listData, num?) {
			for (let i = 0; i < listData.length; i++) {
				let card = this['card' + i] as SangongCard;
				card.initWithNum(listData[i]);
				card.showB2Z();
				if (num == 1) {
				} else {
					this.cardAnimation();
				}
			}
		}

		public delTouch() {
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTaped, this);
			for (let i = 0; i < 3; i++) {
				let card = this['card' + i] as SangongCard;
				card.selectDown();
			}
		}

		public addTouch() {
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTaped, this);
		}
		/**
	 * 自己翻牌
	 */
		public turnOutPoker_me(card) {
			this.renderByList(card);
			for (let i = 0; i < card.length; i++) {
				let card = this["card" + i] as SangongCard;
				card.showB2Z();
			}
		}



		/**
		 * 发牌动画
		 */
		public cardAnimation() {
			this.alphaIs0();
			egret.Tween.get(this.card0).to({ x: 0, y: 0 }, 50).to({ x: 0, y: 0 }, 300)
			egret.Tween.get(this.card1).to({ x: 0, y: 0 }, 50).to({ x: 123, y: 0 }, 300)
			egret.Tween.get(this.card2).to({ x: 0, y: 0 }, 50).to({ x: 246, y: 0 }, 300)
		}

		public alphaIs0() {
			for (let i = 0; i < 3; i++) {
				let card = this["card" + i] as SangongCard;
				card.x = 0;
				card.y = 0;
			}
		}

		private root: SangongGameScene;
		public setRoot(root) {
			this.root = root;
		}

		private onTouchTaped(e: egret.TouchEvent) {
			NiuniuUtils.playClick();
			//发送请求选择好了牌	
		}
	}
}