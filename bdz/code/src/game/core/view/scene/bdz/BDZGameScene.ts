/*
 * @Author: MC Lee 
 * @Date: 2019-03-28 10:30:04 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-04-11 17:16:00
 * @Description: 游戏主场景
 */
class BDZGameScene extends game.BaseScene {
	private fapaiImage: eui.Image;

	private playerGroup1: eui.Group;
	private playerGroup2: eui.Group;
	private playerGroup3: eui.Group;
	private playerGroup4: eui.Group;
	private playerGroup5: eui.Group;
	private shoupai1: BDZShoupai;

	private tipImage1: eui.Image;
	private tipImage2: eui.Image;
	private tipImage3: eui.Image;
	private tipImage4: eui.Image;
	private tipImage5: eui.Image;

	private pokerList: BDZPoker[] = [];
	private effectGroup: eui.Group;
	private touchGroup: eui.Group;


	private buttonGroup: eui.Group;
	private changeGroup: eui.Group;

	//选择按钮
	private selectBtn1: eui.Button;
	private selectBtn2: eui.Button;
	private selectBtn3: eui.Button;
	private selectBtn4: eui.Button;
	private noChangeBtn: eui.Button;
	private changeBtn: eui.Button;
	private backBtn: eui.Button;


	private cmList1: BDZCMList;
	private cmItemList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	private directions: any;
	private czTipImage1: eui.Image;

	private switchCardList: BDZPoker[] = [];
	private restartBtn: eui.Button;
	private playerYzLabel1: eui.Label;

	private timeComponent: DBComponent;

	private patternTip1: eui.Button;
	public constructor() {
		super();
		this.skinName = new BDZGameSceneSkin();
	}

	public onAdded() {
		super.onAdded();
		EventManager.instance.addEvent(EventNotify.BDZ_CARD_TOUCH, this.bdzCardTouch, this);
		EventManager.instance.addEvent(ServerNotify.s_curPlay, this.s_curPlayPush, this);
		EventManager.instance.addEvent(ServerNotify.s_handleBetTask, this.s_handleBetTaskPush, this);
		EventManager.instance.addEvent(ServerNotify.s_hangupTask, this.s_hangupTaskPush, this);
		EventManager.instance.addEvent(ServerNotify.s_switchCard, this.s_switchCardPush, this);
		EventManager.instance.addEvent(ServerNotify.s_curPlaySwitchCard, this.s_curPlaySwitchCardPush, this);
		EventManager.instance.addEvent(ServerNotify.s_handleOperateTask, this.s_handleOperateTaskPush, this);
		EventManager.instance.addEvent(ServerNotify.s_roundSettlement, this.s_roundSettlementPush, this);
		EventManager.instance.addEvent(ServerNotify.s_startSwitchCard, this.s_startSwitchCardPush, this);
		EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
		EventManager.instance.addEvent(ServerNotify.s_roomFinished, this.s_roomFinishedPush, this);
		EventManager.instance.addEvent(ServerNotify.s_startBet, this.s_startBetPush, this);
	}

	public onRemoved() {
		super.onRemoved();
		EventManager.instance.removeEvent(EventNotify.BDZ_CARD_TOUCH, this.bdzCardTouch, this);
		EventManager.instance.removeEvent(ServerNotify.s_curPlay, this.s_curPlayPush, this);
		EventManager.instance.removeEvent(ServerNotify.s_handleBetTask, this.s_handleBetTaskPush, this);
		EventManager.instance.removeEvent(ServerNotify.s_hangupTask, this.s_hangupTaskPush, this);
		EventManager.instance.removeEvent(ServerNotify.s_switchCard, this.s_switchCardPush, this);
		EventManager.instance.removeEvent(ServerNotify.s_curPlaySwitchCard, this.s_curPlaySwitchCardPush, this);
		EventManager.instance.removeEvent(ServerNotify.s_handleOperateTask, this.s_handleOperateTaskPush, this);
		EventManager.instance.removeEvent(ServerNotify.s_roundSettlement, this.s_roundSettlementPush, this);
		EventManager.instance.removeEvent(ServerNotify.s_startSwitchCard, this.s_startSwitchCardPush, this);
		EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
		EventManager.instance.removeEvent(ServerNotify.s_roomFinished, this.s_roomFinishedPush, this);
		EventManager.instance.removeEvent(ServerNotify.s_startBet, this.s_startBetPush, this);
	}

	private showPatternTip(playerIndex){
		let playerData = Global.roomProxy.getPlayerByIndex(playerIndex) as PlayerGameDataBean;
		let tipCards = playerData.tipCards || [];
		let mineCard = playerData.handCards.value;
		let roundPattern = playerData.roundPattern;
		let str = "";
		if(roundPattern == 4){
			let card = PokerUtils.number2Puker(mineCard[mineCard.length - 1]  % 100)
			str = `메이드 ${card} 탑`;
		}else {
			for(let i = 0; i < mineCard.length; i++){
				let card = mineCard[i];
				if(tipCards.indexOf(card) == -1){
					str += PokerUtils.number2Puker(card  % 100) + " ";
				}
			}
			if(roundPattern == 3){
				str += "베이스";
			}else if(roundPattern == 2){
				str += "투베이스";
			}
		}
		let button = this[`patternTip${this.directions[playerIndex]}`] as eui.Button;
		button.visible = true;
		button.labelDisplay.text = str;
	}

	private s_startBetPush(e: egret.Event) {
		// this.showChangeGroup(false)
	}

	private s_roomFinishedPush(e: egret.Event) {
		let data = e.data;
		let roomInfo = Global.roomProxy.roomInfo;
		roomInfo.roundStatus = ROUND_STATUS.CLOSE;
		this.status = ROUND_STATUS.CLOSE;
		// if (data.status == 2) {
		// 	Global.alertMediator.addAlert("牌局异常结束,请联系客服", () => {
		// 		game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_SANGONG_HALL);
		// 		game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SANGONG_GAME);
		// 	}, null, true);
		// }
	}


	private clearTabelInfo() {
		for (let i = 1; i <= 5; i++) {
			this[`playerYzLabel${i}`].text = "";
			this[`tipImage${i}`].source = "";
			this[`czTipImage${i}`].source = "";
		}
	}

	private s_startSwitchCardPush(e: egret.Event) {
		this.switchCardList = null;
		this.lockHuanpaiGroup(false);
		this.clearTabelInfo();
	}

