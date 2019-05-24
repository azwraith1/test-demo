module majiang {
	export class HSZBar extends game.BaseUI {
		private enterBtn: eui.Button;
		private timeCount: number;
		private lock: boolean;
		private root: MajiangScene;
		public constructor() {
			super();
			this.skinName = new HSZBarSkin();
		}

		public createChildren() {
			super.createChildren();
			// this.timeCount = 10000;
		}




		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.enterBtn:
					this.enterBtnTouch();
					break;
			}
		}

		public enterBtnTouch() {
			this.lock = true;
			this.root.sendHSZReq();
			this.visible = false;
			this.root.otherChose.visible = true;		
		}


		public hszNumberChange(e: egret.TouchEvent) {
			let num = e.data;
			if (num == 3) {
				this.enterBtn.touchEnabled = true;
				this.enterBtn.getChildAt(0)['source'] = RES.getRes("hsz_btn_bg_png")
				// this.bgImage.source = 
			} else {
				this.enterBtn.touchEnabled = false;
				this.enterBtn.getChildAt(0)['source'] = RES.getRes("hsz_btn_bg1_png")
			}
		}

		public onStart(root) {
			this.root = root;
			EventManager.instance.addEvent(EventNotify.HSZ_SELECT_NUM, this.hszNumberChange, this);
		}

		public onAdded() {
			super.onAdded();
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.HSZ_SELECT_NUM, this.hszNumberChange, this);
		}
	}
}