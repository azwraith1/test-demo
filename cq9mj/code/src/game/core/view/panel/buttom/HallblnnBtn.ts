/*
 * @Author: he bing 
 * @Date: 2018-10-09 11:24:08 
 * @Last Modified by:   he bing 
 * @Last Modified time: 2018-10-09 11:24:08 
 * @Description: 
 */

module majiang {
	export class HallblnnBtn extends game.BaseComponent {
		public peoples_nn: eui.Label;
		public nn: eui.Image;
		public nnLable: eui.Label;
		public nn_Group: eui.Group;
		public jqqd: eui.Image;
		public constructor() {
			super();
			this.skinName = new HallblnnSkin();
		}
		public createChildren() {
			super.createChildren();
			// Global.gameProxy.people();
			// this.peoples_nn.text = "0" //Global.gameProxy.peoplesCounts["blnn"];

		}


	}
}