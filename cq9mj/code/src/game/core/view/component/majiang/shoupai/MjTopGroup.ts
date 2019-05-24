/*
 * @Author: he bing 
 * @Date: 2018-07-13 18:47:06 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:12:21
 * @Description: 麻将上家杠牌组
 */

module majiang {
	export class MjTopGroup extends game.BaseUI {
		private list: MjShangPg[] = [];
		//	private nuberColor = [];
		public constructor() {
			super();
			// this.skinName = new MjTopGroupSkin();
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
				let mj1 = new MjShangPg(type, color, this.list.length + 1, pbg);
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

		private p2g(value) {
			for (let i = 0; i < this.list.length; i++) {
				if (value == this.list[i]["color"]) {
					this.list[i].showColor_pbg()
					break;
				}
			}
		}

		/**
	 * 玩家断线重连的赋值方法
	 */
		private setSortOne() {
			let topGp = [{ x: 0, y: 0 }, { x: 113, y: 0 }, { x: 224, y: 0 }, { x: 336, y: 0 }];
			for (let i = 0; i < this.list.length; i++) {
				this.list[i].x = topGp[i].x;
				this.list[i].y = topGp[i].y;
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

		private setSort(color) {
			let topGp = [{ x: 100, y: 0 }, { x: 213, y: 0 }, { x: 324, y: 0 }, { x: 436, y: 0 }];
			switch (this.choseColorNumer(color)) {
				case 0:
					this.list[0].x = topGp[0].x;
					this.list[0].y = topGp[0].y;
					egret.Tween.get(this.list[0]).to({ x: topGp[0].x - 100 }, 200, egret.Ease.circIn);

					break;
				case 1:
					this.list[1].x = topGp[1].x;
					this.list[1].y = topGp[1].y;
					egret.Tween.get(this.list[1]).to({ x: topGp[1].x - 100 }, 200, egret.Ease.circIn);

					break;
				case 2:
					this.list[2].x = topGp[2].x;
					this.list[2].y = topGp[2].y;
					egret.Tween.get(this.list[2]).to({ x: topGp[2].x - 100 }, 200, egret.Ease.circIn);

					break;
				case 3:
					this.list[3].x = topGp[3].x;
					this.list[3].y = topGp[3].y;
					egret.Tween.get(this.list[3]).to({ x: topGp[3].x - 100 }, 200, egret.Ease.circIn);

					break;
			}

		}
	}
}







