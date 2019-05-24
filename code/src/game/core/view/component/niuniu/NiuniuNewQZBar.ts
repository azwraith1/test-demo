module niuniu {
	export class NiuniuNewQZBar extends game.BaseUI {

		private btn0: eui.Button;
		private btn1: eui.Button;
		private btn2: eui.Button;
		private btn3: eui.Button;
		private qzList: number[] = [];
		private rootScene: NiuniuSGameScene;

		public constructor() {
			super();
			this.skinName = new NiuniuNewBtnSkin();
		}

		public createChildren() {
			super.createChildren();
		}


		public show(qzData) {
			this.qzList = [];
			for (let key in qzData) {
				this.qzList.push(parseInt(key));
				let result = qzData[key];
				if (!result) {
					if (this['btn' + key].an) {
						this['btn' + key].an.visible = true;
						this['btn' + key].labelDisplay.alpha = 0.5;
						this['btn' + key].labelDisplay1.alpha = 0.5;
					}
					this['btn' + key].touchEnabled = false;
				} else {
					if (this['btn' + key].ming) {
						this['btn' + key].ming.visible = true;
					}
					this['btn' + key].touchEnabled = true;
				}
				if (this['btn' + key].labelDisplay) {
					this['btn' + key].labelDisplay.text = "x" + key;
				}
			}
			this.visible = true;
		}

		public setRoot(root) {
			this.rootScene = root;
		}

		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.btn0:
					//不抢
					this.rootScene.sendQZReq(this.qzList[0]);
					break;
				case this.btn1:
					//第一个按钮
					this.rootScene.sendQZReq(this.qzList[1]);
					break;
				case this.btn2:
					//第二个按钮
					this.rootScene.sendQZReq(this.qzList[2]);
					break;
				case this.btn3:
					//第三个按钮
					this.rootScene.sendQZReq(this.qzList[3]);
					break;
			}
		}
	}
}