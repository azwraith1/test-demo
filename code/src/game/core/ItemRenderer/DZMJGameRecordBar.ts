module dzmj {
	export class DZMJGameRecordBar extends game.BaseUI {
		private values;
		private paijunumber: eui.Label;
		private room: eui.Label;
		private winOrLose: eui.Label;
		private gametimes: eui.Label;
		public constructor(data) {
			super();
			this.values = data;
			this.skinName = new DZMJGameRecordBarSkin();
		}

		protected createChildren(): void {
			super.createChildren();
			let num = this.values;
			this.paijunumber.text = num["roomId"];
			this.room.text = this.choseField(num["sceneId"]);
			if (num["gainGold"] >= 0) {
				this.winOrLose.text = "+" + NumberFormat.handleFloatDecimal(num["gainGold"]);
				this.winOrLose.textColor = 0xe70909;
			} else {
				this.winOrLose.text = NumberFormat.handleFloatDecimalStr(num["gainGold"]);
				this.winOrLose.textColor = 0x0a790a;
			}
			this.gametimes.text = this.fmtDate(num["gameTime"]);
		}


		private choseField(value) {
			let val = Number(value);
			switch (val) {
				case 1001:
					return "初级场";
				case 1002:
					return "中级场";
				case 1003:
					return "高级场";
				case 1004:
					return "土豪场";
			}
		}

		private fmtDate(obj) {
			var date = new Date(obj * 1000);
			var y = date.getFullYear();
			var m = "0" + (date.getMonth() + 1);
			var d = "0" + date.getDate();
			var h = "0" + date.getHours();
			var mins = "0" + date.getMinutes();
			var sc = "0" + date.getSeconds();
			return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length) + "\t" + h.substring(h.length - 2, h.length) + ":" + mins.substring(mins.length - 2, mins.length) + ":" + sc.substring(sc.length - 2, sc.length);
		}
	}
}