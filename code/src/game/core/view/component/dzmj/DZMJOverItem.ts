class DZMJOverItem extends eui.Component{
	private fan1: eui.Label;
	private fan2: eui.Label;
	private type1: eui.Label;
	private type2: eui.Label;
	private count1: number;
	private count2: number;
	private fanCount1;
	private fanCount2
	public constructor(count1, fan1, count2, fan2) {
		super();
		this.count1 = count1;
		this.count2 = count2;
		this.fanCount1 = fan1;
		this.fanCount2 = fan2;
		this.skinName = new DZMJOverItemSkin();
	}


	public createChildren(){
		super.createChildren();
		if(this.count1){
			let countArr = MJConfig.FAN_XING[this.count1].split("|");
			this.type1.text = countArr[0];
			this.fan1.text =  this.fanCount1 + "番";
		}
		if(this.count2){
			let countArr = MJConfig.FAN_XING[this.count2].split("|");
			this.type2.text = countArr[0];
			this.fan2.text =  this.fanCount2 + "番";
		}
	}
}