/*
 * @Author: wangtao 
 * @Date: 2019-04-19 17:45:56 
 * @Last Modified by: wangtao
 * @Last Modified time: 2019-04-19 17:50:27
 * @Description: 
 */
module dntg {
	export class DNTGScrollerItem extends eui.Component {
		private maxSize: number;
		private icons: DNTGIcon[] = [];
		// -1 停止 1 无限循环 0停止
		public runModel: number = 0;
		public stopIcon: DNTGIcon; //停止图标
		public iconList: DNTGIcon[] = []; //scroller图标数组
		public index: number;
		public result: Array<number> = []; //结果数组
		public scatterAni: DBComponent;
		private downTimeout: egret.Timer;
		private sceneIndex: number;
		private minYIndex: number = 0;
		private moveX: number = 0;
		private rollCount: number = 0;
		public speed: number = 48;
		public constructor() {
			super();
		}
		/**
		 * 转动结束替换图标
		 * @param  {} time
		 * @param  {} result
		 */
		public startDownTimeOut(time, result) {
			if (this.downTimeout) {
				this.downTimeout.stop();
			}
			this.downTimeout = new egret.Timer(time, 1);
			this.downTimeout.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
				this.changeResult(result);
			}, this);
			this.downTimeout.start();
		}
		/**
		 * downTimeout移除
		 */
		public clearDownTimeOut() {
			if (this.downTimeout) {
				this.downTimeout.stop();
			}
		}

		public createChildren() {
			super.createChildren();

			// this.scatterAni.visible = false;
		}
		/**
		 * 初始化scrolleritem
		 * @param  {} size
		 * @param  {} index
		 * @param  {} sceneIndex
		 */
		public initSize(size, index, sceneIndex) {
			this.maxSize = size;
			this.index = index;
			this.sceneIndex = sceneIndex
		}
		/**
		 * 开始转动
		 */
		public startRun() {
			this.resetPosition();
			this.rollCount = 0;
			this.speed = game.LaohuUtils.speed;
			this.runModel = RUN_MODEL.LOOP;
			for (let i = 0; i < this.icons.length; i++) {
				this.icons[i].hideDbComponent();
			}
		}

		private stopY: number;
		/**
		 * 收到消息替换结果
		 * @param  {} result
		 */
		public changeResult(result) {
			if (this.runModel == RUN_MODEL.STOP) {
				return;
			}
			let icons = _.sortBy(this.icons, "y");
			icons[1].changeSouceByValue(result[0]);
			icons[2].changeSouceByValue(result[1]);
			icons[3].changeSouceByValue(result[2]);
			this.iconList[0] = icons[1];
			this.iconList[1] = icons[2];
			this.iconList[2] = icons[3];
			this.stopIcon = icons[4];
			this.stopY = (this.rollCount + 1) * 866 //- Number(this.stopIcon.name) * 172
			this.runModel = RUN_MODEL.RESULT;
		}
		/**
		 * 满足部分scatter条件，scatter图标动画
		 * @param  {} index
		 * @param  {string} str
		 */
		public changeFoguang(index, str: string) {
			let icons = _.sortBy(this.icons, "y");
			icons[index + 1].showFoguang(str);
		}
		/**
		 * 转动完成调整图标位置
		 */
		public resetPosition() {
			let y = this.y;
			for (let i = 0; i < this.icons.length; i++) {
				this.icons[i].y += y;
			}
			this.y = 0;
		}
		/**
		 * icon下落
		 */
		public itemDown() {
			if (this.runModel == RUN_MODEL.STOP) {
				return;
			}
			let arr = this.icons;
			if (this.runModel == RUN_MODEL.RESULT) {
				let y = this.y;
				let point = this.stopIcon.y - 172;
				if (y + point >= 338) {
					let cha = y + point - 338;
					this.runModel = RUN_MODEL.STOP;
					this.y -= cha;
					this.fixPos();
					EventManager.instance.dispatch(EventNotify.LHJ_ITEM_OVER, { index: this.index, sceneIndex: this.sceneIndex });
					//修正坐标
					return;
				}
				// if (point.y > 510 + 93) {
				// 	let cha = point.y - (510 + 93);
				// 	this.runModel = RUN_MODEL.STOP;
				// 	this.y -= cha;
				// 	this.fixPos();
				// 	//修正坐标
				// 	return;
				// }
			}
			this.y += this.speed;
			for (let i = 0; i < arr.length; i++) {
				let icon = arr[i];
				let point = icon.localToGlobal();
				if (point.y >= 800 && this.runModel == RUN_MODEL.LOOP) {
					let last = this.findLast() as DNTGIcon;
					// last.changeRamdom();
					icon.y = last.y - 172;
					if (icon.name == "7") {
						this.rollCount += 1;
					}
				}
			}
		}
		/**
		 * 最后一个icon位置
		 */
		private findLast() {
			let returnIcon = this.icons[0];
			for (let i = 0; i < this.icons.length; i++) {
				let icon = this.icons[i];
				if (icon.y < returnIcon.y) {
					returnIcon = icon;
				}
			}
			return returnIcon;
		}
		/**
		 * 依据最后图标位置调整其他图标位置
		 */
		private fixPos() {
			//icons 可以做特效
			let y = this.y;
			this.y += 30;
			egret.Tween.get(this).to({
				y: y
			}, 330)
		}
		/**
		 * 展示图标中奖连线
		 * @param  {} index
		 * @param  {} times
		 */
		public showAni(index, times) {
			let data = this.iconList[index];
			data.showDbComponent();
		}
		/**
		 * 中间动画移除
		 */
		public stopAni() {
			for (let i = 0; i < this.iconList.length; i++) {
				let icon = this.iconList[i].stopDbComponet();
			}
			// let data = 
		}

		/**
		 * 初始化
		 */
		public getLineArr() {
			let countArr = [];
			for (let i = 1; i <= 12; i++) {
				let count = Math.floor(_.random(4, 6));
				for (let j = 0; j < count; j++) {
					countArr.push(i);
				}
			}
			return _.shuffle(countArr).slice(0, this.maxSize);
		}
		/**
		 * 创建item上的图标
		 * @param  {} firstArr
		 */
		public createIcons(firstArr) {
			let lineArr = this.getLineArr();
			if (firstArr.length > 0) {
				lineArr = lineArr.slice(firstArr.length, lineArr.length);
				lineArr = firstArr.concat(lineArr);
			}
			for (let i = 0; i < lineArr.length; i++) {
				let iconData = lineArr[i];
				let arr = new DNTGIcon();
				arr.changeSouceByValue(iconData);
				arr.name = i + "";
				this.addChild(arr);
				arr.y = this.height - (172 * (i + 1));
				if (i == 0) {
					this.minYIndex = arr.y + 172 + 90;
				}
				this.icons.push(arr);
			}
		}
	}
}
// 转动条件
enum RUN_MODEL {
	STOP,
	LOOP,
	RESULT
}