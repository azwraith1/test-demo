module majiang {
	export class BaseChupai extends game.BaseUI {
		public bgImage: eui.Image;
		public colorImage: eui.Image;
		public bgImage1: eui.Image;
		public maskRect: eui.Rect;
		public value: number;
		public direction;
		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
			this.maskRect.mask = this.bgImage1;
		}

		public dianpaoAni() {
			let mc1 = GameCacheManager.instance.getMcCache("hu_up1", this.direction + "_hu_up1", null); //game.MCUtils.getMc("hu_up1");
			let mc2 = GameCacheManager.instance.getMcCache("hu_up2", this.direction + "_hu_up2", null);//game.MCUtils.getMc("hu_up2");
			this.addChild(mc2);
			this.addChild(this.bgImage);
			this.addChild(this.colorImage);
			this.addChild(mc1);
			mc2.scaleX = mc2.scaleX = 1.5;
			mc2.x = this.width / 2;
			mc2.y = this.height / 2;
			mc1.scaleX = mc1.scaleY = 1.5
			mc1.x = this.width / 2;
			mc1.y = this.height / 2 - 20

			let mcCallback1 = () => {
				mc1.removeEventListener(egret.MovieClipEvent.COMPLETE, mcCallback1, this);
				game.UIUtils.removeSelf(mc1);
			}
			mc1.addEventListener(egret.MovieClipEvent.COMPLETE, mcCallback1, this);
			let mcCallback2 = () => {
				mc2.removeEventListener(egret.MovieClipEvent.COMPLETE, mcCallback2, this);
				game.UIUtils.removeSelf(mc2);
			}
			mc2.addEventListener(egret.MovieClipEvent.COMPLETE, mcCallback2, this);
			mc1.play(1);
			mc2.play(1);
			this.setAutoTimeout(() => {
				game.UIUtils.removeSelf(this);
			}, this, 400)
			return 400;
		}

		public showMaskRect(value) {
			this.maskRect.visible = this.value == value;
		}
	}
}