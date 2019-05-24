/*
 * @Author: MC Lee 
 * @Date: 2019-04-01 10:41:26 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-04-01 10:42:47
 * @Description: 百得之筹码
 */
class BDZCM extends eui.Component {
	private goldLabel: eui.BitmapLabel;
	private cmColor: eui.Image;
	public constructor() {
		super();
		this.skinName = new BDZCMSkin();
	}

	public createChildren() {
		super.createChildren();
	}

	public changeGold(gold) {
		let goldStr = "";
		if (gold >= 1000) {
			goldStr = Math.floor(gold / 1000) + "k";
		} else {
			goldStr = gold + ""
		}
		this.goldLabel.text = goldStr;
	}

	public changeColor(type) {
		//绿-> 紫 -> 角 元 -> 红
		switch (type) {
			case "yuan":
				this.cmColor.source = RES.getRes("bdz_cm_4_png");
				break;
			case "jiao":
				this.cmColor.source = RES.getRes("bdz_cm_2_png");
				break;
			case "fen":
				this.cmColor.source = RES.getRes("bdz_cm_1_png");
				break;
		}

	}

}