module majiang {
	export class HjzyTip extends eui.Component{
		private valueText: eui.BitmapLabel;
		private tipImage: eui.Image;
		public constructor() {
			super();
			this.skinName = new HjzyTipSkin();
		}

		public createChildren(){
			super.createChildren();
			game.UIUtils.setAnchorPot(this);
		}

		public showText(value){
			if (value > 0) {
				this.tipImage.visible = false;
                this.valueText.font = "ying_font_fnt";
            } else {
				this.tipImage.visible = true;
                this.valueText.font = "shu_font_fnt";
            }
			let text = value;
            if (value >= 0) {
                text = "+" + value;
            }
			this.valueText.text = text;
		}

		/**
		 * 展现动画
		 */
		public showAni(){
			let pos = {alpha: 1}
			if(this.horizontalCenter){
				pos['horizontalCenter'] = this.horizontalCenter + 30;
			}else if(this.left){
				pos['left'] = this.left + 30;
			}else if(this.right){
				pos['right'] = this.right - 30;
			}
			this.alpha = 0;
			egret.Tween.removeTweens(this);
			egret.Tween.get(this).to(pos, 300).to({
                alpha: 0
            }, 1000).call(() => {
                game.UIUtils.removeSelf(this);
            });
		}
	}
}