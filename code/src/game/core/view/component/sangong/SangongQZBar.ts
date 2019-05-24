module sangong {
	export class SangongQZBar extends game.BaseUI {
		private btn0: eui.Button;
		private btn1: eui.Button;
		private qzList: number[] = [];
		private rootScene: SangongGameScene;

		public constructor() {
			super();
			this.skinName = new SangongQZBarSkin();
		}

		public createChildren() {
			super.createChildren();
		}

		public show() {
			this.visible = true;
			egret.Tween.get(this.btn0).to({
				x: 60,
				y: 60,
				scaleX: 1,
				scaleY: 1	
			},  200, egret.Ease.quadOut);
			egret.Tween.get(this.btn1).to({
				x: 200,
				y: 60,
				scaleX: 1,
				scaleY: 1	
			}, 200, egret.Ease.quadOut);
		}

		public setRoot(root) {
			this.rootScene = root;
		}

		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.btn0:
					//不抢
					this.rootScene.sendQZReq(0);
					break;
				case this.btn1:
					//第一个按钮
					this.rootScene.sendQZReq(1);
					break;
			}
		}
	}
}