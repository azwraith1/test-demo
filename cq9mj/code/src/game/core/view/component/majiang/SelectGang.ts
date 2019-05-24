/*
 * @Author: li mengchan 
 * @Date: 2018-07-20 11:41:14 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:11:05
 * @Description: 多个杠牌的显示
 */
module majiang {
	export class SelectGang extends eui.Component{
		private bgImage: eui.Image;
		private itemGroup: eui.Group;
		private taskArr: any[];
		private root: MajiangTaskBar;
		public constructor() {
			super();
			// this.skinName = new SelectGangSkin();
		}

		public createChildren(){
			super.createChildren();
		}

		
		public initWithTask(taskArr){
			this.taskArr = taskArr;
			this.itemGroup.removeChildren();
			for(var i = 0; i < taskArr.length; i++){
				let item = new SelectGangItem(taskArr[i].card);
				this.itemGroup.addChild(item);
			}
			this.bgImage.width = this.itemGroup.width + 36;
			this.visible = true;
		}

		public hide(){
			this.taskArr = null;
			this.itemGroup.removeChildren();
			this.visible = false;
		}

		public getMaxWidth(){
			return this.bgImage.width + 50;
		}
	}
}