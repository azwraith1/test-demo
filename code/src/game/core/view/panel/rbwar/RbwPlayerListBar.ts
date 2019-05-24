module rbwar {
	export class RbwPlayerListBar extends game.BaseUI {
		//富豪榜
		private title_fh: eui.Image;
		//名次
		private mingci: eui.BitmapLabel;
		//头像
		private playerHeader: eui.Image;
		//名字
		private playerName: eui.Label;
		//钱
		private playerMoney: eui.Label;
		//下注
		private playerXz: eui.Label;
		//压中
		private playerYz: eui.Label;

		private value: any;
		private n: any;
		public constructor(data, n) {
			super();
			this.value = data;
			this.n = n;
			this.skinName = new RbwarPlayerListBarSkin();
		}

		public createChildren() {
			super.createChildren();
			if (this.n == 0) {
				this.title_fh.source = RES.getRes("rbw_luckey_png")
				this.mingci.text = "";
			} else {
				this.title_fh.source = RES.getRes("rbw_fh_png")
				this.mingci.text = this.n;
			}

			this.playerHeader.source = RES.getRes(`hall_header_${this.value.sex}_${this.value.url}_png`);
			this.playerName.text = this.value.name;
			this.playerMoney.text = this.value.gold.toFixed(2);
			this.playerXz.text = "下注：" + this.value.lastBet;
			this.playerYz.text = "压中：" + this.value.lastWin;
		}
	}
}