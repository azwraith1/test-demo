/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:27:19 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:07:39
 * @Description: 上家手牌集合组
 */
module majiang {
	export class LeftShoupaiGroup extends BaseShoupaiGroup {
		public shoupais: LeftShoupai[] = [];
		public mopai: LeftShoupai;
		public constructor() {
			super();
			// this.skinName = new LeftShoupaiGroupSkin();
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
			for (var i = 1; i <= number; i++) {
				var shoupai = new LeftShoupai();
				this.mainGroup.addChild(shoupai);
				var locationPoint = this.recordsJson[i];
				game.UIUtils.setAnchorPot(shoupai);
				shoupai.changeBgResource(locationPoint.source);
				this.shoupais.push(shoupai);
				shoupai.visible = visible;
				shoupai.x = locationPoint.x;
				shoupai.y = locationPoint.y;
				shoupai.name = locationPoint.name;
			}

			this.mopai = new LeftShoupai();
			game.UIUtils.setAnchorPot(this.mopai);
			this.mainGroup.addChild(this.mopai);
			this.mopai.name = "mopai";
			this.mopai.visible = false;
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
					majiang.x = pos.x + 1;
					majiang.y = pos.y;
					majiang.visible = true;
					majiang.showColor(value);
				}
			}
		}

		public setPointByIndex(index) {
			let pos = this.recordsJson[index];
			this.mopai.x = pos.x + 1;
			this.mopai.y = pos.y + 20;
			this.mopai.changeBgResource(pos.source);
		}

		/**
		 * 玩家摸牌动画效果
		 * @param  {} value
		 */
		public playerMopai(value) {
			let mopai = this.createShoupai(this.mainGroup.numChildren);
			let num = this.mainGroup.numChildren;
			let lastShoupai = this.createShoupai(num + 1);
			let locationPoint = this.recordsJson[num];
			lastShoupai.changeBgResource(locationPoint.source);
			lastShoupai.x = locationPoint.x;
			lastShoupai.y = locationPoint.y - 30;
			lastShoupai.visible = true;
			// this.resetZorder();
		}


		private createShoupai(index) {
			var shoupai = new LeftShoupai();
			this.mainGroup.addChild(shoupai);
			var locationPoint = this.recordsJson[index];
			shoupai.changeBgResource(locationPoint.source);
			shoupai.x = locationPoint.x;
			shoupai.y = locationPoint.y;
			shoupai.name = locationPoint.name;
			return shoupai;
		}

	}
}