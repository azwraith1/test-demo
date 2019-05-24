/*
 * @Author: li mengchan 
 * @Date: 2018-07-31 10:27:36 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-19 17:55:08
 * @Description: 战绩流水
 */
module majiang {
	export class RecordBar extends game.BaseUI {
		private scroller: eui.Scroller;
		private recordLabel: eui.Label;
		private recordList: eui.List;
		public constructor() {
			super();
			this.skinName = new RecordBarSkin();
		}

		public createChildren() {
			super.createChildren();
			this.scroller.scrollPolicyH = 'off';
			this.recordList.dataProvider = null;
			this.recordList.itemRenderer = RecordItemRender;
			this.visible = false;
		}

		public show() {
			let records: any = Global.gameProxy.getMineGameData().bills || [];
			let filterRecord = _.filter(records, (data)=>{
				return data['type'] > 0;
			})
			this.recordList.dataProvider = new eui.ArrayCollection(filterRecord);  
			this.visible = true;
			let count = 0;
			for(let i = 0; i< filterRecord.length; i++){
				count += records[i].info.gainGold;
			}
			
			let countStr = count > 0 ? "+" + count.toFixed(2) : count.toFixed(2); 
			this.recordLabel.text = "总输赢 : " + countStr; 
		}

		public hide(){
			// this.recordList.removeChildren();
			this.visible = false;
		}
	}
}