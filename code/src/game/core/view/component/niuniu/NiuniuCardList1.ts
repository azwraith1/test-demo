module niuniu {
	export class NiuniuCardList1 extends game.BaseUI {
		private card0: NiuniuCard;
		private card1: NiuniuCard;
		private card2: NiuniuCard;
		private card3: NiuniuCard;
		private card4: NiuniuCard;
		public constructor() {
			super();
			// this.skinName = new NiuniuCardListSkin1();
		}

		public createChildren() {
			super.createChildren();
		}

		/**
		 * 其他人翻牌
		 */
		public turnOutPoker_others() {

		}

		public renderByList(dataOrNum) {
			if (typeof(dataOrNum) != "number") {
				for (let i = 0; i < dataOrNum.length; i++) {
					let data = dataOrNum[i];
					let card = this['card' + i] as NiuniuCard;
					card.initWithNum(data);
					card.showB2Z();
					this.cardAnimation();

				}
			} else {
				for (let i = 0; i < dataOrNum; i++) {
					let card = this['card' + i] as NiuniuCard;
					card.showZ2B();
				}
			}
		}

		/**
		 * 发牌动画和展牌动画
		 */
		public cardAnimation() {
			this.alphaIs0();
			egret.Tween.get(this.card0).to({ x: 0, y: 0 }, 200)
			egret.Tween.get(this.card1).to({ x: 46, y: 0 }, 200)
			egret.Tween.get(this.card2).to({ x: 92, y: 0 }, 200)
			egret.Tween.get(this.card3).to({ x: 138, y: 0 }, 200)
			egret.Tween.get(this.card4).to({ x: 184, y: 0 }, 200)
		}

		/**
		 * 隐藏
		 */
		public alphaIs0() {
			for (let i = 0; i < 5; i++) {
				let card = this["card" + i] as NiuniuCard;
				card.x = 0;
				card.y = 0;
			}
		}
	}
}