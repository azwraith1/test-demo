module niuniu {
	export class NiuniuSGameScene extends game.BaseGameScene {
		//头像组 1 - 4
		private player1: eui.Group;
		//1-4
		private wc1: eui.Group;
		private wc2: eui.Group;
		private wc3: eui.Group;
		private wc4: eui.Group;

		//头像 1 - 4
		private header1: NiuniuNewHeader;
		//自己的牌组
		private cards1: NiuniuCardList2;
		//其他玩家的牌组
		private cards2: NiuniuCardList1;
		//自己小牌
		private cards1_1: NiuniuCardList1;
		//抢庄的条
		private qzBar: NiuniuNewQZBar;

		private yzBar: NiuniuNewYZBar;
		//计算器
		private caculator: NiuniuNewCaculatorBar;
		//倒计时
		private timeBar: NiuniuNewTimeBar;

		private ynBtn: eui.Button;

		private wnBtn: eui.Button;
		//座位号
		private directions: any
		//选出来的牛牌。
		private nplist = [];

		//每个玩家占位1-4
		private pl1: eui.Image;
		private effectGroup: eui.Group;

		private niuniuTipsData = {};

		private caculatorGroup: eui.Group;
		private status: number;
		//功能组
		private tisiyu: eui.Label;
		private tipsGroup: eui.Group;
		private tipLabel: eui.Label;
		private diFen: eui.Label;
		private otherBtnGroups: eui.Group;
		//五小牛按钮
		private fiveBtn: eui.Button;
		//炸弹按钮
		private boomBtn: eui.Button;
		private tisiGroup: eui.Group;
		private tisiLable: eui.Label;
		public pmdKey: string = "blnn";
		private roomid: eui.Label;
		//new
		/**
		 * 打开游戏界面通知
		 */
		public GAME_SCENE_NOTIFY: string = SceneNotify.OPEN_NIUNIUGAMES;

		/**
		 * 关闭游戏界面通知
		 */
		public HALL_SCENE_NOTIFY: string = SceneNotify.OPEN_NIUNIUSELECT;

		/**
		 * 关闭当前界面通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_NIUNIUGAMES;

		/**
		 * 对应匹配界面通知
		 */
		public MATCHING_SCENE_NOTIFY: string = SceneNotify.OPEN_NIUNIU_MATCHING;

		public constructor() {
			super();
			GameConfig.CURRENT_ISSHU = true;
			this.skinName = new NiuniuSGameSceneSkin();
		}

		public onAdded() {
			super.onAdded();
			this.listenEvent();
		}

		public onRemoved() {
			super.onRemoved();
			this.listenOffEvent();
		}


		public async createChildren() {
			super.createChildren();
			this.restartBtn.visible = false;
			this.showBtnsType(1);
			game.UIUtils.setAnchorPot(this.ynBtn);
			game.UIUtils.setAnchorPot(this.wnBtn);
			this.niuniuTipsData = { "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6" };
			this.qzBar.setRoot(this);
			this.yzBar.setRoot(this);
			let length = _.values(Global.roomProxy.getPlayers()).length;
			this.directions = NiuniuUtils.getDirectionByMine(Global.roomProxy.getMineIndex(), length);
			this.diFen.text = Global.gameProxy.lastGameConfig.diFen;
			this.roomid.text = "牌局编号：" + Global.roomProxy.roomInfo.roomId;
			this.showHeaders();
			//交换一下位子 适配一下
			for (let i = 1; i <= length; i++) {
				this['header' + this.directions[i]].setIndex(i);
			}
			if (Global.roomProxy.reconnect) {
				this.timeBar.startTime(this);
				this.timeBar.visible = true;
				let roomInfo = Global.roomProxy.roomInfo;
				this.showRunTimeByStep(roomInfo.roundStatus);
			} else {
				this.showStartAni();
			}
			let publicMsg = PMDComponent.instance;
			publicMsg.anchorOffsetY = 24;
			publicMsg.horizontalCenter = 10;
			publicMsg.top = 50;
		}


		private showStartAni() {
			let startImage = new eui.Image("nns_start_img_png");
			this.addChild(startImage);
			game.UIUtils.setAnchorPot(startImage);
			startImage.scaleX = 1;
			startImage.scaleY = 1;
			startImage.verticalCenter = -150;
			startImage.horizontalCenter = 0;
			egret.Tween.get(startImage).to({
				scaleX: 0.8,
				scaleY: 0.8,
			}, 500, egret.Ease.backOut).wait(700).to({ alpha: 0 }, 300).call(() => {
				game.UIUtils.removeSelf(startImage);
			}, this);
			this.setAutoTimeout(() => {
				this.timeBar.startTime(this);
				this.timeBar.visible = true;

			}, this, 1500);


		}

		/**
		 * 根据坐标找到头像
		 * @param  {} index
		 */
		private getHeaderByIndex(index) {
			for (let i = 1; i <= 4; i++) {
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
		 * 有牛BTN点击
		 */
		private async ynBtnTouchEnd() {
			if (!this.nplist || this.nplist.length != 3) {
				//TipsCompoment.instance.show("请选牌");
				this.tisiLable.text = "请选牌";
				this.trueMe(this.tisiGroup);
				this.falseMe(this.tisiGroup);
				return;
			}
			let sum = NiuniuUtils.getNumberSum(this.nplist);
			if (sum % 10 != 0) {
				//TipsCompoment.instance.show("选牌错误");
				this.tisiLable.text = "选牌错误";
				this.trueMe(this.tisiGroup);
				this.falseMe(this.tisiGroup);
				return;
			}
			this.cards1.visible = false;
			this.cards1_1.visible = true;
			this.caculatorGroup.visible = false;
			var handler = ServerPostPath.game_nnHandle_rc_playCards;
			let cardss = { cards: this.nplist };
			let resp: any = await game.PomeloManager.instance.request(handler, cardss);
			// this.showTipsGroup("等待其他玩家选牛");
			if (resp && resp.error && resp.error.code == 0) {
				// 	this.caculator.visible = false;
				// } else {
				// 	this.ynBtn.visible = true;
				// 	this.wnBtn.visible = true;
				// 	this.cards1_1.visible = false;
				// 	this.cards1.visible = true;
			}
		}

		/**
		 * 无牛按钮点击
		 */
		private async wxBtnTouchEnd() {
			let player = Global.roomProxy.getMineInfo();
			if (player.roundPattern > 0) {
				//TipsCompoment.instance.show("你再看看，可能有牛哦");
				this.tisiLable.text = "你再看看，可能有牛哦";
				this.trueMe(this.tisiGroup);
				this.falseMe(this.tisiGroup);
				return;
			}
			var handler = ServerPostPath.game_nnHandle_rc_playCards;
			let cardss = { cards: [] };
			this.cards1_1.visible = true;
			this.cards1.visible = false;
			this.caculatorGroup.visible = false;
			let resp1: any = await game.PomeloManager.instance.request(handler, cardss);
			// this.showTipsGroup("等待其他玩家选牛");
		}


		private async boomBtnTouch() {
			var handler = ServerPostPath.game_nnHandle_rc_playCards;
			let cardss = { cards: [] };
			this.cards1_1.visible = true;
			this.cards1.visible = false;
			this.boomBtn.visible = false;
			let resp1: any = await game.PomeloManager.instance.request(handler, cardss);
			// this.showTipsGroup("等待其他玩家选牛");
		}

		private async fiveBtnTouch() {
			var handler = ServerPostPath.game_nnHandle_rc_playCards;
			let cardss = { cards: [] };
			this.cards1_1.visible = true;
			this.cards1.visible = false;
			this.fiveBtn.visible = false;
			let resp1: any = await game.PomeloManager.instance.request(handler, cardss);
			// this.showTipsGroup("等待其他玩家选牛");
		}

		/**
		 * 自带监听
		 */
		public async onTouchTap(e: egret.TouchEvent) {
			let sum = 0;
			e.stopPropagation();
			switch (e.target) {
				case this.ynBtn:
					this.ynBtnTouchEnd();
					break;
				case this.wnBtn:
					this.wxBtnTouchEnd();
					break;
				case this.restartBtn:
					this.restartBtnTouch();
					break;
				case this.backBtn:
					this.showBtnsType(1);
					this.backBtnTouch();
					break;
				case this.settingBtn:
					this.showBtnsType(1);
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING);
					break;
				case this.boomBtn:
					this.boomBtnTouch();
					break;
				case this.fiveBtn:
					this.fiveBtnTouch();
					break;
				case this.recordBtn:
					this.showBtnsType(1);
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_NIUGAMERECORD, "blnn");
					break;
				case this.helpBtn:
					this.showBtnsType(1);
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_HELP_SHU, { type: "blnn" });
					break;
				case this.xlbtn:
					this.showBtnsType(2);
					break;
				case this.xlbtn1:
					this.showBtnsType(1);
					break;

			}
		}


		/**
		 * 打开panl，关闭szGroup；
		 */
		// private closePanls() {
		// 	this.btnzuo.visible = true;
		// 	this.btnxia.visible = false;
		// 	egret.Tween.get(this.gnGroup).to({ top: -80 }, 100);
		// }


		private listenEvent() {
			EventManager.instance.addEvent(ServerNotify.s_robDealerMulti, this.robDealerMulti, this);
			EventManager.instance.addEvent(ServerNotify.s_startRobDealer, this.startRobDealer, this);
			EventManager.instance.addEvent(ServerNotify.s_playerRobDealer, this.playerRobDealer, this);
			EventManager.instance.addEvent(ServerNotify.s_startAddAnte, this.startAddAnte, this);
			EventManager.instance.addEvent(ServerNotify.s_addAnteFinish, this.addAnteFinish, this);
			EventManager.instance.addEvent(ServerNotify.s_startPlayCards, this.startPlayCards, this);
			EventManager.instance.addEvent(ServerNotify.s_playCards, this.playCards, this);
			EventManager.instance.addEvent(ServerNotify.s_playCardsFinish, this.playCardsFinish, this);
			EventManager.instance.addEvent(ServerNotify.s_playerAddAnte, this.playerAddAnte, this);
			EventManager.instance.addEvent(ServerNotify.s_playerAnteChange, this.playerAnteChange, this);
			EventManager.instance.addEvent(ServerNotify.s_roundSettlement, this.roundSettlement, this);
			EventManager.instance.addEvent(ServerNotify.s_dealerChanged, this.dealerChanged, this);
			EventManager.instance.addEvent(ServerNotify.s_initHandCards, this.initHandCards, this);
			EventManager.instance.addEvent(ServerNotify.s_addAnteMulti, this.addAnteMulti, this);
			EventManager.instance.addEvent(ServerNotify.s_roomFinished, this.roomFinished, this);
			EventManager.instance.addEvent(ServerNotify.s_countdown, this.countdown, this);
			EventManager.instance.addEvent(EventNotify.CACULATOR_VALUE, this.touchList, this);
			EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
		}

		private listenOffEvent() {
			EventManager.instance.removeEvent(ServerNotify.s_robDealerMulti, this.robDealerMulti, this);
			EventManager.instance.removeEvent(ServerNotify.s_startRobDealer, this.startRobDealer, this);
			EventManager.instance.removeEvent(ServerNotify.s_playerRobDealer, this.playerRobDealer, this);
			EventManager.instance.removeEvent(ServerNotify.s_startAddAnte, this.startAddAnte, this);
			EventManager.instance.removeEvent(ServerNotify.s_addAnteFinish, this.addAnteFinish, this);
			EventManager.instance.removeEvent(ServerNotify.s_startPlayCards, this.startPlayCards, this);
			EventManager.instance.removeEvent(ServerNotify.s_playCards, this.playCards, this);
			EventManager.instance.removeEvent(ServerNotify.s_playCardsFinish, this.playCardsFinish, this);
			EventManager.instance.removeEvent(ServerNotify.s_playerAddAnte, this.playerAddAnte, this);
			EventManager.instance.removeEvent(ServerNotify.s_playerAnteChange, this.playerAnteChange, this);
			EventManager.instance.removeEvent(ServerNotify.s_roundSettlement, this.roundSettlement, this);
			EventManager.instance.removeEvent(ServerNotify.s_dealerChanged, this.dealerChanged, this);
			EventManager.instance.removeEvent(ServerNotify.s_initHandCards, this.initHandCards, this);
			EventManager.instance.removeEvent(EventNotify.CACULATOR_VALUE, this.touchList, this);
			EventManager.instance.removeEvent(ServerNotify.s_addAnteMulti, this.addAnteMulti, this);
			EventManager.instance.removeEvent(ServerNotify.s_roomFinished, this.roomFinished, this);
			EventManager.instance.removeEvent(ServerNotify.s_countdown, this.countdown, this);
			EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
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
			//TipsCompoment.instance.show("开始抢庄");
			let roomInfo = Global.roomProxy.roomInfo;
			let players = roomInfo.players;
			for (let index in players) {
				let player = players[index];
				if (player.robDealerAnte == -1) {
					//如果是我 没有抢庄状态 就显示抢庄条
					if (Global.roomProxy.checkIndexIsMe(index)) {
						this.qzBar.show(player.robDealerMulti);
					}
				} else {
					let header = this.getHeaderByIndex(index) as NiuniuNewHeader;
					header.showBeishu(player.robDealerAnte);

				}
			}
		}

		/**
		 * 接收服务器开始抢庄消息
		 */
		private startRobDealer(e: egret.Event) {
			let data = e.data;
			let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;

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
			roomInfo.roundStatus = NiuniuStep.QIANG_ZHUANG;
			this.showRunTimeByStep(roomInfo.roundStatus);
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
		public async sendQZReq(multi) {
			//抢庄完成后发个事件给服务器  
			// this.showTipsGroup("等待其他玩家抢庄");
			let serverPath = ServerPostPath.game_nnHandler_c_robDealer;
			let data = { multi: multi };
			this.qzBar.visible = false;
			let resp: any = await Global.pomelo.request(serverPath, data);
			if (resp && resp.error && resp.error.code != 0) {
				if (Global.roomProxy.roomInfo.roundStatus == NiuniuStep.QIANG_ZHUANG) {
					this.qzBar.visible = true;
				}
			}
		}

		/**
		* 收到某个玩家抢庄
		*
 		*/
		private playerRobDealer(e: egret.Event) {
			let data = e.data;
			if (Global.roomProxy.roomInfo.roundStatus != NiuniuStep.QIANG_ZHUANG) {
				return;
			}
			let player = Global.roomProxy.getPlayerInfoByIndex(data.playerIndex);
			player.qzMulti = data.multi;
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
			let header = this.getHeaderByIndex(data.playerIndex) as NiuniuNewHeader;
			header.showBeishu(data.multi);
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
				let header = this['header' + i] as NiuniuNewHeader;
				if (header.index != room.dealer) {
					header.hideBeishu();
				}
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

		private releaseKPUI() {
			this.caculatorGroup.visible = false;
			this.cards1.visible = false;
			this.releaseQZUI();
		}

		//抢庄END
		private clearQZInfo() {
			let players = Global.roomProxy.roomInfo.players;
			for (let key in players) {
				if (key != "" + Global.roomProxy.roomInfo.dealer) {
					let header = this.getHeaderByIndex(key) as NiuniuHeader;
					header.hideBeishu();
				}
			}
		}


		//押注流程start

		/**
		 * 进入押注流程 等待addAnteMulti
		 */
		private startAddAnte(e: egret.Event) {
			this.releaseQZUI();
			this.clearQZInfo();
			//给服务器发事件 game_nnHandler_c_addAnte
			let data = e.data;
			let room = Global.roomProxy.roomInfo as BaseRoomInfo;
			room.roundStatus = NiuniuStep.ADDANTE;
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
			Global.roomProxy.roomInfo.roundStatus = NiuniuStep.ADDANTE;
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
					let header = this.getHeaderByIndex(index) as NiuniuNewHeader;
					header.showBeishu(player.addAnte);
				}
			}
		}

		/**
		 * 闲家押注
		 */
		public async sendYZReq(value) {
			let serverPath = ServerPostPath.game_nnHandler_c_addAnte;
			let data = { multi: value };
			this.yzBar.visible = false;
			let resp: any = await Global.pomelo.request(serverPath, data);
			// this.showTipsGroup("等待其他玩家押注");
			if (resp && resp.error && resp.error.code != 0) {
				if (Global.roomProxy.roomInfo.roundStatus == NiuniuStep.ADDANTE) {
					this.yzBar.visible = true;
				}
			}
		}

		/**
		 * 同playerAnteChange
		 * 玩家押注通知
		 */
		private playerAddAnte(e: egret.Event) {
			//	展示每个压住玩家的分数  game_nnHandler_c_addAnte
			this.playerAnteChange(e);
		}

		/**
		 * 玩家押注通知
		 */
		private playerAnteChange(e: egret.Event) {
			let data = e.data;
			let player = Global.roomProxy.getPlayerInfoByIndex(data.playerIndex) as NNPlayerGameBean;
			player.addAnte = data.multi;
			if (data.playerIndex == Global.roomProxy.getMineIndex()) {
				this.yzBar.visible = false;
				if (!this.findNotAnteOver()) {
					this.showTipsGroup("等待其他玩家下注");
				} else {
					this.closeTipsGroup();
					//	this.timeBar.visible = false;
				}
			} else {
				if (this.findNotAnteOver()) {
					this.closeTipsGroup();
					//	this.timeBar.visible = false;
				}
			}
			let header = this.getHeaderByIndex(data.playerIndex) as NiuniuNewHeader;
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
		 * 押注完成 
		 */
		private addAnteFinish(e: egret.Event) {
			//服务器会告诉,相当于清除押注的UI，开始发牌的相关UI
			this.closeTipsGroup();
			let room = Global.roomProxy.roomInfo as BaseRoomInfo;
			room.roundStatus = NiuniuStep.EMPTY;
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
			roomInfo.roundStatus = NiuniuStep.FAPAI;
			this.createPokers();
			let players = roomInfo.players;
			for (let key in players) {
				let player = players[key];
				let index = this.directions[key];
				if (Global.roomProxy.checkIndexIsMe(key)) {
					player.handCards = cards;
					player.roundPattern = data.roundPattern;
					this.cards1.renderByList(cards);
				} else {
					player.cardLength = data.cardLength;
					this['player' + index].visible = true;
					let cards = this['cards' + index] as NiuniuCardList1;
					cards.renderByList(player.cardLength);
				}
			}
			this.startMove();
			//动画过后展现
			// this.setAutoTimeout(() => {
			//进入看牌流程
			// roomInfo.roundStatus = NiuniuStep.XUANPAI;

			// }, this, 3500);
		}

		/**
		 * 选牌  7
		 */
		private startPlayCards(e: egret.Event) {
			let data = e.data;
			let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;
			// if (!roomInfo.countdown) roomInfo.countdown = {};
			// roomInfo.countdown.start = data.serverTimeStampMS;
			// roomInfo.countdown.end = data.countdownMS + data.serverTimeStampMS;
			// game.DateTimeManager.instance.updateServerTime(data.serverTimeStampMS);

		}

		private lockTouch: boolean = false;
		private hideTouch() {
			this.caculatorGroup.visible = false;
			this.fiveBtn.visible = false;
			this.boomBtn.visible = false;
			this.lockTouch = true;
		}


		private findNotChooseOver() {
			let players = Global.roomProxy.getPlayers();
			for (let key in players) {
				let player = players[key];
				if (!player.handCards || player.handCards.length < 5) {
					return false;
				}
			}
			return true;
		}

		/**
		 * 服务器推送什么牌型  8
		 */
		private playCards(e: egret.Event) {
			//展示有牛没牛，但是不给其他玩家展示
			let data = e.data;
			let cards = data.handCards;
			let roundPattern = data.roundPattern;
			let selectCards = data.selectedCards;
			let index = data.playerIndex;
			let player = Global.roomProxy.getPlayerInfoByIndex(index);
			player.handCards = cards;
			player.roundPattern = roundPattern;
			player.selectCards = selectCards;
			/**
			 * 显示完成
			 */
			let dir = this.directions[index];
			// this["wc" + dir].visbile = true;
			this.showWc(index);
			if (Global.roomProxy.checkIndexIsMe(index)) {
				//是我
				this.hideTouch();
				this.cards1.delTouch();
				this.cards1.visible = false;
				this.cards1_1.visible = true;
				if (this.findNotChooseOver()) {
					this.closeTipsGroup();
					//this.timeBar.visible = false;
				} else {
					this.showTipsGroup("等待其他玩家选牛")
				}
			} else {
				this[`cards${dir}`].visible = true;
				if (this.findNotChooseOver()) {
					this.closeTipsGroup();
					//this.timeBar.visible = false;
				}
			}
		}

		private showWc(key) {
			let dir = this.directions[key];
			switch (dir) {
				case "1":
					this.wc1.visible = true;
					break;
				case "2":
					this.wc2.visible = true;
					break;

				case "3":
					this.wc3.visible = true;
					break;
				case "4":
					this.wc4.visible = true;
					break;
			}
		}

		private sortShoupai(cards, selectCards) {
			if (!selectCards) {
				return cards;
			}
			let copyCard = selectCards.concat(cards);
			return _.uniq(copyCard);
		}

		/**
		 * 玩家选牌结果 9
		 */
		private playCardsFinish(e: egret.Event) {
			//玩家选牌完成，展示所有玩家的牌面。
			let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;
			roomInfo.roundStatus = NiuniuStep.EMPTY;
			Global.roomProxy.roomInfo.countdown = null;
			this.timeBar.visible = false;
			this.releaseKPUI();
			this.closeTipsGroup();


		}


		/**
		 * 飞金币效果
		 */
		private showGold2Header(index1, index2) {
			if (Global.runBack) {
				return;
			}
			let header1 = this['player' + index1] as NiuniuNewHeader;//this.getHeaderByIndex(index1) as NiuniuNewHeader;
			let header2 = this['player' + index2] as NiuniuNewHeader;//this.getHeaderByIndex(index2) as NiuniuNewHeader;
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
				image.verticalCenter = header1.verticalCenter - 50 + _.random(-20, 20);
				this.effectGroup.addChild(image);
				NiuniuUtils.playFjb();
				let time = _.random(200, 550);
				egret.Tween.get(image).wait(15 * (num / 2)).call(() => {
					callback();
				}).to({
					horizontalCenter: header2.horizontalCenter + _.random(-20, 20),
					verticalCenter: header2.verticalCenter - 50 + _.random(-20, 20)
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
				let roomInfo = Global.roomProxy.roomInfo as BaseRoomInfo;
				let keys = NiuniuUtils.getNNSort(roomInfo.dealer, Global.roomProxy.getPlayersLength());
				async.eachSeries(keys, (key, callback) => {
					let player = Global.roomProxy.getPlayerInfoByIndex(key);
					let ptn = player.roundPattern;
					let dir = this.directions[key];
					if (!Global.roomProxy.checkIndexIsMe(key)) {
						let resultCards = this.sortShoupai(player.handCards, player.selectCards);
						let list1 = this['cards' + dir] as NiuniuCardList1;
						list1.renderByList(resultCards);
					} else {
						let resultCards = this.sortShoupai(player.handCards, player.selectCards);
						let list1 = this['cards' + dir + "_" + dir] as NiuniuCardList1;
						list1.renderByList(resultCards);
					}
					this.setAutoTimeout(() => {
						let playerData = Global.roomProxy.getPlayerByIndex(key);
						if (playerData) {
							this.showNiu(ptn, dir);
							//播声音
							NiuniuUtils.playShowNiu(playerData.sex, ptn);
						}
					}, this, 100)
					this.setAutoTimeout(() => {
						callback();
					}, this, 1000);
				}, () => {
					this.goldAni(data);
				});
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
				let header = this.getHeaderByIndex(record.index) as NiuniuNewHeader;
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
				//通吃和通赔
				let length = xian2zhuangRecords.length + zhuang2xianRecords.length;
				if (zhuang2xianRecords.length == length) {
					PukerUtils.showZJTongPei(this.effectGroup);
				} else if (xian2zhuangRecords.length == length) {
					PukerUtils.showZJTongChi(this.effectGroup);
				}
				//庄家飞闲家				
				for (let key in records) {
					let player = roomInfo.players[key];
					let header = this.getHeaderByIndex(key) as NiuniuNewHeader;
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
						Global.playerProxy.playerData.gold = lishuis.ownGold;
					}
					header.showLiushuiLabel(sum);
				}

				this.setAutoTimeout(() => {
					this.restartBtn.visible = true;
					this.allowBack = true;
				}, this, 2000);
			});
		}



		private test() {
			this.showHeaders_test();
			// this.restartBtn.visible = true;
			let card = [201, 202, 203, 204, 205];
			this.cards1.renderByList(card);
			this.cards1.visible = true;
			// this.setAutoTimeout(() => {
			// this.turnOutPoker(card);
			// }, this, 2000)
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
				let header = this['header' + dir] as NiuniuNewHeader;
				if (Global.roomProxy.checkIndexIsMe(key)) {
					let cards = this['cards' + dir] as NiuniuCardList2;
					//cards.visible = false;
				} else {
					let cards = this['cards' + dir] as NiuniuCardList1;
					cards.visible = false;
				}
				header.initWithPlayer(players[key]);
				header.showIsZhuang(game.Utils.valueEqual(zhuangId, key));
				player.visible = true;
				header.visible = true;
			}
			//	this['header2'].change2Left();
		}

		private runFapaiStep() {

		}

		private runXuanpaiStep() {
			let players = Global.roomProxy.getPlayers();
			this.qzBar.visible = false;
			this.yzBar.visible = false;
			this.cards1.addTouch();
			for (let key in players) {
				let player = players[key] as NNPlayerGameBean;
				let dirIndex = this.directions[key];
				let header = this.getHeaderByIndex(key) as NiuniuNewHeader;
				header.showBeishu(player.addAnte);
				if (Global.roomProxy.checkIndexIsMe(key)) {
					if (player.isPlayCards) {
						//选择了牌
						this.cards1_1.visible = true;
					} else {
						if (player.roundPattern == 13) {
							this.otherBtnGroups.visible = true;
							this.boomBtn.visible = true;
						} else if (player.roundPattern == 14) {
							this.otherBtnGroups.visible = true;
							this.fiveBtn.visible = true;
						} else {
							this.caculatorGroup.visible = true;
							this.cards1.visible = true;
							this.cards1.renderByList(player.handCards);
						}
					}
				} else {
					let cards = this['cards' + this.directions[key]] as NiuniuCardList1;
					cards.renderByList(5);
					cards.visible = true;
				}
			}
		}

		/**
		 * 展示不同时间节点状态
		 */
		private showRunTimeByStep(step) {
			switch (step) {
				case NiuniuStep.QIANG_ZHUANG:
					this.timeBar.visible = true;
					this.runQzStep();
					break;
				case NiuniuStep.FAPAI:
					this.timeBar.visible = false;
					this.runFapaiStep();
					break;
				case NiuniuStep.KAIPAI:
				case NiuniuStep.XUANPAI:
					this.timeBar.visible = true;
					this.runXuanpaiStep();
					break;
				case NiuniuStep.ADDANTE:
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
					let cards = this['cards' + dir] as NiuniuCardList2;
					cards.turnOutPoker_me(card);
				} else {
					let cards = this['cards' + dir] as NiuniuCardList1;
					cards.turnOutPoker_others();
				}
			}
		}

		private touchList(e: egret.Event) {
			this.nplist = [];
			let nums = e.data;
			if (nums.length < 3) {

			} else {
				for (let i = 0; i < nums.length; i++) {
					let value = nums[i]["value"];
					let color = nums[i]["color"];
					let cardValue = color * 100 + value;
					this.nplist.push(cardValue);
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
			roomInfo.roundStatus = NiuniuStep.CLOSE;
			this.status = NiuniuStatus.close;
			this.timeBar.visible = false;
			this.timeBar.removeTimer();
			if (data.status == 2) {
				Global.alertMediator.addAlert("牌局异常结束,请联系客服", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_NIUNIUSELECT);
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_NIUNIUGAMES);
				}, null, true);
			}
		}

		/**
			 * 展现玩家头像
			 */
		private showHeaders_test() {
			let players = Global.roomProxy.getPlayers().length || [1, 2, 3, 4, 5, 6];
			//let zhuangId = Global.roomProxy.roomInfo.dealer;//换到抢庄的地方去。
			for (let key = 1; key <= 6; key++) {
				//	let dir = this.directions[key];
				let player = this['player' + key] as eui.Group;
				let header = this['header' + key] as NiuniuNewHeader;
				if (key == 2) {
					let cards = this['cards' + key] as NiuniuCardList2;
					cards.visible = false;
				} else {
					let cards = this['cards' + key] as NiuniuCardList1;
					cards.visible = false;
				}
				//header.initWithPlayer(players[key]);
				player.visible = true;
				header.visible = true;
			}

			// this.randomEstates();
		}

		private createPokers() {
			let length = Global.roomProxy.getPlayersLength() || 6;
			for (let i = length * 5 - 1; i >= 0; i--) {
				let tempPokers: niuniu.NiuniuCard = ObjectPool.produce("niuniu_poker", niuniu.NiuniuCard);
				if (!tempPokers) {
					tempPokers = new niuniu.NiuniuCard();
				}
				this.effectGroup.addChild(tempPokers);
				tempPokers.name = "poker" + i;
				tempPokers.scaleX = tempPokers.scaleY = 0.55;
				tempPokers.verticalCenter = 0;
				tempPokers.horizontalCenter = 0.05 - i * 0.08;
			}
			// this.startMove();
		}


		/**
		 * 发牌
		 */
		private startMove() {
			let count = 1;
			let length = Global.roomProxy.getPlayersLength() || 6;
			var listArr = [];
			for (let i = 0; i < length; i++) {
				listArr[i] = i;
			}
			async.eachSeries(listArr, (data, callback) => {
				let time1 = 0;
				for (let i = data * 5; i < (data + 1) * 5; i++) {
					let poker = this.effectGroup.getChildByName("poker" + i);
					if (Global.runBack) {
						game.UIUtils.removeSelf(poker);
						ObjectPool.reclaim("niuniu_poker", poker);
					} else {
						egret.Tween.get(poker)
							.to({ verticalCenter: this["pl" + count].verticalCenter, horizontalCenter: this["pl" + count].horizontalCenter }, (150 + (50 * time1))).call(() => {
								game.UIUtils.removeSelf(poker);
								ObjectPool.reclaim("niuniu_poker", poker);
							});
					}
					time1++;
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
					Global.roomProxy.roomInfo.roundStatus = NiuniuStep.XUANPAI;
					this.showRunTimeByStep(Global.roomProxy.roomInfo.roundStatus);
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
				let header = this['header' + dealers] as NiuniuNewHeader;
				NiuniuUtils.playDz();
				header.headerImage_k.visible = true;
				header.showIsZhuang(true);
				showCount = 0;
				return;
			} else {
				do {
					for (let i = 0; i < players.length; i++) {
						let dir = this.directions[players[i]];
						let header = this['header' + dir] as NiuniuNewHeader;
						header.hideBeishu();
						await this.tweenSync(header.headerImage_k, 50, 50);
					}
					showCount--;
				} while (showCount > 0);
				let header = this['header' + dealers] as NiuniuNewHeader;
				header.headerImage_k.visible = true;
				if (Global.runBack) {
					header.showBeishuGroup();
					header.showIsZhuang(true);
				} else {
					egret.Tween.get(header.headerImage_k).to({ visible: true }, 80).to({ visible: false }, 80).call(() => { NiuniuUtils.playDz(); }).to({ visible: true }, 80).to({ visible: false }, 80).call(() => { NiuniuUtils.playDz(); }).to({ visible: true }, 80).to({ visible: false }, 80).call(() => { NiuniuUtils.playDz(); }).to({ visible: true }, 80).to({ visible: false }, 80).call(() => { NiuniuUtils.playDz(); }).to({ visible: true }, 80).to({ visible: false }, 80).to({ visible: true }, 80).call(() => {
						header.showBeishuGroup();
						header.showIsZhuang(true);
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
			this.niuniuTipsData[index1] = index2;
		}

		/**
		 * 展示牛牌
		 */
		private nnFenGroup: NiuniuNewFen;
		private showNiu(pt, direction) {
			this.wc1.visible = this.wc2.visible = this.wc3.visible = this.wc4.visible = false;
			this.nnFenGroup = new NiuniuNewFen(pt);
			let dir = this.niuniuTipsData[direction] + ""
			switch (dir) {
				case "1":
				case "2":
				case "3":
				case "4":
					this.nnFenGroup.x = -23;
					this.nnFenGroup.y = 247;
					break;

			}
			let pl = this["player" + dir] as eui.Group;
			pl.addChild(this.nnFenGroup);
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