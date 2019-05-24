/*
 * @Author: wangtao 
 * @Date: 2019-03-27 13:58:06 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 14:58:20
 * @Description: 
 */
module dntg {
	export class DNTGScene1 extends game.BaseScene {
		private scroller: DNTGScroller;
		private startBtn: eui.Button;
		private menuBtn: eui.Button;
		public mouseOn: DBComponent;
		public runGroup: eui.Group;
		public menuGroup: eui.Group;
		public settingBtn: eui.Button;
		public tipsBtn: eui.Button;
		public betAddBtn: eui.Button;
		public betSubBtn: eui.Button;
		public yazhu_ima: eui.Image;
		public autoRunBtn: eui.Button;
		public betTtipsGroup: eui.Group;
		public winnum: eui.Label;
		private numAccisiable: eui.Label;
		public totalBetLabel: eui.Label;
		public maxWinLabel: eui.Label;
		public beishu: eui.Label;
		public timesLabel: eui.BitmapLabel;
		public bonusRect: eui.Rect;
		public commomScore: eui.BitmapLabel = new eui.BitmapLabel();;
		public gameRecord: eui.Button;
		public back2HallBtn: eui.Button;
		public maskRect: eui.Rect;
		public resizeGroup: eui.Group;
		private startBtn0: eui.Button;
		public spinresult: eui.EditableText;
		public pscen1: eui.EditableText;
		private testGroup: eui.Group;

		private bet: number = 1; //用于计数bet
		public constructor() {
			super();
			this.skinName = new DNTGGameScene1Skin();
		}

		public onRemoved() {
			super.onRemoved();
			if (game.LaohuUtils.isAutoGame) {
				this.resetBtnColor();
				game.LaohuUtils.isAutoGame = false;
			}
			egret.clearTimeout(this.autoGameTimeOut);
			egret.clearTimeout(this.messageTimeOut);
			egret.clearTimeout(this.removeScoreTimeout);
			egret.clearTimeout(this.showIconTimeOut);
			// EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterGame, this);
			EventManager.instance.removeEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
			EventManager.instance.removeEvent(EventNotify.AUTO_GAME, this.startAutoGame, this);
			EventManager.instance.removeEvent(EventNotify.DNTG_ENTER_COMMON_GAME, this.free2Common, this);
			EventManager.instance.removeEvent(ServerNotify.s_kickGame, this.kickGame, this);
		}

		public eventResize() {
			super.eventResize();
			// this.scroller.y = GameConfig.CURRENT_HEIGHT / 2 - this.scroller.height / 2;
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
			EventManager.instance.addEvent(EventNotify.AUTO_GAME, this.startAutoGame, this);
			// EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterGame, this);
			EventManager.instance.addEvent(EventNotify.DNTG_ENTER_COMMON_GAME, this.free2Common, this);
			EventManager.instance.addEvent(ServerNotify.s_kickGame, this.kickGame, this);

		}