	private status: number;
	private reconnectSuc(e: egret.Event) {
		//对局已经结束不做处理
		if (this.status == ROUND_STATUS.CLOSE) {
			game.NetReconnect.instance.hide();
			return;
		}
		let reqData = Global.roomProxy.lastGameConfig;
		if (!reqData) reqData = {};
		if (!Global.roomProxy.roomInfo || !Global.roomProxy.roomInfo.roomId) {
			game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_HALL);
			game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_GAME);
			return;
		}
		reqData.roomId = Global.roomProxy.roomInfo.roomId;
		Global.playerProxy.updatePlayerInfo(async () => {
			if (this.status == ROUND_STATUS.CLOSE) {
				// game.NetReconnect.instance.hide();
				return;
			}
			let handler = ServerPostPath.hall_sceneHandler_c_enter;
			reqData['isContinue'] = false;
			let resp: any = await game.PomeloManager.instance.request(handler, reqData);
			if (!resp) {
				return;
			}
			if (!resp.error) {
				resp.error = {};
				resp.error.code = 0;
			}
			//游戏房间已经解散
			if (resp.error.code == -213) {
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_HALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_GAME);
				let text = GameConfig.GAME_CONFIG['long_config']['10006'].content || "对局已结束";
				Global.alertMediator.addAlert(text);
				//弹出提示
			} else if (resp.error.code == 0) {
				Global.roomProxy.clearRoomInfo();
				Global.roomProxy.setRoomInfo(resp);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_GAME);
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_GAME);
			}
		})
	}
	/**
	 * gameStatus: 3
	 * playerIndex: 1
	 * task: 1
	 * 弃牌或者过
	 */
	private s_handleOperateTaskPush(e: egret.Event) {
		let data = e.data;
		let playerIndex = data.playerIndex;
		let playerData = Global.roomProxy.getPlayerByIndex(playerIndex);
		playerData.gameStatus = data.gameStatus;
		playerData.task = data.task;
		if (data.task == 1) {
			//弃牌
			let shoupai = this[`shoupai${this.directions[playerIndex]}`] as BDZShoupai;
			shoupai.showQipaiAni(true);
			if (Global.roomProxy.checkIndexIsMe(playerIndex)) {
				this.restartBtn.visible = true;
				this.patternTip1.visible = false;
			}
		}
		let yzLabel = this[`playerYzLabel${this.directions[playerIndex]}`] as eui.Label;
		yzLabel.text = "";
		playerData.taskInfo = this.defaultTaskInfo;
		if (Global.roomProxy.checkIndexIsMe(playerIndex)) {
			this.renderButtonGroup();
		}
		this.showPlayerTask(playerIndex, data.task, true);
	}


	private realeaseAllin() {
		while (this.allInAnis.length > 0) {
			let ani = this.allInAnis.pop();
			ani.stop();
			ani.realease();
		}
	}

	/**
	 * 游戏结算
	 * @param  {egret.Event} e
	 */
	private s_roundSettlementPush(e: egret.Event) {
		this.clearTabelInfo();
		let roomInfo = Global.roomProxy.roomInfo;
		roomInfo.curPlay = 0;
		this.showCurPlay();
		this.realeaseAllin();
		let data = e.data;
		let showResultInfo = data.showResultInfo;
		let winGoldInfo = data.winGoldInfo;
		let allinBackInfo = data.allinBackInfo;
		//给玩家赋值牌
		let players = roomInfo.players;
		let indexes = [];
		for (let key in players) {
			if (showResultInfo[key]) {
				let player = players[key] as PlayerGameDataBean;
				player.handCards = showResultInfo[key].handCards;
				player.tipCards = showResultInfo[key].tipCards;
				player.roundPattern = showResultInfo[key].roundPattern || showResultInfo[key].pattern;
				indexes.push(key);
			}
		}
		//allin 返回一些
		for (let key in allinBackInfo) {
			let dir = this.directions[key];
			let header = this[`header${dir}`] as BDZHeader;
			header.updateGold(allinBackInfo[key].ownGold, false);
		}
		let startIndex = showResultInfo.turnStartIndex;
		let chaiIndex = indexes.indexOf(startIndex + "");
		let newIndexes = indexes.slice(chaiIndex, indexes.length).concat(indexes.slice(0, chaiIndex));
		// this.checkMineIsBDZ(Global.roomProxy.getMineIndex());
		//翻牌
		async.eachSeries(newIndexes, (playerIndex, callback) => {
			if (Global.roomProxy.checkIndexIsMe(playerIndex)) {
				callback()
				return;
			}
			let shoupai = this[`shoupai${this.directions[playerIndex]}`] as BDZShoupai;
			let player = Global.roomProxy.getPlayerByIndex(playerIndex) as PlayerGameDataBean;
			shoupai.showOtherFanpai(playerIndex);
			egret.setTimeout(() => {
				this.showPatternTip(playerIndex);
			}, this, 700);
			egret.setTimeout(callback, this, 300);
		}, () => {
			let keys = _.keys(winGoldInfo);
			for (let key in winGoldInfo) {
				this.showWinAni(key);
				let goldInfo = winGoldInfo[key];
				let gainGold = goldInfo.gainGold;
				let ownGold = goldInfo.ownGold;
				let dir = this.directions[key];
				let header = this[`header${dir}`] as BDZHeader;
				egret.setTimeout(() => {
					header.showLsLabel(gainGold);
					header.updateGold(ownGold, false);
				}, this, 1500);
			}
			//飞CM
			egret.setTimeout(() => {
				this.playerWin2CM(keys);
			}, this, 1500);

			egret.setTimeout(() => {
				this.restartBtn.visible = true;
			}, this, 2500)
		});
	}


	private playerWin2CM(keys: any[]) {
		let size = keys;
		let cms = [];
		let point = this.cmGroup.localToGlobal();

		for (let i = 0; i < this.cmGroup.numChildren; i++) {
			let cm = this.cmGroup.getChildAt(i) as BDZCMList;
			if (cm.cmList.length > 0) {
				cms.push(cm);
			}
		}
		let cmDatas = {};
		var result = [];
		let num = Math.floor(cms.length / size.length);
		for (var i = 0, len = cms.length; i < len; i += num) {
			result.push(cms.slice(i, i + num));
		}
		async.eachSeries(size, (index, callback) => {
			let arrIndex = size.indexOf(index);
			let newGroup = new eui.Group();
			newGroup.width = this.cmGroup.width;
			newGroup.height = this.cmGroup.height;
			newGroup.x = point.x;
			newGroup.y = point.y;
			let dir = this.directions[index];
			this.touchGroup.addChild(newGroup);
			for (let i = 0; i < result[arrIndex].length; i++) {
				let cm = result[arrIndex][i];
				newGroup.addChild(cm);
			}
			this.coin2Component(newGroup, this[`header${dir}`]);
			egret.setTimeout(() => {
				callback();
			}, this, 300);
		}, () => {

		})
	}


	/**
	 * 金币从group飞回来
	 */
	private coin2Component(newGroup, component) {
		let point = component.localToGlobal();
		egret.setTimeout(() => {
			egret.Tween.get(newGroup).to({
				alpha: 0
			}, 400);
		}, this, 400)

		egret.Tween.get(newGroup).to({
			x: point.x - component.width / 2,
			y: point.y
		}, 800, egret.Ease.sineOut).call(() => {
			game.UIUtils.removeSelf(newGroup);
		});
	}


	private allInAnis: DBComponent[] = [];
	private showAllIn(playerIndex) {
		let dir = this.directions[playerIndex];
		let group = this[`playerGroup${dir}`] as eui.Group;
		let dbComponent = GameCacheManager.instance.getCache(`${dir}_bdz_allin_ani`, null) as DBComponent;
		if (!dbComponent) {
			dbComponent = new DBComponent("all_in");
			dbComponent.touchEnabled = false;
			group.addChild(dbComponent);
			dbComponent.resetPosition();
		}
		switch (dir) {
			case "1":
				dbComponent.x = group.width / 2 - 20 + 5;
				dbComponent.y = group.height / 2 + 50 + 5;
				break;
			case "2":
			case "3":
				dbComponent.x = group.width / 2 - 15;
				dbComponent.y = group.height / 2 + 40;
				break;
			case "4":
			case "5":
				dbComponent.x = group.width / 2 + 20 - 7;
				dbComponent.y = group.height / 2 + 40;
				break;
		}
		dbComponent.playNamesAndLoop(["appear", "loop"]);
		this.allInAnis.push(dbComponent);
	}

	private showWinAni(playerIndex) {
		let dir = this.directions[playerIndex];
		let group = this[`playerGroup${dir}`] as eui.Group;
		let dbComponent = GameCacheManager.instance.getCache(`${dir}_bdz_win_ani`, null) as DBComponent;
		if (!dbComponent) {
			dbComponent = new DBComponent("win");
			dbComponent.touchEnabled = false;
			group.addChild(dbComponent);
			dbComponent.resetPosition();
		}
		switch (dir) {
			case "1":
				dbComponent.x = group.width / 2 - 20 + 3;
				dbComponent.y = group.height / 2 + 73;
				break;
			case "2":
			case "3":
				dbComponent.x = group.width / 2 - 20 + 1;
				dbComponent.y = group.height / 2 + 44;
				break;
			case "4":
			case "5":
				dbComponent.x = group.width / 2 + 20;
				dbComponent.y = group.height / 2 + 44;
				break;
		}
		dbComponent.playNamesAndLoop(['start', 'loop']);
	}



	private showBDZAni(playerIndex) {
		let dir = this.directions[playerIndex];
		let group = this[`playerGroup${dir}`] as eui.Group;
		let dbComponent = GameCacheManager.instance.getCache(`${dir}_bdz_win_ani`, null) as DBComponent;
		if (!dbComponent) {
			dbComponent = new DBComponent("notice");
			dbComponent.touchEnabled = false;
			group.addChild(dbComponent);
			dbComponent.resetPosition();
		}
		switch (dir) {
			case "1":
				dbComponent.x = group.width / 2 - 20 + 3;
				dbComponent.y = group.height / 2
				break;
			case "2":
			case "3":
				dbComponent.x = group.width / 2 - 20 + 1;
				dbComponent.y = group.height / 2
				break;
			case "4":
			case "5":
				dbComponent.x = group.width / 2 + 20;
				dbComponent.y = group.height / 2
				break;
		}

		dbComponent.play("default", 1);
	}


	private lockHuanpaiGroup(isLock: boolean) {
		this.changeGroup.touchEnabled = !isLock;
		this.changeGroup.touchChildren = !isLock;
		this.shoupai1.addTouchEvent(!isLock);
		let status = isLock ? "disabled" : "up";
		this.changeBtn.currentState = this.noChangeBtn.currentState = status;
	}


	private s_curPlaySwitchCardPush(e: egret.Event) {
		let data = e.data;
		let playerIndex = data.playerIndex;
		if (Global.roomProxy.checkIndexIsMe(playerIndex)) {
			if (this.switchCardList) {
				egret.setTimeout(() => {
					this.sendSwitchCardsReq();
				}, this, 500);
			}
		}

	}

	public s_hangupTaskPush(e: egret.Event) {
		let data = e.data;
		let mineData = Global.roomProxy.getMineData();
		mineData.taskInfo = data;
		this.renderButtonGroup();
	}

	/**
	 * 玩家换牌
	 */
	private s_switchCardPush(e: egret.Event) {
		let data = e.data;
		let playerIndex = data.playerIndex;
		let num = data.num;
		let playerData = Global.roomProxy.getPlayerByIndex(playerIndex);
		if (!playerData.switchCardNum) {
			playerData.switchCardNum = [];
		}
		playerData.switchCardNum.push(num);
		let shoupai = this[`shoupai${this.directions[playerIndex]}`] as BDZShoupai;
		shoupai.showHuanpaiCount(playerData.switchCardNum);
		if ((Global.roomProxy.checkIndexIsMe(playerIndex))) {
			this.lockHuanpaiGroup(true);
			this.shoupai1.cardsAllDown();
			this.syncShouapi();
			// this.showPatternTip(Global.roomProxy.getMineIndex());
		} else {
			this.otherPlayerHuanpai(this.directions[playerIndex], num);
		}
	}

	/**
	 * 玩家下注
	 * @param  {egret.Event} e
	 */
	private s_handleBetTaskPush(e: egret.Event) {
		let data = e.data;
		let addBet = data.addBet;
		let playerIndex = data.playerIndex;
		let roomInfo = Global.roomProxy.roomInfo;
		roomInfo.totalBet = data.roomTotalBet;
		let player = Global.roomProxy.getPlayerByIndex(playerIndex) as PlayerGameDataBean;
		player.taskInfo = null;
		if (Global.roomProxy.checkIndexIsMe(playerIndex)) {
			this.renderButtonGroup();
		}
		let beforeAllIn = player.isAllIn;
		if (!player.isAllIn && data.isAllIn) {
			this.showAllIn(playerIndex);
		}
		player.isAllIn = data.isAllIn;
		player.gold = data.ownGold;
		player.playerBet = data.playerTotalBet;
		if (addBet > 0) {
			this.playerYZ(playerIndex, addBet);
		}
		this.updatePotScore();
		// this.showPot();
		//头像扣钱
		let header = this["header" + this.directions[playerIndex]] as BDZHeader;
		header.updateGold(player.gold, false);
		//展现本轮次押注
		player.gameStatus = data.gameStatus;
		player.task = data.task;
		if (player.task != 0) {
			let yzLabel = this[`playerYzLabel${this.directions[playerIndex]}`] as eui.Label;
			if (addBet == 0) {
				yzLabel.text = "";
			} else {
				yzLabel.text = NumberFormat.fNumberBDZStr2(addBet);
			}
		}


		this.showPlayerTask(playerIndex, data.task, true);
	}

	/**
	 * 玩家押注的提示
	 * @param  {} playerIndex
	 * @param  {} gameStatus
	 * @param  {} needAni
	 */
	private showPlayerTask(playerIndex, task, needAni) {
		let str = TASK_STATUS_STR[task];
		let dir = this.directions[playerIndex];
		let czTipsImage = this[`czTipImage${dir}`] as eui.Image;
		czTipsImage.source = RES.getRes(`bdz_${str}_3_png`);
		if (needAni) {
			let tipsImage = this[`tipImage${dir}`] as eui.Image;
			if (dir == "4" || dir == "5") {
				tipsImage.source = RES.getRes(`bdz_${str}_1_png`);
			} else {
				tipsImage.source = RES.getRes(`bdz_${str}_2_png`);
			}
			tipsImage.visible = true;
			tipsImage.alpha = 1;
			egret.Tween.get(tipsImage).to({
				alpha: 1
			}, 400).wait(400).call(() => {
				czTipsImage.visible = true;
			}).to({
				alpha: 0
			}, 400).call(() => {
				tipsImage.visible = false;
			});
		} else {
			czTipsImage.visible = true;
		}
	}

	private s_curPlayPush(e: egret.Event) {
		let data = e.data;
		let roomInfo = Global.roomProxy.roomInfo;
		let lastGameTurn = roomInfo.curGameTurn;
		let nowGameTurn = data.curGameTurn;
		if (lastGameTurn != nowGameTurn) {
			roomInfo.curGameTurn = nowGameTurn;
			this.changeGameTurn();
		}
		let lastRoundStatus = roomInfo.roundStatus;
		let nowRoundStatus = data.roundStatus;
		if (lastRoundStatus != nowRoundStatus) {
			roomInfo.roundStatus = nowRoundStatus;
			this.changeRoundStatus();
		}
		roomInfo.curPlay = data.curPlay;
		this.showCurPlay();
	}

	/**
	 * 改变当前房间状态 button显示规则
	 */
	private changeRoundStatus() {
		let nowRoundStatus = Global.roomProxy.roomInfo.roundStatus;
		let mineData = Global.roomProxy.getMineData();
		if (mineData.gameStatus == PLAYER_STATUS.ABANDON) {
			return;
		}
		if (nowRoundStatus == ROUND_STATUS.BETTING) {
			this.showButtonGroup(true);
			this.showChangeGroup(false);
		} else if (nowRoundStatus == ROUND_STATUS.SWITCH_CARD) {
			this.showButtonGroup(false);
			this.showChangeGroup(true);
		}
	}

	private defaultTaskInfo;
	private renderButtonGroup() {
		let mineData = Global.roomProxy.getMineData();
		let taskInfo = mineData.taskInfo;
		if (!taskInfo) {
			taskInfo = this.defaultTaskInfo;
		}
		for (let key in taskInfo) {
			let button = this.buttonGroup.getChildByName(`btn${key}`) as eui.Button;
			this.setButtonGray(button, taskInfo[key].opt == 0);
			if (taskInfo[key].score) {
				button.labelDisplay.text = NumberFormat.fNumberBDZStr2(taskInfo[key].score);
			} else {
				button.labelDisplay.text = "";
			}
		}
		let passShow = false;
		if (taskInfo[7] && taskInfo[7].opt == 1) {
			passShow = true;
		}
		this.btnpass.visible = passShow;
		this.btngz.visible = !passShow;
	}

	private setButtonGray(button: eui.Button, isGray: boolean) {
		if (isGray) {
			button.touchEnabled = false;
			button.currentState = "disabled";
		} else {
			button.touchEnabled = true;
			button.currentState = "up";
		}
	}


	private createDBs() {
		this.timeComponent = new DBComponent("time");
		this.dateGroup.addChild(this.timeComponent);
		this.timeComponent.callback = () => {
			let roomInfo = Global.roomProxy.roomInfo;
			let gameTurn = roomInfo.curGameTurn;
			this.timeComponent.visible = false;
			this.nightImage.visible = true;
		}
	}
	/**
	 * 改变早中晚
	 */
	private nightImage: eui.Image;
	private dateGroup: eui.Group;
	private roundImg1: eui.Image;
	private changeGameTurn(needAni: boolean = true) {
		if (!this.nightImage) {
			this.nightImage = new eui.Image();
			this.dateGroup.addChild(this.nightImage);
		}
		let roomInfo = Global.roomProxy.roomInfo;
		let gameTurn = roomInfo.curGameTurn;
		if (gameTurn < 1) {
			return;
		}
		let point = this[`roundImg${gameTurn}`];
		this.nightImage.source = RES.getRes(`bdz_round_${gameTurn}_2_png`);
		this.nightImage.x = point.x;
		if (needAni) {
			this.timeComponent.visible = true
			this.timeComponent.x = point.x + 24;
			this.timeComponent.y = point.y + 25;
			this.nightImage.y = point.y;
			this.nightImage.visible = false;
			this.timeComponent.play(gameTurn + "", 1);
		} else {
			this.nightImage.y = point.y
		}

		if (needAni) {
			let mineData = Global.roomProxy.getMineData() as PlayerGameDataBean;
			if (mineData.gameStatus == PLAYER_STATUS.ABANDON) {
				return;
			}
			this.showButtonGroup(false);
			this.showChangeGroup(true);
		}

	}

	private bdzCardTouch(e: egret.Event) {
		let data = e.data;
		this.cardTouch(Number(data));
		this.syncChangeButton();
	}


	private dealerBtnHandle() {
		let isDealer = Global.roomProxy.isDealer(Global.roomProxy.getMineIndex());
		this.btnpass.visible = isDealer;
		this.btngz.visible = !isDealer;
	}




	public createChildren() {
		super.createChildren();
		this.createDBs();
		this.defaultTaskInfo = {
			1: { opt: 0, score: 0 },
			2: { opt: 0, score: 0 },
			3: { opt: 0, score: 0 },
			4: { opt: 0, score: 0 },
			5: { opt: 0, score: 0 },
			6: { opt: 0, score: 0 },
			7: { opt: 0, score: 0 }
		}
		this.buttonGroup.bottom = -95;
		this.changeGroup.bottom = -95;
		this.aniTotalBet = Global.roomProxy.roomInfo.totalBet;
		this.hideAll();
		this.dealerBtnHandle();
		// this.showButtonGroup(true);
		this.showRoomInfo();
		this.renderButtonGroup();
		// this.showChangeGroup(true);
	}


	private showRoomInfo() {
		let roomInfo = Global.roomProxy.roomInfo;
		this.directions = game.Utils.getDirectionByMine(Global.roomProxy.getMineIndex(), 5);
		let players = roomInfo.players;
		this.showHeaders(players);
		if (!Global.roomProxy.reconnect) {
			this.showFapai();
		} else {
			this.showPaiByReconnect();
			this.shoupai1.addTouchEvent(true);
			this.showRoomByStep();
			this.showPatternTip(Global.roomProxy.getMineIndex());
			let mineDATA = Global.roomProxy.getMineData() as PlayerGameDataBean;
			if (mineDATA.gameStatus == PLAYER_STATUS.ABANDON) {
				this.patternTip1.visible = false;
				this.restartBtn.visible = true;
			}
		}
		let gameTurn = roomInfo.curGameTurn;
		this.showPot();
		this.showCms(false);
		this.changeGameTurn(false);
	}

	/**
	 * 当前玩家
	 */
	private showCurPlay() {
		let players = Global.roomProxy.roomInfo.players;
		let curPlay = Global.roomProxy.roomInfo.curPlay;
		for (let key in players) {
			let dir = this.directions[key];
			let shoupai = this[`shoupai${dir}`] as BDZShoupai;
			shoupai.showKuangAni(game.Utils.valueEqual(key, curPlay));
		}
	}


	private showHeaders(players) {
		for (let key in players) {
			let player = players[key] as PlayerGameDataBean;
			let dir = this.directions[key];
			let header = this[`header${dir}`] as BDZHeader;
			header.initWithData(players[key]);
			header.showBoss(Global.roomProxy.isDealer(key));
			header.visible = true;
			this[`playerGroup${dir}`].visible = true;

			let shoupais = this[`shoupai${dir}`] as BDZShoupai;
			shoupais.showHuanpaiCount(player.switchCardNum);
		}
	}


	private hideAll() {
		for (let i = 1; i <= 5; i++) {
			let shoupai = this[`shoupai${i}`] as BDZShoupai;
			shoupai.hideAllShoupai();
			this[`tipImage${i}`].visible = false;
			this[`playerGroup${i}`].visible = false;
			this[`header${i}`].visible = false;
			this[`czTipImage${i}`].visible = false;

		}
	}


	private showPaiByReconnect() {
		let roomInfo = Global.roomProxy.roomInfo;
		let players = roomInfo.players;
		for (let key in players) {
			let player = players[key] as PlayerGameDataBean;
			let dir = this.directions[key];
			let shoupai = this[`shoupai${dir}`] as BDZShoupai;
			if (Global.roomProxy.checkIndexIsMe(key)) {
				shoupai.showShoupaiRecCard(player.handCards.value);
			} else {
				shoupai.showShoupaiRecLength(player.handCardsNum);
			}
			if (player.gameStatus == PLAYER_STATUS.ABANDON) {
				shoupai.showQipaiAni(false);
			} else {
				if (player.isAllIn) {
					this.showAllIn(key);
				}

			}
		}
	}


	private showRoomByStep() {
		let roomInfo = Global.roomProxy.roomInfo;
		switch (roomInfo.roundStatus) {
			case ROUND_STATUS.BETTING:
				this.showBettingStatus(roomInfo);
				break;
			case ROUND_STATUS.SWITCH_CARD:
				this.showSwitchCardStatus(roomInfo);
				break;
		}
	}

	/**
	 * 回显当前状态
	 * @param  {BaseRoomInfo} roomInfo
	 */
	private showSwitchCardStatus(roomInfo: BaseRoomInfo) {
		let mineData = Global.roomProxy.getMineData() as PlayerGameDataBean;
		this.showCurPlay();
		if (mineData.gameStatus == PLAYER_STATUS.ABANDON) {
			this.showButtonGroup(true, false);
			return;
		}

		if (mineData.switchCardNum.length == roomInfo.curGameTurn) {
			//我换了牌
			this.lockHuanpaiGroup(true);
		} else {
			this.lockHuanpaiGroup(false);
		}
		this.showChangeGroup(true, false);


	}

	/**
	 * 玩家下注状态回显
	 */
	private showBettingStatus(roomInfo: BaseRoomInfo) {
		this.showCurPlay();
		this.showButtonGroup(true, false);
		let players = roomInfo.players;
		for (let key in players) {
			let player = players[key] as PlayerGameDataBean;
			this.showPlayerTask(key, player.task, false);
		}
	}


	private showFapai() {
		let roomInfo = Global.roomProxy.roomInfo;
		let playerKeys = _.keys(roomInfo.players);
		let playerCount = playerKeys.length;
		for (let i = 1; i <= playerCount * 4; i++) {
			let poker = ObjectPool.produce("dbz_poker", BDZPoker);
			if (!poker) {
				poker = new BDZPoker();
			}
			this.effectGroup.addChild(poker);
			game.UIUtils.setAnchorPot(poker);
			poker.x = GameConfig.CURRENT_WIDTH / 2 //- poker.width / 2;
			poker.y = -poker.anchorOffsetY;
			// poker.visible = false;
			// poker.rotation = 40;
			this.pokerList.push(poker);
		}
		// return;
		let index = 0;
		async.eachSeries(this.pokerList, (poker: BDZPoker, callback) => {
			this.touchGroup.addChild(poker);
			poker.visible = true;
			let toIndex = Number(playerKeys[index]);
			let shoupais = this[`shoupai${toIndex}`] as BDZShoupai;
			let endP = shoupais.getGlobalIndex();
			let endPX = endP.x + poker.width * poker.scaleX / 2;
			let endYX = endP.y + poker.height * poker.scaleX / 2;
			let scale = 1;
			if (toIndex != 1) {
				scale = 0.72;
				endPX = endP.x + poker.width * 0.72 / 2;
				endYX = endP.y + poker.height * 0.72 / 2;

			}
			if (toIndex == 4 || toIndex == 5) {
				poker.x -= poker.width / 2;
			} else {
				poker.x += poker.width / 2;
			}

			let currentIndex = shoupais.moveIndex;
			shoupais.moveIndex++;
			index++;
			if (index > playerKeys.length - 1) {
				index = 0;
			}
			poker.rotation = -180;
			egret.Tween.get(poker).to({
				rotation: 0,
				scaleX: scale,
				scaleY: scale,
				x: endPX,
				y: endYX
			}, 200, egret.Ease.circOut).call(() => {
				if (toIndex == 1) {
					shoupais.showShoupaiByAni(currentIndex, null);
				} else {
					shoupais.showShoupai(currentIndex);
				}
				ObjectPool.reclaim("dbz_poker", poker);
				game.UIUtils.removeSelf(poker);
			});
			egret.setTimeout(() => {
				callback();
			}, this, 70);
		}, () => {
			this.showButtonGroup(false);
			egret.setTimeout(() => {
				this.showButtonGroup(true);
				this.shoupai1.addTouchEvent(true);
				//自动提示一下
				this.shoupai1.autoTipsCards();
				this.checkMineIsBDZ(Global.roomProxy.getMineIndex());
				this.showPatternTip(Global.roomProxy.getMineIndex());
			}, this, 300);
		});
	}

	/**
	 * 判断百得之动画
	 * @param  {} playerIndex
	 */
	private checkMineIsBDZ(playerIndex) {
		let player = Global.roomProxy.getPlayerByIndex(playerIndex) as PlayerGameDataBean;
		let pattern = player.roundPattern;
		if (pattern == BDZ_PATTERN.BDZ) {
			this.showBDZAni(playerIndex)
		}
	}



	private btnqp: eui.Button;
	private btn1bd: eui.Button;
	private btngz: eui.Button;
	private btnper25: eui.Button;
	private btnper50: eui.Button;
	private btn2bd: eui.Button;
	private btnpass: eui.Button;
	public onTouchTap(e: egret.TouchEvent) {
		switch (e.target) {
			case this.selectBtn1:
				this.cardTouch(1);
				break;
			case this.selectBtn2:
				this.cardTouch(2);
				break;
			case this.selectBtn3:
				this.cardTouch(3);
				break;
			case this.selectBtn4:
				this.cardTouch(4);
				break;
			case this.noChangeBtn:
				this.noChangeBtnTouch();
				break;
			case this.changeBtn:
				this.changeBtnTouch();
				break;
			case this.btnqp:
				this.sendPlayerChoose(1);
				break;
			case this.btn2bd:
				this.sendPlayerChoose(2);
				break;
			case this.btn1bd:
				this.sendPlayerChoose(3);
				break;
			case this.btngz:
				this.sendPlayerChoose(4);
				break;
			case this.btnper25:
				this.sendPlayerChoose(5);
				break;
			case this.btnper50:
				this.sendPlayerChoose(6);
				break;
			case this.btnpass:
				this.sendPlayerChoose(7);
				break;
			case this.backBtn:
				this.backBtnTouch();
				break;
			case this.restartBtn:
				this.restartBtnTouch();
				break;
		}
	}

	private async restartBtnTouch() {
		this.restartBtn.visible = false;
		delete Global.roomProxy.lastGameConfig['roomId'];
		let quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
		if (quitResp.gold) {
			Global.playerProxy.playerData.gold = quitResp.gold;
		}
		if (quitResp) {
			if (quitResp.error) {
				let text = GameConfig.GAME_CONFIG['long_config']['10002'].content;
				this.restartBtn.visible = true;
				Global.alertMediator.addAlert(text, () => {
				}, null, true);
				return;
			}
			let data = Global.roomProxy.lastGameConfig;
			let quitResp1: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_enter, data)
			if (quitResp1) {
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_GAME);
				Global.roomProxy.clearRoomInfo();
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_MATCHING, data);
			} else {
				this.restartBtn.visible = true;
				Global.alertMediator.addAlert("换桌失败，请重新换桌!");
			}
		} else {
			this.restartBtn.visible = true;
			Global.alertMediator.addAlert("换桌失败，请重新换桌!");
		}
	}

	private async sendPlayerChoose(task) {
		let mineData = Global.roomProxy.getMineData();
		let curTask = mineData.taskInfo
		mineData.taskInfo = this.defaultTaskInfo;
		this.renderButtonGroup();
		let resp: any = await Global.pomelo.request(ServerPostPath.game_bdzHandler_c_submitOperateTask, { type: task });
		if (resp.error && resp.error != 0) {

		}
	}


	private async backBtnTouch() {
		// this.showBDZAni(1);
		// return;
		var quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
		if (quitResp) {
			if (quitResp.error && quitResp.error.code != 0) {
				let text = GameConfig.GAME_CONFIG['long_config']['10002'].content
				Global.alertMediator.addAlert(text, () => {
				}, null, true);
				return;
			}
			Global.roomProxy.clearRoomInfo();
			if (quitResp.gold) {
				Global.playerProxy.playerData.gold = quitResp.gold;
			}
			game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BDZ_GAME);
			game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_HALL);
			return;
		}

		let text = GameConfig.GAME_CONFIG['long_config']['10002'].content
		Global.alertMediator.addAlert(text, () => {

		}, null, true);
	}

	/**
	 * 点击哪几个按钮
	 */
	private cardTouch(index) {
		let selected = this.shoupai1.selectUpByIndex(index);
		let button = this[`selectBtn${index}`] as eui.Button;
		button.currentState = selected ? "down" : "up";
		this.syncChangeButton();
	}

	private showChangeGroup(isShow, needAni = true) {
		this.changeGroup.visible = true;
		let bottom = isShow ? 0 : - this.changeGroup.height
		if (needAni) {
			egret.Tween.get(this.changeGroup).to({
				bottom: bottom
			}, 300).call(() => {
				this.changeGroup.visible = isShow;
			});
		} else {
			this.changeGroup.bottom = bottom;
		}
		this.syncChangeButton();
		//同步选择状态
		this.syncShouapi();

	}


	private syncChangeButton() {
		let shoupais = this.shoupai1.pokerLists.concat(this.shoupai1.selectLists);
		let selected = false;
		for (let i = 0; i < shoupais.length; i++) {
			let poker = shoupais[i]
			if (poker.selected) {
				selected = true;
			}
		}
		this.changeBtn.currentState = selected ? "up" : "disabled";
	}

	private syncShouapi() {
		let shoupais = this.shoupai1.pokerLists.concat(this.shoupai1.selectLists);
		for (let i = 0; i < shoupais.length; i++) {
			let poker = shoupais[i] as BDZPoker;
			let button = this[`selectBtn${i + 1}`] as eui.Button;
			button.currentState = poker.selected ? "down" : "up";
		}
	}


	private showButtonGroup(isShow, needAni = true) {
		this.buttonGroup.visible = true;
		let bottom = isShow ? 0 : - this.buttonGroup.height
		if (needAni) {
			egret.Tween.get(this.buttonGroup).to({
				bottom: bottom
			}, 300).call(() => {
				this.buttonGroup.visible = isShow;
			});
		} else {
			this.buttonGroup.bottom = bottom;
		}

	}

	/**
	 * 其他玩家换牌
	 */
	private otherPlayerHuanpai(playerIndex, num) {
		let shoupais = this[`shoupai${playerIndex}`] as BDZShoupai;
		let cards = shoupais.getSelectCardsByOther(num);
		let movePoker = [];
		for (let i = 0; i < cards.length; i++) {
			let poker = cards[i];
			poker.visible = false;
			let outerPoker = ObjectPool.produce("dbz_poker", BDZPoker) as BDZPoker;
			if (!outerPoker) {
				outerPoker = new BDZPoker();
			}
			game.UIUtils.setAnchorPot(outerPoker);
			poker.name = "";
			let point = poker.localToGlobal();
			outerPoker.scaleX = outerPoker.scaleY = 1;
			outerPoker.x = point.x + outerPoker.anchorOffsetX;
			outerPoker.y = point.y + outerPoker.anchorOffsetY;
			this.touchGroup.addChild(outerPoker);
			movePoker.push(outerPoker);
		}
		//飞向牌堆
		async.eachSeries(movePoker, (outerPoker: BDZPoker, callback) => {
			let x = outerPoker.x;
			let y = outerPoker.y;
			egret.Tween.get(outerPoker).to({
				rotation: 0,
				scaleX: 1,
				scaleY: 1,
				x: GameConfig.CURRENT_WIDTH / 2,
				y: -outerPoker.width
			}, 100, egret.Ease.sineIn);
			egret.setTimeout(callback, this, 50);
		}, () => {
			shoupais.moveIndex = 4 - movePoker.length + 1;
			shoupais.hebingCards(false);
			egret.setTimeout(() => {
				this.back2Shoupai(playerIndex, movePoker, null);
			}, this, 400);
		});
	}

	private aniTotalBet: number;
	public updatePotScore() {
		let totalBet = Global.roomProxy.roomInfo.totalBet;
		egret.Tween.removeTweens(this);
		egret.Tween.get(this, { onChange: this.onChange, onChangeObj: this }).to({ aniTotalBet: totalBet }, 200, egret.Ease.bounceIn);
	}

	private onChange(): void {
		this.totalGoldLabel.text = NumberFormat.fNumberBDZStr2(this.aniTotalBet);
	}


	private chaifenGold(gold) {
		//元拆分
		let yuanGold = Math.floor(gold / KOREA_GOLD.YUAN);
		let jiaoGold = Math.floor((gold - yuanGold * KOREA_GOLD.YUAN) / KOREA_GOLD.JIAO);
		let fenGold = Math.floor(gold - (jiaoGold * KOREA_GOLD.JIAO) - (yuanGold * KOREA_GOLD.YUAN));

		// 3058
		let data = [];
		let yuanGoldStr = yuanGold + "";
		for (let i = 0; i < yuanGoldStr.length; i++) {
			let count = Number(yuanGoldStr[i]);
			if (count > 0) {
				let unit = Math.pow(10, yuanGoldStr.length - i - 1)
				data.push({ unit: unit, count: count, total: count * unit, type: "yuan" });
			}
		}

		let jiaoGoldStr = jiaoGold + "";
		for (let i = 0; i < jiaoGoldStr.length; i++) {
			let count = Number(jiaoGoldStr[i]);
			if (count > 0) {
				let unit = Math.pow(10, jiaoGoldStr.length - i - 1)
				data.push({ unit: unit, count: count, total: count * unit, type: "jiao" });
			}
		}
		let fenGoldStr = fenGold + "";
		for (let i = 0; i < fenGoldStr.length; i++) {
			let count = Number(fenGoldStr[i]);
			if (count > 0) {
				let unit = Math.pow(10, fenGoldStr.length - i - 1)
				data.push({ unit: unit, count: count, total: count * unit, type: "fen" });
			}
		}
		data = _.sortBy(data, (item) => {
			return item.count * -1;
		});
		return data;
	}

	private showCms(needAni: boolean = false) {
		let gold = Global.roomProxy.roomInfo.totalBet;
		// this.showPot(gold);
		let useGold = Math.floor(gold / KOREA_GOLD.QIAN_FEN) * KOREA_GOLD.QIAN_FEN;
		let rules = this.chaifenGold(useGold);
		for (let i = 1; i <= 9; i++) {
			let cmList = this[`cmList${i}`] as BDZCMList;
			cmList.visible = false;
			// 	cmList.showGolds(900, 100);
		}
		let length = rules.length;
		if (length > 9) {
			length = 9;
		}
		for (let i = 0; i < length; i++) {
			let cmList = this[`cmList${this.cmItemList[i]}`] as BDZCMList;
			cmList.visible = true;
			cmList.showGolds(rules[i]);
			if (needAni) {
				egret.Tween.removeTweens(cmList);
				cmList.alpha = 0.5;
				egret.Tween.get(cmList).to({
					alpha: 1
				}, 200, egret.Ease.backInOut);
			}
		}
	}

	private totalGoldLabel: eui.Label;
	private showPot() {
		let gold = Global.roomProxy.roomInfo.totalBet;
		if (!gold || gold == 0) {
			this.totalGoldLabel.text = "0";
			return
		}
		let yuanGold = Math.floor(gold / KOREA_GOLD.YUAN);
		let jiaoGold = Math.floor((gold - yuanGold * KOREA_GOLD.YUAN) / KOREA_GOLD.JIAO);
		let fenGold = Math.floor(gold - (jiaoGold * KOREA_GOLD.JIAO) - (yuanGold * KOREA_GOLD.YUAN));
		let str = "";
		if (yuanGold > 0) {
			str += yuanGold + "억";
		}
		if (jiaoGold > 0) {
			str += jiaoGold + "만";
		}
		if (fenGold > 0) {
			str += fenGold;
		}
		this.totalGoldLabel.text = str;
	}

	private cmGroup: eui.Group;
	private playerYZ(playerIndex, gold) {
		let data = this.chaifenGold(gold);
		let cmPoint = this[`cmPoint${this.directions[playerIndex]}`] as eui.Component;
		for (let i = 0; i < data.length; i++) {
			let item = data[i];
			let count = item.count;
			let cm = ObjectPool.produce("bdz_move_cm", BDZCM) as BDZCM;
			if (!cm) {
				cm = new BDZCM();
				cm.scaleX = cm.scaleY = 0.7;
			}
			cm.alpha = 1;
			cm.changeGold(item.unit);
			cm.changeColor(item.type);
			this.effectGroup.addChild(cm);
			cm.x = cmPoint.localToGlobal().x - 30;
			cm.y = cmPoint.localToGlobal().y - 30;
			egret.setTimeout(() => {
				egret.Tween.get(cm).to({
					alpha: 0
				}, 100);
			}, this, 300);
			egret.Tween.get(cm).to({
				x: this.cmGroup.localToGlobal().x + this.cmGroup.width / 2 + _.random(-50, 0),
				y: this.cmGroup.localToGlobal().y + this.cmGroup.height / 2 + _.random(-80, 0),
			}, 400).call(() => {
				game.UIUtils.removeSelf(cm);
				ObjectPool.reclaim("bdz_move_cm", cm);
			});
		}
		egret.setTimeout(() => {
			this.showCms();
		}, this, 400);
	}

	/**
	 * 我的牌飞回来
	 */
	private back2Shoupai(index, movePoker, backValues) {
		let shoupais = this[`shoupai${index}`] as BDZShoupai;
		async.eachSeries(movePoker, (poker: BDZPoker, callback) => {
			let endP = shoupais.getGlobalIndex();
			let endPX = endP.x + poker.width * poker.scaleX / 2;
			let endYX = endP.y + poker.height * poker.scaleX / 2;
			let scale = 1;
			if (index != 1) {
				scale = 0.72;
				endPX = endP.x + poker.width * 0.72 / 2;
				endYX = endP.y + poker.height * 0.72 / 2;
			}
			if (index == 4 || index == 5) {
				poker.x -= poker.width / 2;
			} else {
				poker.x += poker.width / 2;
			}
			let currentIndex = shoupais.moveIndex;
			shoupais.moveIndex++;
			poker.rotation = -180;
			egret.Tween.get(poker).to({
				rotation: 0,
				scaleX: scale,
				scaleY: scale,
				x: endPX,
				y: endYX
			}, 250, egret.Ease.circOut).call(() => {
				if (index == 1) {
					let movePokerIndex = movePoker.indexOf(poker);
					shoupais.showShoupaiByAni(currentIndex, backValues[movePokerIndex]);
				} else {
					shoupais.showShoupai(currentIndex);
				}
				ObjectPool.reclaim("dbz_poker", poker);
				game.UIUtils.removeSelf(poker);
			});
			egret.setTimeout(() => {
				callback();
			}, this, 175);
		}, () => {
			egret.setTimeout(() => {
				if (index == 1) {
					shoupais.sortShoupaiByValue();
					this.showButtonGroup(true);
					this.showChangeGroup(false);
				}
			}, this, 500);
		});
	}


	private async sendSwitchCardsReq() {
		let num = [];
		let mineData = Global.roomProxy.getMineData() as PlayerGameDataBean;
		let values = mineData.handCards.value;
		for (let i = 0; i < this.switchCardList.length; i++) {
			let poker = this.switchCardList[i];
			num.push(values.indexOf(poker.number));
		}
		let resp: any = await Global.pomelo.request(ServerPostPath.game_bdzHandler_c_switchCard, { cardIndex: num });
		if (resp && resp.error) {

		} else {
			let movePoker = [];
			let beforePattern = mineData.roundPattern;
			let afterPattern = resp.roundPattern;
			mineData.roundPattern = resp.roundPattern;
			mineData.handCards = resp.handCards;
			let backCards = resp.switchCard || [];
			mineData.tipCards = resp.tipCards || [];
			for (let i = 0; i < this.switchCardList.length; i++) {
				let poker = this.switchCardList[i] as BDZPoker;
				poker.visible = false;
				poker.showZ2B();
				let outerPoker = ObjectPool.produce("dbz_poker", BDZPoker) as BDZPoker;
				if (!outerPoker) {
					outerPoker = new BDZPoker();
				}
				game.UIUtils.setAnchorPot(outerPoker);
				poker.name = "";
				let point = poker.localToGlobal();
				outerPoker.scaleX = outerPoker.scaleY = 1;
				outerPoker.x = point.x + outerPoker.anchorOffsetX;
				outerPoker.y = point.y + outerPoker.anchorOffsetY;
				this.touchGroup.addChild(outerPoker);
				movePoker.push(outerPoker);
			}
			this.switchCardList = null;
			//飞向牌堆
			async.eachSeries(movePoker, (outerPoker: BDZPoker, callback) => {
				let x = outerPoker.x;
				let y = outerPoker.y;
				egret.Tween.get(outerPoker).to({
					rotation: 0,
					scaleX: 1,
					scaleY: 1,
					x: GameConfig.CURRENT_WIDTH / 2,
					y: -outerPoker.anchorOffsetY
				}, 200, egret.Ease.sineIn);
				egret.setTimeout(callback, this, 50);
			}, () => {
				this.shoupai1.moveIndex = 4 - movePoker.length + 1;
				this.shoupai1.sortShoupaiByValue();
				this.shoupai1.hebingCards();
				egret.setTimeout(() => {
					this.back2Shoupai(1, movePoker, backCards);
					let roomInfo = Global.roomProxy.roomInfo;
					egret.setTimeout(() => {
						if (roomInfo.curGameTurn != 3) {
							this.shoupai1.autoTipsCards();
							this.shoupai1.addTouchEvent(true);
						}
						if (beforePattern != BDZ_PATTERN.BDZ && afterPattern == BDZ_PATTERN.BDZ) {
							this.showBDZAni(Global.roomProxy.getMineIndex());
						}
						this.showPatternTip(Global.roomProxy.getMineIndex());
					}, this, 1300);
				}, this, 400);

			});
		}
	}

	private lockSwitch: boolean = false;
	private changeBtnTouch() {
		let cards = this.shoupai1.getSelectCards();
		if (cards.length > 0) {
			this.switchCardList = cards;
			this.lockHuanpaiGroup(true);
			if (Global.roomProxy.curIndexIsMe()) {
				this.sendSwitchCardsReq();
			}
			this.syncShouapi();
		}
	}

	private noChangeBtnTouch() {
		this.switchCardList = [];
		this.lockHuanpaiGroup(true);
		if (Global.roomProxy.curIndexIsMe()) {
			this.sendSwitchCardsReq();
		}
		this.syncShouapi();
	}
}

const KOREA_GOLD = {
	YUAN: 10000 * 10000,
	JIAO: 10000,
	QIAN_FEN: 1000
}

const ROUND_STATUS = {
	WAITING: 1,   // 等待其它玩家准备
	NEW_CARD: 2,   // 发牌
	PLAYER_INIT_BET: 3,   // 初始化押注
	BETTING: 4,   // 下注
	SWITCH_CARD: 5,   // 换牌
	SETTLEMENT: 6, // 结算
	CLOSE: 100
};

const TASK_STATUS_STR = {
	"1": "qp",
	"2": "1bd",
	"3": "2bd",
	"4": "gz",
	"5": "per25",
	"6": "per50",
	"7": "pass"
}

const BDZ_PATTERN = {
	BDZ_SINGLE: 1, //单张
	BDZ_2: 2, //两张组合
	BDZ_3: 3, //三张组合
	BDZ: 4, //百得之
};

const PLAYER_STATUS = {
	// 等待
	WAIT: 1,
	// 游戏中
	PLAYING: 2,
	// 弃牌
	ABANDON: 3,
	// 跟
	GEN: 4,
	// 加
	ADD: 5,
	// 过牌
	PASS: 6,
};