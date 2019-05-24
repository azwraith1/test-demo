module majiang {
	export class HuTipsItem extends eui.Component{
		public pai: MineZhengpai;
		public syLabel: eui.Label;
		public fanLabel: eui.Label;
		public majiangData
		public constructor(majiangData) {
			super();
			this.majiangData = majiangData;
			this.skinName = new HuTipsItemSkin();
		}

		public createChildren(){
			super.createChildren();
			this.pai.changeColor(this.majiangData.value);
			this.syLabel.text = this.majiangData.count;
			// this.fanLabel.text = this.majiangData.fan;
			if(this.majiangData.fan == 0){
				this.fanLabel.text = "1";
			}else{
				this.fanLabel.text = Math.pow(2, this.majiangData.fan) + "";
			}

			if(this.majiangData.count < 1){
				this.pai.alpha = 0.5;
			}
		}
	}
}