/*
 * @Author: he bing 
 * @Date: 2018-07-13 18:49:41 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:04:59
 * @Description: 右家杠牌组。
 */

module majiang {
	export class MjRightGroup extends game.BaseUI {
		private list: MjRightPg[] = [];
	//	private nuberColor = [];
		public constructor() {
			super();
			// this.skinName = new MjRightGroupSkin();
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
				let mj1 = new MjRightPg(type, color,this.list.length + 1, pbg);
				if (pbg == 1) {
					this.p2g(color)
				} else {
					this.addChild(mj1);
					this.list.push(mj1);
				//	this.nuberColor.push(color);
					//this.resetZorder();
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
			let rightGp = [{ x: 0, y: 0 }, { x: 20, y: 83 }, { x: 41, y: 173 }, { x: 63, y: 268 }];
			for (let i = 0; i < this.list.length; i++) {
				this.list[i].x = rightGp[i].x;
				this.list[i].y = rightGp[i].y;
				
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
			let rightGp = [{ x: 0, y: 50 }, { x: 20, y: 133 }, { x: 41, y: 223 }, { x: 63, y: 318 }];
			switch (this.choseColorNumer(color)) {
				case 0:
					this.list[0].x = rightGp[0].x;
					this.list[0].y = rightGp[0].y;
					egret.Tween.get(this.list[0]).to({ x: rightGp[0].x, y: rightGp[0].y - 50 }, 200, egret.Ease.circIn);				
					break;
				case 1:
					this.list[1].x = rightGp[1].x;
					this.list[1].y = rightGp[1].y;
					egret.Tween.get(this.list[1]).to({ x: rightGp[1].x, y: rightGp[1].y - 50 }, 200, egret.Ease.circIn);				
					break;
				case 2:
					this.list[2].x = rightGp[2].x;
					this.list[2].y = rightGp[2].y;
					egret.Tween.get(this.list[2]).to({ x: rightGp[2].x, y: rightGp[2].y - 50 }, 200, egret.Ease.circIn);					
					break;
				case 3:
					this.list[3].x = rightGp[3].x;
					this.list[3].y = rightGp[3].y;
					egret.Tween.get(this.list[3]).to({ x: rightGp[3].x, y: rightGp[3].y - 50 }, 200, egret.Ease.circIn);
					break;
			}
		}

	}
}