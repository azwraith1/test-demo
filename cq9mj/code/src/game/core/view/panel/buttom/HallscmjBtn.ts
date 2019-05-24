/*
 * @Author: he bing 
 * @Date: 2018-10-09 11:24:00 
 * @Last Modified by:   he bing 
 * @Last Modified time: 2018-10-09 11:24:00 
 * @Description: 
 */

module majiang {
	export class HallscmjBtn extends game.BaseComponent {
		public peoples_mj: eui.Label;
		public constructor() {
			super();
			this.skinName = new HallscmjSkin();
		}
		public createChildren() {
			super.createChildren();
			//	Global.gameProxy.people();
			//	this.peoples_mj.text = Global.gameProxy.peoplesCounts["scmj"];




		}
	}
}