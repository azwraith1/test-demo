module niuniu {
	export class NiuniuNewYZBar extends game.BaseUI {
		public constructor() {
			super();
			this.skinName = new NiuniuNewYZBtnSkin();
		}

		private btn0: eui.Button;
		private btn1: eui.Button;
		private btn2: eui.Button;
		private btn3: eui.Button;
		private btn4: eui.Button;
		private qzList: number[] = [];
		private rootScene: NiuniuSGameScene;

		public createChildren() {
			super.createChildren();
		}


		public show(qzData) {
			this.qzList = [];
			let i = 0;
			for (let key in qzData) {
				this.qzList.push(parseInt(key));
				let result = qzData[key];
				if (!result) {
					if (this['btn' + i].an) {
						this['btn' + i].an.visible = true;
						this['btn' + i].labelDisplay.alpha = 0.5;
					}
					this['btn' + i].touchEnabled = false;
				} else {
					if (this['btn' + i].ming) {
						this['btn' + i].ming.visible = true;
					}
					this['btn' + i].touchEnabled = true;
				}
				if (this['btn' + i].labelDisplay) {
					this['btn' + i].labelDisplay.text = "x " + key;
				}

				i++;
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
					this.rootScene.sendYZReq(this.qzList[0]);
					break;
				case this.btn1:
					//第一个按钮
					this.rootScene.sendYZReq(this.qzList[1]);
					break;
				case this.btn2:
					//第二个按钮
					this.rootScene.sendYZReq(this.qzList[2]);
					break;
				case this.btn3:
					//第三个按钮
					this.rootScene.sendYZReq(this.qzList[3]);
					break;
				case this.btn4:
					//第三个按钮
					this.rootScene.sendYZReq(this.qzList[4]);
					break;
			}
		}
	}
}