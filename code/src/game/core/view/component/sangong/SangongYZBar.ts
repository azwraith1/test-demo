module sangong {
	export class SangongYZBar extends game.BaseUI {
		public constructor() {
			super();
			this.skinName = new SangongYZBarSkin();
		}

		private btn0: eui.Button;
		private btn1: eui.Button;
		private btn2: eui.Button;
		private btn3: eui.Button;
		private btn4: eui.Button;
		private qzList: number[] = [];
		private rootScene: SangongGameScene;
		private points: any = {};
		public createChildren() {
			super.createChildren();
			let p1 = {x: -155,y: 51};
			let p2 = {x: -85, y: -61};
			let p3 = {x: 55, y: -110};
			let p4 = {x: 187, y: -61};
			let p5 = {x: 250, y: 51};
			this.points[1] = [p3];
			this.points[2] = [p2, p4];
			this.points[3] = [p2, p3, p4];
			this.points[4] = [p1, p2, p3, p4];
			this.points[5] = [p1, p2, p3, p4, p5];

			for(let i = 0; i<=4; i++){
				let btn = this['btn' + i] as eui.Button;
				btn.scaleX = btn.scaleY = 0;
				btn.x = btn.y = 60;
				btn.visible = false;
			}

		}

		public show(qzData) {
			this.qzList = [];
			for (let key in qzData) {
				if(qzData[key] == true){
					this.qzList.push(parseInt(key));
				}
			}
			let points = this.points[this.qzList.length];
			for(let i = 0; i < points.length; i++){
				let point = points[i];
				let key = this.qzList[i];
				let button = this['btn' + i] as eui.Button;
				button.labelDisplay.text = "x" + key;
				button.visible = true;		
				egret.Tween.get(button).to({
					x: point.x,
					y: point.y,
					scaleX: 1,
					scaleY: 1
				}, 200+(i*35));
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