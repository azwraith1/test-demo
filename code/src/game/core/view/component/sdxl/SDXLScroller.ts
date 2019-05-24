module sdxl {
	export class SDXLScroller extends game.BaseUI {
		private scroller: eui.Scroller;
		private itemGroup: eui.Group;
		public item1: SDXLScrollerItem;
		public item2: SDXLScrollerItem;
		public item3: SDXLScrollerItem;
		public item4: SDXLScrollerItem;
		public item5: SDXLScrollerItem;
		private itemSize1: number = 8
		private itemSize2: number = 8
		private itemSize3: number = 8
		private itemSize4: number = 8
		private itemSize5: number = 8
		private overIndex: number = 0;
		public speed: number = 48;

		public constructor() {
			super();
			this.skinName = new SDXLScrollerSkin();
		}

		public onAdded() {
			super.onAdded();
			this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
		}

		public onRemoved() {
			super.onRemoved();
			this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
		}

		public isRun: boolean = false;
		private overTime: number;
		public update(e: egret.Event) {
			if (!this.isRun) {
				return;
			}
			// this.item5.y += this.speed;
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`] as SDXLScrollerItem //.itemDown(this.speed);
				item.itemDown();
			}
		}
		public stopIconDb() {
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`].stopAni();
			}
		}

		/**
		 * 转动
		 */
		public run() {
			//还原
			this.isRun = true;
			this.overIndex = 1;
			this.overIndexes = [];
			this.resultArrList = null;
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`] as SDXLScrollerItem;
				item.startRun();
			}
		}
		/**
		 * 免费游戏转动
		 */
		public freeRun() {
			//还原
			this.isRun = true;
			this.overIndex = 1;
			for (let i = 6; i <= 10; i++) {
				let item = this[`item${i}`] as SDXLScrollerItem;
				item.startRun();
			}
		}

		private overIndexes: string[] = [];
		private resultArrList: any;
		/**
		 * 快速转动结果
		 */
		public runResultFast() {
			if (this.resultArrList) {
				let resultArr = this.resultArrList;
				for (let i = 0; i < resultArr.length; i++) {
					let result = resultArr[i];
					let item = this[`item${i + 1}`] as SDXLScrollerItem;
					item.clearDownTimeOut();
					if (this.overIndexes.indexOf(i + "") < 0) {
						item.startDownTimeOut(20 * (1 + i), result);
					}
				}
				return true;
			}
			return false;
		}
		/**
		 * 将转动结果resultAtr替换成转轴结果
		 * @param  {} resultArr
		 */
		public runResult(resultArr) {
			this.resultArrList = resultArr;
			for (let i = 0; i < resultArr.length; i++) {
				let result = resultArr[i];
				let item = this[`item${i + 1}`] as SDXLScrollerItem;
				item.startDownTimeOut(this.changeResultByIndex(i + 1), result)
			}
		}
		/**
		 * 中了scatter的特效
		 * @param  {} item
		 * @param  {} index
		 * @param  {} str
		 */
		public addFoGuang(item, index, str) {
			this[`item${item}`].changeFoguang(index, str);
		}
		/**
		 * 可能中scatter的scatter特效
		 * @param  {} item
		 * @param  {} index
		 * @param  {} str
		 */
		public addFoGuang1(item, index, str) {
			this[`item${item}`].changeFoguang1(index, str);
		}

		/**
		 * 更改index列转动结果
		 * @param  {} index
		 */
		private changeResultByIndex(index) {
			switch (index) {
				case 1:
					return game.LaohuUtils.downTime1;
				case 2:
					return game.LaohuUtils.downTime2;
				case 3:
					return game.LaohuUtils.downTime3;
				case 4:
					return game.LaohuUtils.downTime4;
				case 5:
					return game.LaohuUtils.downTime5;
			}
		}

		/**
		 * 改变index列速度
		 * @param  {} index
		 */
		private changeSpeedByIndex(index) {
			switch (index) {
				case 1:
					return 48 * 1;
				case 2:
					return 48 * 1.01;
				case 3:
					return 48 * 1.02;
				case 4:
					return 48 * 1.03;
				case 5:
					return 48 * 1.04;
			}
		}

		public scatterAni: DBComponent;
		public createChildren() {
			super.createChildren();
			this.scroller.bounces = false;
			this.scroller.scrollPolicyH = "off";
			this.scroller.scrollPolicyV = "off";
			this.scatterAni = new DBComponent("sdxl_scatterkuang");
			// this.scatterAni.x = 630;
			// this.scatterAni.y = 255;

			// this.addChild(this.scatterAni);
		}
		/**
		 * 初始化每列图表数量
		 * @param  {} sceneIndex
		 */
		public initItemCounts(sceneIndex) {
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`] as SDXLScrollerItem;
				item.initSize(this[`itemSize${i}`], i, sceneIndex);
			}
		}
		/**
		 * 初始化每列图标
		 * @param  {} index
		 * @param  {} firstArr
		 */
		public initItemByFirst(index, firstArr) {
			let item = this[`item${index}`] as SDXLScrollerItem;
			item.name = "item" + index;
			item.createIcons(firstArr);
		}
		/**
		 * 生成一列除excludeValue以外的转轴图标数组
		 * @param  {} excludeValue
		 */
		private getLine3Icon(excludeValue) {
			var arrWating = [];
			for (let i = 3; i <= 12; i++) {
				if (i != excludeValue) {
					let count = Math.floor(_.random(1, 2));
					if (i == 2) {
						count = 1;
					}
					for (let j = 0; j < count; j++) {
						arrWating.push(i);
					}
				}
			}
			arrWating = _.shuffle(arrWating);
			let sure1 = [arrWating[0], arrWating[1], arrWating[2]];
			return sure1;

		}
		/**
		 * scatter加速特效
		 * @param  {number} index
		 */
		public addScatterAni(index: number) {
			switch (index) {
				case 4:
					this.scatterAni.x = 700;
					this.scatterAni.y = 260;
					this.scatterAni.scaleY = 1;
					this.addChild(this.scatterAni);
					this.scatterAni.play("", -1);
					break;
				case 5:
					this.scatterAni.x = 900;
					this.scatterAni.y = 260;
					this.addChild(this.scatterAni);
					this.scatterAni.scaleY = 1;
					this.scatterAni.play("", -1);
					break;
			}

		}
		public commomScore: eui.BitmapLabel;
		public scoreTimeOut: any;
		/**
		 * @param  {Array<Array<number>>} allline
		 * @param  {number} allscore
		 */
		public addBonusAni(allline: Array<Array<number>>, allscore?: number) {
			for (let i = 1; i <= allline.length; i++) {
				for (let j = 0; j < allline[i - 1].length; j++) {
					this[`item${i}`].showAni(allline[i - 1][j]);
				}
			}

		}
		/**
		 * 图标置灰
		 */
		public setIconHui() {
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`].setIconHui();
			}
		}
		/**
		 * 移除置灰
		 * @param  {Array<Array<number>>} array
		 */
		public removeIconHui(array: Array<Array<number>>) {
			for (let i = 1; i <= array.length; i++) {
				for (let j = 0; j < array[i - 1].length; j++) {
					this[`item${i}`].resetIconHui(array[i - 1][j]);
				}
			}
		}
		/**
		 * 特殊图标置灰
		 * @param  {Array<Array<number>>} array
		 */
		public setSpecilHui(array: Array<Array<number>>) {
			for (let i = 1; i <= array.length; i++) {
				for (let j = 0; j < array[i - 1].length; j++) {
					this[`item${i}`].setSpecilHui(array[i - 1][j]);
				}
			}
		}
		/**
		 * @param  {} index?
		 */
		public removeScatterAni(index?) {
			if (this.scatterAni.parent && this.scatterAni) {
				this.scatterAni.parent.removeChild(this.scatterAni);
			}
		}
		/**
		 * 初始化游戏图标
		 * @param  {} sceneIndex
		 */
		public showFirst(sceneIndex) {
			this.initItemCounts(sceneIndex);
			// this.initItemByFirst(1, [2, 2, 2, 2, 2, 2, 2, 2]);
			// this.initItemByFirst(2, [2, 2, 2, 2, 2, 2, 2, 2]);
			// this.initItemByFirst(3, [2, 2, 2, 2, 2, 2, 2, 2]);
			// this.initItemByFirst(4, [2, 2, 2, 2, 2, 2, 2, 2]);
			// this.initItemByFirst(5, [2, 2, 2, 2, 2, 2, 2, 2]);
			this.initItemByFirst(1, this.getLine3Icon(1));
			this.initItemByFirst(2, this.getLine3Icon(2));
			this.initItemByFirst(3, this.getLine3Icon(0));
			this.initItemByFirst(4, this.getLine3Icon(2));
			this.initItemByFirst(5, this.getLine3Icon(1));
		}
		/**
		 * 免费游戏初始化图标
		 * @param  {} sceneIndex
		 */
		public showFreeFirst(sceneIndex) {
			this.initItemCounts(sceneIndex);
			this.initItemByFirst(1, this.getLine3Icon(2));
			this.initItemByFirst(2, this.getLine3Icon(2));
			this.initItemByFirst(3, this.getLine3Icon(2));
			this.initItemByFirst(4, this.getLine3Icon(2));
			this.initItemByFirst(5, this.getLine3Icon(2));
		}
	}
}