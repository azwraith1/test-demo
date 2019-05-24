/*
 * @Author: li mengchan 
 * @Date: 2018-07-16 00:05:02 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-08-27 11:00:27
 * @Description: 玩家胡牌
 */
module majiang {
	export class MajiangHupai extends eui.Component {
		public direction: string;
		public bgImage: eui.Image;
		public colorImage: eui.Image;
		public value: number;
		public colorStr: string;
		public index: number;
		private bgImage1: eui.Image;
		public maskRect: eui.Rect;
		public constructor(direction, value) {
			super();
			this.value = value;
			this.colorStr = "color_value_`VALUE`_png";
			this.direction = direction;
			switch (direction) {
				case "mine":
					this.skinName = new MineHupaiSkin();
					break;
				case "left":
					this.skinName = new LeftHupaiSkin();
					break;
				case "right":
					this.skinName = new RightHupaiSkin();
					break;
				case "top":
					this.skinName = new TopHupaiSkin();
					break;
			}
		}


		public showMaskRect(value) {
			this.maskRect.visible = this.value == value;
		}


		public createChildren() {
			super.createChildren();
			let color = this.colorStr.replace("`VALUE`", this.value + "");
			this.colorImage.source = RES.getRes(color);
			this.maskRect.mask = this.bgImage1;
		}

		public showZimo() {
			this.alpha = 1;
			let effectName = "zimohu";
			let mc = GameCacheManager.instance.getMcCache("zimohu", this.direction + "_" + effectName, null);
			this.maskRect.alpha = this.bgImage.alpha = 0;
			this.colorImage.alpha = 0;
			this.addChild(this.bgImage);
			this.addChild(this.colorImage);
			this.addChild(this.maskRect);
			this.addChild(mc);
			mc.scaleX = mc.scaleX = 1.5;
			mc.x = this.width / 2;
			if(this.direction == "mine" || this.direction == "right"){
				mc.y = this.height / 2 - 30;
			}else{
				mc.y = this.height / 2;
			}
			mc.addEventListener(egret.MovieClipEvent.COMPLETE, () => {
				game.UIUtils.removeSelf(mc);
				// game.MCUtils.reclaim("zimohu", mc);
				this.maskRect.alpha = 1;
			}, this);
			mc.play(1);
			egret.setTimeout(() => {
				egret.Tween.get(this.bgImage).to({
					alpha: 1
				}, 100);
				egret.Tween.get(this.colorImage).to({
					alpha: 1
				}, 100);
			}, this, 200)
		}


		public showDianpao() {
			let mc1 = GameCacheManager.instance.getMcCache("hu_down1", this.direction + "_hu_down1", null)
			let mc2 = GameCacheManager.instance.getMcCache("hu_down2", this.direction + "_hu_down2", null)
			this.addChild(mc2);
			this.addChild(this.bgImage);
			this.addChild(this.colorImage);
			this.addChild(this.maskRect);
			// pai.parent.addChild(pai);
			this.addChild(mc1);
			let alpha = this.alpha;
			this.alpha = 0;
			mc2.scaleX = mc2.scaleX = 1.5;
			mc2.x = this.width / 2;
			mc2.y = this.height / 2;
			mc1.scaleX = mc1.scaleY = 1.5
			mc1.x = this.width / 2;
			mc1.y = this.height / 2 - 20;
			mc1.addEventListener(egret.MovieClipEvent.COMPLETE, () => {
				game.UIUtils.removeSelf(mc1);
				// game.MCUtils.reclaim("hu_down1", mc1);
			}, this);
			mc2.addEventListener(egret.MovieClipEvent.COMPLETE, () => {
				game.UIUtils.removeSelf(mc2);
				// game.MCUtils.reclaim("hu_down2", mc2);
			}, this);
			egret.Tween.get(this).to({
				alpha: alpha
			}, 50);
			mc1.play(1);
			mc2.play(1);

		}
	}
}