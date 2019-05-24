module majiang {
	export class SelectGangItem extends game.BaseUI{
		private pai1: MineZhengpai;
		private value: number;
		public constructor(value) {
			super();
			this.value = value;
			this.skinName = new SelectGangItemSkin();
		}


		public createChildren(){
			super.createChildren();
			this.initWithValue();
		}
		/**
		 * 改变底牌颜色
		 */
		private initWithValue(){
			for(var i = 1; i<=4; i++){
				this['pai' + i].changeColor(this.value);
			}
		}

		public onTouchTap(e: egret.TouchEvent){
			e.stopPropagation();
			EventManager.instance.dispatch(EventNotify.GANG_SELECT, this.value);
		}
	}
}