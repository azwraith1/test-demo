/*
 * @Author: he bing 
 * @Date: 2018-10-09 11:24:26 
 * @Last Modified by: he bing
 * @Last Modified time: 2018-10-09 11:31:04
 * @Description: 
 */

module majiang {
	export class HallblbyBtn extends game.BaseComponent {
		public peoples_by: eui.Label;
		public by: eui.Image;
		public byLable: eui.Label;
		public constructor() {
			super();
			this.skinName = new HallblbySkin();
		}

		public createChildren() {
			super.createChildren();
			// Global.gameProxy.people();
			// this.peoples_by.text = "0"// Global.gameProxy.peoplesCounts["blby"];

		}

	}
}