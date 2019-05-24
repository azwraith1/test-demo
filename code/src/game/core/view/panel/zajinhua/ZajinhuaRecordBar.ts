module zajinhua {
	export class ZajinhuaRecordBar extends game.BaseUI {
		private value: any;
		private pjbh: eui.Label;
		private roomtype: eui.Label;
		private w2f: eui.Label;
		private time: eui.Label;
		public constructor(data) {
			super();
			this.value = data;
			this.skinName = new ZajinhuaJiluBarSkin();
		}

		public createChildren() {
			super.createChildren();
			this.pjbh.text = this.value.roomId;
			this.roomtype.text = this.choseField(this.value.sceneId);
			let gold: number = this.value.gainGold;
			if (this.value.gainGold > 0) {
				this.w2f.textColor = 0xf7c085;
				this.w2f.text = "+" + gold.toFixed(2);
			} else {
				this.w2f.textColor = 0x83fc4e;
				this.w2f.text = gold.toFixed(2);
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
				case 1004:
					return "王者场";

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