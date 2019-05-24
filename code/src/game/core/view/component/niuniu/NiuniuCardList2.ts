/*
 * @Author: li mengchan 
 * @Date: 2018-10-24 14:02:31 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-11-22 17:50:01
 * @Description: 自己的手牌
 */
module niuniu {
	export class NiuniuCardList2 extends game.BaseUI {
		private card0: NiuniuCard;
		private card1: NiuniuCard;
		private card2: NiuniuCard;
		private card3: NiuniuCard;
		private card4: NiuniuCard;
		private touchonList: NiuniuCard[] = [];
		public constructor() {
			super();
			this.skinName = new NiuniuCardListSkin2();
		}

		public createChildren() {
			super.createChildren();
			// this.alphaIs0();
			// this.cardAnimation();

		}

		public renderByList(listData) {
			for (let i = 0; i < listData.length; i++) {
				let card = this['card' + i] as NiuniuCard;
				card.initWithNum(listData[i]);
			}
			// this.visible = true;
		}

		public delTouch() {
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTaped, this);
			for (let i = 0; i < 5; i++) {
				let card = this['card' + i] as NiuniuCard;
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
				let card = this["card" + i] as NiuniuCard;
				card.showB2Z();
			}
		}

		/**
		 * 发牌动画
		 */
		public cardAnimation() {
			this.alphaIs0();
			egret.Tween.get(this.card0).to({ x: 0, y: 0 }, 50).to({ x: 0, y: 0 }, 300)
			egret.Tween.get(this.card1).to({ x: 0, y: 0 }, 50).to({ x: 126, y: 0 }, 300)
			egret.Tween.get(this.card2).to({ x: 0, y: 0 }, 50).to({ x: 252, y: 0 }, 300)
			egret.Tween.get(this.card3).to({ x: 0, y: 0 }, 50).to({ x: 378, y: 0 }, 300)
			egret.Tween.get(this.card4).to({ x: 0, y: 0 }, 50).to({ x: 504, y: 0 }, 300)
		}

		public alphaIs0() {
			for (let i = 0; i < 5; i++) {
				let card = this["card" + i] as NiuniuCard;
				card.x = 0;
				card.y = 0;
			}
		}

		private onTouchTaped(e: egret.TouchEvent) {
			NiuniuUtils.playClick();
			let x = e.localX;
			let y = e.localY;
			let findCard = this.findTouchOn(x, y);
			if (!findCard) {
				return;
			}
			if (this.touchonList.indexOf(findCard) > -1) {
				findCard.selectDown();
				game.Utils.removeArrayItem(this.touchonList, findCard);
			} else {
				if (this.touchonList.length < 3) {
					findCard.selectUp();
					this.touchonList.push(findCard);
				} else {
					return;
				}
			}
			EventManager.instance.dispatch(EventNotify.CACULATOR_VALUE, this.touchonList);
		}

		private findTouchOn(x, y) {
			for (let i = 0; i <= 4; i++) {
				let card = this['card' + i] as NiuniuCard;
				let point = new egret.Point(x, y);
				let rectagle = new egret.Rectangle(card.x, card.y, card.width, card.height);
				if (rectagle.containsPoint(point)) {
					return card;
				}

			}
		}
	}
}