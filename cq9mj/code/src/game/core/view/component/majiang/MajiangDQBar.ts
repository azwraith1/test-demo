/*
 * @Author: li mengchan 
 * @Date: 2018-07-11 10:07:22 
 * @Last Modified by: he bing
 * @Last Modified time: 2018-08-24 15:14:28
 * @Description: 麻将的定缺条
 */
module majiang {
	export class MajiangDQBar extends game.BaseUI {
		private btn1: eui.Button;
		private btn2: eui.Button;
		private btn3: eui.Button;
		private root: MajiangScene;
		// private 
		private effect1: egret.MovieClip;
		private effect2: egret.MovieClip;
		private effect3: egret.MovieClip;
		private times = [];//选择次数，仅前端判断。
		public constructor(root) {
			super();
			this.root = root;
			this.skinName = new MajiangDQBarSkin();
		}

		public onRemoved() {
			super.onRemoved();
		}

		public createChildren() {
			super.createChildren();
			let mineShoupai = Global.gameProxy.getMineShuopaiArr();
			let color = MajiangUtils.getColorLatestNum(mineShoupai);
			this.btn1.alpha = this.btn2.alpha = this.btn3.alpha = 0.3;
			this.addEffectAni("color1", (mv: egret.MovieClip) => {
				if (mv) {
					this.addChild(mv);
					game.UIUtils.setAnchorPot(mv);
					this.effect1 = mv;
					mv.x = this.btn1.x + 49;
					mv.y = this.btn1.y + 48;
					if (color == 1) {
						mv.play(-1);
					}
				}
			});

			this.addEffectAni("color2", (mv: egret.MovieClip) => {
				if (mv) {
					this.addChild(mv);
					game.UIUtils.setAnchorPot(mv);
					this.effect2 = mv;
					mv.x = this.btn2.x + 49;
					mv.y = this.btn2.y + 48;
					if (color == 2) {
						mv.play(-1);
					}
				}
			});

			this.addEffectAni("color3", (mv: egret.MovieClip) => {
				if (mv) {
					this.addChild(mv);
					game.UIUtils.setAnchorPot(mv);
					mv.scaleX = mv.scaleY = 1;
					this.effect3 = mv;
					mv.x = this.btn3.x + 49;
					mv.y = this.btn3.y + 48;
					if (color == 3) {
						mv.play(-1);
					}
				}
			});
		}


		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.btn1:
					// this.effect1.gotoAndPlay(1);

					this.root.chooseDQ(1);
					this.root.otherChose.visible = true;
					break;
				case this.btn2:
					// this.effect2.gotoAndPlay(1);

					this.root.chooseDQ(2);
					this.root.otherChose.visible = true;
					break;
				case this.btn3:
					// this.effect3.gotoAndPlay(1);

					this.root.chooseDQ(3);
					this.root.otherChose.visible = true;
					break;
			}

		}

		/**
         * 胡碰杠
         * @param  {} direction
         * @param  {} effectName
         */
		private addEffectAni(effectName, callback) {
			GameCacheManager.instance.getMcCache(effectName,  "mine_" + effectName, (mv: egret.MovieClip) => {
				callback && callback(mv);
			});
		}
	}
}