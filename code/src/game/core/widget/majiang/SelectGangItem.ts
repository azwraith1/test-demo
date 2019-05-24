module majiang {
	export class SelectGangItem extends game.BaseUI{
		private pai1: MineZhengpai;
		private pai2: MineZhengpai;
		private pai3: MineZhengpai;
		private pai4: MineZhengpai;
		private value: number;
		private isGang: boolean;
		public constructor(value, isGang = true) {
			super();
			this.value = value;
			this.isGang = isGang;
			this.skinName = new SelectGangItemSkin();
		}

		public createChildren(){
			super.createChildren();
			if(this.isGang){
				this.initWithValue();
			}else{
				this.initWithChi();
			}
			
		}

		private initWithChi(){
			this.pai4.visible = false;
			this.pai1.changeColor(this.value - 2);
			this.pai2.changeColor(this.value - 1);
			this.pai3.changeColor(this.value);
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
			if(this.isGang){
				EventManager.instance.dispatch(EventNotify.GANG_SELECT, this.value);
			}else{
				EventManager.instance.dispatch(EventNotify.CHI_SELECT, this.value);
			}
		}
	}
}