module majiang {
	export class BasePGItem extends eui.Component {
		protected times;//那堆牌。
		public color;
		public type;
		protected pbg;
		protected image1: eui.Image;
		protected image2: eui.Image;
		protected image3: eui.Image;
		protected image4: eui.Image;
		protected value3: eui.Image;
		protected value2: eui.Image;
		protected value1: eui.Image;
		protected value4: eui.Image;
		protected rectGroup: eui.Rect;
		protected rect1: eui.Rect;
		protected rect2: eui.Rect;
		protected rect3: eui.Rect;
		public constructor(type, color, lgth, pbg?) {
			super();
			this.color = color;
			this.type = type;
			this.pbg = pbg;
		}

		//碰牌变吃牌
		public peng2Chi(maxCard){
			this.type = 10;
			this.color = maxCard;
			this.value2.source = "color_value_" + (maxCard - 1) + "_png";
			this.value3.source = "color_value_" + (maxCard) + "_png";
			this.value1.source = "color_value_" + (maxCard - 2) + "_png";
		}


		public checkShowRect(value){
			let chaju = this.color - value;
			this.rectGroup.visible = true;
			if(0 <= chaju && chaju <= 2){
				this[`rect${3 - chaju}`].visible = true;
			}
		}

		public showRect(value) {
			if (value == 0) {
				this.rect1.visible = this.rect2.visible = this.rect3.visible = false;
				this.rectGroup.visible = false;
			} else {
				this.rect1.visible = this.rect2.visible = this.rect3.visible = true;
				this.rectGroup.visible = true;
			}
		}
	}
}