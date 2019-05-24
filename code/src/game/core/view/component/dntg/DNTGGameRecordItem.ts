module dntg {
	export class DNTGGameRecordItem extends game.BaseItemRender {
		public timeText: eui.Label;
		public gameNameText: eui.Label;
		public totalBetText: eui.Label;
		public totalWinText: eui.Label;

		public constructor() {
			super();
			this.skinName = new DNTGGameRecordItemSkin();
		}

		public createChildren() {
			super.createChildren();
		}

		protected dataChanged() {
			this.updateShow(this.data);
		}

		public updateShow(data: any) {
			if (data) {
				this.timeText.text = this.fmtDate(data.gameTime);
				if (data.sceneId == 1001) {
					this.gameNameText.text = "大闹天宫";
				} else if (data.sceneId == 1002) {
					this.gameNameText.text = "神雕侠侣";
				}else if(data.sceneId == 1003){
					this.gameNameText.text = "赤壁之战";
				}
				this.totalWinText.text = data.gainGold + "";
				this.totalBetText.text = data.betNum + "";
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