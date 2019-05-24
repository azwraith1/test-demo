/*
 * @Author: wangtao 
 * @Date: 2019-04-19 17:51:03 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-20 15:34:10
 * @Description: 
 */
module dntg {
	export class DNTGScroller extends game.BaseUI {
		private scroller: eui.Scroller;
		private itemGroup: eui.Group;
		public item1: DNTGScrollerItem;
		public item2: DNTGScrollerItem;
		public item3: DNTGScrollerItem;
		public item4: DNTGScrollerItem;
		public item5: DNTGScrollerItem;
		private itemSize1: number = 8
		private itemSize2: number = 8
		private itemSize3: number = 8
		private itemSize4: number = 8
		private itemSize5: number = 8
		private overIndex: number = 0;
		public speed: number = 48;

		public constructor() {
			super();
		}

		public onAdded() {
			super.onAdded();
			this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
		}

		public onRemoved() {
			super.onRemoved();
			this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
		}

		public isRun: boolean = false; //判断转轴是否再转动
		/**
		 * 转动时每帧更新图标位置
		 * @param  {egret.Event} e
		 */
		public update(e: egret.Event) {
			if (!this.isRun) {
				return;
			}
			// this.item5.y += this.speed;
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`] as DNTGScrollerItem //.itemDown(this.speed);
				item.itemDown();
			}
		}
		/**
		 * 调用item内停止图标动画的方法
		 */
		public stopIconDb() {
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`].stopAni();
			}
		}

		/**
		 * scroller转动
		 */
		public run() {
			//还原
			this.isRun = true;
			this.overIndex = 1;
			this.overIndexes = [];
			this.resultArrList = null;
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`] as DNTGScrollerItem;
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
				let item = this[`item${i}`] as DNTGScrollerItem;
				item.startRun();
			}
		}

		private overIndexes: string[] = [];
		private resultArrList: any;
		/**
		 * 快速停止
		 */
		public runResultFast() {
			//满足收到消息的条件
			if (this.resultArrList) {
				let resultArr = this.resultArrList;
				for (let i = 0; i < resultArr.length; i++) {
					let result = resultArr[i];
					let item = this[`item${i + 1}`] as DNTGScrollerItem;
					item.clearDownTimeOut();
					if (this.overIndexes.indexOf(i + "") < 0) {
						item.startDownTimeOut(20 * (1 + i), result);
					}
				}
			}
		}
		/**
		 * 正常转动结束替换图标
		 * @param  {} resultArr
		 */
		public runResult(resultArr) {
			this.resultArrList = resultArr;
			for (let i = 0; i < resultArr.length; i++) {
				let result = resultArr[i];
				let item = this[`item${i + 1}`] as DNTGScrollerItem;
				item.startDownTimeOut(this.changeResultByIndex(i + 1), result)
			}
		}
		/**
		 * 调用item内scatter动画的方法
		 * @param  {} item
		 * @param  {} index
		 * @param  {} str
		 */
		public addFoGuang(item, index, str) {
			this[`item${item}`].changeFoguang(index, str);
		}

		/**
		 * 替换每个item的图标结果
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
		 * 根据index更换每列的转动速度
		 * @param  {} index
		 */
		private changeSpeedByIndex(index) {
			switch (index) {
				case 1:
					return 48 * 1;
				case 2:
					return 48 * 1.1;
				case 3:
					return 48 * 1.11;
				case 4:
					return 48 * 1.12;
				case 5:
					return 48 * 1.13;
			}
		}

		public scatterAni: DBComponent;
		public createChildren() {
			super.createChildren();
			this.scroller.bounces = false;
			this.scroller.scrollPolicyH = "off";
			this.scroller.scrollPolicyV = "off";
			this.scatterAni = new DBComponent("fire_flow");
			// this.scatterAni.x = 630;
			// this.scatterAni.y = 255;

			// this.addChild(this.scatterAni);
		}
		/**
		 * 转动前初始化图标数量
		 * @param  {} sceneIndex
		 */
		public initItemCounts(sceneIndex) {
			for (let i = 1; i <= 5; i++) {
				let item = this[`item${i}`] as DNTGScrollerItem;
				item.initSize(this[`itemSize${i}`], i, sceneIndex);
			}
		}
		/**
		 * 初始化item
		 * @param  {} index
		 * @param  {} firstArr
		 */
		public initItemByFirst(index, firstArr) {
			let item = this[`item${index}`] as DNTGScrollerItem;
			item.name = "item" + index;
			item.createIcons(firstArr);
		}
		/**
		 * 根据条件给每列移除不符合条件的图标
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
		 * 第四第五列加速特效
		 * @param  {number} index
		 */
		public addScatterAni(index: number) {
			switch (index) {
				case 4:
					this.scatterAni.x = 630;
					this.scatterAni.y = 255;
					this.addChild(this.scatterAni);
					this.scatterAni.play("", -1);
					break;
				case 5:
					this.scatterAni.x = 806;
					this.scatterAni.y = 255;
					this.addChild(this.scatterAni);
					this.scatterAni.play("", -1);
					break;
			}

		}
		public addScore(index) {
			// this.item3.showScore(index);
		}
		public commomScore: eui.BitmapLabel; //分数label
		public scoreTimeOut: any; //分数展示移除的timeout
		/**
		 * 调用item的展示连线方法
		 * @param  {Array<Array<number>>} allline
		 * @param  {number} allscore
		 */
		public addBonusAni(allline: Array<Array<number>>, allscore: number) {

			for (let i = 1; i <= allline.length; i++) {
				for (let j = 0; j < allline[i - 1].length; j++) {
					this[`item${i}`].showAni(allline[i - 1][j]);
				}
			}

		}
		/**
		 * 移除连线动画
		 * @param  {} index?
		 */
		public removeScatterAni(index?) {
			if (this.scatterAni.parent && this.scatterAni) {
				this.scatterAni.parent.removeChild(this.scatterAni);
			}
		}
		/**
		 * 进入游戏时显示的初始图标
		 * @param  {} sceneIndex
		 */
		public showFirst(sceneIndex) {
			this.initItemCounts(sceneIndex);
			this.initItemByFirst(1, this.getLine3Icon(1));
			this.initItemByFirst(2, this.getLine3Icon(2));
			this.initItemByFirst(3, this.getLine3Icon(0));
			this.initItemByFirst(4, this.getLine3Icon(2));
			this.initItemByFirst(5, this.getLine3Icon(1));
		}
		/**
		 * 免费游戏显示的初始图标
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