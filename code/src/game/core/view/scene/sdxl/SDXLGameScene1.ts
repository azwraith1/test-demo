/*
 * @Author: wangtao 
 * @Date: 2019-04-03 11:05:27 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 14:58:30
 * @Description: 
 */
module sdxl {
	export class SDXLGameScene1 extends game.BaseScene {
		public resizeGroup: eui.Group;
		public scroller: sdxl.SDXLScroller;
		public bottomGroup: eui.Group;
		public muneBtn: eui.Button;
		public tipsBtn: eui.Button;
		public maxBet: eui.Image;
		public autoGameBtn: eui.Button;
		public startBtn: eui.Image;
		public quitBtn: eui.Button;
		public timesLabel: eui.BitmapLabel;
		private ownGold: number;
		private playerMoney: eui.Label;
		private winNum: eui.Label;
		private totalBet: eui.Label;
		private beishu: eui.Label;
		private subBet: eui.Button;
		private addBet: eui.Button;
		private runGroup: eui.Group;
		private gameGroup: eui.Group;
		private maskRect: eui.Rect;
		private menuGroup: eui.Group;
		private sdxlSettingBtn: eui.Button;
		private sdxlRecordBtn: eui.Button;
		private sdxl_bg2: eui.Image;
		private sdxl_bg1: eui.Image;
		private effecttGroup: eui.Group;
		private startBtn0: eui.Button;
		public spinresult: eui.EditableText;
		public pscen1: eui.EditableText;
		private testGroup: eui.Group;
		private betTtipsGroup: eui.Group;
		private maxWinLabel: eui.Label;

		private dbMouseOn: DBComponent;//初始开始按钮状态动画
		private dbGameRun: DBComponent;//游戏开始时spin按钮动画
		private dbSpinGuang: DBComponent;//点击时开始按钮特效
		private bgDb: DBComponent;//游戏背景萤火虫特效
		private winGoldDiAni: DBComponent;//中奖金额下层特效
		private btnStopAni: DBComponent;//快速停止特效
		private bet: number = 1;

		public constructor() {
			super();
			this.skinName = new SDXLGameScene1Skin();
		}
		private bigWinPanel: SDXLBigWinGroup;
		public createChildren() {
			super.createChildren();
			var colorMatrix = [
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0, 0, 0, 1, 0
			];
			this.setBtncolor();
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			this.startBtn.filters = [colorFlilter];
			this.startBtn.touchEnabled = false;
			//进入游戏判断是否为测试账号
			if (Global.playerProxy.playerData.nickname == "test004" || Global.playerProxy.playerData.nickname == "test001" || Global.playerProxy.playerData.nickname == "test002" || Global.playerProxy.playerData.nickname == "test003" || Global.playerProxy.playerData.nickname == "test005" || Global.playerProxy.playerData.nickname == "test006" || Global.playerProxy.playerData.nickname == "test007" || Global.playerProxy.playerData.nickname == "test008" || Global.playerProxy.playerData.nickname == "test009" || Global.playerProxy.playerData.nickname == "test010") {
				if (ServerConfig.PATH_TYPE == PathTypeEnum.QA_TEST) {
					this.testGroup.visible = true;
				}
			}
			if (ServerConfig.OP_RETURN_TYPE == "3") {
				this.quitBtn.visible = false;
			}

			game.SDXLUtils.sakura = DBComponent.create("sakura", "sdxl_bigwin_sakura");
			game.SDXLUtils.titleChaneAni = DBComponent.create("titleChaneAni", "sdxl_bigwin_guang");
			// game.SDXLUtils.sakura = new DBComponent("sdxl_bigwin_sakura");
			// game.SDXLUtils.titleChaneAni = new DBComponent("sdxl_bigwin_guang");

			this.startGame();
			this.scroller.showFirst(1);
			let isPC = NativeApi.instance.IsPC();
			//判断是否为pc端
			if (isPC) {
				mouse.enable(this.stage);
				this.addMouseOnEvent();
			}
			this.bgDb = DBComponent.create("bgDb", "sdxl_denglong");
			this.winGoldDiAni = DBComponent.create("winGoldDiAni", "sdxl_gold_diguang");

			// this.bgDb = new DBComponent("sdxl_denglong");
			// this.winGoldDiAni = new DBComponent("sdxl_gold_diguang");
			this.winGoldDiAni.bottom = 85;
			this.winGoldDiAni.horizontalCenter = 0;
			this.btnStopAni = DBComponent.create("btnStopAni", "sdxl_spin_guang");
			// this.btnStopAni = new DBComponent("sdxl_spin_guang");
			this.btnStopAni.horizontalCenter = 17;
			this.btnStopAni.bottom = 80;

			this.bgDb.play("", 0);
			this.bgDb.horizontalCenter = 0;
			this.bgDb.bottom = 120;
			this.effecttGroup.addChild(this.bgDb);
			this.bgDb.resetPosition();
			this.bgDb.touchEnabled = false;
			this.dbMouseOn = DBComponent.create("sdxl_mouseon", "sdxl_mouseon");
			// this.dbMouseOn = new DBComponent("sdxl_mouseon");
			this.dbMouseOn.play("", 0);
			this.dbMouseOn.horizontalCenter = 17;
			this.dbMouseOn.bottom = 35;
			this.runGroup.addChild(this.dbMouseOn);
			this.dbMouseOn.resetPosition();
			this.dbMouseOn.touchEnabled = false;
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterGame, this);
			EventManager.instance.addEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
			EventManager.instance.addEvent(EventNotify.AUTO_GAME, this.startAutoGame, this);
			EventManager.instance.addEvent(EventNotify.SDXL_ENTER_COMMON_GAME, this.free2Common, this);
			EventManager.instance.addEvent(ServerNotify.s_kickGame, this.kickGame, this);
		}

