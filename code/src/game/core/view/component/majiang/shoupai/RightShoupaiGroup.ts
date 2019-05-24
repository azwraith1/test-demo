/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:27:19 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:06:57
 * @Description: 上家手牌集合组
 */
module majiang {
	export class RightShoupaiGroup extends BaseShoupaiGroup {
		public shoupais: RightShoupai[] = [];
		public mopai: RightShoupai;
		public constructor() {
			super();
			// this.skinName = new RightShoupaiGroupSkin();
		}

		public createChildren() {
			super.createChildren();

		}

		/**
		 * 初始化左家手牌
		 * @param  {number} number 手牌数量
		 */
		public initWithArr(number: number, visible: boolean = true) {
			super.clearGroup();
			this.mopai = new RightShoupai();
			this.mainGroup.addChild(this.mopai);
			game.UIUtils.setAnchorPot(this.mopai);
			this.mopai.name = "mopai";
			this.mopai.visible = false;
			for (var i = number; i > 0; i--) {
				let shoupai = this.createShoupai(i);
				shoupai.visible = visible;
			}
		}


		private createShoupai(index) {
			var shoupai = new RightShoupai();
			this.mainGroup.addChild(shoupai);
			game.UIUtils.setAnchorPot(shoupai);
			var locationPoint = this.recordsJson[index];
			shoupai.changeBgResource(locationPoint.source);
			this.shoupais.push(shoupai);
			shoupai.x = locationPoint.x;
			shoupai.y = locationPoint.y;
			shoupai.name = locationPoint.name;
			return shoupai;
		}

		public removeShoupaiByPeng() {
			this.removeLastPai();
			this.removeLastPai();
		}

		/**
		 * 根据牌重新绘制玩家手牌
		 * @param  {number[]} cards
		 */
		public changeColorWithArr(cards: number[]) {
			let color = Global.gameProxy.getPlayerByIndex(this.index).selectColor;
			let isHu = Global.gameProxy.getPlayerByIndex(this.index).huCards.length > 0;
			for (var i = 0; i < cards.length; i++) {
				var value = cards[i];
				var majiang = this.mainGroup.getChildByName("mj" + (i + 1)) as LeftShoupai;
				let pos = this.recordsJson[(i + 1)];
				if (majiang) {
					majiang.x = pos.x - 2;
					majiang.visible = true;
					majiang.showColor(value);
				}
			}
		}

		public setPointByIndex(index) {
			let pos = this.recordsJson[index];	
			this.mopai.x = pos.x - 2;
			this.mopai.y = pos.y - 30;
			this.mopai.changeBgResource(pos.source);
		}

		public resetZorder() {
			for (var i = 14; i > 0; i--) {
				let lastShoupai: RightShoupai = this.mainGroup.getChildByName("mj" + i) as RightShoupai;
				if (lastShoupai) {
					this.mainGroup.addChild(lastShoupai);
				}
			}
		}
	}
}