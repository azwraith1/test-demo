module majiang {
	export class MajiangHupaiGroup extends game.BaseUI {
		private majiangs: MajiangHupai[] = [];
		private records: any;
		private direction;
		private positions;

		public constructor(direction) {
			super();
			// this.skinName = new HupaiGroupSkin();	
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.FIND_COLOR, this.findColor, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.FIND_COLOR, this.findColor, this);
		}

		/**
		 * 查找颜色相同的
		 * @param  {egret.Event} e
		 */
		public findColor(e: egret.Event) {
			let value = e.data;
			for (let i = 0; i < this.majiangs.length; i++) {
				this.majiangs[i].showMaskRect(value)
			}
		}


		public initWithDirection(direction) {
			this.direction = direction;
			this.positions = this.createRecords();
		}

		public createRecords() {
			this.records = {};
			switch (this.direction) {
				case "mine":
					return [{ x: 0, y: 0 }, { x: 44, y: 0 }, { x: 88, y: 0 }];
				case "left":
					return [{ x: 0, y: 0 }, { x: -5.5, y: 37 }, { x: -11, y: 75 }];
				case "right":
					return [{ x: 9, y: 48 }, { x: 4.5, y: 24 }, { x: 0, y: 0 }];
				case "top":
					return [{ x: 70, y: 0 }, { x: 35, y: 0 }, { x: 0, y: 0 }]
			}
		}

		public initWithArr(huCards) {
			for (var i = 0; i < huCards.length; i++) {
				let huCard = huCards[i];
				this.addHu(huCard);
			}

		}

		public addHu(huJson, type: number = 0) {
			let hu = huJson.card;
			let hupai = new MajiangHupai(this.direction, hu);
			if(huJson.mainCard == false){hupai.alpha = 0.7;}
			let numberIndex = this.majiangs.length;
			let row = Math.floor(numberIndex / 3);
			let cow = numberIndex % 3;
			hupai.index = numberIndex + 1;
			this.addChild(hupai);
			this.majiangs.push(hupai);
			switch (this.direction) {
				case "mine":
					hupai.x = this.positions[cow].x + (row * 5)
					hupai.y = this.positions[cow].y + (row * -17);
					break;
				case "left":
					hupai.x = this.positions[cow].x + (row * -4)
					hupai.y = this.positions[cow].y + (row * -18);
					break;
				case "right":
					hupai.x = this.positions[cow].x + (row * 4)
					hupai.y = this.positions[cow].y + (row * -18);
					break;
				case "top":
					hupai.x = this.positions[cow].x + (row * -2)
					hupai.y = this.positions[cow].y + (row * -20);
					break;
			}
			this.resetZorder();
			switch (type) {
				case 1:
					//点炮
					hupai.showDianpao();
					break;
				case 2:
					//自摸
					hupai.alpha = 0;
					hupai.showZimo();
			}
		}

		public resetZorder() {
			switch (this.direction) {
				case "mine":
					var groups = _.groupBy(this.majiangs, 'y');
					for (var key in groups) {
						for (var i = groups[key].length - 1; i >= 0; i--) {
							this.addChild(groups[key][i]);
						}
					}
					break;
				case "left":
					break;
				case "right":
					var groups = _.groupBy(this.majiangs, function (majiang) {
						return Math.floor((majiang.index - 1) / 3);
					});
					for (var key in groups) {
						for (var i = groups[key].length - 1; i >= 0; i--) {
							this.addChild(groups[key][i]);
						}
					}
					break;
				case "top":
					var groups = _.groupBy(this.majiangs, 'y');
					for (var key in groups) {
						for (var i = groups[key].length - 1; i >= 0; i--) {
							this.addChild(groups[key][i]);
						}
					}
			}

		}
	}
}