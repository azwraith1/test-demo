module niuniu {
	export class NiuniuNewTimeBar extends game.BaseUI implements IUpdate {
		private timeLabel: eui.Label;
		private angle: number = 0;
		private time: number = 0;
		private timeShape: egret.Shape;
		public constructor() {
			super();
			this.skinName = new NiuniuNewtimeDirectionBarSkin();
		}

		private ima: eui.Image;
		private ima1: eui.Image;
		public createChildren() {
			super.createChildren();
			this.timeShape = new egret.Shape();
			this.timeShape.rotation = -90;
			this.addChild(this.timeShape);
			this.timeShape.x = -49.5;
			this.timeShape.y = 144.5;
			this.addChild(this.timeLabel);
		}



		
		private showShapByPo(angle) {
			let shape = this.timeShape;
			shape.graphics.clear();
			shape.graphics.beginFill(0x53a7ce);
			shape.graphics.moveTo(90, 90);
			shape.graphics.drawArc(90, 90, 32, 0, angle * Math.PI / 180, false);
			shape.graphics.lineTo(90, 90);
			shape.graphics.endFill();
		}



		private root: NiuniuSGameScene;
		public startTime(root) {
			this.root = root;
			game.UpdateTickerManager.instance.add(this);
		}

		private tim: any;
		public update(dt: number) {
			if (Global.roomProxy.roomInfo && Global.roomProxy.roomInfo.countdown) {
				let endTime = Global.roomProxy.roomInfo.countdown.end;
				let startTime = game.DateTimeManager.instance.now;
				let start = Global.roomProxy.roomInfo.countdown.s;
				this.tim = start;
				if (!start) {
					start = Global.roomProxy.roomInfo.countdown.end - Global.roomProxy.roomInfo.countdown.start;
				}
				let cha = endTime - startTime;
				let value = Math.floor(360 * cha / start);
				// * 360;
				if (value >= 0) {
					this.showShapByPo(value);
				}
				if (cha <= 0) {
					this.timeLabel.text = "00";
					return;
				}
				this.timeLabel.text = NumberFormat.getNNTimeStr(cha);
			}
		}

		public removeTimer() {
			game.UpdateTickerManager.instance.remove(this);
		}
	}
}