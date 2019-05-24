module majiang {
	export class HSZTipBar extends game.BaseUI {
		private bgImage: eui.Image;
		private type: number;
		private group1: eui.Group;
		private group2: eui.Group;
		private group3: eui.Group;
		private topImage: eui.Image;
		private bottomImage: eui.Image;
		public constructor(type) {
			super();
			this.type = type;
			this.skinName = new HSZSucTipSkin();
		}

		public createChildren() {
			super.createChildren();
			this.bgImage.source = RES.getRes("hsz_tip" + this.type + "_png");
			this.showTypeAni();
		}
		
		

		public showTypeAni() {
			var time = 1100;
			switch (this.type) {
				case 0:
					this.group1.visible = true;
					egret.Tween.get(this.group1).to({
						rotation: 360
					}, 1000, egret.Ease.circOut)
					break;
				case 1:
					this.group2.visible = true;
					egret.Tween.get(this.group2).to({
						rotation: -360
					}, 1000, egret.Ease.circOut)
					break;
				case 2:
					this.group3.visible = true;
					egret.Tween.get(this.topImage).to({
						y: this.topImage.y - 300
					}, 600, egret.Ease.circOut)
					egret.Tween.get(this.bottomImage).to({
						y: this.bottomImage.y + 300
					}, 600, egret.Ease.circOut)
					break;
			}
		}
	}
}