/*
 * @Author: Li MengChan 
 * @Date: 2018-07-02 16:29:08 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:09:25
 * @Description: 右侧玩家手牌
 */
module majiang {
	export class RightShoupai extends eui.Component {
		private bgImage: eui.Image;
		public value: number = 0;
		public constructor() {
			super();
			this.skinName = new RightShoupaiSkin();
		}

		public createChildren() {
			super.createChildren();
		}

		public changeBgResource(source) {
			this.bgImage.source = RES.getRes(source);
		}

		public showColor(value) {
			this.value = value;
			this.bgImage.visible = false;
		}
	}
}