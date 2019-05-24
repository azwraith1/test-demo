module rbwar {
	export class RBWRecordRenderer extends game.BaseUI {
		private value: any;
		private pjbh: eui.Label;
		private roomtype: eui.Label;
		private w2f: eui.Label;
		private time: eui.Label;
		public constructor(data) {
			super();
			this.value = data;
			this.skinName = new RBWJiLuBarSkin();
		}

		public createChildren() {
			super.createChildren();
			this.pjbh.text = this.value.roundId;
			this.roomtype.text = this.choseField(this.value.sceneId);
			if (this.value.gainGold > 0) {
				this.w2f.textColor = 0xfed100;
				this.w2f.text = "+" + this.value.gainGold;
			} else {
				this.w2f.textColor = 0x28c676;
				this.w2f.text = this.value.gainGold;
			}
			this.time.text = this.fmtDate(this.value.gameTime);
		}


		private choseField(value) {
			switch (value) {
				case 1001:
					return "初级场";
				case 1002:
					return "中级场";
				case 1003:
					return "高级场";

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