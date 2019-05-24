module sdxl {
	export class SDXLIcon extends SDXLBaseIcon {
		private dbAni: DBComponent;
		public rect: eui.Rect;
		public constructor() {
			super();
			this.skinName = new SDXLIconSkin();
		}

		public changeRamdom(min = 1, max = 12) {
			this.changeSouceByValue(Math.floor(_.random(1, 12)));
		}

		public changePosition() {
			switch (this.value) {
				case 1:
					this.dbComp.x = 93;
					this.dbComp.y = 92;
					break;
				case 2:
					this.dbComp.x = 93;
					this.dbComp.y = 92;
					break;
				case 3:
					this.dbComp.x = 93;
					this.dbComp.y = 92;
					break;
				case 4:
					this.dbComp.x = 93;
					this.dbComp.y = 92;
					break;
				case 5:
					this.dbComp.x = 93;
					this.dbComp.y = 92;
					break;
				case 6:
					this.dbComp.x = 93;
					this.dbComp.y = 92;
					break;
				case 7:
					this.dbComp.x = 93;
					this.dbComp.y = 92;
					break;
				case 8:
					this.dbComp.x = 93;
					this.dbComp.y = 92;
					break;


			}

		}

		public showRect(){
			this.rect.visible = true;
			this.addChild(this.rect);
		}
		public hideRect(){
			this.rect.visible = false;
		}
	}
}