		public createChildren() {
			super.createChildren();
			var colorMatrix = [
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			this.startBtn.filters = [colorFlilter];
			this.startBtn.touchEnabled = false;
			this.setBtnColor();
			game.LaohuUtils.scoreguang = DBComponent.create("dntg_scoreguang", "dntg_bigwin_guang");
			game.LaohuUtils.titaleChangeAni = DBComponent.create("dntg_titaleChangeAni", "win_change");
			// game.LaohuUtils.scoreguang = new DBComponent("dntg_bigwin_guang");
			// game.LaohuUtils.titaleChangeAni = new DBComponent("win_change");
			this.startGame();
			this.scroller.showFirst(1);
			let isPC = NativeApi.instance.IsPC();
			//判断是否为pc端
			if (isPC) {
				mouse.enable(this.stage);
				this.addMouseOnEvent();
			}
			//进入游戏判断是否为测试账号
			if (Global.playerProxy.playerData.nickname == "test004" || Global.playerProxy.playerData.nickname == "test001" || Global.playerProxy.playerData.nickname == "test002" || Global.playerProxy.playerData.nickname == "test003" || Global.playerProxy.playerData.nickname == "test005" || Global.playerProxy.playerData.nickname == "test006" || Global.playerProxy.playerData.nickname == "test007" || Global.playerProxy.playerData.nickname == "test008" || Global.playerProxy.playerData.nickname == "test009" || Global.playerProxy.playerData.nickname == "test010") {
				if (ServerConfig.PATH_TYPE == PathTypeEnum.QA_TEST) {
					this.testGroup.visible = true;
				}
			}
			if (ServerConfig.OP_RETURN_TYPE == "3") {
				this.back2HallBtn.visible = false;
			}
			//添加按钮动画
			this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
			if (!this.mouseOn) {
				this.mouseOn = new DBComponent("onmouseon");
				GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
			}
			this.mouseOn.touchEnabled = false;
			this.mouseOn.touchChildren = false;
			this.mouseOn.play("onmouseon", 0);
			this.mouseOn.x = 76.5;
			this.mouseOn.y = 69;
			this.runGroup.addChild(this.mouseOn);
		}
		/**
		 * 鼠标悬浮事件
		 */
		public addMouseOnEvent() {
			this.menuBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeMenuBtn, this);
			this.menuBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeMenuBtn2, this);
			this.settingBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changesettingBtn, this);
			this.settingBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changesettingBtn2, this);
			this.tipsBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changetipsBtn, this);
			this.tipsBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changetipsBtn2, this);
			this.betAddBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeBetAddBtn, this);
			this.betAddBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeBetAddBtn2, this);
			this.betSubBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeBetSubBtn, this);
			this.betSubBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeBetSubBtn2, this);
			this.yazhu_ima.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeyazhuBtn, this);
			this.yazhu_ima.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeyazhuBtn2, this);
			this.autoRunBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeAutoRunBtn, this);
			this.autoRunBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeAutoRunBtn2, this);
			this.gameRecord.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeGameRecord, this);
			this.gameRecord.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeGameRecord2, this);
			this.back2HallBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeOutBtn, this);
			this.back2HallBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeOutBtn2, this);
		}
		private changeMenuBtn() {
			this.menuBtn.currentState = "down";
		}
		private changeMenuBtn2() {
			this.menuBtn.currentState = "up";
		}
		private changesettingBtn() {
			this.settingBtn.currentState = "down";
		}
		private changesettingBtn2() {
			this.settingBtn.currentState = "up";
		}
		private changetipsBtn() {
			this.tipsBtn.currentState = "down";
		}
		private changetipsBtn2() {
			this.tipsBtn.currentState = "up";
		}
		private changeBetAddBtn() {
			this.betAddBtn.currentState = "down";
			this.betTtipsGroup.visible = true;
		}
		private changeBetAddBtn2() {
			this.betAddBtn.currentState = "up";
			this.setAutoTimeout(() => { this.betTtipsGroup.visible = false; }, this, 5000)
		}
		private changeBetSubBtn() {
			this.betSubBtn.currentState = "down";
			this.betTtipsGroup.visible = true;
		}
		private changeBetSubBtn2() {
			this.betSubBtn.currentState = "up";
			this.setAutoTimeout(() => { this.betTtipsGroup.visible = false; }, this, 5000)
		}
		private changeyazhuBtn() {
			this.yazhu_ima.source = RES.getRes("dntg_scene1_bet2_png");
		}
		private changeyazhuBtn2() {
			this.yazhu_ima.source = RES.getRes("dntg_scene1_bet1_png");
		}
		private changeAutoRunBtn() {
			this.autoRunBtn.currentState = "down";
		}
		private changeAutoRunBtn2() {
			this.autoRunBtn.currentState = "up";
		}
		private changeGameRecord() {
			this.gameRecord.currentState = "down";
		}
		private changeGameRecord2() {
			this.gameRecord.currentState = "up";
		}

		private changeOutBtn() {
			this.back2HallBtn.currentState = "donw";
		}
		private changeOutBtn2() {
			this.back2HallBtn.currentState = "up";
		}
		/**
		 * @param  {egret.TouchEvent} e
		 * 点击事件
		 */
		public onTouchTap(e: egret.TouchEvent) {
			switch (e.target) {
				//开始游戏按钮
				case this.startBtn:
					this.startBtnTouch();
					break;
				//菜单按钮
				case this.menuBtn:
					SoundManager.getInstance().playEffect("button_dntg_mp3");
					if (this.menuGroup.visible == false)
					{ this.menuGroup.visible = true; } else {
						this.menuGroup.visible = false;
					}
					break;
				//设置按钮
				case this.settingBtn:
					SoundManager.getInstance().playEffect("button_dntg_mp3");
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING);
					this.menuGroup.visible = false;
					break;
				//tips窗口按钮
				case this.tipsBtn:
					SoundManager.getInstance().playEffect("button_dntg_mp3");
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_LAOHUGAME_TIPS);
					this.menuGroup.visible = false;
					break;
				//加注按钮
				case this.betAddBtn:
					SoundManager.getInstance().playEffect("button_dntg_mp3");
					this.addBet();
					break;
				//减注按钮
				case this.betSubBtn:
					SoundManager.getInstance().playEffect("button_dntg_mp3");
					this.reduceBet();
					break;
				//最大倍数按钮
				case this.yazhu_ima:
					SoundManager.getInstance().playEffect("button_dntg_mp3");
					this.maxBet();
					break;
				//自动游戏按钮
				case this.autoRunBtn:
					SoundManager.getInstance().playEffect("button_dntg_mp3");
					this.menuGroup.visible = false;
					this.openAutoGame();
					break;
				//游戏记录
				case this.gameRecord:
					SoundManager.getInstance().playEffect("button_dntg_mp3");
					this.openGameRecord();
					this.menuGroup.visible = false;
					break;
				//返回大厅
				case this.back2HallBtn:
					SoundManager.getInstance().playEffect("button_dntg_mp3");
					this.backtoHall();
					this.menuGroup.visible = false;
					break;
				//scroller快速停止
				case this.maskRect:
					this.scrollerFastGame();
					break;
				//测试按钮
				case this.startBtn0:
					this.startBtnTouch0();
					break;
			}
		}

		/**
		 * 超时未下注请出房间
		 */
		private kickGame() {
			let text = "你已超过5分钟局未下注,请重新进入游戏";
			Global.alertMediator.addAlert(text, () => {
				Global.playerProxy.playerData.gold = game.LaohuUtils.ToTalMoney;
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DNTG);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHUGAME_TIPS);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
			}, "", true);
			return;
		}


		private ownGold: number = 0; //玩家拥有的金钱

		//进入游戏发送c_enter请求
		public async startGame() {
			let data = { "gameId": Global.gameProxy.gameIds["slot"], "sceneId": 1001 }
			let resp: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_enter, data);
			if (resp.error.code != 0) {
				let text = resp.error.msg;
				Global.alertMediator.addAlert(text, () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DNTG);
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LAOHUJI_HALL);
				}, "", true);
				return;
			}
			SoundManager.getInstance().playMusic("background_mus_dntg_mp3");
		}
		//进入游戏接收处理
		/**
		 * @param  {egret.Event} e
		 */
		public enterGame(e: egret.Event) {
			let resp = e.data;

			for (let i = 0; i < resp.roomInfo.gamePayTable.bets.length; i++) {
				game.LaohuUtils.bets.push(resp.roomInfo.gamePayTable.bets[i]);
			}
			for (let j = 0; j < resp.roomInfo.gamePayTable.muls.length; j++) {
				game.LaohuUtils.muls.push(resp.roomInfo.gamePayTable.muls[j]);
			}
			//gamepayTable非空判断
			if (resp.roomInfo.gamePayTable) {
				game.LaohuUtils.FreeTimeMul = [];
				for (let k = 0; k < resp.roomInfo.gamePayTable.freeGameMuls.length; k++) {
					game.LaohuUtils.FreeTimeMul.push(resp.roomInfo.gamePayTable.freeGameMuls[k]);
				}
				game.LaohuUtils.FreeTimeMulIndex = resp.roomInfo.players.freeMulIndex;
				game.LaohuUtils.FreeTimeMul = game.LaohuUtils.FreeTimeMul[game.LaohuUtils.FreeTimeMulIndex];
				game.LaohuUtils.freeTimes = resp.roomInfo.players.freeTimes;
				this.ownGold = resp.roomInfo.players.gold;
			}

			this.numAccisiable.text = NumberFormat.handleFloatDecimal(resp.roomInfo.players.gold) + "";
			this.ownGold = resp.roomInfo.players.gold;
			var colorMatrix = [
				1, 0, 0, 0, 0,
				0, 1, 0, 0, 0,
				0, 0, 1, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			this.startBtn.filters = [colorFlilter];
			this.startBtn.touchEnabled = true;
			this.resetBtnColor();
			//本地存储玩家信息
			game.LaohuUtils.ToTalMoney = this.ownGold;
			game.LaohuUtils.bet = game.LaohuUtils.bets[0];
			game.LaohuUtils.mul = game.LaohuUtils.muls[0];
			//判断是否为免费游戏
			if (resp.roomInfo.players.isScatter == 1 && resp.roomInfo.players.freeTimes == 0) {
				game.LaohuUtils.bet = resp.roomInfo.players.lastBet;
				game.LaohuUtils.mul = resp.roomInfo.players.lastMul;
				EventManager.instance.dispatch(EventNotify.DNTG_ENTER_FREE_GAME);
			} else if (resp.roomInfo.players.isScatter == 0 && resp.roomInfo.players.freeTimes != 0) {
				game.LaohuUtils.freeWin = resp.roomInfo.players.freeWinGold;
				game.LaohuUtils.bet = resp.roomInfo.players.lastBet;
				game.LaohuUtils.mul = resp.roomInfo.players.lastMul;
				EventManager.instance.dispatch(EventNotify.DNTG_START_FREE_GAME);
			}
			switch ((game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) {
				case 0.5:
					this.bet = 1;
					break;
				case 1:
					this.bet = 2;
					break;
				case 2:
					this.bet = 3;
					break;
				case 5:
					this.bet = 4;
					break;
				case 10:
					this.bet = 5;
					break;
				case 15:
					this.bet = 6;
					break;
				case 30:
					this.bet = 7;
					break;
				case 50:
					this.bet = 8;
					break;
				case 70:
					this.bet = 9;
					break;
				case 100:
					this.bet = 10;
					break;
			}
			this.totalBetLabel.text = NumberFormat.handleFloatDecimal((game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) + "";
			this.beishu.text = parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 + "") + "";
			this.maxWinLabel.text = "最高可得: " + parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
		}


		public db_runguang: DBComponent; //点击开始特效
		public db_run: DBComponent; //点击开始特效
		// public winnerAtr: Array<Array<number>>; //
		//开始旋转
		public runningType: number = 3;
		public isTest: boolean = false;
		public spinTest: number = 0;
		/**
		 * 点击开始游戏按钮
		 */
		public async startBtnTouch() {
			if (this.runningType == RUNNING_TYPE.EMPTY) {
				this.menuGroup.visible = false;
				if (game.LaohuUtils.bet * game.LaohuUtils.mul * 50 > this.ownGold) {
					let text = "金币不足";
					Global.alertMediator.addAlert(text, () => {
						this.startBtn.currentState = "up";
						this.resetBtnColor();
						if (!this.mouseOn) {
							this.mouseOn = new DBComponent("onmouseon");
							GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
						}
						this.mouseOn.touchEnabled = false;
						this.mouseOn.touchChildren = false;
						this.mouseOn.play("onmouseon", 0);
						this.mouseOn.x = 76.5;
						this.mouseOn.y = 69;
						this.runGroup.addChild(this.mouseOn);
					}, "", true);
					return;
				}
				this.isTest = false;
				this.spinTest = 0;
				this.setBtnColor();
				SoundManager.getInstance().playEffect("reel_dntg_mp3");
				//自动游戏条件判断
				if (game.LaohuUtils.isAutoGame && game.LaohuUtils.auto_times <= 0) {
					game.LaohuUtils.isAutoGame = false;
					game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
					game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
					this.resetBtnColor();
					this.startBtn.currentState = "up";
					this.timesLabel.text = "";
					game.LaohuUtils.speed = 48;
					this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
					if (!this.mouseOn) {
						this.mouseOn = new DBComponent("onmouseon");
						GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
					}
					this.mouseOn.touchEnabled = false;
					this.mouseOn.touchChildren = false;
					this.mouseOn.play("onmouseon", 0);
					this.mouseOn.x = 76.5;
					this.mouseOn.y = 69;
					this.runGroup.addChild(this.mouseOn);
					this.runningType = RUNNING_TYPE.EMPTY;
					SoundManager.getInstance().stopEffectByName("reel_dntg_mp3");
					return;
				}
				if (game.LaohuUtils.totalAdd && game.LaohuUtils.isAutoGame) {
					if (game.LaohuUtils.totalBet >= game.LaohuUtils.totalAdd) {
						game.LaohuUtils.isAutoGame = false;
						this.resetBtnColor();
						this.startBtn.currentState = "up";
						this.timesLabel.text = "";
						game.LaohuUtils.speed = 48;
						this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
						if (!this.mouseOn) {
							this.mouseOn = new DBComponent("onmouseon");
							GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
						}
						game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
						game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
						this.mouseOn.touchEnabled = false;
						this.mouseOn.touchChildren = false;
						this.mouseOn.play("onmouseon", 0);
						this.mouseOn.x = 76.5;
						this.mouseOn.y = 69;
						this.runGroup.addChild(this.mouseOn);
						this.runningType = RUNNING_TYPE.EMPTY;
						SoundManager.getInstance().stopEffectByName("reel_dntg_mp3");
						return;
					}
				}
				if (game.LaohuUtils.totalWin && game.LaohuUtils.isAutoGame) {
					if (game.LaohuUtils.totoalWinGold >= game.LaohuUtils.totalWin) {
						game.LaohuUtils.isAutoGame = false;
						game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
						game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
						this.resetBtnColor();
						this.startBtn.currentState = "up";
						this.timesLabel.text = "";
						game.LaohuUtils.speed = 48;
						this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
						if (!this.mouseOn) {
							this.mouseOn = new DBComponent("onmouseon");
							GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
						}
						this.mouseOn.touchEnabled = false;
						this.mouseOn.touchChildren = false;
						this.mouseOn.play("onmouseon", 0);
						this.mouseOn.x = 76.5;
						this.mouseOn.y = 69;
						this.runGroup.addChild(this.mouseOn);
						this.runningType = RUNNING_TYPE.EMPTY;
						SoundManager.getInstance().stopEffectByName("reel_dntg_mp3");
						return;
					}
				}
				if (game.LaohuUtils.oneMax && game.LaohuUtils.isAutoGame) {
					if (this.winGold >= game.LaohuUtils.oneMax) {
						game.LaohuUtils.isAutoGame = false;
						game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
						game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
						this.resetBtnColor();
						this.startBtn.currentState = "up";
						this.timesLabel.text = "";
						game.LaohuUtils.speed = 48;
						this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
						if (!this.mouseOn) {
							this.mouseOn = new DBComponent("onmouseon");
							GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
						}
						this.mouseOn.touchEnabled = false;
						this.mouseOn.touchChildren = false;
						this.mouseOn.play("onmouseon", 0);
						this.mouseOn.x = 76.5;
						this.mouseOn.y = 69;
						this.runGroup.addChild(this.mouseOn);
						this.runningType = RUNNING_TYPE.EMPTY;
						SoundManager.getInstance().stopEffectByName("reel_dntg_mp3");
						return;
					}
				}
				this.runningType = RUNNING_TYPE.LOOP;
				this.removeLastAni();
				this.scroller.stopIconDb();
				SoundManager.getInstance().playEffect("button_dntg_mp3");
				this.isStopAni = true;
				if (game.LaohuUtils.isAutoGame) {
					game.LaohuUtils.speed = 64;
					if (game.LaohuUtils.auto_times > 1000) {
						this.timesLabel.text = "s";
					} else {
						this.timesLabel.text = game.LaohuUtils.auto_times + "";
					}
					game.LaohuUtils.auto_times -= 1;
					game.LaohuUtils.totalBet += game.LaohuUtils.bet * game.LaohuUtils.mul * 50;
				}
				// this.startBtn.touchEnabled = false;
				this.ownGold -= game.LaohuUtils.bet * game.LaohuUtils.mul * 50;
				this.numAccisiable.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
				this.winnum.text = 0 + "";
				this.scroller.run();
				this.messageSend();
			} else if (this.runningType == RUNNING_TYPE.RESULT) {
				if (game.LaohuUtils.isAutoGame && this.scatterIcon >= 2) {
					this.startBtn.currentState == "up";
					this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
					if (!this.mouseOn) {
						this.mouseOn = new DBComponent("onmouseon");
						GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
					}
					this.mouseOn.touchEnabled = false;
					this.mouseOn.touchChildren = false;
					this.mouseOn.play("onmouseon", 0);
					this.mouseOn.x = 76.5;
					this.mouseOn.y = 69;
					this.runGroup.addChild(this.mouseOn);
					game.LaohuUtils.isAutoGame = false;
					game.LaohuUtils.auto_times = 0;
					this.timesLabel.text = "";
				}
				this.fastGame();
			} else if (this.runningType == RUNNING_TYPE.STOP) {

			}
		}
		/**
		 * 测试按钮
		 */
		public async startBtnTouch0() {
			this.isTest = true;
			this.wheel = [[], [], [], [], []];
			let data = this.spinresult.text;
			for (let i = 0; i < 5; i++) {
				let j = data.split(":")[i];
				let l = j.split(",");
				for (let m = 0; m < l.length; m++) {
					let n = parseInt(l[m]);
					this.wheel[i].push(n);
				}
			}
			let data2 = this.pscen1.text;
			this.spinTest = parseInt(data2);
			this.setBtnColor();
			this.removeLastAni();
			this.scroller.stopIconDb();
			this.scroller.run();
			this.messageSend();
		}
		/**
		 * 点击按钮快速停止游戏
		 */
		public fastGame() {
			if (this.scatterIcon >= 2) {
				this.fastEnd = true;
				egret.clearTimeout(this.scatter4timeout);
				egret.clearTimeout(this.scatter5timeout);
				SoundManager.getInstance().stopEffectByName("reel_fast_spin_none_mp3");
				SoundManager.getInstance().stopEffectByName("reel_fast_spin_win_mp3");
				this.scroller.removeScatterAni();
				this.scroller.item4.speed = 48;
				this.scroller.item5.speed = 48;
				this.scroller.runResultFast();
			}
			if (game.LaohuUtils.isAutoGame) {
				game.LaohuUtils.speed = 48;
				egret.clearTimeout(this.autoGameTimeOut);
				if (this.scatter != 1) this.resetBtnColor();
				if (this.db_run && this.db_run.parent) {
					this.db_run.parent.removeChild(this.db_run);
				}
				if (this.db_runguang && this.db_runguang.parent) {
					this.db_runguang.parent.removeChild(this.db_runguang);
				}
				this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
				if (!this.mouseOn) {
					this.mouseOn = new DBComponent("onmouseon");
					GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
				}
				this.mouseOn.touchEnabled = false;
				this.mouseOn.touchChildren = false;
				this.mouseOn.play("onmouseon", 0);
				this.mouseOn.x = 76.5;
				this.mouseOn.y = 69;
				this.runGroup.addChild(this.mouseOn);
				let stopAutoAni = DBComponent.create("dntg_stopAutoAni", "button_stop");
				// let stopAutoAni = new DBComponent("button_stop");
				stopAutoAni.play("", 1);
				stopAutoAni.x = 76.5;
				stopAutoAni.y = 73.5;
				this.runGroup.addChild(stopAutoAni);
				stopAutoAni.addEventListener(egret.Event.COMPLETE, () => {
					if (stopAutoAni && stopAutoAni.parent) {
						stopAutoAni.parent.removeChild(stopAutoAni);
					}
				}, this)
				this.timesLabel.text = "";
				game.LaohuUtils.isAutoGame = false;
				game.LaohuUtils.auto_times = 0;
				this.startBtn.currentState = "up";
			} else {
				this.bonusRect.touchEnabled = false;
				this.runningType = RUNNING_TYPE.LOOP;
				this.scroller.runResultFast();
			}
		}
		/**
		 * 点击转轴区域快速停止游戏
		 */
		public scrollerFastGame() {
			if (this.runningType == RUNNING_TYPE.RESULT) {
				if (this.scatterIcon >= 2) {
					if (this.scatterIcon >= 2) {
						this.fastEnd = true;
						egret.clearTimeout(this.scatter4timeout);
						egret.clearTimeout(this.scatter5timeout);
						SoundManager.getInstance().stopEffectByName("reel_fast_spin_none_mp3");
						SoundManager.getInstance().stopEffectByName("reel_fast_spin_win_mp3");
						this.scroller.removeScatterAni();
						this.scroller.item4.speed = 48;
						this.scroller.item5.speed = 48;
						// this.scroller.runResultFast();
					}
				};
				this.scroller.runResultFast();
			}
		}
		/**
		 * 移除旋转中奖上次动画
		 */
		public removeLastAni() {
			this.setBtnColor();
			this.fastEnd = false;
			this.scroller.stopIconDb();
			game.UIUtils.removeSelf(this.commomScore);
		}
		public autoGameTimeOut: any;
		//打开自动游戏窗口
		public openAutoGame() {
			if (!game.LaohuUtils.isAutoGame) {
				game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_LAOHU_AUTO_PANEL);
			}
		}
		//开始自动游戏
		public startAutoGame() {
			this.changeAutoBtnState();
			if (game.LaohuUtils.bet * game.LaohuUtils.mul * 50 > this.ownGold) {
				let text = "金币不足";
				this.resetBtnColor();
				this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
				if (!this.mouseOn) {
					this.mouseOn = new DBComponent("onmouseon");
					GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
				}
				this.mouseOn.touchEnabled = false;
				this.mouseOn.touchChildren = false;
				this.mouseOn.play("onmouseon", 0);
				this.mouseOn.x = 76.5;
				this.mouseOn.y = 69;
				this.runGroup.addChild(this.mouseOn);
				Global.alertMediator.addAlert(text, () => {
				}, "", true);
				return;
			}
			game.LaohuUtils.isAutoGame = true;
			game.LaohuUtils.speed = 64;
			if (game.LaohuUtils.auto_times > 1000) {
				this.timesLabel.text = "s";
			} else {
				this.timesLabel.text = game.LaohuUtils.auto_times + "";
			}
			this.startBtnTouch();
		}
		/**
		 * 自动游戏按钮状态
		 */
		private changeAutoBtnState() {
			this.startBtn.currentState = "down";
			this.mouseOn.visible = false;
		}
		private showAtr: Array<Array<number>>;  // 展示图标数组
		private bonusAtr: Array<Array<number>>;  //中奖图标数组
		private allAtr: Array<Array<number>> //所有中奖连线图标数组
		private eachLineScore: Array<number>; //每条线的中奖金额
		private winGold: number = 0;   //每次赢得的金币
		public messageTimeOut: any;   //收到消息后旋转时间延迟
		private scatterIcon: number = 0; //玉帝图标的数量
		public scatter: number = 0;  //是否中免费游戏
		public yudiAtr: Array<number>;
		public wheel: Array<Array<number>>;

		/**
		 * 转动游戏收发消息
		 */
		public async messageSend() {
			// this.winnerAtr = [];
			this.showAtr = [];
			this.bonusAtr = [];
			this.scatterIcon = 0;
			this.eachLineScore = [];
			this.yudiAtr = [];
			this.allAtr = [];
			this.scatter = 0;
			let data2: any;
			//测试专用消息
			if (this.isTest) {
				if (this.spinTest == 1) {
					data2 = { "spinType": this.spinTest, "bet": game.LaohuUtils.bet, "multiple": game.LaohuUtils.mul, "lineCount": 243, "activityId": 0, "freeWheel": this.wheel };
				} else {
					data2 = { "spinType": this.spinTest, "bet": game.LaohuUtils.bet, "multiple": game.LaohuUtils.mul, "lineCount": 243, "activityId": 0, "wheel": this.wheel };
				}
			} else {
				data2 = { "spinType": 0, "bet": game.LaohuUtils.bet, "multiple": game.LaohuUtils.mul, "lineCount": 243, "activityId": 0 };
			}
			let resp2: any = await Global.pomelo.request(ServerPostPath.game_slotHandler_c_bet, data2);
			//消息判断
			if (resp2.error) {
				let text = resp2.error.msg;
				Global.alertMediator.addAlert(text, "", "", true);
				//服务器为准备就绪状态发送退出房间请求
				var quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
				if (quitResp) {
					if (quitResp.error && quitResp.error.code != 0) {
						let text = GameConfig.GAME_CONFIG['long_config']['10002'].content
						Global.alertMediator.addAlert(text, () => {
						}, null, true);
						return;
					}
					Global.gameProxy.clearRoomInfo();
					if (quitResp.gold) {
						Global.playerProxy.playerData.gold = quitResp.gold;
					}
				}
				//关闭其他窗口
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DNTG);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHUGAME_TIPS);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
				return;
			}
			let resp1: any = resp2.spinRes;
			//结果展示数组
			this.showAtr = [resp1.matrix[0], resp1.matrix[1], resp1.matrix[2], resp1.matrix[3], resp1.matrix[4]];
			this.messageTimeOut = this.setAutoTimeout(() => {
				this.scroller.runResult(this.showAtr);
				this.runningType = RUNNING_TYPE.RESULT;
			}, this, 300);
			this.winGold = resp2.winCount;
			this.ownGold = resp2.own_gold;
			game.LaohuUtils.ToTalMoney = this.ownGold;
			this.scatter = resp2.sactter;
			if (resp1.rmIndex) {
				for (let i in resp1.rmIndex) {
					this.allAtr.push(resp1.rmIndex[i]);
				}
			}
			//消息判断
			if (resp1.winnerInfo) {
				for (let i = 0; i < resp1.winnerInfo.length; i++) {
					for (let j = 0; j < resp1.winnerInfo[i].length; j++) {
						resp1.winnerInfo[i][j] = resp1.winnerInfo[i][j].myReplace(" ", "");
						let aaa = resp1.winnerInfo[i][j];
						let str_lingshi: number[] = [];
						let temp: any = [];
						temp = resp1.winnerInfo[i][j].split(":")[2];
						let temp2 = resp1.winnerInfo[i][j].split(":")[1];
						temp = temp.myReplace("{", "");
						temp = temp.myReplace("}", "");
						let arr = temp.split(",")
						this.eachLineScore.push(temp2);
						for (let k = 0; k < arr.length; k++) {
							str_lingshi.push(parseInt(arr[k]));
						}
						this.bonusAtr.push(str_lingshi);
					}
				}
			} else {
				this.bonusAtr = [];
			}
			if (resp2.sactter == 1) {
				let scatternum = 0;
				this.yudiAtr = [];
				for (let i = 0; i <= 4; i++) {
					for (let j = 0; j < this.showAtr[i].length; j++) {
						if (this.showAtr[i][j] == 2) {
							this.yudiAtr.push(j);
						}
					}
				}
			}
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < this.showAtr[i].length; j++) {
					//判断前三列几个玉帝
					if (this.showAtr[i][j] == 2) {
						this.scatterIcon++;
					} else {
						// this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.fastGame, this);
						this.startBtn.touchEnabled = true;
						this.scroller.touchEnabled = true;
					}
				}
			}
			this.isStopAni = false;
			if (game.LaohuUtils.isAutoGame) {
				game.LaohuUtils.totoalWinGold += this.winGold;
			}
			var colorMatrix = [
				1, 0, 0, 0, 0,
				0, 1, 0, 0, 0,
				0, 0, 1, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			if (!game.LaohuUtils.isAutoGame) {
				this.db_run.filters = [colorFlilter]
			} else {
				this.startBtn.filters = [colorFlilter];
			}
		}

		//旋转时按钮设灰
		public setBtnColor() {
			// this.startBtn.touchEnabled = false;
			egret.clearTimeout(this.removeScoreTimeout);
			egret.clearTimeout(this.showIconTimeOut);
			if (this.commomScore && this.commomScore.parent) {
				this.commomScore.parent.removeChild(this.commomScore);
			}
			var colorMatrix = [
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			this.menuBtn.filters = [colorFlilter];
			this.menuBtn.touchEnabled = this.yazhu_ima.touchEnabled = this.betAddBtn.touchEnabled = this.betSubBtn.touchEnabled = this.autoRunBtn.touchEnabled = this.tipsBtn.touchEnabled = this.back2HallBtn.touchEnabled = false;
			this.yazhu_ima.filters = [colorFlilter];
			this.betAddBtn.filters = [colorFlilter];
			this.betSubBtn.filters = [colorFlilter];
			this.autoRunBtn.filters = [colorFlilter];
			this.tipsBtn.filters = [colorFlilter];
			//判断是否为自动游戏
			if (!game.LaohuUtils.isAutoGame) {
				if (!this.db_runguang) {
					this.db_runguang = new DBComponent("ongamerun");
					GameCacheManager.instance.setCache("ongamerun", this.db_runguang);
				}
				this.db_runguang.touchEnabled = false;
				this.db_runguang.touchChildren = false;
				this.db_runguang.play("runguang", 1);
				this.db_runguang.x = 76.7;
				this.db_runguang.y = 68;
				this.runGroup.addChild(this.db_runguang);

				this.db_run = GameCacheManager.instance.getCache("ongamerun1");
				if (!this.db_run) {
					this.db_run = new DBComponent("ongamerun");
					GameCacheManager.instance.setCache("ongamerun1", this.db_run);
				}
				this.db_run.touchEnabled = false;
				this.db_run.touchChildren = false;
				this.db_run.playNamesAndLoop(["ongamerun"]);
				this.db_run.x = 76.7;
				this.db_run.y = 68;
				this.runGroup.addChild(this.db_run);
				this.db_run.filters = [colorFlilter];
			} else {
				this.startBtn.filters = [colorFlilter];
			}
		}
		//旋转完成后按钮还原
		/**
		 */
		public resetBtnColor() {
			this.startBtn.touchEnabled = true;
			var colorMatrix = [
				1, 0, 0, 0, 0,
				0, 1, 0, 0, 0,
				0, 0, 1, 0, 0,
				0, 0, 0, 1, 0
			];
			if (this.scatter != 1) this.back2HallBtn.touchEnabled = true;
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			this.menuBtn.filters = [colorFlilter];
			this.menuBtn.touchEnabled = this.yazhu_ima.touchEnabled = this.betAddBtn.touchEnabled = this.betSubBtn.touchEnabled = this.autoRunBtn.touchEnabled = this.tipsBtn.touchEnabled = this.back2HallBtn.touchEnabled = true;
			this.yazhu_ima.filters = [colorFlilter];
			this.betAddBtn.filters = [colorFlilter];
			this.betSubBtn.filters = [colorFlilter];
			this.autoRunBtn.filters = [colorFlilter];
			this.tipsBtn.filters = [colorFlilter];
			if (this.db_run && this.db_run.parent) {
				this.db_run.parent.removeChild(this.db_run);
			}
			if (this.db_runguang && this.db_runguang.parent) {
				this.db_runguang.parent.removeChild(this.db_runguang);
			}
			this.runGroup.addChild(this.mouseOn);
		}
		public scatterAni: DBComponent;//scatter时的特效
		private fastEnd: boolean = false; // 快速结束条件 true/false
		public isInScatter: boolean = false; //是否是scatter播放判断条件 true/false
		private scatter4timeout: any; //第四列scatter动画播放的timeout
		private scatter5timeout: any;//第5列scatter动画播放的timeout
		/**
		 * @param  {egret.Event} e
		 */
		public scrollerEnd(e: egret.Event) {
			let data = e.data;
			if (data.sceneIndex != 1) {
				return;
			}
			let index = e.data.index;
			switch (index) {
				case 5:
					//自动游戏继续下一把
					SoundManager.getInstance().stopEffectByName("reel_dntg_mp3");
					if (this.showAtr) {
						if (this.showAtr.length != 0) {
							for (let i = 0; i < this.showAtr[4].length; i++) {
								//判断第5列上是否有scatter
								if (this.showAtr[4][i] == 2) {
									for (let j = 0; j < 3; j++) {
										if (this.showAtr[2][j] == 2) {
											for (let k = 0; k < 3; k++) {
												if (this.showAtr[0][k] == 2) {
													SoundManager.getInstance().playEffect("scat_dntg_mp3");
													this.scroller.addFoGuang(5, i, "foguang");
												}
											}
										}
									}
								} else {
									SoundManager.getInstance().playEffect("reelstop1_dntg_mp3");
								}
							}
						}
						if (game.LaohuUtils.auto_times >= 0 && game.LaohuUtils.isAutoGame) {
							this.winnum.text = NumberFormat.handleFloatDecimal(this.winGold) + "";
							if (this.scatter == 1) {
								this.checkBonusIcon();
								return;
							}
							this.setAutoTimeout(() => {
								LogUtils.logD("empty4");
								if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
							}, this, 500);
							if (this.winGold > 0) {
								this.autoGameTimeOut = this.setAutoTimeout(this.startBtnTouch, this, 2000);
							} else {
								this.autoGameTimeOut = this.setAutoTimeout(this.startBtnTouch, this, 1000);
							}
						} else {
							if (this.scatter != 1) this.resetBtnColor();
							if (this.db_run && this.db_run.parent) {
								this.db_run.parent.removeChild(this.db_run);
							}
							if (this.db_runguang && this.db_runguang.parent) {
								this.db_runguang.parent.removeChild(this.db_runguang);
							}
							this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
							if (!this.mouseOn) {
								this.mouseOn = new DBComponent("onmouseon");
								GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
							}
							this.mouseOn.touchEnabled = false;
							this.mouseOn.touchChildren = false;
							this.mouseOn.play("onmouseon", 0);
							this.mouseOn.x = 76.5;
							this.mouseOn.y = 69;
							this.runGroup.addChild(this.mouseOn);
							this.winnum.text = NumberFormat.handleFloatDecimal(this.winGold) + "";
							this.bonusRect.touchEnabled = false;
							this.setAutoTimeout(() => {
								LogUtils.logD("empty5");
								if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
							}, this, 500);
						}
						this.numAccisiable.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
						this.checkBonusIcon();
					}

					break;
				case 3:
					//判断玉帝数量，是否添加scatter特效
					if (this.showAtr) {
						for (let i = 0; i < this.showAtr[2].length; i++) {
							//判断第三列上是否有scatter
							if (this.showAtr[2][i] == 2) {
								for (let j = 0; j < 3; j++) {
									if (this.showAtr[0][j] == 2) {
										SoundManager.getInstance().playEffect("scat_dntg_mp3");
										this.scroller.addFoGuang(3, i, "foguang");
									}
								}

							} else {
								SoundManager.getInstance().playEffect("reelstop1_dntg_mp3");
							}
						}
						//是否可能中scatter，4,5列加速
						if (this.scatterIcon >= 2) {
							if (this.fastEnd) return;
							// this.scroller.item4.runModel = RUN_MODEL.LOOP
							// this.scroller.item5.runModel = RUN_MODEL.LOOP
							this.scroller.item4.clearDownTimeOut();
							this.scroller.item5.clearDownTimeOut();
							this.scroller.item4.speed = 64;
							this.scroller.item5.speed = 64;
							// this.scroller.speed = 64;		
							this.scroller.addScatterAni(4);
							this.scroller.speed = 64;
							let item4 = this.scroller[`item${4}`];
							let item5 = this.scroller[`item${5}`];
							SoundManager.getInstance().playEffect("reel_fast_spin_none_mp3");

							this.scatter4timeout = this.setAutoTimeout(() => {
								item4.changeResult(this.showAtr[3]);
								this.scroller.removeScatterAni(4);
								this.scroller.addScatterAni(5);
								if (this.scatter != 1) { SoundManager.getInstance().playEffect("reel_fast_spin_none_mp3") }
								else { SoundManager.getInstance().playEffect("reel_fast_spin_win_mp3"); }
							}, this, 2500);
							this.scatter5timeout = this.setAutoTimeout(() => {
								item5.changeResult(this.showAtr[4]);
								if (this.scatter == 1) SoundManager.getInstance().playEffect("scat_dntg_mp3");
								this.scroller.removeScatterAni(5);
								egret.clearTimeout(this.autoGameTimeOut);
							}, this, 5000);
						}
					}

					break;
				case 1:
					if (this.showAtr) {
						for (let i = 0; i < this.showAtr[0].length; i++) {
							//判断第1列上是否有scatter
							if (this.showAtr[0][i] == 2) {
								SoundManager.getInstance().playEffect("scat_dntg_mp3");
								this.scroller.addFoGuang(1, i, "foguang");
							} else { SoundManager.getInstance().playEffect("reelstop1_dntg_mp3"); }
						}
					}
					break;
				case 2:
					SoundManager.getInstance().playEffect("reelstop1_dntg_mp3");
					break;
				case 4:
					SoundManager.getInstance().playEffect("reelstop1_dntg_mp3");
					break;
			}
		}
		public bigWinPanel: DNTGBigwinGroup; //bigwin的特效窗口
		private toFreeAni: dragonBones.EgretArmatureDisplay = new dragonBones.EgretArmatureDisplay(); //进入免费游戏的猴子动画
		public showIconTimeOut: any; //连线动画timeout
		private isStopAni: boolean = false;
		public removeScoreTimeout: any;
		//旋转完成中奖、免费游戏判断
		public checkBonusIcon() {
			//判断是否有中bigwin
			// this.removeLastAni();
			if (this.winGold >= (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) * 15) {
				egret.clearTimeout(this.autoGameTimeOut);
				this.startBtn.touchEnabled = false;
				this.menuBtn.touchEnabled = this.yazhu_ima.touchEnabled = this.betAddBtn.touchEnabled = this.betSubBtn.touchEnabled = this.autoRunBtn.touchEnabled = this.tipsBtn.touchEnabled = this.back2HallBtn.touchEnabled = false;
				/**
				 * bigwin窗口点击事件
				 */
				let func = () => {
					this.bigWinPanel.touchEnabled = false;
					this.bigWinPanel.bigwinStopRect.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);

					if (this.scatter != 1) this.startBtn.touchEnabled = true;
					if (!game.LaohuUtils.isAutoGame && this.scatter != 1) {
						this.runningType = RUNNING_TYPE.EMPTY;
					}
					/**
					 * bigwin结束窗口效果
					 */
					this.bigWinPanel.stopShowBigWin(() => {
						if (game.LaohuUtils.isAutoGame && this.scatter != 1) {
							this.scroller.stopIconDb();
							this.scroller.addBonusAni(this.allAtr, this.winGold);
							this.autoGameTimeOut = this.setAutoTimeout(() => {
								this.startBtnTouch();
							}, this, 1700);
						}
						if (this.scatter != 1) { this.startBtn.touchEnabled = true; this.scroller.addBonusAni(this.allAtr, this.winGold); }
						if (this.scatter != 1) this.menuBtn.touchEnabled = this.yazhu_ima.touchEnabled = this.betAddBtn.touchEnabled = this.betSubBtn.touchEnabled = this.autoRunBtn.touchEnabled = this.tipsBtn.touchEnabled = this.back2HallBtn.touchEnabled = true;
						if (this.scatter == 1) this.addEachLineAni();
					});
				}

				this.bigWinPanel = new DNTGBigwinGroup();

				this.bigWinPanel.showpanel();
				this.bigWinPanel.touchEnabled = false;
				this.setAutoTimeout(() => {
					this.bigWinPanel.touchEnabled = true;
					this.bigWinPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, func, this)
				}, this, 1500);
				/**
				 * bigwin窗口
				 * @param score,callback?
				 */
				this.bigWinPanel.scoreShow(this.winGold, () => {

					if (this.commomScore && this.commomScore.parent) {
						this.commomScore.parent.removeChild(this.commomScore);
					} if (game.LaohuUtils.isAutoGame && this.scatter != 1) {
						this.scroller.stopIconDb();

						this.autoGameTimeOut = this.setAutoTimeout(() => {
							this.startBtnTouch();
						}, this, 1500);
					}

					if (this.scatter != 1) { this.startBtn.touchEnabled = true; this.scroller.addBonusAni(this.allAtr, this.winGold); }
					if (!game.LaohuUtils.isAutoGame && this.scatter != 1) { this.runningType = RUNNING_TYPE.EMPTY; }
					if (this.scatter != 1) this.menuBtn.touchEnabled = this.yazhu_ima.touchEnabled = this.betAddBtn.touchEnabled = this.betSubBtn.touchEnabled = this.autoRunBtn.touchEnabled = this.tipsBtn.touchEnabled = this.back2HallBtn.touchEnabled = true;
					if (this.scatter == 1) this.addEachLineAni();
				})
				this.resizeGroup.addChild(this.bigWinPanel);

			} else {
				//未中bigwin逐个展示中奖图标
				if (this.bonusAtr.length > 0 && this.winGold > 0) {
					if (this.scatter == 1) this.runningType = RUNNING_TYPE.STOP;
					SoundManager.getInstance().playEffect("win_dntg_mp3");
					this.scroller.addBonusAni(this.allAtr, this.winGold);
					this.commomScore = new eui.BitmapLabel();
					this.commomScore.font = "dntg_win_gold_fnt";
					let data = Number(new Big(this.winGold).mul(100));
					this.commomScore.text = NumberFormat.handleFloatDecimal(data) + "";
					this.commomScore.textAlign = "center";
					this.commomScore.verticalCenter = 0;
					this.commomScore.horizontalCenter = 0;
					this.scroller.addChild(this.commomScore);
					this.removeScoreTimeout = this.setAutoTimeout(() => {
						if (this.commomScore && this.commomScore.parent)
						{ this.commomScore.parent.removeChild(this.commomScore); }
						this.addEachLineAni();
					}, this, 2000);
				} else {
					//未中奖后进入免费游戏
					if (this.scatter == 1) {
						this.runningType = RUNNING_TYPE.STOP;
						this.back2HallBtn.touchEnabled = false;
						this.scroller.addFoGuang(1, this.yudiAtr[0], "icon_2");
						this.scroller.addFoGuang(3, this.yudiAtr[1], "icon_2");
						this.scroller.addFoGuang(5, this.yudiAtr[2], "icon_2");
						this.toFreeAni = this.showAllIcon("freegame");
						this.toFreeAni.x = 700;
						this.toFreeAni.y = 300;
						this.toFreeAni.addEventListener(egret.Event.COMPLETE, () => {
							EventManager.instance.dispatch(EventNotify.DNTG_ENTER_FREE_GAME);
							if (this.toFreeAni && this.toFreeAni.parent) {
								this.toFreeAni.parent.removeChild(this.toFreeAni);
							}
						}, this);
						this.setAutoTimeout(() => { this.toFreeAni.animation.play("freegame", 1); this.resizeGroup.addChild(this.toFreeAni); }, this, 1200);
						SoundManager.getInstance().playEffect("scatin_dntg_mp3");

					}
				}
			}
		}
		/**
		 * 免费游戏回到正常游戏场景处理
		 */
		private free2Common() {
			SoundManager.getInstance().playMusic("background_mus_dntg_mp3");
			this.back2HallBtn.touchEnabled = true;
			this.startBtn.touchEnabled = true;
			/**
			 * 继续自动游戏
			 */
			if (game.LaohuUtils.isAutoGame) {
				this.setAutoTimeout(() => { this.startAutoGame(); }, this, 1000)
			}
			else {
				game.LaohuUtils.speed = 48;
				this.resetBtnColor();
				this.runningType = RUNNING_TYPE.EMPTY;
				this.startBtn.currentState = "up";
				this.timesLabel.text = "";
				this.mouseOn = GameCacheManager.instance.getCache("onmouseon");
				/**
				 * 添加按钮动画
				 */
				if (!this.mouseOn) {
					this.mouseOn = new DBComponent("onmouseon");
					GameCacheManager.instance.setCache("onmouseon", this.mouseOn);
				}
				this.mouseOn.touchEnabled = false;
				this.mouseOn.touchChildren = false;
				this.mouseOn.play("onmouseon", 0);
				this.mouseOn.x = 76.5;
				this.mouseOn.y = 69;
				this.runGroup.addChild(this.mouseOn);
			}
			this.numAccisiable.text = NumberFormat.handleFloatDecimal(game.LaohuUtils.ToTalMoney) + "";
			this.ownGold = game.LaohuUtils.ToTalMoney;
			game.LaohuUtils.freeWin = 0;
		}
		/**
		 * 每条连线动画
		 */
		public addEachLineAni() {
			// this.removeLastAni();
			// 非空判断
			if (this.bonusAtr.length > 0 && this.winGold > 0) {
				let count = 0;
				async.eachSeries(this.bonusAtr, (index, callback) => {
					if (this.isStopAni) return;
					if (this.commomScore && this.commomScore.parent)
					{ this.commomScore.parent.removeChild(this.commomScore); }
					for (let j = 0; j < index.length; j++) {
						let k = j + 1;
						this.scroller[`item${k}`].showAni(index[j]);
						// this.commomScore = new eui.BitmapLabel();
						this.commomScore.font = "font_gold_fnt";
						let data = Number(new Big(this.eachLineScore[count]).mul(100));
						this.commomScore.text = NumberFormat.handleFloatDecimal(data, 0) + "";
						this.commomScore.verticalCenter = ((index[2] - 1)) * 172 - 12;
						this.commomScore.horizontalCenter = 0;
						this.commomScore.textAlign = "center";
						this.commomScore.scaleX = 0.8;
						this.commomScore.scaleY = 0.8;
						this.resizeGroup.addChild(this.commomScore);
					}

					if (this.bonusAtr.length == 1) {
						if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
						this.showIconTimeOut = this.setAutoTimeout(callback, this, 1500);
					}
					if (this.bonusAtr.length > 1) {
						if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
						this.setAutoTimeout(() => {
							if (this.commomScore && this.commomScore.parent)
							{ this.commomScore.parent.removeChild(this.commomScore); }
						}, this, 1500)
						this.showIconTimeOut = this.setAutoTimeout(callback, this, 2500);
					}
					count++;
				}, () => {
					if (this.scatter == 1) {
						if (this.commomScore && this.commomScore.parent)
						{ this.commomScore.parent.removeChild(this.commomScore); }
						// this.startBtn.touchEnabled = false;
						this.back2HallBtn.touchEnabled = false;
						this.runningType = RUNNING_TYPE.STOP;
						this.scroller.addFoGuang(1, this.yudiAtr[0], "icon_2");
						this.scroller.addFoGuang(3, this.yudiAtr[1], "icon_2");
						this.scroller.addFoGuang(5, this.yudiAtr[2], "icon_2");
						this.toFreeAni = this.showAllIcon("freegame")
						this.toFreeAni.x = 700;
						this.toFreeAni.y = 300;
						this.toFreeAni.addEventListener(egret.Event.COMPLETE, () => {
							EventManager.instance.dispatch(EventNotify.DNTG_ENTER_FREE_GAME);
							if (this.toFreeAni && this.toFreeAni.parent) {
								this.toFreeAni.parent.removeChild(this.toFreeAni);
							}
						}, this)
						this.setAutoTimeout(() => {
							this.toFreeAni.animation.play("freegame", 1);
							SoundManager.getInstance().playEffect("scatin_dntg_mp3");
							this.resizeGroup.addChild(this.toFreeAni);
						}, this, 1200);
					}
					else {
						count = 0;
						if (this.commomScore && this.commomScore.parent)
						{ this.commomScore.parent.removeChild(this.commomScore); }
						return this.addEachLineAni();
					}

				})
			}
		}

		//增加bet
		private addBet() {
			if (this.bet <= 9) {
				game.LaohuUtils.totalWin = 0;
				this.bet += 1;
				SoundManager.getInstance().playEffect("button_dntg_mp3");
				switch (this.bet) {
					case 1:
						game.LaohuUtils.bet = game.LaohuUtils.bets[0];
						game.LaohuUtils.mul = game.LaohuUtils.muls[0];
						break;
					case 2:
						game.LaohuUtils.bet = game.LaohuUtils.bets[0];
						game.LaohuUtils.mul = game.LaohuUtils.muls[1];

						break;
					case 3:
						game.LaohuUtils.bet = game.LaohuUtils.bets[0];
						game.LaohuUtils.mul = game.LaohuUtils.muls[3];
						break;
					case 4:
						game.LaohuUtils.bet = game.LaohuUtils.bets[0];
						game.LaohuUtils.mul = game.LaohuUtils.muls[9];
						break;
					case 5:
						game.LaohuUtils.bet = game.LaohuUtils.bets[1];
						game.LaohuUtils.mul = game.LaohuUtils.muls[9];
						break;
					case 6:
						game.LaohuUtils.bet = game.LaohuUtils.bets[2];
						game.LaohuUtils.mul = game.LaohuUtils.muls[5];
						break;
					case 7:
						game.LaohuUtils.bet = game.LaohuUtils.bets[3];
						game.LaohuUtils.mul = game.LaohuUtils.muls[5];
						break;
					case 8:
						game.LaohuUtils.bet = game.LaohuUtils.bets[3];
						game.LaohuUtils.mul = game.LaohuUtils.muls[9];
						break;
					case 9:
						game.LaohuUtils.bet = game.LaohuUtils.bets[4];
						game.LaohuUtils.mul = game.LaohuUtils.muls[6];
						break;
					case 10:
						game.LaohuUtils.bet = game.LaohuUtils.bets[4];
						game.LaohuUtils.mul = game.LaohuUtils.muls[9];
						break;
				}
			} else {
			}
			this.beishu.text = parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 + "") + "";
			this.totalBetLabel.text = NumberFormat.handleFloatDecimal((game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) + "";
			this.maxWinLabel.text = "最高可得: " + parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
			if ((game.LaohuUtils.bet * game.LaohuUtils.mul * 50) > this.ownGold) {
				let text = "金币不足";
				Global.alertMediator.addAlert(text, "", "", true);
				this.reduceBet();
			}
		}
		//减少bet
		private reduceBet() {
			if (this.bet <= 1) {
				return;
			} else {
				game.LaohuUtils.totalWin = 0;
				SoundManager.getInstance().playEffect("button_dntg_mp3");
				this.bet -= 1;
				switch (this.bet) {
					case 1:
						game.LaohuUtils.bet = game.LaohuUtils.bets[0];
						game.LaohuUtils.mul = game.LaohuUtils.muls[0];
						break;
					case 2:
						game.LaohuUtils.bet = game.LaohuUtils.bets[0];
						game.LaohuUtils.mul = game.LaohuUtils.muls[1];
						break;
					case 3:
						game.LaohuUtils.bet = game.LaohuUtils.bets[0];
						game.LaohuUtils.mul = game.LaohuUtils.muls[3];
						break;
					case 4:
						game.LaohuUtils.bet = game.LaohuUtils.bets[0];
						game.LaohuUtils.mul = game.LaohuUtils.muls[9];
						break;
					case 5:
						game.LaohuUtils.bet = game.LaohuUtils.bets[1];
						game.LaohuUtils.mul = game.LaohuUtils.muls[9];
						break;
					case 6:
						game.LaohuUtils.bet = game.LaohuUtils.bets[2];
						game.LaohuUtils.mul = game.LaohuUtils.muls[5];
						break;
					case 7:
						game.LaohuUtils.bet = game.LaohuUtils.bets[3];
						game.LaohuUtils.mul = game.LaohuUtils.muls[5];
						break;
					case 8:
						game.LaohuUtils.bet = game.LaohuUtils.bets[3];
						game.LaohuUtils.mul = game.LaohuUtils.muls[9];
						break;
					case 9:
						game.LaohuUtils.bet = game.LaohuUtils.bets[4];
						game.LaohuUtils.mul = game.LaohuUtils.muls[6];
						break;
					case 10:
						game.LaohuUtils.bet = game.LaohuUtils.bets[4];
						game.LaohuUtils.mul = game.LaohuUtils.muls[9];
						break;
				}
			}
			this.beishu.text = parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 + "") + "";
			this.totalBetLabel.text = NumberFormat.handleFloatDecimal((game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) + "";
			this.maxWinLabel.text = "最高可得: " + parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
		}
		//返回dbegretArmature对象
		/**
		 * @param  {string} str
		 * @param  {number} x?
		 * @param  {number} y?
		 */
		public showAllIcon(str: string, x?: number, y?: number) {
			let scycle: dragonBones.EgretArmatureDisplay = new dragonBones.EgretArmatureDisplay();
			scycle = DBFactory.instance.getDBAsync1(str);
			return scycle;
		}
		//直接选中最大bet
		private maxBet() {
			game.LaohuUtils.bet = game.LaohuUtils.bets[4];
			game.LaohuUtils.mul = game.LaohuUtils.muls[9];
			if (game.LaohuUtils.mul * game.LaohuUtils.bet * 50 > this.ownGold) {
				let text = "金币不足";
				Global.alertMediator.addAlert(text, "", "", true);
				return;
			}
			this.betTtipsGroup.visible = true;
			this.maxWinLabel.text = "最高可得: " + parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
			this.totalBetLabel.text = NumberFormat.handleFloatDecimal(game.LaohuUtils.bet * game.LaohuUtils.mul * 50) + "";
			this.setAutoTimeout(() => { this.betTtipsGroup.visible = false }, this, 5000);
			this.bet = 10;
			this.beishu.text = parseInt(game.LaohuUtils.bet * game.LaohuUtils.mul * 100 + "") + "";

		}
		/**
		 * 打开游戏记录
		 */
		private openGameRecord() {
			// let record: dntg.DNTGGameRecordPanel = new DNTGGameRecordPanel();
			game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_DNTG_RECORD_PANEL);
		}
		/**
		 * 返回大厅
		 */
		private backtoHall() {
			game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_LEAVE_LAOHU_PANEL);
		}
	}

}

enum RUNNING_TYPE {
	LOOP,//旋转中
	RESULT,//旋转有结果可以快停
	STOP,//停止
	EMPTY//无状态可以开始
}