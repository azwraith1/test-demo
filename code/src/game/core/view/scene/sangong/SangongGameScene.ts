module sangong {
	export class SangongGameScene extends game.BaseGameScene {
		//头像组 1 - 5
		private player1: eui.Group;
		//头像 1 - 5
		private header1: SangongHeader;
		//自己的牌组
		private cards1: SangongCardList2;
		//其他玩家的牌组
		private cards2: SangongCardList1;
		//抢庄的条
		private qzBar: SangongQZBar;

		private yzBar: SangongYZBar;
		//倒计时
		private timeBar: SangongTimeBar;

		//座位号
		private directions: any
		//每个玩家占位1-4
		private pl1: eui.Image;
		private effectGroup: eui.Group;

		private status: number;
		private tisiyu: eui.Label;
		private tipsGroup: eui.Group;
		private tipLabel: eui.Label;
		private diFen: eui.Label;

		private otherBtnGroups: eui.Group;
		private tisiGroup: eui.Group;
		private tisiLable: eui.Label;
		public pmdKey: string = "sangong";
		private roomid: eui.Label;
		private fpBtn: eui.Button;
		private fpBtnGroup: eui.Group;

		//new
		/**
		 * 打开游戏界面通知
		 */
		public GAME_SCENE_NOTIFY: string = SceneNotify.OPEN_SANGONG_GAME;

		/**
		 * 关闭游戏界面通知
		 */
		public HALL_SCENE_NOTIFY: string = SceneNotify.OPEN_SANGONG_HALL;

		/**
		 * 关闭当前界面通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_SANGONG_GAME;

		/**
		 * 对应匹配界面通知
		 */
		public MATCHING_SCENE_NOTIFY: string = SceneNotify.OPEN_SANGONG_WATING;

		public constructor() {
			super();
			GameConfig.CURRENT_ISSHU = true;
			this.skinName = new SangongGameSceneSkin();
		}

		private hideUI() {
			for (let i = 2; i <= 5; i++) {
				this['player' + i].visible = false;
			}
			for (let i = 1; i <= 5; i++) {
				this['cards' + i].visible = false;
			}
			this.timeBar.visible = false;
			this.tipsGroup.visible = false;
		}


		public onAdded() {
			super.onAdded();
		}

		public onRemoved() {
			super.onRemoved();
			this.listenOffEvent();
		}

		private tipsData;
		public async createChildren() {
			super.createChildren();
			this.hideUI();
			this.cards1.setRoot(this);
			this.showBtnsType(1);
			this.restartBtn.visible = false;
			this.qzBar.setRoot(this);
			this.yzBar.setRoot(this);
			let length = _.values(Global.roomProxy.getPlayers()).length;
			this.directions = NiuniuUtils.getDirectionByMine(Global.roomProxy.getMineIndex(), length);
			this.diFen.text = Global.gameProxy.lastGameConfig.diFen;
			this.roomid.text = "牌局编号：" + Global.roomProxy.roomInfo.roomId;
			this.showHeaders();
			for (let i = 1; i <= length; i++) {
				this['header' + this.directions[i]].setIndex(i);
			}
			if (Global.roomProxy.reconnect || Global.runBack) {
				this.timeBar.startTime(this);
				this.timeBar.visible = true;
				let roomInfo = Global.roomProxy.roomInfo;
				this.showRunTimeByStep(roomInfo.roundStatus);
			} else {
				this.showStartAni();
			}
			this.listenEvent();
			let publicMsg = PMDComponent.instance;
			publicMsg.anchorOffsetY = 24;
			publicMsg.horizontalCenter = 10;
			publicMsg.top = 40;
		}


		private showStartAni() {
			let startDb = GameCacheManager.instance.getCache("sg_kaishiyouxi");
			if (!startDb) {
				startDb = new DBComponent("sg_kaishiyouxi");
			}
			startDb.callback = () => {
				game.UIUtils.removeSelf(startDb);
				GameCacheManager.instance.setCache(startDb.dnName, startDb);
				this.timeBar.startTime(this);
				this.createPokers();
				this.startMove();
			}
			this.effectGroup.addChild(startDb);
			startDb.verticalCenter = -50;
			startDb.horizontalCenter = startDb.width / 2;
			startDb.playDefault(1);
		}

		/**
		 * 根据坐标找到头像
		 * @param  {} index
		 */
		private getHeaderByIndex(index) {
			for (let i = 1; i <= 5; i++) {
				if (this['header' + i].index == index) {
					return this['header' + i];
				}
			}
			return null;
		}

		/**
		 * 隐藏自己的提示语
		 */
		private falseMe(num1: eui.Group) {
			this.setAutoTimeout(() => {
				num1.visible = false;
			}, this, 1000)
		}

		private trueMe(num1: eui.Group) {
			num1.visible = true;
		}

		/**
		 * 自带监听
		 */
		public async onTouchTap(e: egret.TouchEvent) {
			let sum = 0;
			e.stopPropagation();
			switch (e.target) {
				case this.restartBtn:
					this.restartBtnTouch();
					break;
				case this.backBtn:
					this.showBtnsType(1);
					this.backBtnTouch();
					break;
				case this.settingBtn:
					this.showBtnsType(1);
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING, {});
					break;
				case this.recordBtn:
					this.showBtnsType(1);
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_NIUGAMERECORD, "sangong");
					break;
				case this.helpBtn:
					this.showBtnsType(1);
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_HELP_SHU, { type: "sangong" });
					break;
				case this.fpBtn:
				case this.fpBtnGroup:
					this.fanpai();
					break;
				case this.xlbtn:
					this.showBtnsType(2);
					break;
				case this.xlbtn1:
					this.showBtnsType(1);
					break;
			}
		}

		private listenEvent() {
			EventManager.instance.addEvent(ServerNotify.s_robDealerMulti, this.robDealerMulti, this);
			EventManager.instance.addEvent(ServerNotify.s_startRobDealer, this.startRobDealer, this);
			EventManager.instance.addEvent(ServerNotify.s_playerRobDealer, this.playerRobDealer, this);
			EventManager.instance.addEvent(ServerNotify.s_startAddAnte, this.startAddAnte, this);
			EventManager.instance.addEvent(ServerNotify.s_addAnteFinish, this.addAnteFinish, this);
			EventManager.instance.addEvent(ServerNotify.s_playerAddAnte, this.playerAddAnte, this);
			EventManager.instance.addEvent(ServerNotify.s_playerAnteChange, this.playerAnteChange, this);
			EventManager.instance.addEvent(ServerNotify.s_roundSettlement, this.roundSettlement, this);
			EventManager.instance.addEvent(ServerNotify.s_dealerChanged, this.dealerChanged, this);
			EventManager.instance.addEvent(ServerNotify.s_initHandCards, this.initHandCards, this);
			EventManager.instance.addEvent(ServerNotify.s_addAnteMulti, this.addAnteMulti, this);
			EventManager.instance.addEvent(ServerNotify.s_roomFinished, this.roomFinished, this);
			EventManager.instance.addEvent(ServerNotify.s_countdown, this.countdown, this);
			EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			//	s_openCard
			EventManager.instance.addEvent(ServerNotify.s_openCard, this.openCard, this);
			EventManager.instance.addEvent(ServerNotify.s_openCardFinish, this.openCardFinsh, this);
			EventManager.instance.addEvent(ServerNotify.s_startOpenCard, this.startOpenCard, this);
		}

		private listenOffEvent() {
			EventManager.instance.removeEvent(ServerNotify.s_robDealerMulti, this.robDealerMulti, this);
			EventManager.instance.removeEvent(ServerNotify.s_startRobDealer, this.startRobDealer, this);
			EventManager.instance.removeEvent(ServerNotify.s_playerRobDealer, this.playerRobDealer, this);
			EventManager.instance.removeEvent(ServerNotify.s_startAddAnte, this.startAddAnte, this);
			EventManager.instance.removeEvent(ServerNotify.s_addAnteFinish, this.addAnteFinish, this);
			EventManager.instance.removeEvent(ServerNotify.s_playerAddAnte, this.playerAddAnte, this);
			EventManager.instance.removeEvent(ServerNotify.s_playerAnteChange, this.playerAnteChange, this);
			EventManager.instance.removeEvent(ServerNotify.s_roundSettlement, this.roundSettlement, this);
			EventManager.instance.removeEvent(ServerNotify.s_dealerChanged, this.dealerChanged, this);
			EventManager.instance.removeEvent(ServerNotify.s_initHandCards, this.initHandCards, this);
			EventManager.instance.removeEvent(ServerNotify.s_addAnteMulti, this.addAnteMulti, this);
			EventManager.instance.removeEvent(ServerNotify.s_roomFinished, this.roomFinished, this);
			EventManager.instance.removeEvent(ServerNotify.s_countdown, this.countdown, this);
			EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			EventManager.instance.removeEvent(ServerNotify.s_openCard, this.openCard, this);
			EventManager.instance.removeEvent(ServerNotify.s_openCardFinish, this.openCardFinsh, this);
			EventManager.instance.removeEvent(ServerNotify.s_startOpenCard, this.startOpenCard, this);

		}

		public countdown(e: egret.Event) {
			let data = e.data;
			let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;
			if (!roomInfo.countdown) {
				roomInfo.countdown = {};
			}
			roomInfo.countdown = data;
			game.DateTimeManager.instance.updateServerTime(data.start);
			// roomInfo.countdown.start = data.start;
			// roomInfo.countdown.end = data.end;
		}

		//抢庄START
		/**
	 	 * 抢庄step流程
		 */
		private runQzStep() {
			this.duanXainLookPais();
			//TipsCompoment.instance.show("开始抢庄");
			let roomInfo = Global.roomProxy.roomInfo;
			let players = roomInfo.players;
			for (let index in players) {
				let player = players[index];
				if (player.robDealerAnte == -1) {
					//如果是我 没有抢庄状态 就显示抢庄条
					if (Global.roomProxy.checkIndexIsMe(index)) {
						this.qzBar.show();
					}
				} else {
					let header = this.getHeaderByIndex(index) as SangongHeader;
					if (player.robDealerAnte == 1) {
						header.showText("抢");
					} else {
						header.showText("不抢");
					}
					// header.showBeishu(player.robDealerAnte);
				}
			}
		}

		/**
		 * 接收服务器开始抢庄消息
		 */
		private startRobDealer(e: egret.Event) {
			let data = e.data;
			let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;
			Global.roomProxy.roomInfo.roundStatus = SangongStep.QIANG_ZHUANG;
			this.showRunTimeByStep(Global.roomProxy.roomInfo.roundStatus);
			// if (!roomInfo.countdown) roomInfo.countdown = {};
			// roomInfo.countdown.start = data.serverTimeStampMS;
			// roomInfo.countdown.end = data.countdownMS + data.serverTimeStampMS;

		}

		/**
		 * 开始抢庄显示抢庄条
		 */
		private robDealerMulti(e: egret.Event) {
			let data = e.data;
			let roomInfo = Global.roomProxy.roomInfo;
			let mine = Global.roomProxy.getMineInfo();
			mine.robDealerMulti = data;
			// this.showRunTimeByStep(roomInfo.roundStatus);
		}


		private showTipsGroup(text: string) {
			this.tipsGroup.visible = true;
			this.tipLabel.text = text;
		}

		private closeTipsGroup() {
			this.tipsGroup.visible = false;
			this.tipLabel.text = "";
		}

		/**
		 * 发送抢庄信息
		 */
		public async sendQZReq(rob) {
			//抢庄完成后发个事件给服务器  
			// this.showTipsGroup("等待其他玩家抢庄");
			let serverPath = ServerPostPath.game_sangongHandler_c_robDealer;
			let data = { rob: rob };
			this.qzBar.visible = false;
			let resp: any = await Global.pomelo.request(serverPath, data);
			if (resp && resp.error && resp.error.code != 0) {
				// if (Global.roomProxy.roomInfo.roundStatus == SangongStep.QIANG_ZHUANG) {
				// 	this.qzBar.visible = true;
				// }
			}
		}

		/**
		* 收到某个玩家抢庄
		*
 		*/
		private playerRobDealer(e: egret.Event) {
			let data = e.data;
			if (Global.roomProxy.roomInfo.roundStatus != SangongStep.QIANG_ZHUANG) {
				return;
			}
			let player = Global.roomProxy.getPlayerInfoByIndex(data.playerIndex);
			player.qzMulti = data.rob;
			if (data.playerIndex == Global.roomProxy.getMineIndex()) {
				if (!this.findNotQZOver()) {
					this.showTipsGroup("等待其他玩家抢庄");
				} else {
					this.closeTipsGroup();
					this.timeBar.visible = false;
				}
				this.qzBar.visible = false;
			} else {
				if (this.findNotQZOver()) {
					this.timeBar.visible = false;
					this.closeTipsGroup();
				}
			}
			let header = this.getHeaderByIndex(data.playerIndex) as SangongHeader;
			if (data.rob) {
				header.showText("抢");
			} else {
				header.showText("不抢");
			}


			//展示每个玩家抢庄分数
		}

		/**
		 * 抢庄结果
		 */
		private dealerChanged(e: egret.Event) {
			this.closeTipsGroup();
			let data = e.data;
			let room = Global.roomProxy.roomInfo as BaseRoomInfo;
			room.dealer = data.dealer;
			room.randomDealers = data.randomDealers
			//除了庄家的其他玩家倍数全部空
			for (let i = 1; i <= _.keys(room.players).length; i++) {
				let header = this['header' + i] as SangongHeader;
				//if (header.index != room.dealer) {
				header.hideBeishu();
				//}
			}
			Global.roomProxy.roomInfo.countdown = null;
			this.timeBar.visible = false;
			this.randomEstates();
			this.releaseQZUI();
		}

		/**
		 * 回收抢庄UI
		 */
		private releaseQZUI() {
			this.qzBar.visible = false;
		}
		/**
		 * 回收开牌
		 */
		private releaseKPUI() {
			this.releaseQZUI();
		}

		//抢庄END
		private clearQZInfo() {
			let players = Global.roomProxy.roomInfo.players;
			for (let key in players) {
				let header = this.getHeaderByIndex(key) as SangongHeader;
				header.hideBeishu();
			}
		}

		//押注流程start

		/**
		 * 进入押注流程 等待addAnteMulti
		 */
		private startAddAnte(e: egret.Event) {
			this.releaseQZUI();
			this.clearQZInfo();
			//给服务器发事件 game_sangongHandler_c_addAnte
			let data = e.data;
			let room = Global.roomProxy.roomInfo as BaseRoomInfo;
			room.roundStatus = SangongStep.ADDANTE;
			// if (!room.countdown) room.countdown = {};
			// room.countdown.start = data.serverTimeStampMS;
			// room.countdown.end = data.countdownMS + data.serverTimeStampMS;
			game.DateTimeManager.instance.updateServerTime(data.serverTimeStampMS);
			//如果是庄家就显示等待

		}

		/**
		 * 闲家显示押注条 开始发送闲家押注请求
		 * @param  {egret.TouchEvent} e
		 * 
		 */
		private addAnteMulti(e: egret.TouchEvent) {
			let data = e.data;
			let roomInfo = Global.roomProxy.roomInfo;
			let mine = Global.roomProxy.getMineInfo();
			mine.addAnteMulti = data;
			Global.roomProxy.roomInfo.roundStatus = SangongStep.ADDANTE;
			let time = 1000;
			if (this.qzLength > 1) {
				time = (this.qzLength) * 300;
			}
			this.setAutoTimeout(() => {
				this.showRunTimeByStep(roomInfo.roundStatus);
			}, this, time);
		}

		/**
		 * 闲家的押注UI流程
		 */
		private runAddanteStep() {
			this.releaseQZUI();
			this.duanXainLookPais();
			//TipsCompoment.instance.show("闲家开始押注");
			let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;
			let players = roomInfo.players;
			if (roomInfo.dealer == Global.roomProxy.getMineIndex()) {
				this.showTipsGroup("等待其他玩家下注");
			}
			for (let index in players) {
				let player = players[index];
				if (player.addAnte == -1) {
					//我不是庄家就显示
					if (Global.roomProxy.checkIndexIsMe(index) && roomInfo.dealer + "" != index) {
						this.yzBar.show(player.addAnteMulti);
					}
				} else {
					if (index != roomInfo.dealer + "") {
						let header = this.getHeaderByIndex(index) as SangongHeader;
						header.showBeishu(player.addAnte);
					}

				}
			}
		}

		/**
		 * 闲家押注
		 */
		public async sendYZReq(value) {
			let serverPath = ServerPostPath.game_sangongHandler_c_addAnte;
			let data = { multi: value };
			this.yzBar.visible = false;
			let resp: any = await Global.pomelo.request(serverPath, data);
			// this.showTipsGroup("等待其他玩家押注");
			if (resp && resp.error && resp.error.code != 0) {
				// if (Global.roomProxy.roomInfo.roundStatus == SangongStep.ADDANTE) {
				// 	this.yzBar.visible = true;
				// }
			}
		}

		/**
		 * 同playerAnteChange
		 * 玩家押注通知
		 */
		private playerAddAnte(e: egret.Event) {
			//	展示每个压住玩家的分数  game_sangongHandler_c_addAnte
			this.playerAnteChange(e);
		}

		/**
		 * 玩家押注通知
		 */
		private playerAnteChange(e: egret.Event) {
			let data = e.data;
			let player = Global.roomProxy.getPlayerInfoByIndex(data.playerIndex) as SGPlayerGameBean;
			player.addAnte = data.multi;
			if (data.playerIndex == Global.roomProxy.getMineIndex()) {
				this.yzBar.visible = false;
				if (!this.findNotAnteOver()) {
					this.showTipsGroup("等待其他玩家下注");
				} else {
					this.closeTipsGroup();
					this.timeBar.visible = false;
				}
			} else {
				if (this.findNotAnteOver()) {
					this.closeTipsGroup();
					this.timeBar.visible = false;
				}
			}
			let header = this.getHeaderByIndex(data.playerIndex) as SangongHeader;
			header.showBeishu(data.multi);
		}

		/**
		 * 寻找没有抢庄完成的
		 */
		private findNotQZOver() {
			let players = Global.roomProxy.getPlayers();
			for (let key in players) {
				let player = players[key];
				if (player.qzMulti == undefined || player.qzMulti < 0) {
					return false;
				}
			}
			return true;
		}


		/**
		 * 寻找没有押注完成的
		 */
		private findNotAnteOver() {
			let players = Global.roomProxy.getPlayers();
			for (let key in players) {
				if (key == "" + Global.roomProxy.roomInfo.dealer) {
					continue;
				}
				let player = players[key];
				if (!player.addAnte || player.addAnte < 1) {
					return false;
				}
			}
			return true;
		}


		/**
		 * 寻找玩家开牌完成
		 */

		private findNotKaiPaiOver() {
			let players = Global.roomProxy.getPlayers();
			for (let key in players) {
				let player = players[key];
				if (!player.handCards || player.handCards < 1) {
					return false;
				}
			}
			return true;
		}

		/**
		 * 押注完成 
		 */
		private addAnteFinish(e: egret.Event) {
			//服务器会告诉,相当于清除押注的UI，开始发牌的相关UI
			this.closeTipsGroup();
			let room = Global.roomProxy.roomInfo as BaseRoomInfo;
			room.roundStatus = SangongStep.EMPTY;
			Global.roomProxy.roomInfo.countdown = null;
			this.timeBar.visible = false;
			this.releaseYZUI();
		}


		private releaseYZUI() {
			this.releaseQZUI();
			this.yzBar.visible = false;
		}

		//押注end

		//发牌开始

		/**
		 * 开始发牌
		 */
		private initHandCards(e: egret.Event) {
			this.releaseYZUI();
			let data = e.data;
			let cards = data.cards;
			let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;
			roomInfo.roundStatus = SangongStep.FAPAI;
			//	this.createPokers();
			let players = roomInfo.players;
			for (let key in players) {
				let player = players[key];
				let index = this.directions[key];
				if (Global.roomProxy.checkIndexIsMe(key)) {
					player.handCards = cards;
					player.roundPattern = data.roundPattern;
					this.cards1.renderByList1(cards);
				} else {
					player.cardLength = data.cardLength;
					this['player' + index].visible = true;
					let cards = this['cards' + index] as SangongCardList1;
					cards.renderByList(player.cardLength);
				}
			}
		}


		/**
		 * 飞金币效果
		 */
		private showGold2Header(index1, index2) {
			if (Global.runBack) {
				return;
			}
			let header1 = this['player' + index1] as SangongHeader;
			let header2 = this['player' + index2] as SangongHeader;
			let arr = [];
			for (let i = 0; i < 12; i++) {
				arr.push(i);
			}
			async.eachSeries(arr, (num, callback) => {
				let image = ObjectPool.produce("nn_coin_img", eui.Image) as eui.Image;
				if (!image) {
					image = new eui.Image("nn_coin_png");
					image.scaleX = image.scaleY = 0.8;
				}
				image.horizontalCenter = header1.horizontalCenter + _.random(-20, 20);
				image.verticalCenter = header1.verticalCenter + 20 + _.random(-20, 20);
				this.effectGroup.addChild(image);
				NiuniuUtils.playFjb();
				let time = _.random(200, 550);
				game.UIUtils.setAnchorPot(image);
				let length = Math.floor(game.Utils.ggdl(
					header1.localToGlobal().x
					, header2.localToGlobal().x, header1.localToGlobal().y, header2.localToGlobal().y));
				egret.Tween.get(image).wait(15 * (num / 2)).call(() => {
					callback();
				}).to({
					horizontalCenter: header2.horizontalCenter + _.random(-20, 20),// + header2.width / 2,
					verticalCenter: header2.verticalCenter + 20 + _.random(-20, 20)// + header2.height / 2

				}, time, egret.Ease.cubicInOut).call(() => {
					game.UIUtils.removeSelf(image);
					ObjectPool.reclaim("nn_coin_img", image);
				});
			});
		}

		private updateZhuangjiaLiushui(gold) {
			let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;
			let player = roomInfo.players[roomInfo.dealer];
			let header = this['header' + roomInfo.dealer];
			if (Global.roomProxy.checkIndexIsMe(roomInfo.dealer)) {
				Global.playerProxy.playerData.gold = Global.playerProxy.playerData.gold['add'](gold);
			}
			header.showLiushuiLabel(gold);
		}

		/**
		 * 结算
		 */
		private roundSettlement(e: egret.Event) {
			//调用展示牌
			try {
				this.releaseKPUI();
				this.closeTipsGroup();
				let data = e.data;
				this.goldAni(data);
			} catch (e) {

			}
		}

		/**
		 * 金币过滤。
		 */
		private goldAni(records) {
			let xian2zhuangRecords = [];
			let zhuang2xianRecords = [];
			let dealerRecords;
			let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;
			//把庄家流水过滤出来
			for (let key in records) {
				let record = records[key];
				record.index = key;
				if (key != roomInfo.dealer + "") {
					if (record.gainGold > 0) {
						zhuang2xianRecords.push(record);
					} else {
						xian2zhuangRecords.push(record);
					}

				} else {
					dealerRecords = record;
				}
			}
			let showRecord2GoldAni = (record) => {
				let player = roomInfo.players[record.index];
				let dirIndex = this.directions[record.index];
				let header = this.getHeaderByIndex(record.index) as SangongHeader;
				let sum = record.gainGold;
				player.gold = player.gold['add'](sum);
				if (Global.roomProxy.checkIndexIsMe(record.index)) {
					Global.playerProxy.playerData.gold = Global.playerProxy.playerData.gold['add'](sum);
				}
				if (sum > 0) {
					this.showGold2Header(this.directions[roomInfo.dealer], dirIndex);
				} else {
					this.showGold2Header(dirIndex, this.directions[roomInfo.dealer]);
				}
			}

			async.waterfall([
				(callback) => {
					//闲家飞庄家
					if (xian2zhuangRecords.length == 0) {
						callback();
						return;
					}
					for (let i = 0; i < xian2zhuangRecords.length; i++) {
						showRecord2GoldAni(xian2zhuangRecords[i]);
					}
					this.setAutoTimeout(callback, this, 1500);
				},
				(callback) => {
					//庄家飞闲家
					if (zhuang2xianRecords.length == 0) {
						callback();
						return;
					}
					for (let i = 0; i < zhuang2xianRecords.length; i++) {
						showRecord2GoldAni(zhuang2xianRecords[i]);
					}
					this.setAutoTimeout(callback, this, 1000);
				}
			], (data, callback) => {
				//庄家飞闲家		
				let length = xian2zhuangRecords.length + zhuang2xianRecords.length;
				if (zhuang2xianRecords.length == length) {
					PukerUtils.showZJTongPei_sg(this.effectGroup);
				} else if (xian2zhuangRecords.length == length) {
					PukerUtils.showZJTongChi_sg(this.effectGroup);
				}
				for (let key in records) {
					let player = roomInfo.players[key];
					let header = this.getHeaderByIndex(key) as SangongHeader;
					let lishuis = records[key];
					//先统计总数
					let sum = lishuis.gainGold;
					if (key == roomInfo.dealer + "") {
						player.gold = player.gold['add'](sum);
						if (Global.roomProxy.checkIndexIsMe(key)) {
							Global.playerProxy.playerData.gold = Global.playerProxy.playerData.gold['add'](sum);
							header.showWinPng(sum);
							if (sum > 0) {
								NiuniuUtils.showWin();
							}

						}
					}
					if (Global.roomProxy.checkIndexIsMe(key)) {
						header.showWinPng(sum);
						if (sum > 0) {
							NiuniuUtils.showWin();
						}
					}
					header.showLiushuiLabel(sum);
					//判断通吃或者通赔
				}
				this.setAutoTimeout(() => {
					this.allowBack = true;
					this.restartBtn.visible = true;
				}, this, 2000);
			});
		}


		/**
	     * 展现玩家头像
	     */
		private showHeaders() {
			let players = Global.roomProxy.getPlayers();
			let zhuangId = Global.roomProxy.roomInfo.dealer;//换到抢庄的地方去。
			for (let key in players) {
				let dir = this.directions[key];
				let player = this['player' + dir] as eui.Group;
				let header = this['header' + dir] as SangongHeader;
				if (Global.roomProxy.checkIndexIsMe(key)) {
					let cards = this['cards' + dir] as SangongCardList2;
				} else {
					let cards = this['cards' + dir] as SangongCardList1;
					cards.visible = false;
				}
				header.initWithPlayer(players[key]);
				header.showIsZhuang(game.Utils.valueEqual(zhuangId, key));
				header.exchange45(dir);
				player.visible = true;
				header.visible = true;
			}
		}

		private runFapaiStep() {

		}

		private runXuanpaiStep() {
			this.duanXainLookPais();
			let roomInfo = Global.roomProxy.roomInfo;
			let players = Global.roomProxy.getPlayers();
			for (let key in players) {
				let player = players[key] as SGPlayerGameBean;
				let dirIndex = this.directions[key];
				let header = this.getHeaderByIndex(key) as SangongHeader;
				if (!game.Utils.valueEqual(key, roomInfo.dealer)) {
					header.showBeishu(player.addAnte);
				}
			}
		}



		/**
		 * 翻牌
		 */
		private async fanpai() {
			this.fpBtn.visible = false;
			this.fpBtnGroup.visible = false;
			let fp = ServerPostPath.game_sangongHandler_c_openCard
			let data = {};
			let resp: any = await Global.pomelo.request(fp, data);
			if (resp && resp.error && resp.error.code != 0) {
				this.fpBtn.visible = true;
				this.fpBtnGroup.visible = true;
			}
		}


		/**
		 * 开始开牌
		 */
		private startOpenCard(e: egret.Event) {
			this.timeBar.visible = true;
			this.fpBtn.visible = true;
			this.fpBtnGroup.visible = true;
		}
		/**
		 * 开牌，有玩家开牌，就有推送
		 */
		private openCard(e: egret.Event) {
			let data = e.data;
			let player = Global.roomProxy.getPlayerInfoByIndex(data.playerIndex) as SGPlayerGameBean;
			player.handCards = data.handCards;
			let handCards = data.handCards;
			let playerIndex = data.playerIndex;
			let roundPattern = data.roundPattern;
			let dirIndex = this.directions[playerIndex];
			let playerData = Global.roomProxy.getPlayerByIndex(playerIndex);
			if (data.playerIndex == Global.roomProxy.getMineIndex()) {
				let cards = this['cards' + dirIndex] as SangongCardList2;
				cards.renderByList(handCards);
				this.fpBtn.visible = false;
				this.fpBtnGroup.visible = false;
				if (!this.findNotKaiPaiOver()) {
					this.showTipsGroup("等待其他玩家开牌");
				} else {
					this.closeTipsGroup();
					this.timeBar.visible = false;
				}
			} else {
				let cards = this['cards' + dirIndex] as SangongCardList1;
				cards.renderByList(handCards);
				if (this.findNotKaiPaiOver()) {
					this.closeTipsGroup();
					//this.timeBar.visible = false;
				}
			}
			this.showNiu(roundPattern, playerIndex);
			this.playSoundBySex(playerData.sex, roundPattern, "sg_sex_");
		}

		/**
         * 播放出牌的声音。
         * sex性别，value打的牌面值。
         */
		public playSoundBySex(sex, value, template: string) {
			let sexStr = sex == 1 ? "male" : "female";
			template = template.replace("sex", sexStr) + value + "_mp3";
			SoundManager.getInstance().playEffect(template);
		}

		/**
		 * 开牌完成
		 */

		private openCardFinsh(e: egret.Event) {
			this.timeBar.visible = false;
		}

		/**
		 * 展示不同时间节点状态
		 */
		private showRunTimeByStep(step) {
			switch (step) {
				case SangongStep.QIANG_ZHUANG:
					this.timeBar.visible = true;
					this.runQzStep();
					break;
				case SangongStep.FAPAI:
					// this.timeBar.visible = false;
					this.runFapaiStep();
					break;
				case SangongStep.KAIPAI:
				case SangongStep.XUANPAI:
					this.timeBar.visible = true;
					this.runXuanpaiStep();
					break;
				case SangongStep.ADDANTE:
					this.timeBar.visible = true;
					this.runAddanteStep();
					break;
			}
		}

		/**
		 * 翻牌效果，就是把扣下的牌翻过来。
		 */
		private turnOutPoker(card) {
			let players = Global.roomProxy.getPlayers();
			for (let key in players) {
				let dir = this.directions[key];
				if (Global.roomProxy.checkIndexIsMe(key)) {
					let cards = this['cards' + dir] as SangongCardList2;
					cards.turnOutPoker_me(card);
				} else {
					let cards = this['cards' + dir] as SangongCardList1;
					cards.turnOutPoker_others();
				}
			}
		}

		/**
		 * 游戏结束
		 * @param  {egret.TouchEvent} e
		 */
		private roomFinished(e: egret.TouchEvent) {

			let data = e.data;
			let roomInfo = Global.roomProxy.roomInfo;
			roomInfo.roundStatus = SangongStep.CLOSE;
			this.status = SangongStatus.close;
			this.timeBar.visible = false;
			this.timeBar.removeTimer();
			// this.showRunTimeByStep
			if (data.status == 2) {
				Global.alertMediator.addAlert("牌局异常结束,请联系客服", () => {
					this.backHall();
				}, null, true);
			}
		}


		private createPokers() {
			let length = Global.roomProxy.getPlayersLength() || 5;
			for (let i = length * 5 - 1; i >= 0; i--) {
				let tempPokers: SangongCard = ObjectPool.produce("niuniu_poker", SangongCard);
				if (!tempPokers) {
					tempPokers = new SangongCard();
				}
				this.effectGroup.addChild(tempPokers);
				tempPokers.name = "poker" + i;
				tempPokers.scaleX = tempPokers.scaleY = 0.55;
				tempPokers.verticalCenter = -178;
				tempPokers.horizontalCenter = 0.05 - i * 0.08;
			}
		}


		/**
		 * 发牌
		 */
		private startMove() {
			let count = 1;
			let length = Global.roomProxy.getPlayersLength() || 5;
			var listArr = [];
			for (let i = 0; i < length; i++) {
				listArr[i] = i;
			}
			async.eachSeries(listArr, (data, callback) => {
				let time1 = 0;
				if (!Global.runBack) {
					for (let i = data * 5; i < (data + 1) * 5; i++) {
						let poker = this.effectGroup.getChildByName("poker" + i);
						egret.Tween.get(poker)
							.to({ verticalCenter: this["pl" + count].verticalCenter, horizontalCenter: this["pl" + count].horizontalCenter }, (150 + (50 * time1))).call(() => {
								game.UIUtils.removeSelf(poker);
								ObjectPool.reclaim("niuniu_poker", poker);
							});
						time1++;
					}
				}
				this.setAutoTimeout(() => {
					this["pl" + count].visible = false;
					this['cards' + count].visible = true;
					this['cards' + count].cardAnimation();
					for (let i = 0; i < 20; i++) {
						NiuniuUtils.fapai();
					}
					count++;
					callback();
				}, this, 150);
			}, () => {
				this.setAutoTimeout(() => {
					//	this.showRunTimeByStep(Global.roomProxy.roomInfo.roundStatus);
				}, this, 1000);
			});
		}

		private async tweenSync(node, showTime, hideTime) {
			return new Promise((resolve, reject) => {
				NiuniuUtils.playDz();
				egret.Tween.get(node).to({ visible: true }, showTime).to({ visible: false }, hideTime).call(() => {
					resolve();
				});
			})
		}

		/**
		 * 定庄动画
		 */
		private qzLength = 0;
		private async randomEstates() {
			let players = Global.roomProxy.roomInfo.randomDealers;
			let zhuangId = Global.roomProxy.roomInfo.dealer;//换到抢庄的地方去。	
			let dealers = this.directions[zhuangId];
			let showCount = 3;
			this.qzLength = players.length;
			if (players.length == 1) {
				let header = this['header' + dealers] as SangongHeader;
				NiuniuUtils.playDz();
				header.headerImage_k.visible = true;
				header.showIsZhuang(true);
				showCount = 0;
				header.hideBeishu();
				return;
			} else {
				do {
					for (let i = 0; i < players.length; i++) {
						let dir = this.directions[players[i]];
						let header = this['header' + dir] as SangongHeader;
						header.hideBeishu();
						await this.tweenSync(header.headerImage_k, 50, 50);
					}
					showCount--;
				} while (showCount > 0);
				let header = this['header' + dealers] as SangongHeader;
				header.headerImage_k.visible = true;
				if (Global.runBack) {
					header.showIsZhuang(true);
					header.hideBeishu();
				} else {
					egret.Tween.get(header.headerImage_k).to({ visible: true }, 80).to({ visible: false }, 80).call(() => { NiuniuUtils.playDz(); }).to({ visible: true }, 80).to({ visible: false }, 80).call(() => { NiuniuUtils.playDz(); }).to({ visible: true }, 80).to({ visible: false }, 80).call(() => { NiuniuUtils.playDz(); }).to({ visible: true }, 80).to({ visible: false }, 80).call(() => { NiuniuUtils.playDz(); }).to({ visible: true }, 80).to({ visible: false }, 80).to({ visible: true }, 80).call(() => {
						header.showIsZhuang(true);
						header.hideBeishu();
					}, this);
				}
			}

		}

		/**
		 * 交换group位子
		 */
		private changePlayerGroup(index1, index2) {
			this['player' + index1].bottom = this['player' + index2].bottom;
			this['player' + index1].left = this['player' + index2].left;
			this['player' + index1].top = this['player' + index2].top;
			this['player' + index1].right = this['player' + index2].right;
			this['player' + index1].verticalCenter = this['player' + index2].verticalCenter;
			this['player' + index1].horizontalCenter = this['player' + index2].horizontalCenter;
			this['player' + index1].width = this['player' + index2].width;
			this['player' + index1].height = this['player' + index2].height;
			this['header' + index1].x = this['header' + index2].x;
			this['header' + index1].y = this['header' + index2].y;
			this['cards' + index1].x = this['cards' + index2].x;
			this['cards' + index1].y = this['cards' + index2].y;
			this['pl' + index1].verticalCenter = this['pl' + index2].verticalCenter;
			this['pl' + index1].horizontalCenter = this['pl' + index2].horizontalCenter;
			this.tipsData[index1] = index2;
		}

		/**
		 * 展示点数
		 */
		private nnFenGroup: SangongFen;
		private showNiu(pt, direction) {
			let dir = this.directions[direction];
			this.nnFenGroup = new SangongFen(pt);
			let pl = this["player" + dir] as eui.Group;
			pl.addChild(this.nnFenGroup);
			switch (dir) {
				case "1":
					this.nnFenGroup.x = -60;
					this.nnFenGroup.y = 269;
					break;
				case "2":
				case "3":
					this.nnFenGroup.scaleX = this.nnFenGroup.scaleY = 0.6;
					this.nnFenGroup.x = -140;
					this.nnFenGroup.y = 125;
					break;
				case "4":
				case "5":
					this.nnFenGroup.scaleX = this.nnFenGroup.scaleY = 0.6;
					this.nnFenGroup.x = 117;
					this.nnFenGroup.y = 125;
					break;
			}

		}

		/**
		 * 断线重连后展示玩家的手牌
		 */
		private duanXainLookPais() {
			let players = Global.roomProxy.getPlayers();
			for (let key in players) {
				let player = players[key] as SGPlayerGameBean;
				let dirIndex = this.directions[key];
				let header = this.getHeaderByIndex(key) as SangongHeader;
				if (Global.roomProxy.checkIndexIsMe(key)) {
					let cards = this['cards' + dirIndex] as SangongCardList2;
					if (player.isPlayCards && player.handCards && player.handCards.length > 1) {
						cards.renderByList(player.handCards, 1);
						this.showNiu(player.roundPattern, dirIndex)
						cards.visible = true;
						this.fpBtn.visible = false;
						this.fpBtnGroup.visible = false;
					} else {
						cards.renderByList2(3);
						cards.visible = true;
						if (Global.roomProxy.roomInfo.roundStatus == SangongStep.XUANPAI || Global.roomProxy.roomInfo.roundStatus == SangongStep.FAPAI) {
							this.fpBtn.visible = true;
							this.fpBtnGroup.visible = true;
						} else {
							this.fpBtn.visible = false;
							this.fpBtnGroup.visible = false;
						}
					}
				} else {
					let cards = this['cards' + this.directions[key]] as SangongCardList1;
					if (player.isPlayCards && player.handCards && player.handCards.length > 0) {
						cards.renderByList(player.handCards);
						this.showNiu(player.roundPattern, dirIndex);
						cards.visible = true;
					} else {
						let hands = player.handCards || 3;
						cards.renderByList(hands);
						cards.visible = true;
					}
				}
			}
		}



		/**
         * 断线重连
         */
		private async reconnectSuc(e: egret.Event) {
			//对局已经结束不做处理
			if (this.allowBack) {
				Global.alertMediator.addAlert("对局已经结束", null, null, true);
				this.backHall();
				return;
			}
			let reqData = Global.gameProxy.lastGameConfig;
			if (!reqData) reqData = {};
			if (!Global.roomProxy.roomInfo || !Global.roomProxy.roomInfo.roomId) {
				this.backHall();
				return;
			}
			reqData.roomId = Global.roomProxy.roomInfo.roomId;
			this.reconnectCall(reqData)
		}
	}
}