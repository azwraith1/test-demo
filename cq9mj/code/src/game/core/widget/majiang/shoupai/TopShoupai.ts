/*
 * @Author: Li MengChan 
 * @Date: 2018-07-02 16:29:08 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-08-23 18:09:07
 * @Description: 对面玩家手牌
 */
module majiang {
	export class TopShoupai extends eui.Component {
		private bgImage: eui.Image;
		//{number, index}
		private index;
		public constructor() {
			super();
			this.skinName = new TopShoupaiSkin();
		}

		public createChildren() {
			super.createChildren();
		}

		public changeBgResource(index) {
			if(index < 1 || index > 13 || !index){
				index = 13;
			}
			this.index = index;
			this.bgImage.source = RES.getRes("top_shoupai_" + this.index + "_png");
		}
	}
}