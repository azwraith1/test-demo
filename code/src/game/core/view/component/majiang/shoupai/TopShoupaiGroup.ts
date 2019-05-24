/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:27:19 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:12:15
 * @Description: 对家手牌集合组
 */
module majiang {
	export class TopShoupaiGroup extends BaseShoupaiGroup {
		public shoupais: TopShoupai[] = [];
		public mopai: TopShoupai;
		public constructor() {
			super();
			// this.skinName = new majiang.TopShoupaiGroupSkin();
		}

		public createChildren() {
			super.createChildren();
			// this.scaleX = this.scaleY = 1.3;
		}

		/**
		 * 初始化左家手牌
		 * @param  {number} number 手牌数量
		 */
		public initWithArr(number: number, visible :boolean = true){
			super.clearGroup();
			for(var i = 1; i<= number; i++){
				var shoupai = new TopShoupai();
				shoupai.changeBgResource(i);
				this.mainGroup.addChild(shoupai);
				game.UIUtils.setAnchorPot(shoupai);
				shoupai.visible = visible;
				this.shoupais.push(shoupai);
				var locationPoint = this.recordsJson[i];
				shoupai.x = locationPoint.x;
				shoupai.y = locationPoint.y;
				shoupai.name = locationPoint.name;
			}
			this.mopai = new TopShoupai();
			this.mainGroup.addChild(this.mopai);
			this.mopai.name = "mopai";
			game.UIUtils.setAnchorPot(this.mopai);
			this.mopai.visible = false;
			this.resetZorder();
		}

		public showMopaiAni(){
			let num  = this.mainGroup.numChildren;
			let lastShoupai: TopShoupai = this.mainGroup.getChildByName("mj" + (num)) as TopShoupai;
			var locationPoint = this.recordsJson[num];
			lastShoupai.visible = true;
			lastShoupai.x = locationPoint.x - 30;
			lastShoupai.y = locationPoint.y;
			// this.resetZorder();
		}

		public showChupaiAni(){
			let num  = this.mainGroup.numChildren;
			let lastShoupai: TopShoupai = this.mainGroup.getChildByName("mj" + (num)) as TopShoupai;
			lastShoupai.visible = false;
		}

		public setPointByIndex(index) {
			let pos = this.recordsJson[index];
			this.mopai.x = pos.x - 20;
			this.mopai.y = pos.y
			this.mopai.changeBgResource(index);
		}

		public resetZorder(){
			if(this.mopai){
				this.mainGroup.addChild(this.mopai);
			}
			let zorder = [14,13,12,11,10,9,8,7,6,1,2,3,4,5];
			for(let i = 0; i <= zorder.length - 1; i++){
				if(this.mainGroup.getChildByName("mj" + zorder[i])){
					this.mainGroup.addChild(this.mainGroup.getChildByName("mj" + zorder[i]));
				}
			}
		}
	}
}