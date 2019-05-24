module majiang {
	export class HuTipsBar extends eui.Component {
		private bgImage: eui.Image;
		private itemGroup: eui.Group;
		public constructor() {
			super();
			this.skinName = new HuTipsBarSkin();
		}

		public createChildren() {
			super.createChildren();
			this.visible = false;
			this.horizontalCenter = 0;
			this.bottom = 150;
		}

		public showBar(arr) {
			this.itemGroup.removeChildren();
			for (var i = 0; i < arr.length; i++) {
				let data = arr[i];
				let item = new HuTipsItem(data);
				this.itemGroup.addChild(item);
			}
			this.bgImage.width = this.itemGroup.width + 36;
			this.visible = arr.length > 0;
		}

		public hideBar(){
			this.itemGroup.removeChildren();
			this.visible = false;
		}
	}
}