		private addMouseOnEvent() {
			this.muneBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeMenuBtn, this);
			this.muneBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeMenuBtn2, this);
			this.sdxlSettingBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changesettingBtn, this);
			this.sdxlSettingBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changesettingBtn2, this);
			this.tipsBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changetipsBtn, this);
			this.tipsBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changetipsBtn2, this);
			this.addBet.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeBetAddBtn, this);
			this.addBet.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeBetAddBtn2, this);
			this.subBet.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeBetSubBtn, this);
			this.subBet.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeBetSubBtn2, this);
			this.maxBet.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeyazhuBtn, this);
			this.maxBet.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeyazhuBtn2, this);
			this.autoGameBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeAutoRunBtn, this);
			this.autoGameBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeAutoRunBtn2, this);
			this.sdxlRecordBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeGameRecord, this);
			this.sdxlRecordBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeGameRecord2, this);
			this.quitBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeOutBtn, this);
			this.quitBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeOutBtn2, this);
		}
		private changeMenuBtn() {
			this.muneBtn.currentState = "down";
		}
		private changeMenuBtn2() {
			this.muneBtn.currentState = "up";
		}
		private changesettingBtn() {
			this.sdxlSettingBtn.currentState = "down";
		}
		private changesettingBtn2() {
			this.sdxlSettingBtn.currentState = "up";
		}
		private changetipsBtn() {
			this.tipsBtn.currentState = "down";
		}
		private changetipsBtn2() {
			this.tipsBtn.currentState = "up";
		}
		private changeBetAddBtn() {
			this.addBet.currentState = "down";
			this.betTtipsGroup.visible = true;
		}
		private changeBetAddBtn2() {
			this.addBet.currentState = "up";
			egret.setTimeout(() => { this.betTtipsGroup.visible = false; }, this, 5000)
		}
		private changeBetSubBtn() {
			this.subBet.currentState = "down";
			this.betTtipsGroup.visible = true;
		}
		private changeBetSubBtn2() {
			this.subBet.currentState = "up";
			egret.setTimeout(() => { this.betTtipsGroup.visible = false; }, this, 5000)
		}
		private changeyazhuBtn() {
			this.maxBet.source = RES.getRes("sdxl_bet2_png");
		}
		private changeyazhuBtn2() {
			this.maxBet.source = RES.getRes("sdxl_bet1_png");
		}
		private changeAutoRunBtn() {
			this.autoGameBtn.currentState = "down";
		}
		private changeAutoRunBtn2() {
			this.autoGameBtn.currentState = "up";
		}
		private changeGameRecord() {
			this.sdxlRecordBtn.currentState = "down";
		}
		private changeGameRecord2() {
			this.sdxlRecordBtn.currentState = "up";
		}

		private changeOutBtn() {
			this.quitBtn.currentState = "donw";
		}
		private changeOutBtn2() {
			this.quitBtn.currentState = "up";
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterGame, this);
			EventManager.instance.removeEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
			EventManager.instance.removeEvent(EventNotify.AUTO_GAME, this.startAutoGame, this);
			EventManager.instance.removeEvent(EventNotify.SDXL_ENTER_COMMON_GAME, this.free2Common, this);
			EventManager.instance.removeEvent(ServerNotify.s_kickGame, this.kickGame, this);
		}
		/**
		 * 进入游戏发送c_enter
		 */
		public async startGame() {
			let resp1: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_queryGameState, {});
			let data = { "gameId": Global.gameProxy.gameIds["slot"], "sceneId": 1002 }
			let resp: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_enter, data);
			if (resp.error.code != 0) {
				let text = resp.error.msg;
				Global.alertMediator.addAlert(text, () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDXL);
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LAOHUJI_HALL);
				}, "", true);
				return;
			}
			SoundManager.getInstance().playMusic("sdxl_background_mus_mp3");
		}
		/**
		 * 超时未下注请出房间
		 */
		private kickGame() {
			let text = "你已超过5分钟局未下注,请重新进入游戏";
			Global.alertMediator.addAlert(text, () => {
				Global.playerProxy.playerData.gold = game.SDXLUtils.ToTalMoney;
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDXL);
			}, "", true);
			return;
		}
		/**
		 * 进入游戏初始化玩家信息
		 * @param  {egret.Event} e
		 */
		public enterGame(e: egret.Event) {
			let resp = e.data;
			game.SDXLUtils.bets = [];
			game.SDXLUtils.muls = [];
			for (let i = 0; i < resp.roomInfo.gamePayTable.bets.length; i++) {
				game.SDXLUtils.bets.push(resp.roomInfo.gamePayTable.bets[i]);
			}
			for (let j = 0; j < resp.roomInfo.gamePayTable.muls.length; j++) {
				game.SDXLUtils.muls.push(resp.roomInfo.gamePayTable.muls[j]);
			}
			if (resp.roomInfo.gamePayTable) {
				game.SDXLUtils.FreeTimeMul = [];
				for (let k = 0; k < resp.roomInfo.gamePayTable.freeGameMuls.length; k++) {
					game.SDXLUtils.FreeTimeMul.push(resp.roomInfo.gamePayTable.freeGameMuls[k]);
				}
				game.SDXLUtils.FreeTimeMulIndex = resp.roomInfo.players.freeMulIndex;
				game.SDXLUtils.FreeTimeMul = game.SDXLUtils.FreeTimeMul[game.SDXLUtils.FreeTimeMulIndex];
				game.SDXLUtils.freeTimes = resp.roomInfo.players.freeTimes;
				game.SDXLUtils.freeWin = resp.roomInfo.players.freeWinGold;
			}
			this.ownGold = resp.roomInfo.players.gold;
			this.playerMoney.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
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
			game.SDXLUtils.ToTalMoney = this.ownGold;
			game.SDXLUtils.bet = game.SDXLUtils.bets[0];
			game.SDXLUtils.mul = game.SDXLUtils.muls[0];

			//判断是否为免费游戏
			if (resp.roomInfo.players.isScatter == 1 && resp.roomInfo.players.freeTimes == 0) {
				game.SDXLUtils.bet = resp.roomInfo.players.lastBet;
				game.SDXLUtils.mul = resp.roomInfo.players.lastMul;

				EventManager.instance.dispatch(EventNotify.SDXL_ENTER_FREE_GAME_SCENE);
			} else if (resp.roomInfo.players.isScatter == 0 && resp.roomInfo.players.freeTimes != 0) {
				game.LaohuUtils.freeWin = resp.roomInfo.players.freeWinGold;
				game.LaohuUtils.freeTimes = resp.roomInfo.players.freeTimes;
				game.SDXLUtils.bet = resp.roomInfo.players.lastBet;
				game.SDXLUtils.mul = resp.roomInfo.players.lastMul;
				EventManager.instance.dispatch(EventNotify.SDXL_START_FREE_GAME_SCENE);
			}
			switch ((game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) {
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
			this.totalBet.text = NumberFormat.handleFloatDecimal((game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) + "";
			this.beishu.text = parseInt(game.SDXLUtils.bet * game.SDXLUtils.mul * 100 + "") + "";
			this.maxWinLabel.text = "最高可得: " + parseInt(game.SDXLUtils.bet * game.SDXLUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
		}
		/**
		 * @param  {egret.TouchEvent} e
		 */
		public onTouchTap(e: egret.TouchEvent) {
			switch (e.target) {
				case this.muneBtn:
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					if (this.menuGroup.visible == false) {
						this.menuGroup.visible = true;
					} else {
						this.menuGroup.visible = false;
					}
					break;
				case this.tipsBtn:
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SDXL_TIPS);
					break;
				case this.startBtn:
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					this.startBtnTouch();
					break;
				case this.quitBtn:
					if (this.scatter == 1) return;
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_LEAVE_LAOHU_PANEL);
					break;
				case this.addBet:
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					this.addBets();
					break;
				case this.subBet:
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					this.reduceBet();
					break;
				case this.autoGameBtn:
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SDXL_AUTO_PANEL);
					break;
				case this.maskRect:
					this.scrollerFastGame();
					break;
				case this.sdxlSettingBtn:
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING);
					this.menuGroup.visible = false;
					break;
				case this.sdxlRecordBtn:
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					this.openGameRecord();
					this.menuGroup.visible = false;
					break;
				case this.maxBet:
					SoundManager.getInstance().playEffect("sdxl_button_dntg_mp3");
					this.setMaxBet();
					break;
				case this.startBtn0:
					this.startBtnTouch0();
					break;
			}
		}
		public runningType: number = 3;
		/**
		 * 开始转动
		 */
		private async startBtnTouch() {
			if (game.SDXLUtils.bet * game.SDXLUtils.mul * 50 > this.ownGold) {
				let text = "金币不足";
				Global.alertMediator.addAlert(text, () => {
					this.resetBtnColor();
					Global.playerProxy.playerData.gold = this.ownGold;
				}, "", true);
				return;
			}
			this.menuGroup.visible = false;
			var colorMatrix = [
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			if (this.runningType == RUNNING_TYPE.EMPTY) {
				if (this.scatter == 1) return;
				if (game.LaohuUtils.isAutoGame && game.LaohuUtils.auto_times >= 1) {
					if (game.LaohuUtils.isAutoGame && game.LaohuUtils.auto_times <= 0) {
						game.LaohuUtils.isAutoGame = false;
						game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
						game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
						this.resetBtnColor();
						this.startBtn.source = "sdxl_startbtn_png";
						this.timesLabel.text = "";
						game.LaohuUtils.speed = 48;
						this.runningType = RUNNING_TYPE.EMPTY;
						SoundManager.getInstance().stopEffectByName("sdxl_reel_mp3");
						this.resetStartBtn();
						return;
					}
					if (game.LaohuUtils.totalAdd && game.LaohuUtils.isAutoGame) {
						if (game.LaohuUtils.totalBet >= game.LaohuUtils.totalAdd) {
							game.LaohuUtils.isAutoGame = false;
							this.resetBtnColor();
							this.startBtn.source = "sdxl_startbtn_png";
							this.timesLabel.text = "";
							game.LaohuUtils.speed = 48;
							this.runningType = RUNNING_TYPE.EMPTY;
							SoundManager.getInstance().stopEffectByName("sdxl_reel_mp3");
							this.resetStartBtn();
							return;
						}
					}
					if (game.LaohuUtils.totalWin && game.LaohuUtils.isAutoGame) {
						if (game.LaohuUtils.totoalWinGold >= game.LaohuUtils.totalWin) {
							game.LaohuUtils.isAutoGame = false;
							game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
							game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
							this.resetBtnColor();
							this.startBtn.source = "sdxl_startbtn_png";
							this.timesLabel.text = "";
							game.LaohuUtils.speed = 48;
							this.runningType = RUNNING_TYPE.EMPTY;
							SoundManager.getInstance().stopEffectByName("sdxl_reel_mp3");
							this.resetStartBtn();
							return;
						}
					}
					game.UIUtils.removeSelf(this.dbMouseOn);
					game.LaohuUtils.auto_times -= 1;
					this.timesLabel.visible = true;
					this.timesLabel.text = game.LaohuUtils.auto_times + "";
					game.LaohuUtils.totalBet += game.SDXLUtils.bet * game.SDXLUtils.mul * 50
					if (game.LaohuUtils.auto_times > 1000) {
						this.timesLabel.text = "s";
					}
				} else if (game.LaohuUtils.isAutoGame && game.LaohuUtils.auto_times <= 0) {
					this.timesLabel.visible = false;
					game.LaohuUtils.isAutoGame = false;
					this.startBtn.source = "sdxl_startbtn_png";
					this.resetBtnColor();
					this.resetStartBtn();
					return;
				} else if (!game.LaohuUtils.isAutoGame) {
					this.setStartBtn();
					game.LaohuUtils.speed = 48;
					this.dbGameRun.filters = [colorFlilter];
				}
				this.winNum.text = 0 + "";
				this.startBtn.filters = [colorFlilter];
				this.runningType = RUNNING_TYPE.LOOP;
				this.removeLastAni();
				this.scroller.stopIconDb();
				this.isStopAni = true;
				this.setBtncolor();
				this.scroller.run();
				this.ownGold -= game.SDXLUtils.bet * game.SDXLUtils.mul * 50;
				this.playerMoney.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
				SoundManager.getInstance().playEffect("sdxl_reel_mp3", true);
				this.messageSend();
			} else if (this.runningType == RUNNING_TYPE.RESULT) {
				game.LaohuUtils.auto_times = 0;
				this.timesLabel.text = "";
				this.fastGame();
				game.LaohuUtils.isAutoGame = false;
			} else if (this.runningType == RUNNING_TYPE.STOP) {
			}
		}
		/**
		 * 测试按钮
		 */
		public isTest: boolean = false;
		public spinTest: number = 0;
		public wheel: Array<Array<number>>;
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
			this.removeLastAni();
			this.setStartBtn();
			this.scroller.stopIconDb();
			this.scroller.run();
			this.messageSend();
		}
		private HuiAtr: Array<Array<number>> = [[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]];
		//移除旋转中奖上次动画
		public removeLastAni() {
			this.setBtncolor();
			// this.setBgColor();
			if (this.winGold > 0) {
				egret.clearTimeout(this.sethuiTimeout);
				for (let i = 1; i <= 5; i++) {
					this.scroller[`item${i}`].resetSpecilHui();
				}
			}
			game.UIUtils.removeSelf(this.commomScore);
			this.fastEnd = false;
			this.scroller.stopIconDb();
			egret.clearTimeout(this.removeScoreTimeout);
			egret.clearTimeout(this.eachLineTimeOut);
			egret.clearTimeout(this.showIconTimeOut);
			game.UIUtils.removeSelf(this.commomScore);
			game.UIUtils.removeSelf(this.winGoldDiAni);
		}
		/**
		 * 非免费游戏更换按钮动画
		 */
		private setStartBtn() {
			game.UIUtils.removeSelf(this.dbMouseOn);
			if (!this.dbGameRun) {
				this.dbGameRun = new DBComponent("sdxl_db_run");
				GameCacheManager.instance.setCache("sdxl_db_run", this.dbGameRun);
			}
			this.dbGameRun.horizontalCenter = 17;
			this.dbGameRun.bottom = 35;
			this.dbGameRun.play("", 0);
			if (!this.dbSpinGuang) {
				this.dbSpinGuang = new DBComponent("sdxl_spin_guang");
				GameCacheManager.instance.setCache("sdxl_spin_guang", this.dbSpinGuang);
			}
			this.dbSpinGuang.horizontalCenter = 17;
			this.dbSpinGuang.bottom = 80;
			this.dbSpinGuang.play("", 1);
			this.runGroup.addChild(this.dbGameRun);
			this.dbGameRun.resetPosition();
			this.runGroup.addChild(this.dbSpinGuang);
			this.dbSpinGuang.resetPosition();
			this.dbGameRun.touchEnabled = this.dbSpinGuang.touchEnabled = false;
		}
		/**
		 * 正常转动完成spin按钮播放初始动画
		 */
		private resetStartBtn() {
			game.UIUtils.removeSelf(this.dbGameRun);
			if (!this.dbMouseOn) {
				this.dbMouseOn = new DBComponent("sdxl_mouseon");
				GameCacheManager.instance.setCache("sdxl_mouseon", this.dbMouseOn);
			}
			this.dbMouseOn.horizontalCenter = 17;
			this.dbMouseOn.bottom = 35;
			this.dbMouseOn.play("", 0);
			this.runGroup.addChild(this.dbMouseOn);
			this.dbMouseOn.resetPosition();
			this.dbMouseOn.touchEnabled = false
		}
		/**
		 * 游戏开始按钮置灰
		 */
		private setBtncolor() {
			var colorMatrix = [
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0.3, 0.6, 0, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			this.muneBtn.filters = this.autoGameBtn.filters = this.tipsBtn.filters = this.addBet.filters = this.subBet.filters = this.maxBet.filters = [colorFlilter];
			this.quitBtn.touchEnabled = this.muneBtn.touchEnabled = this.autoGameBtn.touchEnabled = this.tipsBtn.touchEnabled = this.addBet.touchEnabled = this.subBet.touchEnabled = this.maxBet.touchEnabled = false;
		}
		/**
		 * 转动完成按钮变成原来颜色
		 */
		private resetBtnColor() {
			var colorMatrix = [
				1, 0, 0, 0, 0,
				0, 1, 0, 0, 0,
				0, 0, 1, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			this.muneBtn.filters = this.autoGameBtn.filters = this.tipsBtn.filters = this.addBet.filters = this.subBet.filters = this.maxBet.filters = [colorFlilter];
			this.quitBtn.touchEnabled = this.muneBtn.touchEnabled = this.autoGameBtn.touchEnabled = this.tipsBtn.touchEnabled = this.addBet.touchEnabled = this.subBet.touchEnabled = this.maxBet.touchEnabled = true;
		}
		/**
		 * 开始自动游戏
		 */
		private startAutoGame() {
			if (game.SDXLUtils.bet * game.SDXLUtils.mul * 50 > this.ownGold) {
				let text = "金币不足";
				Global.alertMediator.addAlert(text, "", "", true);
				return;
			}
			this.startBtn.source = "sdxl_stop_png";
			game.LaohuUtils.isAutoGame = true;
			game.LaohuUtils.speed = 70;
			if (game.LaohuUtils.auto_times > 1000) {
				this.timesLabel.text = "s";
			} else {
				this.timesLabel.text = game.LaohuUtils.auto_times + "";
			}
			this.startBtnTouch();
		}

		private showAtr: Array<Array<number>>;  // 展示图标数组
		private bonusAtr: Array<Array<number>>;  //中奖图标数组
		private allAtr: Array<Array<number>>
		private eachLineScore: Array<number>; //每条线的中奖金额
		private winGold: number = 0;   //每次赢得的金币
		public messageTimeOut: any;   //收到消息后旋转时间延迟
		private scatterIcon: number = 0; //小龙女图标的数量
		public scatter: number = 0;  //是否中免费游戏
		public yudiAtr: Array<number>;
		/**
		 * 旋转结果
		 */
		private fastEnd: boolean = false;
		/**
		 * c_bet消息收发
		 */
		public async messageSend() {
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
					data2 = { "spinType": this.spinTest, "bet": game.SDXLUtils.bet, "multiple": game.SDXLUtils.mul, "lineCount": 243, "activityId": 0, "freeWheel": this.wheel };
				} else {
					data2 = { "spinType": this.spinTest, "bet": game.SDXLUtils.bet, "multiple": game.SDXLUtils.mul, "lineCount": 243, "activityId": 0, "wheel": this.wheel };
				}
			} else {
				data2 = { "spinType": 0, "bet": game.SDXLUtils.bet, "multiple": game.SDXLUtils.mul, "lineCount": 243, "activityId": 0 };
			}
			let resp2: any = await Global.pomelo.request(ServerPostPath.game_slotHandler_c_bet, data2);
			if (resp2.error) {
				let text = resp2.error.msg;
				Global.alertMediator.addAlert(text, "", "", true);
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDXL);
				return;
			}
			var colorMatrix = [
				1, 0, 0, 0, 0,
				0, 1, 0, 0, 0,
				0, 0, 1, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			this.startBtn.filters = [colorFlilter];
			if (!game.LaohuUtils.isAutoGame) this.dbGameRun.filters = [colorFlilter];
			let resp1: any = resp2.spinRes;
			this.showAtr = [resp1.matrix[0], resp1.matrix[1], resp1.matrix[2], resp1.matrix[3], resp1.matrix[4]];
			this.messageTimeOut = egret.setTimeout(() => {
				this.scroller.runResult(this.showAtr);
			}, this, 300);
			this.runningType = RUNNING_TYPE.RESULT;
			this.winGold = resp2.winCount;
			this.ownGold = resp2.own_gold;
			// this.ownGold -= game.SDXLUtils.bet * game.SDXLUtils.mul * 50;
			game.SDXLUtils.ToTalMoney = this.ownGold;
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
			if (game.LaohuUtils.isAutoGame && game.LaohuUtils.totalWin) {
				game.LaohuUtils.totoalWinGold += this.winGold;
			}
			this.isStopAni = false;
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
		}
		/**
		 * 快速结束转动
		 */
		private fastGame() {
			if (this.scatterIcon >= 2) {
				this.fastEnd = true;
				egret.clearTimeout(this.scatter4timeout);
				egret.clearTimeout(this.scatter5timeout);
				SoundManager.getInstance().stopEffectByName("reel_fast_spin_none_mp3");
				SoundManager.getInstance().stopEffectByName("reel_fast_spin_win_mp3");
				this.scroller.removeScatterAni();
				this.scroller.item4.speed = 48;
				this.scroller.item5.speed = 48;
				this.startBtn.source = "sdxl_startbtn_png";
				this.scroller.runResultFast();
				for (let i = 1; i <= 4; i++) {
					this.scroller[`item${i}`].resetSpecilHui();
				}
			} if (game.LaohuUtils.isAutoGame) {
				game.LaohuUtils.speed = 48;
				egret.clearTimeout(this.autoGameTimeout);
				if (this.scatter != 1) this.resetBtnColor();
				this.resetStartBtn();
				this.timesLabel.text = "";
				game.LaohuUtils.isAutoGame = false;
				game.LaohuUtils.auto_times = 0;
				game.LaohuUtils.oneMax = 0;
				game.LaohuUtils.totalAdd = 0;
				game.LaohuUtils.totalBet = 0;
				this.startBtn.source = "sdxl_startbtn_png";
				game.LaohuUtils.oneMax = 0;
				game.LaohuUtils.totalAdd = 0;
				game.LaohuUtils.totalBet = 0;
				this.btnStopAni.play("", 1);
				this.runGroup.addChild(this.btnStopAni);
				this.btnStopAni.resetPosition();
				this.btnStopAni.callback = () => {
					game.UIUtils.removeSelf(this.btnStopAni);
				}
				game.LaohuUtils.free_time_times = game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
				this.scroller.runResultFast();
			}
			else {
				this.startBtn.source = "sdxl_startbtn_png";
				// this.setBgColor();
				if (this.scroller.runResultFast()) {
					this.runningType = RUNNING_TYPE.LOOP;
				}
				SoundManager.getInstance().stopEffectByName("sdxl_reel_fast_spin_none_mp3");
				SoundManager.getInstance().stopEffectByName("sdxl_reel_fast_spin_win_mp3");
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
						this.scroller.removeScatterAni();
						this.scroller.item4.speed = 48;
						this.scroller.item5.speed = 48;
						for (let i = 1; i <= 4; i++) {
							this.scroller[`item${i}`].resetSpecilHui();
						}
						// this.scroller.runResultFast();
					}
				}
				// this.setBgColor();
				this.scroller.runResultFast();
				SoundManager.getInstance().stopEffectByName("sdxl_reel_fast_spin_none_mp3");
				SoundManager.getInstance().stopEffectByName("sdxl_reel_fast_spin_win_mp3");
			}
		}

		private autoGameTimeout: any;
		private scatter4timeout: any;
		private scatter5timeout: any;
		/**
		 * @param  {egret.Event} e
		 * 每个转轴转动结束
		 */
		public scrollerEnd(e: egret.Event) {
			let data = e.data;
			if (data.sceneIndex != 1) {
				return;
			}
			let index = e.data.index;
			switch (index) {
				case 5:
					if (game.LaohuUtils.oneMax && game.LaohuUtils.isAutoGame) {
						if (this.winGold >= game.LaohuUtils.oneMax) {
							game.LaohuUtils.isAutoGame = false;
							game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
							game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
							this.resetBtnColor();
							this.startBtn.source = "sdxl_startbtn_png";
							this.timesLabel.text = "";
							game.LaohuUtils.speed = 48;
							this.runningType = RUNNING_TYPE.EMPTY;
							SoundManager.getInstance().stopEffectByName("sdxl_reel_mp3");
							this.resetStartBtn();
						}
					}
					this.scroller.removeIconHui(this.HuiAtr);
					this.playerMoney.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
					SoundManager.getInstance().stopEffectByName("sdxl_reel_mp3");
					if (this.showAtr) {
						if (this.showAtr.length != 0) {
							for (let i = 0; i < this.showAtr[4].length; i++) {
								//判断第5列上是否有scatter
								if (this.showAtr[4][i] == 2) {
									for (let j = 0; j < 3; j++) {
										if (this.showAtr[2][j] == 2) {
											for (let k = 0; k < 3; k++) {
												if (this.showAtr[0][k] == 2) {
													SoundManager.getInstance().playEffect("sdxl_scat_dntg_mp3");
													this.scroller.addFoGuang1(5, i, "sdxl_icon1_di");
												}
											}
										}
									}
								} else {
									SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
								}
							}
						}
						this.winNum.text = this.winGold + "";
						if (game.LaohuUtils.auto_times >= 0 && game.LaohuUtils.isAutoGame) {
							this.winNum.text = NumberFormat.handleFloatDecimal(this.winGold) + "";
							if (this.scatter == 1) {
								this.quitBtn.touchEnabled = false;
								this.checkBonusIcon();
								return;
							}
							egret.setTimeout(() => {
								LogUtils.logD("empty4");
								if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
							}, this, 500);
							if (this.winGold > 0) {
								this.autoGameTimeout = egret.setTimeout(this.startBtnTouch, this, 2000);
							} else {
								this.autoGameTimeout = egret.setTimeout(this.startBtnTouch, this, 1000);
							}
						}
						else {
							if (this.scatter != 1) {
								this.resetStartBtn();
								this.resetBtnColor();
							}
							egret.setTimeout(() => {
								LogUtils.logD("empty5");
								if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
							}, this, 500);
						}
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
										SoundManager.getInstance().playEffect("sdxl_scat_dntg_mp3");
										this.scroller.addFoGuang1(3, i, "sdxl_icon1_di");
									}
								}

							} else {
								SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
							}
						}
						//是否可能中scatter，4,5列加速
						if (this.scatterIcon >= 2) {
							let atr: Array<Array<number>> = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
							this.scroller.setSpecilHui(atr);
							// this.setBGHui();
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
							SoundManager.getInstance().playEffect("sdxl_reel_fast_spin_none_mp3")
							this.scatter4timeout = egret.setTimeout(() => {
								item4.changeResult(this.showAtr[3]);
								this.scroller.removeScatterAni(4);
								this.scroller.addScatterAni(5);
								this.scroller.setSpecilHui([[], [], [], [0, 1, 2], []]);
								if (this.scatter != 1) { SoundManager.getInstance().playEffect("sdxl_reel_fast_spin_none_mp3") }
								else { SoundManager.getInstance().playEffect("sdxl_reel_fast_spin_win_mp3"); }
							}, this, 2500);
							this.scatter5timeout = egret.setTimeout(() => {
								item5.changeResult(this.showAtr[4]);
								this.scroller.removeScatterAni(5);
								if (this.scatter != 1) { SoundManager.getInstance().stopEffectByName("sdxl_reel_fast_spin_none_mp3") }
								else { SoundManager.getInstance().stopEffectByName("sdxl_reel_fast_spin_win_mp3"); }
								egret.clearTimeout(this.autoGameTimeout);
								this.scroller.removeIconHui(this.HuiAtr);
								// this.setBgColor();
							}, this, 5000);
						}
					}
					break;
				case 1:
					if (this.showAtr) {
						for (let i = 0; i < this.showAtr[0].length; i++) {
							//判断第1列上是否有scatter
							if (this.showAtr[0][i] == 2) {
								SoundManager.getInstance().playEffect("sdxl_scat_dntg_mp3");
								this.scroller.addFoGuang1(1, i, "sdxl_icon1_di");
							} else {
								SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
							}
						}
					}
					break;
				case 4:
					SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
					break;
				case 2:
					SoundManager.getInstance().playEffect("sdxl_reelstop1_dntg_mp3");
					break;
			}
		}
		public commomScore: eui.BitmapLabel = new eui.BitmapLabel();
		private removeScoreTimeout: any;
		private isStopAni: boolean = false;
		// /**
		//  * 背景置灰
		//  */

		private eachLineTimeOut: any
		/**
		 * 转动完成开始展示奖励
		 */
		private checkBonusIcon() {
			//是否满足bigwin条件
			if (this.scatter == 1 && !game.LaohuUtils.isAutoGame) this.resetStartBtn();
			if (this.scatter == 1 && game.LaohuUtils.isAutoGame) {
				this.startBtn.source = "sdxl_startbtn_png";
				this.timesLabel.visible = false;
				this.resetStartBtn();
			}
			if (this.winGold >= (game.SDXLUtils.bet * game.SDXLUtils.mul * 50) * 15) {
				// this.setBGHui();
				egret.clearTimeout(this.autoGameTimeout);
				if (this.bonusAtr.length > 0 && this.winGold > 0) {
					let func = () => {
						this.bigWinPanel.touchEnabled = false;
						// game.UIUtils.removeSelf(this.bigWinPanel);
						this.bigWinPanel.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);

						if (this.scatter != 1) this.startBtn.touchEnabled = true;
						if (!game.LaohuUtils.isAutoGame) {
							this.runningType = RUNNING_TYPE.EMPTY;
						}
						/**
						 * bigwin结束窗口效果
						 */
						this.bigWinPanel.stopShowBigWin(() => {
							if (game.LaohuUtils.isAutoGame && this.scatter != 1) {
								this.autoGameTimeout = egret.setTimeout(() => {
									this.startBtnTouch();
								}, this, 2000);
							}
							if (!game.LaohuUtils.isAutoGame) { this.runningType = RUNNING_TYPE.EMPTY; }
							if (this.scatter != 1) this.muneBtn.touchEnabled = this.maxBet.touchEnabled = this.addBet.touchEnabled = this.subBet.touchEnabled = this.autoGameBtn.touchEnabled = this.tipsBtn.touchEnabled = this.quitBtn.touchEnabled = true;
							if (this.scatter == 1) this.addEachLineAni();
						});
						if (this.scatter != 1) {
							egret.setTimeout(() => {
								this.scroller.setIconHui();
								this.scroller.removeIconHui(this.allAtr);
								this.scroller.addBonusAni(this.allAtr, this.winGold);
								if (!game.LaohuUtils.isAutoGame) {
									this.eachLineTimeOut = egret.setTimeout(() => {
										this.addEachLineAni();
									}, this, 1710)
								}
							}, this, 4000)
						}
					}

					this.bigWinPanel = new SDXLBigWinGroup();

					this.bigWinPanel.showPanel();
					this.bigWinPanel.touchEnabled = false;
					egret.setTimeout(() => {
						this.bigWinPanel.touchEnabled = true;
						this.bigWinPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, func, this)
					}, this, 1500);
					/**
					 * bigwin窗口
					 * @param score,callback?
					 */
					this.bigWinPanel.showScore(this.winGold, () => {
						game.UIUtils.removeSelf(this.commomScore);
						if (game.LaohuUtils.isAutoGame && this.scatter != 1) {
							this.autoGameTimeout = egret.setTimeout(() => {
								this.startBtnTouch();
							}, this, 1500);
						}
						if (this.scatter != 1) {
							this.startBtn.touchEnabled = true; this.scroller.stopIconDb();
							this.scroller.addBonusAni(this.allAtr, this.winGold);
							this.muneBtn.touchEnabled = this.maxBet.touchEnabled = this.addBet.touchEnabled = this.subBet.touchEnabled = this.autoGameBtn.touchEnabled = this.tipsBtn.touchEnabled = this.quitBtn.touchEnabled = true;
						}
						if (!game.LaohuUtils.isAutoGame) { this.runningType = RUNNING_TYPE.EMPTY; }
						if (this.scatter == 1) this.addEachLineAni();
						game.UIUtils.removeSelf(this.bigWinPanel);
					})
					this.resizeGroup.addChild(this.bigWinPanel);
				}//bigwin后中免费游戏 
				else {
					if (this.scatter == 1) {
						this.runningType = RUNNING_TYPE.STOP;
						this.quitBtn.touchEnabled = false;
						this.scroller.addFoGuang(1, this.yudiAtr[0], "sdxl_icon_2");
						this.scroller.addFoGuang(3, this.yudiAtr[1], "sdxl_icon_2");
						this.scroller.addFoGuang(5, this.yudiAtr[2], "sdxl_icon_2");
						EventManager.instance.dispatch(EventNotify.SDXL_ENTER_FREE_GAME_SCENE);
						// this.resetBtnColor();
						if (!game.LaohuUtils.isAutoGame) this.resetStartBtn();
						if (this.scatter == 1 && game.LaohuUtils.isAutoGame) {
							this.startBtn.source = "sdxl_startbtn_png";
							this.timesLabel.visible = false;
							this.resetStartBtn();
						}
					}
				}
			}//未中bigwin 
			else {
				//中奖
				if (this.bonusAtr.length > 0 && this.winGold > 0) {
					// this.setBGHui();
					SoundManager.getInstance().playEffect("sdxl_win_dntg_mp3");
					if (this.scatter == 1) this.runningType = RUNNING_TYPE.STOP;
					this.scroller.setIconHui();
					this.scroller.removeIconHui(this.allAtr);
					this.scroller.addBonusAni(this.allAtr, this.winGold);
					// this.commomScore = new eui.BitmapLabel();
					this.commomScore.font = "sdxl_wingold_fnt";
					let data = Number(new Big(this.winGold).mul(100));
					this.commomScore.text = NumberFormat.handleFloatDecimal(data) + "";
					this.commomScore.textAlign = "center";
					this.commomScore.verticalCenter = 0;
					this.commomScore.horizontalCenter = 0;
					this.winGoldDiAni.play("", 1);
					this.sethuiTimeout = egret.setTimeout(() => { this.scroller.setIconHui(); }, this, 1700)
					this.scroller.addChild(this.winGoldDiAni);
					this.winGoldDiAni.resetPosition();
					this.scroller.addChild(this.commomScore);
					this.removeScoreTimeout = egret.setTimeout(() => {
						game.UIUtils.removeSelf(this.commomScore);
						game.UIUtils.removeSelf(this.winGoldDiAni);
						this.addEachLineAni();
					}, this, 2500);
				}
				//未中奖 
				else {
					if (this.scatter == 1) {
						this.runningType = RUNNING_TYPE.STOP;
						this.quitBtn.touchEnabled = false;
						this.scroller.addFoGuang(1, this.yudiAtr[0], "sdxl_icon_2");
						this.scroller.addFoGuang(3, this.yudiAtr[1], "sdxl_icon_2");
						this.scroller.addFoGuang(5, this.yudiAtr[2], "sdxl_icon_2");
						egret.setTimeout(() => {
							EventManager.instance.dispatch(EventNotify.SDXL_ENTER_FREE_GAME_SCENE);
							// if (!game.LaohuUtils.isAutoGame) this.resetBtnColor();
						}, this, 2700);
						if (!game.LaohuUtils.isAutoGame) this.resetStartBtn();
						if (this.scatter == 1 && game.LaohuUtils.isAutoGame) {
							this.startBtn.source = "sdxl_startbtn_png";
							this.timesLabel.visible = false;
							this.resetStartBtn();
						}
					}
				}
			}
		}

		private showIconTimeOut: any;
		private sethuiTimeout: any;
		/**
		 * 中奖图标播放每条连线
		 */
		private addEachLineAni() {
			if (this.bonusAtr.length > 0 && this.winGold > 0) {
				if (this.scatter == 1) { this.quitBtn.touchEnabled = false; this.resetStartBtn(); }
				let count = 0;
				//逐个展示中奖连线
				async.eachSeries(this.bonusAtr, (index, callback) => {
					if (this.isStopAni) return;
					game.UIUtils.removeSelf(this.commomScore);
					this.scroller.setSpecilHui([[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]]);
					for (let j = 0; j < index.length; j++) {
						let k = j + 1;
						this.scroller[`item${k}`].resetIconHui(index[j]);
						this.scroller[`item${k}`].showAni(index[j]);
						// this.commomScore = new eui.BitmapLabel();
						this.commomScore.font = "sdxl_wingold_fnt";
						let data = Number(new Big(this.eachLineScore[count]).mul(100));
						this.commomScore.text = NumberFormat.handleFloatDecimal(data, 0) + "";
						this.commomScore.verticalCenter = ((index[2] - 1)) * 184;
						this.commomScore.horizontalCenter = 0;
						this.commomScore.textAlign = "center";
						this.commomScore.scaleX = 0.8;
						this.commomScore.scaleY = 0.8;
						this.scroller.addChild(this.commomScore);
					}

					if (this.bonusAtr.length == 1) {
						if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
						this.sethuiTimeout = egret.setTimeout(() => {
							this.scroller.setIconHui();
							game.UIUtils.removeSelf(this.commomScore);
						}, this, 1710)
						this.showIconTimeOut = egret.setTimeout(callback, this, 2210);
					}
					if (this.bonusAtr.length > 1) {
						if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
						this.sethuiTimeout = egret.setTimeout(() => {
							this.scroller.setIconHui();
							game.UIUtils.removeSelf(this.commomScore);
						}, this, 1710)
						this.showIconTimeOut = egret.setTimeout(callback, this, 2210);
					}
					count++;
				}, () => {
					//callback 判断结果是否为scatter
					if (this.scatter == 1) {
						game.UIUtils.removeSelf(this.commomScore);
						// this.startBtn.touchEnabled = false;
						this.quitBtn.touchEnabled = false;
						this.runningType = RUNNING_TYPE.STOP;
						this.scroller.removeIconHui(this.HuiAtr);
						this.scroller.addFoGuang(1, this.yudiAtr[0], "sdxl_icon_2");
						this.scroller.addFoGuang(3, this.yudiAtr[1], "sdxl_icon_2");
						this.scroller.addFoGuang(5, this.yudiAtr[2], "sdxl_icon_2");
						egret.setTimeout(() => {
							EventManager.instance.dispatch(EventNotify.SDXL_ENTER_FREE_GAME_SCENE);
						}, this, 2700)
						// this.resetBtnColor();
						if (!game.LaohuUtils.isAutoGame) this.resetStartBtn();
						if (this.scatter == 1 && game.LaohuUtils.isAutoGame) {
							this.startBtn.source = "sdxl_startbtn_png";
							this.timesLabel.visible = false;
							this.resetStartBtn();
						}
					}
					else {
						count = 0;
						this.scroller.setIconHui();
						game.UIUtils.removeSelf(this.commomScore);
						return this.addEachLineAni();
					}

				})
			}
		}
		/**
		 * 免费游戏结束后回到正常游戏
		 */
		private free2Common() {
			this.scatter = 0;
			this.runningType = RUNNING_TYPE.EMPTY;
			this.quitBtn.touchEnabled = true;
			this.scroller.speed = 48;
			this.resetBtnColor();
			SoundManager.getInstance().playMusic("sdxl_background_mus_mp3");
			if (game.LaohuUtils.stopAuto) {
				game.LaohuUtils.isAutoGame = false;
				game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
				game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
				this.startBtn.source = "sdxl_startbtn_png";
				this.timesLabel.text = "";
				game.LaohuUtils.speed = 48;
				this.runningType = RUNNING_TYPE.EMPTY;
			}
			if (game.LaohuUtils.isAutoGame) {
				game.UIUtils.removeSelf(this.dbMouseOn);
				egret.setTimeout(() => { this.startAutoGame(); }, this, 1000)
			}
			this.playerMoney.text = NumberFormat.handleFloatDecimal(game.SDXLUtils.ToTalMoney) + "";
			this.ownGold = game.SDXLUtils.ToTalMoney;
			game.LaohuUtils.freeWin = 0;
		}

		/**
		 * 打开游戏记录
		 */
		private openGameRecord() {
			// let record: dntg.DNTGGameRecordPanel = new DNTGGameRecordPanel();
			game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_DNTG_RECORD_PANEL);
		}
		/**
		 * 增加倍数
		 */
		private addBets() {
			if (this.bet <= 9) {
				game.LaohuUtils.totalWin = 0;
				this.bet += 1;
				SoundManager.getInstance().playEffect("button_dntg_mp3");
				switch (this.bet) {
					case 1:
						game.SDXLUtils.bet = game.SDXLUtils.bets[0];
						game.SDXLUtils.mul = game.SDXLUtils.muls[0];
						break;
					case 2:
						game.SDXLUtils.bet = game.SDXLUtils.bets[0];
						game.SDXLUtils.mul = game.SDXLUtils.muls[1];

						break;
					case 3:
						game.SDXLUtils.bet = game.SDXLUtils.bets[0];
						game.SDXLUtils.mul = game.SDXLUtils.muls[3];
						break;
					case 4:
						game.SDXLUtils.bet = game.SDXLUtils.bets[0];
						game.SDXLUtils.mul = game.SDXLUtils.muls[9];
						break;
					case 5:
						game.SDXLUtils.bet = game.SDXLUtils.bets[1];
						game.SDXLUtils.mul = game.SDXLUtils.muls[9];
						break;
					case 6:
						game.SDXLUtils.bet = game.SDXLUtils.bets[2];
						game.SDXLUtils.mul = game.SDXLUtils.muls[5];
						break;
					case 7:
						game.SDXLUtils.bet = game.SDXLUtils.bets[3];
						game.SDXLUtils.mul = game.SDXLUtils.muls[5];
						break;
					case 8:
						game.SDXLUtils.bet = game.SDXLUtils.bets[3];
						game.SDXLUtils.mul = game.SDXLUtils.muls[9];
						break;
					case 9:
						game.SDXLUtils.bet = game.SDXLUtils.bets[4];
						game.SDXLUtils.mul = game.SDXLUtils.muls[6];
						break;
					case 10:
						game.SDXLUtils.bet = game.SDXLUtils.bets[4];
						game.SDXLUtils.mul = game.SDXLUtils.muls[9];
						break;
				}
			}
			this.beishu.text = parseInt(game.SDXLUtils.bet * game.SDXLUtils.mul * 100 + "") + "";
			this.totalBet.text = NumberFormat.handleFloatDecimal((game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) + "";
			this.maxWinLabel.text = "最高可得: " + parseInt(game.SDXLUtils.bet * game.SDXLUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
			if ((game.SDXLUtils.bet * game.SDXLUtils.mul * 50) > this.ownGold) {
				let text = "金币不足";
				Global.alertMediator.addAlert(text, "", "", true);
				this.reduceBet();
			}
		}
		/**
		 * 减少倍数
		 */
		private reduceBet() {
			if (this.bet <= 1) {
				return;
			} else {
				game.LaohuUtils.totalWin = 0;
				SoundManager.getInstance().playEffect("button_dntg_mp3");
				this.bet -= 1;
				switch (this.bet) {
					case 1:
						game.SDXLUtils.bet = game.SDXLUtils.bets[0];
						game.SDXLUtils.mul = game.SDXLUtils.muls[0];
						break;
					case 2:
						game.SDXLUtils.bet = game.SDXLUtils.bets[0];
						game.SDXLUtils.mul = game.SDXLUtils.muls[1];
						break;
					case 3:
						game.SDXLUtils.bet = game.SDXLUtils.bets[0];
						game.SDXLUtils.mul = game.SDXLUtils.muls[3];
						break;
					case 4:
						game.SDXLUtils.bet = game.SDXLUtils.bets[0];
						game.SDXLUtils.mul = game.SDXLUtils.muls[9];
						break;
					case 5:
						game.SDXLUtils.bet = game.SDXLUtils.bets[1];
						game.SDXLUtils.mul = game.SDXLUtils.muls[9];
						break;
					case 6:
						game.SDXLUtils.bet = game.SDXLUtils.bets[2];
						game.SDXLUtils.mul = game.SDXLUtils.muls[5];
						break;
					case 7:
						game.SDXLUtils.bet = game.SDXLUtils.bets[3];
						game.SDXLUtils.mul = game.SDXLUtils.muls[5];
						break;
					case 8:
						game.SDXLUtils.bet = game.SDXLUtils.bets[3];
						game.SDXLUtils.mul = game.SDXLUtils.muls[9];
						break;
					case 9:
						game.SDXLUtils.bet = game.SDXLUtils.bets[4];
						game.SDXLUtils.mul = game.SDXLUtils.muls[6];
						break;
					case 10:
						game.SDXLUtils.bet = game.SDXLUtils.bets[4];
						game.SDXLUtils.mul = game.SDXLUtils.muls[9];
						break;
				}
			}
			this.beishu.text = parseInt(game.SDXLUtils.bet * game.SDXLUtils.mul * 100 + "") + "";
			this.totalBet.text = NumberFormat.handleFloatDecimal((game.SDXLUtils.bet * game.SDXLUtils.mul * 50)) + "";
			this.maxWinLabel.text = "最高可得: " + parseInt(game.SDXLUtils.bet * game.SDXLUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
		}
		/**
		 * 最大倍数
		 */
		private setMaxBet() {
			game.SDXLUtils.bet = game.SDXLUtils.bets[4];
			game.SDXLUtils.mul = game.SDXLUtils.muls[9];
			if (game.SDXLUtils.mul * game.SDXLUtils.bet * 50 > this.ownGold) {
				let text = "金币不足";
				Global.alertMediator.addAlert(text, "", "", true);
				return;
			}
			this.betTtipsGroup.visible = true;
			this.maxWinLabel.text = "最高可得: " + parseInt(game.SDXLUtils.bet * game.SDXLUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
			this.totalBet.text = NumberFormat.handleFloatDecimal(game.SDXLUtils.bet * game.SDXLUtils.mul * 50) + "";
			this.bet = 10;
			egret.setTimeout(() => { this.betTtipsGroup.visible = false }, this, 5000);
			this.beishu.text = parseInt(game.SDXLUtils.bet * game.SDXLUtils.mul * 100 + "") + "";
		}
	}
}