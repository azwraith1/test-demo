module zajinhua {
	export class ZajinhuaCardListMine extends game.BaseUI {
		public card0: ZajinhuaCard;
		public card1: ZajinhuaCard;
		public card2: ZajinhuaCard;
		private fenImage: eui.Image;
		private fenGroup: eui.Group;
		private bpw2l: eui.Image;
		public constructor() {
			super();
			//this.skinName = new ZajinhuaMineCardsSkin();
		}

		public createChildren() {
			super.createChildren();
			this.db();

		}

		public renderByList(listData, isAni) {
			for (let i = 0; i < listData.length; i++) {
				let card = this['card' + i] as ZajinhuaCard;
				card.initWithNum(listData[i]);
				card.showB2Z();
			}
			if (isAni) {
				this.cardAnimation();
			}
		}

		/**
		 * 展牌动画
		 */
		public cardAnimation() {
			this.alphaIs0();
			egret.Tween.get(this.card0).to({ x: 65, y: 92.5 }, 50).to({ x: 65, y: 92.5 }, 300)
			egret.Tween.get(this.card1).to({ x: 65, y: 92.5 }, 50).to({ x: 198.5, y: 92.5 }, 300)
			egret.Tween.get(this.card2).to({ x: 65, y: 92.5 }, 50).to({ x: 332, y: 92.5 }, 300)

		}

		public alphaIs0() {
			for (let i = 0; i < 3; i++) {
				let card = this["card" + i] as ZajinhuaCard;
				card.x = 65;
				card.y = 92.5;
			}
		}

		/**
		 * 展示分数
		 */
		public showFen(num, isConit: boolean = false) {
			//10表示隐藏。
			this.db();
			this.addChild(this.fenGroup);
			this.fenGroup.visible = (num == 10) ? false : true;
			if (num != 10) {
				if (isConit) {
					this.fenImage.source = "zjh_px_" + num + "_png";
					return;
				}
				if (num >= 3) {
					this.fenImage.source = "zjh_px_diban_png";
					this.word.play(this.chose(num), 1);
				} else {
					this.fenImage.source = "zjh_px_" + num + "_png";
				}
			}
		}

		private word: DBComponent;
		private db() {
			this.fenGroup.removeChildren();
			this.word = new DBComponent("words");
			this.word.scaleX = this.word.scaleY = 1.2;
			this.fenGroup.addChild(this.fenImage);
			this.fenGroup.addChild(this.word);
			this.word.verticalCenter = 10;
			this.word.horizontalCenter = 0;
			this.word.visible = false;
			this.word.callback = () => {
			}
		}

		private chose(num) {
			switch (num) {
				case 3:
					return "jinhua";
				case 4:
					return "shunjin";
				case 5:
					return "baozi";
			}
		}

		public showFen1(num) {
			//10表示隐藏。
			this.fenGroup.visible = (num == 1) ? true : false;
		}



		public showCardByIndex(index) {
			this["card" + index].visible = true;
		}


		/**
		 * 中间收牌
		 */
		public zhongjianShouPai() {
			egret.Tween.get(this.card0).to({ x: this.card1.x }, 200);
			egret.Tween.get(this.card2).to({ x: this.card1.x }, 200);
		}

		/**
	 * 恢复最初状态
	 */
		public setNomal(num) {
			for (let i = 2; i >= 0; i--) {
				let cd = this["card" + i] as ZajinhuaCard;
				cd.scaleX = 1;
				cd.scaleY = 1;
				cd.y = 92.5;
				cd.x = 65 + (i * 133.5);
				cd.alpha = 1;
				cd.showMb(num);
				if (num != 2) {
					cd.showZ2B();
				}
				cd.visible = 1 == num ? false : true;
				if (num == 2) {
					this.addChild(this.fenGroup);
					this.showFen1(1)
				}
			}
		}

		public paiBianHui() {
			for (let i = 0; i < 3; i++) {
				this["card" + i].showMb(2);
			}
		}
	}
}