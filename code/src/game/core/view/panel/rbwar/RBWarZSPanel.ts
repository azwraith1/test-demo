module rbwar {
	export class RBWarZSPanel extends game.BaseComponent {
		private closeBtn: eui.Button;

		//对局条
		private progress1: eui.Image;
		private progress2: eui.Image;

		private percent1: eui.Label;
		private percent2: eui.Label;

		private shengfuGroup: eui.Group;

		private person1: DBComponent;
		private person2: DBComponent;

		private progressWidth: number = 994;

		private item1: RBWarZSItem;

		private group1: eui.Group;
		private group2: eui.Group;

		private tipImage1: eui.Image;
		private tipImage2: eui.Image;
		private tipsGroup: eui.Group;
		public constructor() {
			super();
			this.skinName = new RBWarZSPanelSkin();
		}

		public createChildren() {
			super.createChildren();
			this.createDBComponent();
			this.showWinPercent();
			this.showLuDan();
			this.showPattern();
		}

		private showPattern() {
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			let dataArr = roomInfo.lastWinPattern;
			let oushuArr = [];
			let jishuArr = [];
			for (let i = 0; i < dataArr.length; i++) {
				if (i % 2 == 0) {
					oushuArr.push(dataArr[i]);
				} else {
					jishuArr.push(dataArr[i]);
				}
			}
			for (let i = 0; i < oushuArr.length; i++) {
				let data = oushuArr[i];
				let groupChild;
				if (i >= this.group1.numChildren) {
					groupChild = new RBWarZSPattern();
					groupChild.initModel(data.luckyWin);
					this.group1.addChild(groupChild);
				} else {
					groupChild = this.group1.getChildAt(i) as RBWarZSPattern;
					if (!groupChild) {
						groupChild = new RBWarZSPattern();
						groupChild.initModel(data.luckyWin);
						this.group1.addChild(groupChild);
					}
				}
				groupChild.showContent(RBW_PATTERN[data.pattern]);
			}

			for (let i = 0; i < jishuArr.length; i++) {
				let data = jishuArr[i];
				let groupChild;
				if (i >= this.group2.numChildren) {
					groupChild = new RBWarZSPattern();
					groupChild.initModel(data.luckyWin);
					this.group2.addChild(groupChild);
				} else {
					groupChild = this.group2.getChildAt(i) as RBWarZSPattern;
					if (!groupChild) {
						groupChild = new RBWarZSPattern();
						groupChild.initModel(data.luckyWin);
						this.group2.addChild(groupChild);
					}
				}
				groupChild.showContent(RBW_PATTERN[data.pattern]);
			}
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.ROOM_FULSH, this.s_roomInfo, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.ROOM_FULSH, this.s_roomInfo, this);
		}

		public s_roomInfo() {
			for (let i = 1; i <= 20; i++) {
				let item = this['item' + i] as RBWarZSItem;
				item.clearData();
			}
			this.showWinPercent();
			this.showLuDan();
			this.showPattern();
		}

		private showLuDan() {
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			let dataArr = _.clone(roomInfo.lastRBReport);
			// console.log(JSON.stringify(dataArr));
			// dataArr = [
			// 	2,1,1,1,2,2,1,1,1,2,
			// 	2,1,2,2,1,2,1,2,1,1,
			// 	1,2,2,1,2,1,2,2,1,1,
			// 	2,1,2,1,1,2,2,2,1,1,
			// 	2,2,2,2,2,2,1,1,2,2,
			// 	2,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,1,2
			// 	]
			// dataArr = [1, 1, 2, 1, 1, 2, 2, 1, 2,
			// 	1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1
			// 	, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1,
			// 	2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2,
			// 	1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 2, 1, 2];

			// let data = [[1,1,1,1,1,1,1], {2:2}]
			let index = -1;
			let lastValue = 0;
			let dataResult = [];
			while (dataArr.length > 0) {
				if (!dataResult[index] && index > -1) {
					dataResult[index] = [];
				}
				let value = dataArr.shift();
				if (lastValue == value) {
					dataResult[index].push(value);
				} else {
					index++;
					if (!dataResult[index]) {
						dataResult[index] = [];
					}
					dataResult[index].push(value)
					lastValue = value;
				}
			}
			let startLength = 0;
			if (dataResult.length > 20) {
				startLength = dataResult.length - 20;
				let offset = 0;
				let count1 = 6;
				let lianxuIndex = 0;
				for(let i = dataResult.length - 1, offsetIndex = 0; i >= startLength; i--, offsetIndex ++){
					let data = dataResult[i];
					let count = data.length;
					let offerset = count - count1 - offsetIndex + lianxuIndex;
					if(offerset > offset){
						offset = offerset;
						count1 --;
						lianxuIndex ++;
					}else{
						lianxuIndex = 0;
						count1 = 6;
					}	
				}
				startLength += offset;
			}

			for (let i = startLength, index = 1; i < dataResult.length; i++ , index++) {
				let arrData = dataResult[i];
				let data = arrData[0];
				let item = this['item' + index] as RBWarZSItem;
				this.showItemByArr(arrData, index);
			}

			let patterns = roomInfo.lastRBReport;
			for (let i = 1; i <= 20; i++) {
				let item = this['item' + i] as RBWarZSItem;
				let index = patterns.length - 20 + (i - 1);
				item.showType(patterns[index]);
			}
		}

		private async pointMoveOne(){
			for(let i = 2; i <= 20; i++){
				let before = this['item' + (i - 1)];
				let current = this['item' + (i)];
				let images = current.images;
				current.clearData();
				before.change2Points(images);
			}
		}

		private showImageByStartPoint(colwn, type) {
			let item = this['item' + colwn] as RBWarZSItem;
			if (item.checkPointsHas(this.chaochuIndex)) {
				this.chaochuIndex--;
				this.showImageByStartPoint(colwn + 1, type);
				return;
			}
			item.showImageByPoint(this.chaochuIndex, type);
		}

		private chaochuIndex: number = 6;
		//当前列数
		private currentColwn = 0;
		//当前行数
		private maxRow = 6;
		private isJian = false;
		private async showItemByArr(arrData, colwn) {
			let item = this['item' + colwn] as RBWarZSItem;
			//当前列最低排数
			let lastRow = item.findLastRow();
			for (let i = 0; i < arrData.length; i++) {
				let type = arrData[i];
				let row = i + 1;
				if (row > lastRow) {
					item = this['item' + (colwn + (row - lastRow))] as RBWarZSItem;
					if(item){
						item.showImageByPoint(lastRow, type);
					}
				} else {
					item.showImageByPoint(row, type);
				}
			}
		}

		/**
		 * 展现胜利百分比
		 */
		private showWinPercent() {
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			let report = roomInfo.lastRBReport;
			let redWinCount = RBWUtils.getReportWinCount(report, 1);
			let blackWinCount = 20 - redWinCount;

			let percent1 = Math.floor(redWinCount / 20 * 100);
			let percent2 = 100 - percent1;

			this.percent1.text = percent1 + "%";
			this.percent2.text = percent2 + "%";

			this.progress1.width = this.progressWidth * percent1 / 100;
			this.progress2.width = 994 - this.progress1.width;

			this.progress2.x = 994 - this.progress2.width;
			if (percent1 > percent2) {
				this.person1.playNamesAndLoop(["normal_smell", "smell"]);
				this.person2.playNamesAndLoop(["normal_cry", "cry"]);
			} else if (percent1 < percent2) {
				this.person2.playNamesAndLoop(["normal_smell", "smell"]);
				this.person1.playNamesAndLoop(["normal_cry", "cry"]);
			} else {
				this.person1.playNamesAndLoop(["normal"]);
				this.person2.playNamesAndLoop(["normal"]);
			}
			let tipsX = this.progress1.width - this.tipsGroup.width + 53;
			if (tipsX >= 680) {
				tipsX = 680
			} else if (tipsX < 220) {
				tipsX = 220;
			}
			this.tipsGroup.x = tipsX;
		}

		private createDBComponent() {
			let person1 = DBComponent.create("rbw_person1_zs", "rbw_red_person");
			person1.scaleX = person1.scaleY = 0.2;
			person1.x = -50;
			person1.y = 15;
			this.tipsGroup.addChild(person1);
			this.person1 = person1;
			this.person1.playNamesAndLoop(["normal"]);

			let person2 = DBComponent.create("rbw_person2_zs", "rbw_black_person");
			person2.scaleX = person2.scaleY = 0.2;
			person2.x = this.tipsGroup.width + 50;
			person2.y = 15;
			this.person2 = person2;
			this.person2.playNamesAndLoop(["normal"]);
			this.tipsGroup.addChild(person2);

		}


		public onTouchTap(e: egret.TouchEvent) {
			switch (e.target) {
				case this.closeBtn:
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_RBWARZS);
					break;
			}
		}
	}
}