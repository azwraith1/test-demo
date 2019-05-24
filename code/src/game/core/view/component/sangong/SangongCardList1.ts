module sangong {
	export class SangongCardList1 extends game.BaseUI {
		private card0: SangongCard;
		private card1: SangongCard;
		private card2: SangongCard;
		public constructor() {
			super();
			// this.skinName = new SangongCardListSkin1();
		}

		public createChildren() {
			super.createChildren();
		}

		public turnOutPoker_others() {


		}

			public renderByList(dataOrNum) {
			if (typeof (dataOrNum) != "number") {
				for (let i = 0; i < dataOrNum.length; i++) {
					let data = dataOrNum[i];
					let card = this['card' + i] as SangongCard;
					if (card) {
						card.initWithNum(data);
						card.showB2Z();
						this.cardAnimation();
					}
				}
			} else {
				for (let i = 0; i < dataOrNum; i++) {
					let card = this['card' + i] as SangongCard;
					if (card) {
						card.showZ2B();
					}
				}
			}
			
		}

		/**
		 * 发牌动画和展牌动画
		 */
		public cardAnimation() {
			this.alphaIs0();
			egret.Tween.get(this.card0).to({ x: 0, y: 0 }, 200)
			egret.Tween.get(this.card1).to({ x: 34, y: 0 }, 200)
			egret.Tween.get(this.card2).to({ x: 67, y: 0 }, 200)
		}

		/**
		 * 隐藏
		 */
		public alphaIs0() {
			for (let i = 0; i < 3; i++) {
				let card = this["card" + i] as SangongCard;

				card.x = 0;
				card.y = 0;
			}
		}
	}
}