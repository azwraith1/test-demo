/*
 * @Author: he bing 
 * @Date: 2018-07-13 18:46:17 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:15:37
 * @Description: 自己杠牌组
 */

module majiang {
	export class MjMineGroup extends game.BaseUI {
		private list: MjziPg[] = []
		//碰的牌的顺序
		//private nuberColor = [];
		public constructor() {
			super();
			// this.skinName = new MjMimeGroupSkin();
		}

		public createChildren() {
			super.createChildren();

		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.FIND_COLOR, this.findColor, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.FIND_COLOR, this.findColor, this);
		}

		private findColor(e: egret.Event) {
			let value = e.data;
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].color == value) {
					this.list[i].showRect(value);
				} else {
					this.list[i].showRect(0);
				}
			}

		}
		public add(type, color, pbg?) {
			if (pbg == 3) {
				this.g2p(color);
			} else {
				let mj1 = new MjziPg(type, color,this.list.length + 1, pbg);
				if (pbg == 1) {
					this.p2g(color)
				} else {
					this.addChild(mj1);
					this.list.push(mj1);
					//this.nuberColor.push(color);
					if (pbg == 2) {
						this.setSortOne();
					} else {
						this.setSort(color);
					}
				}
			}
		}


		/**
		 * 抢杠胡牌时，玩家的牌要杠变碰。
		 */
		private g2p(color) {
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].color == color) {
					this.list[i].showColor();
					this.list[i].dianpaoAni();
					break;
				}
			}
		}



		/**
		 * 碰变杠
		 */
		private p2g(value) {
			for (let i = 0; i < this.list.length; i++) {
				if (value == this.list[i]["color"]) {
					this.list[i].showColor_m()
					break;
				}
			}
		}


		/**
		 * 玩家断线重连的赋值方法
		 */
		private setSortOne() {
			let mineGp = [{ x: 436, y: 0 }, { x: 291, y: 0 }, { x: 145, y: 0 }, { x: 0, y: 0 }];
			for (let i = 0; i < this.list.length; i++) {
				this.list[i].x = mineGp[i].x;
				this.list[i].y = mineGp[i].y;
				
			}

		}

		/**
		 * 找花色
		 */
		public choseColorNumer(color) {
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].color == color) {
					return i;
				}
			}
		}

		/**
		 * 正常进入游戏的赋值方法，需要动画。
		 */
		private setSort(color) {
			let mineGp = [{ x: 336, y: 0 }, { x: 191, y: 0 }, { x: 45, y: 0 }, { x: -100, y: 0 }];
			switch (this.choseColorNumer(color)) {
				case 0:
					this.list[0].x = mineGp[0].x;
					this.list[0].y = mineGp[0].y;
					egret.Tween.get(this.list[0]).to({ x: mineGp[0].x + 100 }, 200, egret.Ease.circIn);
				
					break;
				case 1:
					this.list[1].x = mineGp[1].x;
					this.list[1].y = mineGp[1].y;
					egret.Tween.get(this.list[1]).to({ x: mineGp[1].x + 100 }, 200, egret.Ease.circIn);
					
					break;
				case 2:
					this.list[2].x = mineGp[2].x;
					this.list[2].y = mineGp[2].y;
					egret.Tween.get(this.list[2]).to({ x: mineGp[2].x + 100 }, 200, egret.Ease.circIn);
				
					break;
				case 3:
					this.list[3].x = mineGp[3].x;
					this.list[3].y = mineGp[3].y;
					egret.Tween.get(this.list[3]).to({ x: mineGp[3].x + 100 }, 200, egret.Ease.circIn);
				
					break;
			}
		}
	}
}
