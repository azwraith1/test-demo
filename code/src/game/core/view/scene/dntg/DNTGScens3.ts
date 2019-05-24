module dntg {
	export class DNTGScens3 extends game.BaseComponent {
		public freeGroup: eui.Group;
		public roundBg0: eui.Image;
		public scroller: dntg.DNTGScroller;
		public tiangong0: eui.Image;
		public free_spin_label0: eui.BitmapLabel;
		public free_total_win0: eui.BitmapLabel;
		public bg0: eui.Image;
		public treeBg0: eui.Image;
		public bottomCloud0: eui.Image;
		public free03imag0: eui.Image;
		public free01imag0: eui.Image;
		public free05imag0: eui.Image;
		public free02imag0: eui.Image;
		public suijibeishuGroup0: eui.Group;
		public freemul0: eui.BitmapLabel;
		public freemul1: eui.BitmapLabel;
		public freemul2: eui.BitmapLabel;
		public effectGroup0: eui.Group;
		public free_game_mask0: eui.Rect;
		public peachGroup: eui.Group;
		public peach_0: eui.Image;
		public peach_2: eui.Image;
		public peach_3: eui.Image;
		public peach_1: eui.Image;
		public peachTipGroup: eui.Group;
		public freeGame0: eui.Image;
		public freeGame1: eui.Image;
		public freeGame2: eui.Image;
		public freeGame3: eui.Image;
		public clickTips0: eui.Label;
		public selectPeachAni: DBComponent;
		public resizeGroup: eui.Group;
		public constructor() {
			super();
			// this.skinName = new DNTGGameScene3Skin();
		}

		public createChildren() {
			super.createChildren();
			// this.listenOn();
			this.scroller.showFreeFirst(3);
			this.selectPeachAni = DBComponent.create("dntg_selectPeachAni", "freeani");
			// this.selectPeachAni = new DBComponent("freeani");
			this.selectPeachAni.x = 500;
			this.selectPeachAni.y = 120;
			this.resizeGroup.addChild(this.selectPeachAni);
			this.selectPeachAni.visible = false;
			this.peach_0.touchEnabled = this.peach_1.touchEnabled = this.peach_2.touchEnabled = this.peach_3.touchEnabled = false;
		}
		/**
		 * @param  {egret.TouchEvent} e
		 */
		public onTouchTap(e: egret.TouchEvent) {
			switch (e.target) {
				case this.peach_0:
					this.selectPeach(1);
					break;
				case this.peach_1:
					this.selectPeach(3);
					break;
				case this.peach_2:
					this.selectPeach(2);
					break;
				case this.peach_3:
					this.selectPeach(0);
					break;
			}
		}

		public onAdded() {
			super.onAdded();
			this.listenOn();

		}
		public onRemoved() {
			super.onRemoved();
			if (game.LaohuUtils.freeTimes > 0) {
				SoundManager.getInstance().stopEffectByName("reel_dntg_mp3");
				egret.clearTimeout(this.freegameTimeout);
			}
			egret.clearTimeout(this.freegameTimeout);
			egret.clearTimeout(this.messageTimeOut);
			this.listenOFF();
		}
		/**
		 * 初始化监听事件
		 */
		public listenOn() {
			EventManager.instance.addEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
			EventManager.instance.addEvent(EventNotify.DNTG_ENTER_FREE_GAME_SCENE, this.selectPeachTween, this);
			EventManager.instance.addEvent(EventNotify.DNTG_START_FREE_GAME_SCENE, this.startFreeGame, this);
			EventManager.instance.addEvent(ServerNotify.s_kickGame, this.kickGame, this);
		}
		/**
		 * 移除监听事件
		 */
		public listenOFF() {
			EventManager.instance.removeEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
			EventManager.instance.removeEvent(EventNotify.DNTG_ENTER_FREE_GAME_SCENE, this.selectPeachTween, this);
			EventManager.instance.removeEvent(EventNotify.DNTG_START_FREE_GAME_SCENE, this.startFreeGame, this);
			EventManager.instance.removeEvent(ServerNotify.s_kickGame, this.kickGame, this);
		}

		private sendTime: boolean = false; //桃子选择条件 true/false
		/**
		 * 选择桃子，发送消息
		 */
		private selectPeachTween() {
			if (!this.sendTime) {
				this.selectPeachAni.visible = true;
				// this.selectPeachAni = new DBComponent("freeani");
				this.sendTime = true;
				SoundManager.getInstance().playMusic("sactbackground_mus_dntg_mp3");
				this.selectPeachAni.x = 500;
				this.selectPeachAni.y = 120;
				this.setAutoTimeout(() => {
					this.selectPeachAni.play("", 1);
					this.setAutoTimeout(() => { SoundManager.getInstance().playEffect("freegame1_dntg_mp3"); }, this, 1600)
					this.resizeGroup.addChild(this.selectPeachAni);
				}, this, 1000);
				this.setAutoTimeout(() => {
					egret.Tween.get(this.peach_3)
						.to({ x: 100 }, 200)
						.to({ x: 140 }, 200);
					egret.Tween.get(this.peach_0)
						.to({ x: 420 }, 200)
						.to({ x: 460 }, 200);
					egret.Tween.get(this.peach_2)
						.to({ x: 740 }, 200)
						.to({ x: 780 }, 200);
					egret.Tween.get(this.peach_1)
						.to({ x: 1060 }, 200)
						.to({ x: 1100 }, 200).call(() => {
							egret.Tween.get(this.peachGroup)
								.to({ bottom: 180 }, 800, egret.Ease.sineIn)
								.to({ bottom: 150 }, 150)
								.to({ bottom: 190 }, 150)
								.to({ bottom: 185 }, 100)
								.to({ bottom: 180 }, 100).call(() => {
									this.peach_0.touchEnabled = this.peach_1.touchEnabled = this.peach_2.touchEnabled = this.peach_3.touchEnabled = true;
									this.selectPeachAni.visible = false;
									this.peachTipGroup.visible = true;
									this.clickTips0.visible = true;
									if (game.LaohuUtils.free_time_times == 0) {
									}
								})
						})
					this.setAutoTimeout(() => {
						if (game.LaohuUtils.free_time_times != 0) {
							if (game.LaohuUtils.free_time_times && game.LaohuUtils.isAutoGame) {
								switch (game.LaohuUtils.free_time_times) {
									case 5:
										this.selectPeach(3);
										break;
									case 10:
										this.selectPeach(2);
										break;
									case 15:
										this.selectPeach(1);
										break;
									case 20:
										this.selectPeach(0);
										break;
								}
							}
						}
					}, this, 1900);
				}, this, 2500)
			}

		}
		/**
		 * 超时未下注请出房间
		 */
		private kickGame() {
			let text = "你已超过5分钟局未下注,请重新进入游戏";
			Global.alertMediator.addAlert(text, () => {
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DNTG);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHU_AUTO_PANEL);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHUGAME_TIPS);
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING_LAOHU_PANEL);
			}, "", true);
			return;
		}
		/**
		 * 进场后继续免费游戏
		 */
		private startFreeGame() {
			this.freeTimes = game.LaohuUtils.freeTimes;
			this.freemul0.text = game.LaohuUtils.FreeTimeMul[0] + "倍";
			this.freemul1.text = game.LaohuUtils.FreeTimeMul[1] + "倍";
			this.freemul2.text = game.LaohuUtils.FreeTimeMul[2] + "倍";
			if (game.LaohuUtils.freeWin) {
				this.freeWin = game.LaohuUtils.freeWin;
				this.free_total_win0.text = game.LaohuUtils.freeWin + "";
			} else {
				this.freeWin = 0;
			}
			this.removeTreeGroup();
		}

		public freeTimes: number = 0;
		private selelcted: boolean = false;
		/**
		 * 发送selectBonusIndex
		 * @param  {number} time
		 */
		private async selectPeach(time: number) {
			if (!this.selelcted) {
				this.freeTimes = 0;
				this.selelcted = true;
				this.freeWin = 0;
				game.LaohuUtils.freeWin = 0;
				this.peach_0.touchEnabled = this.peach_1.touchEnabled = this.peach_2.touchEnabled = this.peach_3.touchEnabled = true;
				SoundManager.getInstance().playEffect("button_dntg_mp3");
				game.LaohuUtils.FreeTimeMul = [];
				let data2 = { "bonusIndex": time };
				let resp: any = await Global.pomelo.request(ServerPostPath.game_slotHandler_c_selectBonusGame, data2);
				this.freeTimes = resp.freeGameTimes;
				this.free_spin_label0.text = this.freeTimes + "";
				for (let i = 0; i < resp.freeGameMuls.length; i++) {
					game.LaohuUtils.FreeTimeMul.push(resp.freeGameMuls[i]);
				}
				//添加桃子移动放大动画
				switch (time) {
					case 3:
						this.freeGame0.visible = this.freeGame1.visible = this.freeGame2.visible = false;
						this.peach_2.visible = this.peach_3.visible = this.peach_0.visible = false;
						egret.Tween.get(this.freeGame3).to({ x: 496 }, 500);
						egret.Tween.get(this.peach_1).to({ x: 518 }, 500).call(() => {
							egret.Tween.get(this.peach_1).to({ scaleX: 2, scaleY: 2, y: -99 }, 500).call(() => {
								this.setAutoTimeout(() => {
									this.peachGroup.visible = false;
									SoundManager.getInstance().playEffect("freegame3_dntg_mp3");
									this.removeTreeGroup();
								}, this, 1000)
							})
						})
						break;
					case 2:
						this.freeGame0.visible = this.freeGame1.visible = this.freeGame3.visible = false;
						this.peach_1.visible = this.peach_3.visible = this.peach_0.visible = false;
						egret.Tween.get(this.freeGame2).to({ x: 496 }, 500);
						egret.Tween.get(this.peach_2).to({ x: 518 }, 500).call(() => {
							egret.Tween.get(this.peach_2).to({ scaleX: 2, scaleY: 2, y: -99 }, 500).call(() => {
								this.setAutoTimeout(() => {
									this.peachGroup.visible = false;
									SoundManager.getInstance().playEffect("freegame3_dntg_mp3");
									this.removeTreeGroup();
								}, this, 1000)
							})
						})
						break;
					case 1:
						this.freeGame0.visible = this.freeGame2.visible = this.freeGame3.visible = false;
						this.peach_1.visible = this.peach_3.visible = this.peach_2.visible = false;
						egret.Tween.get(this.freeGame1).to({ x: 496 }, 500);
						egret.Tween.get(this.peach_0).to({ x: 518 }, 500).call(() => {
							egret.Tween.get(this.peach_0).to({ scaleX: 2, scaleY: 2, y: -99 }, 500).call(() => {
								this.setAutoTimeout(() => {
									this.peachGroup.visible = false;
									SoundManager.getInstance().playEffect("freegame3_dntg_mp3");
									this.removeTreeGroup();
								}, this, 1000)
							})
						})
						break;
					case 0:
						this.freeGame3.visible = this.freeGame2.visible = this.freeGame1.visible = false;
						this.peach_1.visible = this.peach_0.visible = this.peach_2.visible = false;
						egret.Tween.get(this.freeGame0).to({ x: 496 }, 500);
						egret.Tween.get(this.peach_3).to({ x: 518 }, 500).call(() => {
							egret.Tween.get(this.peach_3).to({ scaleX: 2, scaleY: 2, y: -99 }, 500).call(() => {
								this.setAutoTimeout(() => {
									this.peachGroup.visible = false;
									SoundManager.getInstance().playEffect("freegame3_dntg_mp3");
									this.removeTreeGroup();
								}, this, 1000)
							})
						})
						break;
				}
			}
		}
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
		/**
		 * 入场动画移除
		 */
		private removeTreeGroup() {
			this.suijibeishuGroup0.visible = true;
			this.freemul0.text = game.LaohuUtils.FreeTimeMul[0] + "倍";
			this.freemul1.text = game.LaohuUtils.FreeTimeMul[1] + "倍";
			this.freemul2.text = game.LaohuUtils.FreeTimeMul[2] + "倍";
			this.peachGroup.visible = false;
			egret.Tween.get(this.peachTipGroup).to({ visible: false }, 200);
			this.clickTips0.visible = false;
			egret.Tween.get(this.bg0).to({ alpha: 0 }, 800);
			egret.Tween.get(this.treeBg0).to({ alpha: 0 }, 800);
			egret.Tween.get(this.free01imag0).to({ right: -1280 }, 800);
			egret.Tween.get(this.free03imag0).to({ right: -1136 }, 800);
			egret.Tween.get(this.free02imag0).to({ left: -1280 }, 800);
			egret.Tween.get(this.free05imag0).to({ left: -1280 }, 800).call(() => {
				SoundManager.getInstance().playMusic("freespinbackground_mus_dntg_mp3");
				this.setAutoTimeout(() => {
					this.playFreeRound();
				}, this, 1000);
			});;
			this.bottomCloud0.visible = false;
		}
		private showAtr: Array<Array<number>>; //结果图标数组
		private bonusAtr: Array<Array<number>>;//中奖图标数组
		private winGold: number;//转动赢取金额
		private freeMulIndex: number;//免费游戏中奖倍数index

		private winCount: eui.BitmapLabel;
		/**
		 * 发送免费游戏的消息
		 */
		private async connectSend() {
			this.showAtr = [];
			this.bonusAtr = [];
			this.winGold = 0;
			let data2 = { "spinType": 1, "bet": game.LaohuUtils.bet, "multiple": game.LaohuUtils.mul, "lineCount": 243, "activityId": 0 };
			let resp2: any = await Global.pomelo.request(ServerPostPath.game_slotHandler_c_bet, data2);
			let resp1: any = resp2.spinRes;
			if (resp1.rmIndex) {
				for (let i in resp1.rmIndex) {
					this.bonusAtr.push(resp1.rmIndex[i]);
				}
			} else {
				this.bonusAtr = [];
			}
			this.winGold = resp2.winCount;
			this.freeMulIndex = resp1.freeMulIndex;
			this.showAtr = [resp1.matrix[0], resp1.matrix[1], resp1.matrix[2], resp1.matrix[3], resp1.matrix[4]];
			this.freeWin += this.winGold;
			game.LaohuUtils.ToTalMoney = resp2.own_gold;
			this.setAutoTimeout(() => {
				this.scroller.runResult(this.showAtr);
			}, this, 300)
		}

		private messageTimeOut: any;
		private freeWin: number;
		/**
		 * 开始播放免费游戏
		 */
		private playFreeRound() {
			this.removeLastAni();
			//免费游戏条件判断
			if (this.freeTimes <= 0) {
				this.free_spin_label0.text = 0 + "";
				LogUtils.logD(this.freeTimes + "   freetime")
				this.showTotalwin();
				return;
			}
			this.freeTimes -= 1;
			this.free_spin_label0.text = this.freeTimes + "";
			this.connectSend();
			game.LaohuUtils.speed = 64;
			this.scroller.run();
			SoundManager.getInstance().playEffect("reel_dntg_mp3");
			// this.messageTimeOut = this.setAutoTimeout(() => { this.scroller.runResult(this.showAtr); }, this, 300);
		}
		/**
		 * 移除上次转动动画
		 */
		private removeLastAni() {
			this.scroller.stopIconDb();
			if (this.winCount && this.winCount.parent) {
				this.winCount.parent.removeChild(this.winCount);
			}
		}
		/**
		 * 转动结束
		 * @param  {egret.Event} e
		 */
		private scrollerEnd(e: egret.Event) {
			let data = e.data;
			if (data.sceneIndex != 3) {
				return;
			}
			let index = e.data.index;
			switch (index) {
				case 5:
					SoundManager.getInstance().playEffect("reelstop1_dntg_mp3");
					SoundManager.getInstance().stopEffectByName("reel_dntg_mp3");
					this.addFreeBonusAni();
					break;
				case 4:
					SoundManager.getInstance().playEffect("reelstop1_dntg_mp3");
					break;
				case 3:
					SoundManager.getInstance().playEffect("reelstop1_dntg_mp3");
					break;
				case 2:
					SoundManager.getInstance().playEffect("reelstop1_dntg_mp3");
					break;
				case 1:
					SoundManager.getInstance().playEffect("reelstop1_dntg_mp3");
					break;
			}
		}
		private bigWinPanel: DNTGBigwinGroup;
		private freegameTimeout: any;
		private winTimeout: any;
		/**
		 * 免费游戏连线动画
		 */
		private addFreeBonusAni() {
			this.free_total_win0.text = NumberFormat.handleFloatDecimal(this.freeWin) + "";
			if (this.winGold > 0) {
				SoundManager.getInstance().playEffect("win_dntg_mp3");
				//判断满足bigwin条件
				if (this.winGold >= (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) * 15) {
					this.bigWinPanel = new DNTGBigwinGroup();
					this.bigWinPanel.showpanel();
					this.bigWinPanel.touchEnabled = false;
					this.setAutoTimeout(() => {
						this.bigWinPanel.touchEnabled = true;
						this.bigWinPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, func, this);
					}, this, 1500);
					this.bigWinPanel.scoreShow(this.winGold, () => {
						this.scroller.stopIconDb();
						this.scroller.addBonusAni(this.bonusAtr, this.winGold);
						this.setAutoTimeout(this.playFreeRound, this, 1500);
					});
					this.resizeGroup.addChild(this.bigWinPanel);
					let func = () => {
						this.bigWinPanel.touchEnabled = false;
						this.bigWinPanel.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);
						this.bigWinPanel.stopShowBigWin(() => {
							this.scroller.stopIconDb();
							this.scroller.addBonusAni(this.bonusAtr, this.winGold);
							this.winTimeout = this.setAutoTimeout(this.playFreeRound, this, 2000)
						});
					}
				}
				else {
					this.winCount = new eui.BitmapLabel();
					this.winCount.font = "dntg_win_gold_fnt";
					this.scroller.addBonusAni(this.bonusAtr, this.winGold);
					this.winCount.text = NumberFormat.handleFloatDecimal(this.winGold * 100) + "";
					this.winCount.textAlign = "center";
					this.winCount.verticalCenter = 0;
					this.winCount.horizontalCenter = 0;
					this.scroller.addChild(this.winCount);
					this.freegameTimeout = this.setAutoTimeout(() => {
						game.UIUtils.removeSelf(this.winCount);
						this.playFreeRound();
					}, this, 2000);
				}
				//展示免费游戏中间倍数
				if (this.freeMulIndex == 0) {
					let free_mul_texiao = this.showAllIcon("back_light1");
					free_mul_texiao.animation.play("", 1)
					free_mul_texiao.x = 300;
					free_mul_texiao.y = 80;
					this.suijibeishuGroup0.addChild(free_mul_texiao);
					this.suijibeishuGroup0.addChild(this.freemul0);
					free_mul_texiao.addEventListener(egret.Event.COMPLETE, () => {
						if (free_mul_texiao.parent && free_mul_texiao) { free_mul_texiao.parent.removeChild(free_mul_texiao) }
					}, this)
					egret.Tween.get(this.freemul0).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 0.7, scaleY: 0.7 }, 300);
				}
				if (this.freeMulIndex == 1) {
					let free_mul_texiao = this.showAllIcon("back_light1");
					free_mul_texiao.animation.play("", 1)
					free_mul_texiao.x = 439;
					free_mul_texiao.y = 80;
					this.suijibeishuGroup0.addChild(free_mul_texiao);
					this.suijibeishuGroup0.addChild(this.freemul1);
					free_mul_texiao.addEventListener(egret.Event.COMPLETE, () => {
						if (free_mul_texiao.parent && free_mul_texiao) { free_mul_texiao.parent.removeChild(free_mul_texiao) }
					}, this)
					egret.Tween.get(this.freemul1).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 0.7, scaleY: 0.7 }, 300);
				}
				if (this.freeMulIndex == 2) {
					let free_mul_texiao = this.showAllIcon("back_light1");
					free_mul_texiao.animation.play("", 1)
					free_mul_texiao.x = 610;
					free_mul_texiao.y = 80;
					this.suijibeishuGroup0.addChild(free_mul_texiao);
					this.suijibeishuGroup0.addChild(this.freemul2);
					free_mul_texiao.addEventListener(egret.Event.COMPLETE, () => {
						if (free_mul_texiao.parent && free_mul_texiao) { free_mul_texiao.parent.removeChild(free_mul_texiao) }
					}, this)
					egret.Tween.get(this.freemul2).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 0.7, scaleY: 0.7 }, 300);
				}
			}
			else {
				this.freegameTimeout = this.setAutoTimeout(() => { this.playFreeRound(); }, this, 1000);
			}
		}
		/**
		 * 免费游戏完成，初始化免费场景
		 */
		private showTotalwin() {
			let totalGroup: eui.Group = new eui.Group();
			totalGroup.horizontalCenter = 0;
			totalGroup.verticalCenter = 0;
			this.resizeGroup.addChild(totalGroup);
			let totalWin: eui.Image = new eui.Image("dntg_scene3_bg_3_png");
			let winLabel: eui.Label = new eui.Label();
			totalWin.x = 0
			totalWin.y = 0
			totalGroup.addChild(totalWin);
			winLabel.text = NumberFormat.handleFloatDecimal(this.freeWin) + "";
			winLabel.textColor = 0xd3ad4c;
			winLabel.fontFamily = "PingFang SC Bold";
			winLabel.size = 120;
			winLabel.verticalCenter = 50;
			winLabel.horizontalCenter = 0;
			totalGroup.addChild(winLabel);
			SoundManager.getInstance().playEffect("scatwin_dntg_mp3");
			game.LaohuUtils.freeWin = this.freeWin;
			if (game.LaohuUtils.stopAuto) {
				game.LaohuUtils.auto_times = 0;
				game.LaohuUtils.stopAuto = false;
				game.LaohuUtils.isAutoGame = false;
				game.LaohuUtils.oneMax = 0;
				game.LaohuUtils.totalWin = 0;
				game.LaohuUtils.totoalWinGold = 0; game.LaohuUtils.free_time_times = 0;
			}
			if (game.LaohuUtils.oneMax && this.freeWin >= game.LaohuUtils.oneMax) {
				game.LaohuUtils.auto_times = 0;
				game.LaohuUtils.stopAuto = false;
				game.LaohuUtils.isAutoGame = false;
				game.LaohuUtils.oneMax = 0;
				game.LaohuUtils.totalWin = 0;
				game.LaohuUtils.totoalWinGold = 0;
				game.LaohuUtils.free_time_times = 0;
			}
			if (game.LaohuUtils.totalWin && this.freeWin + game.LaohuUtils.totoalWinGold >= game.LaohuUtils.totalWin) {
				game.LaohuUtils.auto_times = 0;
				game.LaohuUtils.stopAuto = false;
				game.LaohuUtils.isAutoGame = false;
				game.LaohuUtils.oneMax = 0;
				game.LaohuUtils.totalWin = 0;
				game.LaohuUtils.totoalWinGold = 0;
				game.LaohuUtils.free_time_times = 0;
			}
			this.setAutoTimeout(() => {
				if (totalGroup && totalGroup.parent) {
					totalGroup.parent.removeChild(totalGroup);
				}
				EventManager.instance.dispatch(EventNotify.DNTG_QUIT_FREE_GAME);
				this.setAutoTimeout(() => {
					this.freeWin = 0;
					this.sendTime = false;
					this.selelcted = false;
					this.bottomCloud0.visible = true;
					this.peach_0.touchEnabled = this.peach_1.touchEnabled = this.peach_2.touchEnabled = this.peach_3.touchEnabled = false;
					this.suijibeishuGroup0.visible = false;
					this.free_total_win0.text = 0 + "";
					this.bg0.alpha = 1;
					this.treeBg0.alpha = 1;
					this.free01imag0.right = 0;
					this.free03imag0.right = 0;
					this.free02imag0.left = 0;
					this.free05imag0.left = 0;
					this.peachGroup.y = 0;
					this.peachGroup.visible = true;
					this.peach_1.scaleX = this.peach_2.scaleX = this.peach_0.scaleX = this.peach_3.scaleX = 1;
					this.peach_1.scaleY = this.peach_2.scaleY = this.peach_0.scaleY = this.peach_3.scaleY = 1;
					this.peach_1.visible = this.peach_2.visible = this.peach_0.visible = this.peach_3.visible = true;
					this.peach_1.y = this.peach_2.y = this.peach_3.y = this.peach_0.y = 0;
					this.peachGroup.bottom = 620;
					this.peach_3.x = 120;
					this.peach_0.x = 440;
					this.peach_2.x = 760;
					this.peach_1.x = 1080;
					this.freeGame3.x = 1019;
					this.freeGame0.x = 58.55;
					this.freeGame1.x = 399;
					this.freeGame2.x = 716.89;
					this.freeGame0.visible = this.freeGame1.visible = this.freeGame2.visible = this.freeGame3.visible = true;
				}, this, 300);
			}, this, 4500)
		}
	}
}