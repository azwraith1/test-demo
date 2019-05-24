module lhj {
	export abstract class BaseLhjIcon extends eui.Component {
		protected icon: eui.Image;
		protected value: number;
		protected iconKey: string = "dntg";
		protected dbComp: DBComponent;
		public constructor() {
			super();
		}
		// abstract playEffect();

		public changeSource(source) {
			this.icon.source = RES.getRes(source);
		}

		public changeSouceByValue(value) {
			this.value = value;
			this.icon.source = RES.getRes(`${this.iconKey}_icon_${value}_png`);
		}
		public changeSourceByNameValue(iconKey: string, value) {
			this.value = value;
			this.iconKey = iconKey;
			this.icon.source = RES.getRes(`${this.iconKey}_icon_${value}_png`);
		}

		public foguang: DBComponent;

		/**
		 * @param  {string} str
		 * dntg scatter图标的特效
		 */
		public showFoguang(str: string) {
			this.foguang = new DBComponent(str)
			this.foguang.x = 90;
			this.foguang.y = 90;
			this.foguang.play("", 1);
			this.addChild(this.foguang);
		}

		protected changePosition() {

		}
		public dbGuang: DBComponent;
		public dbBjgang: DBComponent;

	

		public createChildren() {
			super.createChildren();
			this.dbGuang = new DBComponent("guang");//dntg 图标背景特效1
			this.dbBjgang = new DBComponent("tuan");//dntg 图标背景特效2
			this.dbGuang.x = this.dbBjgang.x = 90;
			this.dbGuang.y = this.dbBjgang.y = 90;
			this.dbGuang.visible = false;
			this.dbBjgang.visible = false;
			this.dbGuang.callback = () => {
			}
			this.dbBjgang.callback = () => {
				game.UIUtils.removeSelf(this.dbGuang);
				game.UIUtils.removeSelf(this.dbBjgang);
			};

			
		}
		/**
		 * dntg 展示图标动画
		 */
		public showDbComponent() {
			this.addChild(this.dbBjgang);
			this.addChild(this.dbGuang);
			this.addChild(this.icon);
			this.dbBjgang.play1("", 1);
			this.dbGuang.play1("", 1);
			if (this.value <= 8) {
				if (!this.dbComp) {
					this.dbComp = new DBComponent(`icon_${this.value}`);
					this.dbComp.callback = () => {
						if (this.dbComp) {
							this.dbComp.visible = false;
							this.icon.visible = true;
						}
					}
					this.dbComp.x = 90;
					this.dbComp.y = 90;
				} else {
					this.dbComp.visible = true;
				}
				this.icon.visible = false;
				this.addChild(this.dbComp);
				this.dbComp.play1("", 1);
			}
			else {
				egret.Tween.get(this.icon).to({ scaleX: 1.15, scaleY: 1.15, anchorOffsetX: this.icon.width / 2, anchorOffsetY: this.icon.height / 2 }, 750).to({ scaleX: 1, scaleY: 1, anchorOffsetX: this.icon.width / 2, anchorOffsetY: this.icon.height / 2 }, 750).call(() => { this.stopDbComponet(); })
				if (this.dbComp) {
					this.dbComp.visible = false;
				}
				this.icon.visible = true;
			}
		}

		public hideDbComponent() {
			if (this.dbComp) {
				this.dbComp.stop();
				game.UIUtils.removeSelf(this.dbComp);
				this.dbComp = null;
			}
			egret.Tween.removeTweens(this.icon);
			this.icon.scaleX = this.icon.scaleY = 1;
			this.icon.visible = true;
		}
		/**
		 * dntg 去除图标特效
		 */
		public stopDbComponet() {
			egret.Tween.removeTweens(this.icon);
			this.icon.scaleX = this.icon.scaleY = 1;
			this.icon.visible = true;
			if (this.dbComp) {
				this.dbComp.visible = false;
				game.UIUtils.removeSelf(this.dbComp);
				this.dbComp = null;
			}
			this.stopKuangDB();
		}


		public stopKuangDB() {
			game.UIUtils.removeSelf(this.dbGuang);
			game.UIUtils.removeSelf(this.dbBjgang);
		}
		//
		//以下是神雕侠侣图标特效
		//
		public scatterGuang: DBComponent;
		/**
		 * @param  {string} str
		 * 添加sdxl scatter特效
		 */
		public addScatter(str: string) {
			this.scatterGuang = new DBComponent(str);
			this.scatterGuang.x = 90;
			this.scatterGuang.y = 90;
			this.scatterGuang.play("", 1);
			this.addChild(this.scatterGuang);
		}
		
	}
}