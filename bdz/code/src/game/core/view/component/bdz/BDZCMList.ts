class BDZCMList extends eui.Component {
	public cmList: BDZCM[] = [];
	public constructor() {
		super();
	}

	public createChildren() {
		super.createChildren();
	}

	/**
	 * 显示金币堆
	 * @param  {} total 总量
	 * @param  {} order 单价
	 */
	public showGolds(rule) {
		let unit = rule.unit;
		let total = rule.total;
		let type = rule.type;
		let num = Math.floor(total / unit);
		while(this.cmList.length > 0){
			let cm = this.cmList.pop();
			game.UIUtils.removeSelf(cm);
			ObjectPool.reclaim("bdz_cm", cm);
		}
		for(let i = 0; i < num; i++){
			let cm = ObjectPool.produce("bdz_cm", BDZCM) as BDZCM;
			if(!cm){
				cm = new BDZCM();
			}
			cm.changeGold(unit);
			cm.changeColor(type);
			this.addChild(cm);
			this.cmList.push(cm);
			cm.y = -1 * i * 6;
		}
	}
}