module sangong {
	export class SangongTimeBar extends game.BaseUI implements IUpdate {
		private timeLabel: eui.Label;
		private angle: number = 0;
		private time: number = 0;
		private timeShape: egret.Shape;
		public constructor() {
			super();
			this.skinName = new SangongTimeBarSkin();
		}

		public createChildren() {
			super.createChildren();
			this.addChild(this.timeLabel);
		}


		private root: SangongTimeBar;
		public startTime(root) {
			this.root = root;
			game.UpdateTickerManager.instance.add(this);
		}

		public update(dt: number) {
			if (Global.roomProxy.roomInfo && Global.roomProxy.roomInfo.countdown) {
				let endTime = Global.roomProxy.roomInfo.countdown.end;
				let startTime = game.DateTimeManager.instance.now;
				let start = Global.roomProxy.roomInfo.countdown.s;
				if (!start) {
					start = Global.roomProxy.roomInfo.countdown.end - Global.roomProxy.roomInfo.countdown.start;
				}
				let cha = endTime - startTime;
				if (cha <= 0) {
					this.timeLabel.text = "00";
					return;
				}

				this.timeLabel.text = NumberFormat.getNNTimeStr(cha);
			}
		}


		public updateTimeLabel(){
			this.update(0);
		}

		public removeTimer() {
			game.UpdateTickerManager.instance.remove(this);
		}
	}
}