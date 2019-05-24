module zajinhua {
	export class ZajinhuaCardListOther extends game.BaseUI {
		public card0: ZajinhuaCard;
		public card1: ZajinhuaCard;
		public card2: ZajinhuaCard;
		private fenGroup: eui.Group;
		private fenImage: eui.Image;
		private bpw2l: eui.Image;
		public constructor() {
			super();
			//this.skinName = new ZajinhuaOtherCardsSkin();
		}

		public createChildren() {
			super.createChildren();
			this.db();
		}

		public renderByList(listData) {
			let k = listData.length;
			for (let i = 0; i < k; i++) {
				let card = this['card' + (k - 1 - i)] as ZajinhuaCard;
				card.visible = true;
				card.initWithNum(listData[i]);
				card.showB2Z();
			}
			this.cardAnimation();
		}

		/**
		 * 发牌动画和展牌动画
		 */
		public cardAnimation() {
			this.alphaIs0();
			egret.Tween.get(this.card0).to({ x: 129, y: 129.5 }, 200)
			egret.Tween.get(this.card1).to({ x: 40, y: 0 }, 200)
			egret.Tween.get(this.card2).to({ x: 45, y: 129.5 }, 200)

		}

		/**
		 * 隐藏
		 */
		public alphaIs0() {
			this.card0.rotation = this.card2.rotation = 0;
			this.card0.x = 129; this.card0.y = 129.5
			this.card2.x = 129; this.card2.y = 129.5
			this.card1.x = 84; this.card1.y = 0

		}




		/**
		 * 看牌动画
		 */
		public showLookPai(isAni) {
			if (isAni) {
				this.card1.y = 0;
				egret.Tween.get(this.card0).to({ rotation: -7 }, 200);
				egret.Tween.get(this.card1).to({ y: - 7 }, 200);
				egret.Tween.get(this.card2).to({ rotation: 7 }, 200);
				this.addChild(this.fenGroup);
			} else {
				this.card0.rotation = -7;
				this.card1.y = -7;
				this.card2.rotation = 7;
			}

		}


		/**
		 * 恢复最初状态
		 */
		public setNomal() {
			for (let i = 2; i >= 0; i--) {
				let cd = this["card" + i] as ZajinhuaCard;
				cd.scaleX = 0.7;
				cd.scaleY =0.7;
				cd.alpha = 1;
				this.addChild(cd);
				cd.showZ2B();
				cd.showMb(1);
				cd.visible = false;
			}

			this.card0.rotation = this.card2.rotation = 0;
			this.card1.y = 0;
			this.card1.x = 46;
			this.card0.x = 45;
			this.card2.x = 129;
			this.card2.y = this.card0.y = 129.5;
			this.card0.anchorOffsetX = this.card2.anchorOffsetX = this.card0.width / 2;
			this.card0.anchorOffsetY = this.card2.anchorOffsetY = this.card0.height;
			this.card1.anchorOffsetX = this.card1.anchorOffsetY = 0;
		}

		/**
		 * 三合一，未开牌合拢
		 */
		public setNomal1() {
			egret.Tween.get(this.card0).to({ x: 129 }, 150);
			egret.Tween.get(this.card1).to({ x: 84 }, 150).wait(50).call(() => {
				this.setMaoDian();
			});
		}

		/**
		 * 三合一,开牌合拢；
		 */
		public setNomal2() {
			egret.Tween.get(this.card0).to({ x: 129, rotation: 0 }, 150);
			egret.Tween.get(this.card1).to({ x: 84, y: 0 }, 150);
			egret.Tween.get(this.card2).to({ rotation: 0 }, 150).wait(50).call(() => {
				this.setMaoDian();
			});

		}

		/**
		 * 三和一后的锚点
		 */
		public setMaoDian() {
			for (let i = 0; i < 3; i++) {
				let cd = this["card" + i] as ZajinhuaCard;
				cd.anchorOffsetX = cd.width / 2;
				cd.anchorOffsetY = cd.height / 2;
				cd.x = 92;
				cd.y = 65;
			}
		}


		/**
		 * 展示分数
		 */
		public showFen(num) {
			//10表示隐藏。
			this.db();
			this.addChild(this.fenGroup);
			this.fenGroup.visible = (num == 10) ? false : true;
			if (num != 10) {
				if (num >= 3 && num < 6) {
					this.fenImage.source = "zjh_px_diban_png";
					this.fenImage.x = -5;
					this.word.play(this.chose(num), 1);
				} else {
					this.fenImage.source = "zjh_px_" + num + "_png";
					if (num == 6) {
						this.fenImage.x = -15;
					} else {
						this.fenImage.x = 0;
					}
					this.fenImage.y = 7;
				}
			}
		}

		private word: DBComponent;
		private db() {
			this.fenGroup.removeChildren();
			this.word = new DBComponent("words");
			this.fenGroup.addChild(this.fenImage);
			this.fenGroup.addChild(this.word);
			this.word.horizontalCenter = -5;
			this.word.verticalCenter = 5;
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

		public showCardByIndex(index) {
			this["card" + index].visible = true;
		}



		public paiBianHui() {
			for (let i = 0; i < 3; i++) {
				this["card" + i].showMb(2);
			}
		}
	}
}