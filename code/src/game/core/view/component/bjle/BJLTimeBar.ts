module bjle {
	export class BJLTimeBar extends game.BaseUI implements IUpdate {
		private timeLabel: eui.Label;
		private time: number = 0;
		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
		}

		private root;
		/**
		 * 开始计时
		 */
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
				let value = Math.floor(360 * cha / start);
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