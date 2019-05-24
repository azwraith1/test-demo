/*
 * @Author: wangtao 
 * @Date: 2019-04-19 17:42:55 
 * @Last Modified by: wangtao
 * @Last Modified time: 2019-05-20 18:49:27
 * @Description: 
 */
module dntg {
	export class DNTGIcon extends lhj.BaseLhjIcon {
		private dbAni: DBComponent; //
		public constructor() {
			super();
			this.skinName = new DNTGIconSKin();
		}
		// public playEffect(){}
		/**
		 * 图标更换
		 * @param  {} min=1
		 * @param  {} max=12
		 */
		public changeRamdom(min = 1, max = 12) {
			this.changeSouceByValue(Math.floor(_.random(1, 12)));
		}
		/**
		 * 图标动画位置校准
		 */
		public changePosition() {
			switch (this.value) {
				case 1:
					this.dbComp.x = 92.5;
					this.dbComp.y = 91.5;
					break;
				case 2:
					this.dbComp.x = 91;
					this.dbComp.y = 92;
					break;
				case 3:
					this.dbComp.x = 91;
					this.dbComp.y = 94;
					break;
				case 4:
					this.dbComp.x = 91;
					this.dbComp.y = 93;
					break;
				case 5:
					this.dbComp.x = 90.5;
					this.dbComp.y = 90;
					break;
				case 6:
					this.dbComp.x = 94;
					this.dbComp.y = 88;
					break;
				case 7:
					this.dbComp.x = 94;
					this.dbComp.y = 83;
					break;
				case 8:
					this.dbComp.x = 91;
					this.dbComp.y = 87;
					break;


			}

		}
	}
}