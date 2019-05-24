/*
 * @Author: he bing 
 * @Date: 2018-10-09 11:24:20 
 * @Last Modified by:   he bing 
 * @Last Modified time: 2018-10-09 11:24:20 
 * @Description: 
 */

module majiang {
	export class HallblsgBtn extends game.BaseComponent {
		public peoples_sg: eui.Label;
		public sgm: eui.Group;
		public sg_rimg: eui.Image;
		public constructor() {
			super();
			this.skinName = new HallblsgSkin();
		}

		public createChildren() {
			super.createChildren();
			// Global.gameProxy.people();
			// this.peoples_dz.text = "0"// Global.gameProxy.peoplesCounts["bldz"];

		}

	}
}