/*
 * @Author: he bing 
 * @Date: 2018-07-13 18:49:06 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:12:28
 * @Description: 左家杠牌组
 */

module majiang {
	export class MjLeftGroup extends game.BaseUI {
		private list: MjLeftPg[] = [];
		//private nuberColor = [];
		public constructor() {
			super();
			// this.skinName = new MjLeftGroupSkin();
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
				let mj1 = new MjLeftPg(type, color, this.list.length + 1, pbg);
				if (pbg == 1) {
					this.p2g(color)
				} else {
					this.addChild(mj1);
					this.list.push(mj1);
					this.resetZorder();
					if (pbg == 2) {
						this.setSortOne();
					} else {
						this.setSort(color);
					}
				}
			}
		}

		// public addItems(type, value) {
		// 	let mj1 = new MjLeftPg(type, value, this.list.length + 1);
		// 	this.list.push(mj1);
		// 	this.addChild(mj1);
		// 	this.setSort(value);
		// 	this.resetZorder();
		// }

		/**
		 * 调整层级
		 */
		public resetZorder() {
			for (let i = this.list.length - 1; i >= 0; i--) {
				this.addChild(this.list[i]);
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

		private p2g(value) {
			for (let i = 0; i < this.list.length; i++) {
				if (value == this.list[i].color) {
					this.list[i].showColor_pbg()

					break;
				}
			}
		}

		/**
		 * 玩家断线重连的赋值方法
		 */
		private setSortOne() {
			let leftGp = [{ x: 0, y: 307 }, { x: 25, y: 195 }, { x: 48, y: 94 }, { x: 71, y: 0 }];
			for (let i = 0; i < this.list.length; i++) {
				this.list[i].x = leftGp[i].x;
				this.list[i].y = leftGp[i].y;
			}
		}


		/**
	     * 找花色
	     */
		public choseColorNumer(value) {
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].color == value) {
					return i;
				}
			}
		}

		private setSort(color) {
			let leftGp = [{ x: 0, y: 257 }, { x: 25, y: 145 }, { x: 48, y: 44 }, { x: 71, y: -50 }];
			switch (this.choseColorNumer(color)) {
				case 0:
					this.list[0].x = leftGp[0].x;
					this.list[0].y = leftGp[0].y;
 					egret.Tween.get(this.list[0]).to({ x: leftGp[0].x, y: leftGp[0].y + 50 }, 200, egret.Ease.circIn);
					break;
				case 1:
					this.list[1].x = leftGp[1].x;
					this.list[1].y = leftGp[1].y;
					egret.Tween.get(this.list[1]).to({ x: leftGp[1].x, y: leftGp[1].y + 50 }, 200, egret.Ease.circIn);
					break;
				case 2:
					this.list[2].x = leftGp[2].x;
					this.list[2].y = leftGp[2].y;
					egret.Tween.get(this.list[2]).to({ x: leftGp[2].x, y: leftGp[2].y + 50 }, 200, egret.Ease.circIn);
					break;
				case 3:
					this.list[3].x = leftGp[3].x;
					this.list[3].y = leftGp[3].y;
					egret.Tween.get(this.list[3]).to({ x: leftGp[3].x, y: leftGp[3].y + 50 }, 200, egret.Ease.circIn);
					break;
			}
		}
	}
}