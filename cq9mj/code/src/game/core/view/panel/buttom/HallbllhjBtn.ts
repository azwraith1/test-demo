/*
 * @Author: he bing 
 * @Date: 2018-10-09 11:24:14 
 * @Last Modified by:   he bing 
 * @Last Modified time: 2018-10-09 11:24:14 
 * @Description: 
 */

module majiang {
	export class HallbllhjBtn extends game.BaseComponent {
		public peoples_lhj: eui.Label;
		public lhj: eui.Image;
		public lhjLable: eui.Label;
		public constructor() {
			super();
			this.skinName = new HallbllhjSkin();
		}
		public createChildren() {
			super.createChildren();
			// Global.gameProxy.people();
			// this.peoples_lhj.text = "0";// Global.gameProxy.peoplesCounts["bllhj"];

		}

	}
}