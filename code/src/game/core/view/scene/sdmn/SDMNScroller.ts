module sdmn {
	export class SDMNScroller extends game.BaseUI {
		private scroller: eui.Scroller;
		private itemGroup: eui.Group;
		public item1: SDMNScrollerItem;
		public item2: SDMNScrollerItem;
		public item3: SDMNScrollerItem;
		public item4: SDMNScrollerItem;
		public item5: SDMNScrollerItem;
		private itemSize1: number = 8
		private itemSize2: number = 8
		private itemSize3: number = 8
		private itemSize4: number = 8
		private itemSize5: number = 8
		private overIndex: number = 0;
		public speed: number = 48;

		public constructor() {
			super();
			this.skinName = "SDMNScrollerSkin";
		}

		public onAdded() {
			super.onAdded();
			this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
		}

		public onRemoved() {
			super.onRemoved();
			this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
		}

		public flashIcon: Array<Array<number>> = [];
		public isRun: boolean = false;
		private overTime: number;
		public update(e: egret.Event) {
			if (!this.isRun) {
				return;
			}
			// this.item5.y += this.speed;
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`] as SDMNScrollerItem //.itemDown(this.speed);
				item.itemDown();
			}
		}
		public stopIconDb() {
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`].stopAni();
			}
		}


		public run() {
			//还原
			this.isRun = true;
			this.overIndex = 1;
			this.overIndexes = [];
			this.resultArrList = null;
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`] as SDMNScrollerItem;
				item.startRun();
			}
		}
		public freeRun() {
			//还原
			this.isRun = true;
			this.overIndex = 1;
			for (let i = 6; i <= 10; i++) {
				let item = this[`item${i}`] as SDMNScrollerItem;
				item.startRun();
			}
		}

		private overIndexes: string[] = [];
		private resultArrList: any;
		public runResultFast() {
			if (this.resultArrList) {
				let resultArr = this.resultArrList;
				for (let i = 0; i < resultArr.length; i++) {
					let result = resultArr[i];
					let item = this[`item${i + 1}`] as SDMNScrollerItem;
					item.clearDownTimeOut();
					if (this.overIndexes.indexOf(i + "") < 0) {
						item.startDownTimeOut(20 * (1 + i), result);
					}
				}
				return true;
			}
			return false;
		}

		public runResult(resultArr) {
			this.resultArrList = resultArr;
			for (let i = 0; i < resultArr.length; i++) {
				let result = resultArr[i];
				let item = this[`item${i + 1}`] as SDMNScrollerItem;
				item.startDownTimeOut(this.changeResultByIndex(i + 1), result)
			}
		}
		/**
		 * @param  {} item
		 * @param  {} index
		 * @param  {} str
		 */
		public addFoGuang(item, index, str) {
			this[`item${item}`].changeFoguang(index, str);
		}
		/**
		 * 可能出scatter的动画
		 * @param  {} item
		 * @param  {} index
		 * @param  {} str
		 */
		public addFoGuang1(item, index, str) {
			this[`item${item}`].changeFoguang1(index, str);
		}


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
			this.scatterAni = new DBComponent("cbzz_fast_ani1");
			// this.scatterAni.x = 630;
			// this.scatterAni.y = 255;

			// this.addChild(this.scatterAni);
		}
		/**
		 * @param  {} sceneIndex
		 */
		public initItemCounts(sceneIndex) {
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`] as SDMNScrollerItem;
				item.initSize(this[`itemSize${i}`], i, sceneIndex);
			}
		}
		/**
		 * @param  {} index
		 * @param  {} firstArr
		 */
		public initItemByFirst(index, firstArr) {
			let item = this[`item${index}`] as SDMNScrollerItem;
			item.name = "item" + index;
			item.createIcons(firstArr);
		}
		/**
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
		 * @param  {number} index
		 */
		public addScatterAni(index: number) {
			switch (index) {
				case 4:
					this.scatterAni.x = 655;
					this.scatterAni.y = 280;
					this.scatterAni.scaleY = 1;
					this.addChild(this.scatterAni);
					this.scatterAni.play("", 4);
					break;
				case 5:
					this.scatterAni.x = 845;
					this.scatterAni.y = 280;
					this.addChild(this.scatterAni);
					this.scatterAni.scaleY = 1;
					this.scatterAni.play("", 4);
					break;
			}

		}
		public addScore(index) {
			// this.item3.showScore(index);
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
		 * 数是否在数组中
		 * @param  {number} num
		 * @param  {Array<number>} array
		 */
		public checkisInArray(num: number, array: Array<number>) {
			array.forEach(v => {
				if (v == num) {
					return true;
				}
				else {
					return false;
				}
			})
		}
		public setIconHui() {
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`].setIconHui();
			}
		}
		/**
		 * 移除数组图标置灰
		 * @param  {Array<Array<number>>} array
		 */
		public removeIconHui(array: Array<Array<number>>) {
			for (let i = 1; i <= array.length; i++) {
				for (let j = 0; j < array[i - 1].length; j++) {
					this[`item${i}`].resetIconHui(array[i - 1][j]);
				}
			}
		}
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
			game.UIUtils.removeSelf(this.scatterAni);
		}

		public showFirst(sceneIndex) {
			this.initItemCounts(sceneIndex);
			this.initItemByFirst(1, this.getLine3Icon(1));
			this.initItemByFirst(2, this.getLine3Icon(2));
			this.initItemByFirst(3, this.getLine3Icon(0));
			this.initItemByFirst(4, this.getLine3Icon(2));
			this.initItemByFirst(5, this.getLine3Icon(1));
		}
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