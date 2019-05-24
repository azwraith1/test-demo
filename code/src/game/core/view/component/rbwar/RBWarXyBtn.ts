module rbwar {
	export class RBWarXyBtn extends eui.Component {
		private dbImage: eui.Image;
		private canTouch: boolean = false;;
		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchOn, this);
		}

		private touchOn() {
			if(this.canTouch){
				EventManager.instance.dispatch(EventNotify.RBWAR_XUYA);
			}
		}

		public setGray(gray) {
			this.canTouch = !gray;
			if (gray) {
				this.dbImage.source = RES.getRes("game_cm_6_2_png");
			} else {
				this.dbImage.source = RES.getRes("game_cm_6_1_png");
			}
		}
	}
}