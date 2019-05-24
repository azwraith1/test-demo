module rbwar {
	export class RBWarGameScene extends game.BaseGameScene {
		//红牌1-3
		private redCard1: RBWarCards;
		private redCard2: RBWarCards;
		private redCard3: RBWarCards;
		//黑牌1-3
		private blackCard1: RBWarCards;
		private blackCard2: RBWarCards;
		private blackCard3: RBWarCards;
		private szBtn: eui.Button;
		private playerListBtn: eui.Button;
		private qsBar: RBWarQSBar;

		private war1: RBWarRed;
		private war2: RBWarRed;
		private war3: RBWarHuixin;

		//押注 1 - 6
		private yzBtn1: RBWarYzBtn;
		//续压按钮
		private xyBtn: RBWarXyBtn;
		//富豪榜
		private no1Header: RBWarNo1Header;
		//幸运星
		private luckyHeader: RBWarLuckyHeader;

		private timeBar: RBWarTimebar;

		//头像 1 - 6
		private header1: RBWarHeader;

		//当前押注的类型 押注的坐标
		private currentMoney: number;

		//筹码 1 红 2 黑 3幸
		private cmGroup1: eui.Group;
		private cmGroup2: eui.Group;
		private cmGroup3: eui.Group;

		//筹码集合
		private cmList1: RBWarYzBtn[] = [];
		private cmList2: RBWarYzBtn[] = [];
		private cmList3: RBWarYzBtn[] = [];

		private contentGroup: eui.Group;
		private uiGroup: eui.Group;
		private touchGroup: eui.Group;


		private cmNumList: number[] = [2, 5, 10, 50, 100];

		//所有玩家压的单边的分数，（红色的总共压的，黑色的总共压的）。
		private totleScore: number = 0;

		private group1: eui.Group;
		private group2: eui.Group;
		private person1: DBComponent;
		private person2: DBComponent;
		//开始动画效果
		private vsDBComponent: DBComponent;
		private anteDBComponent: DBComponent;

		private lockYZ: boolean = true;
		private topGroup: eui.Group;

		private rf_group: eui.Group;
		private bf_group: eui.Group;

		private r_fen: eui.Image;
		private b_fen: eui.Image;
		private luckStar: eui.Image;
		private luckStar0: eui.Image;

		//上一盘押注的值 {type:{1: value}}
		private lastYZData: any = {};
		//宏观调控
		private hgtkInterval;
		//连续没下注的次数
		private noXiazhuCount: number = 0;

		private tipsGroup: eui.Group;
		private tipsLabel: eui.Label;
		private roomid: eui.Label;

		private winDb: DBComponent;

		private vsGroup: eui.Group;
		private vs_s: eui.Image;
		private vs_v: eui.Image;
		private vs_g: eui.Image;

		private systemImage: eui.Image;

		//new
		/**
		 * 打开游戏界面通知
		 */
		public GAME_SCENE_NOTIFY: string = SceneNotify.OPEN_RBWAR_GAME;

		/**
		 * 关闭游戏界面通知
		 */
		public HALL_SCENE_NOTIFY: string = SceneNotify.OPEN_RBWAR_HALL;

		/**
		 * 关闭当前界面通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_RBWAR_GAME;

		/**
		 * 对应匹配界面通知
		 */
		public MATCHING_SCENE_NOTIFY: string = null;

		public constructor() {
			super();
			this.skinName = new RBWarGameSkin();
		}

		public createChildren() {
			super.createChildren();
			this.allowBack = true;
			this.createDBComponents();
			this.init();
			this.timeBar.startTime(this);
			this.hgtkInterval = egret.setInterval(() => {
				if (!this.lockYZ) {
					this.clearNormalJinbi();
				}
			}, this, 200);
		}

		/**
		 * 显示提示
		 */
		private showTips(text) {
			if (!this.tipsGroup.visible) {
				this.tipsGroup.visible = true;
				this.tipsGroup.alpha = 0;
			}
			this.tipsLabel.text = text;
			this.tipsGroup.width = this.tipsLabel.width + 100;
			egret.Tween.removeTweens(this.tipsGroup);
			egret.Tween.get(this.tipsGroup).to({
				alpha: 1
			}, 100).wait(1000).to({
				alpha: 0
			}, 100).call(() => {
				this.tipsGroup.visible = false;
			});
		}

		/**
		 * 减少内存
		 */
		public clearNormalJinbi() {
			let kongzhiNumber = 100;
			let cleardata = (type, number) => {
				let list = this['cmList' + type];
				while (number > 0) {
					let jinbi = list.shift();
					game.UIUtils.removeSelf(jinbi);
					ObjectPool.reclaim("cm", jinbi);
					number--;
				}
			}
			if (this.cmList1.length > kongzhiNumber) {
				cleardata(1, this.cmList1.length - kongzhiNumber);
			}
			if (this.cmList2.length > kongzhiNumber) {
				cleardata(2, this.cmList2.length - kongzhiNumber);
			}
			if (this.cmList3.length > kongzhiNumber) {
				cleardata(3, this.cmList3.length - kongzhiNumber);
			}
		}

		/**
		 * 创建好所有需要的龙骨动画
		 */
		private createDBComponents() {
			this.vsDBComponent = DBComponent.create("vsDBComponent", "rbw_start");
			this.touchGroup.addChild(this.vsDBComponent);
			this.vsDBComponent.visible = false;
			this.vsDBComponent.resetPosition();
			this.vsDBComponent.verticalCenter = 0;
			this.vsDBComponent.horizontalCenter = 0;
			this.vsDBComponent.callback = () => {
				this.vsDBComponent.visible = false;
			}
			// this.vsDBComponent.playDefault(1);
			this.anteDBComponent = DBComponent.create("rbw_ante", "rbw_ante");
			this.touchGroup.addChild(this.anteDBComponent);
			this.anteDBComponent.resetPosition();
			this.anteDBComponent.verticalCenter = 0;
			this.anteDBComponent.horizontalCenter = 0;
			this.anteDBComponent.visible = false;
			this.anteDBComponent.callback = () => {
				this.anteDBComponent.visible = false;
			}

			this.winDb = DBComponent.create("rbw_mine_win", "rbw_mine_win");
			this.touchGroup.addChild(this.winDb);
			this.winDb.resetPosition();
			this.winDb.verticalCenter = 0;
			this.winDb.horizontalCenter = 0;
			this.winDb.visible = false;
			this.winDb.callback = () => {
				this.winDb.visible = false;
			}
		}


		public createPersons() {
			let person1 = DBComponent.create("rbw_person1", "rbw_red_person");
			person1.scaleX = person1.scaleY = 0.22;
			person1.x = 120;
			person1.y = 62;
			this.group1.addChild(person1);
			this.person1 = person1;
			this.person1.playNamesAndLoop(["normal"]);

			let person2 = DBComponent.create("rbw_person2", "rbw_black_person");
			person2.scaleX = person2.scaleY = 0.21;
			person2.x = this.group2.width - 135;
			person2.y = 68;
			this.person2 = person2;
			this.person2.playNamesAndLoop(["normal"]);
			this.group2.addChild(person2);
		}

		/**
		 * 开牌，先给牌面赋值
		 */
		private luckyWin: boolean = false;
		private isPump: boolean = false;
		public getNumsPokers(e: egret.Event) {
			let data = e.data;
			this.isPump = false;
			this.luckyWin = false;
			if (!data) {
				return;
			}
			for (let i in data) {
				if (i == "1") {
					Global.roomProxy.roomInfo.rValues = data[i].cards.value;
					Global.roomProxy.roomInfo.r_isRoundWin = data[i].isRoundWin;
					Global.roomProxy.roomInfo.r_roundPattern = data[i].roundPattern;
					let value = data[i].cards.value;
					let pattern = data[i].roundPattern;
					for (let i = 0; i < value.length; i++) {
						let redCard = this["redCard" + (i + 1)] as RBWarCards;
						redCard.initWithNum(value[i]);
					}
				} else if (i == "2") {
					Global.roomProxy.roomInfo.bValues = data[i].cards.value;
					Global.roomProxy.roomInfo.b_isRoundWin = data[i].isRoundWin;
					Global.roomProxy.roomInfo.b_roundPattern = data[i].roundPattern;
					let value = data[i].cards.value;
					let pattern = data[i].roundPattern;
					for (let i = 0; i < value.length; i++) {
						let blackCard = this["blackCard" + (i + 1)] as RBWarCards;
						blackCard.initWithNum(value[i]);
					}
				} else if (i == "isPump") {
					this.isPump = data[i];
				} else {
					this.luckyWin = data[i];
				}
			}
			this.r_fanpaiMovie(Global.roomProxy.roomInfo.r_roundPattern, Global.roomProxy.roomInfo.b_roundPattern);
			this.removeCard();
			this.onLineCards(1);
		}
		/**
		 * 翻牌动画
		 */
		private r_fanpaiMovie(fen1, fen2) {
			if (Global.runBack) {
				this.redCard1.showB2Z();
				this.redCard2.showB2Z();
				this.redCard3.showB2Z();
				this.blackCard1.showB2Z();
				this.blackCard2.showB2Z();
				this.blackCard3.showB2Z();
				this.showFen(1, fen2, 2);
				this.showPlayerC2S();
				return;
			}
			rbwar.RBWUtils.fanpai();
			egret.Tween.get(this.redCard1).to({ scaleX: 0 }, 200).call(() => { this.redCard1.showB2Z(); }).to({ scaleX: 0.5 }, 200).call(() => {
				rbwar.RBWUtils.fanpai();
				egret.Tween.get(this.redCard2).to({ scaleX: 0 }, 200).call(() => { this.redCard2.showB2Z(); }).to({ scaleX: 0.5 }, 200).call(() => {
					rbwar.RBWUtils.fanpai();
					egret.Tween.get(this.redCard3).to({ scaleX: 0.6, scaleY: 0.64 }, 200).to({ scaleX: 0 }, 200).call(() => { this.redCard3.showB2Z(); }).to({ scaleX: 0.6, scaleY: 0.64 }, 200).to({ scaleX: 0.5, scaleY: 0.54 }, 200).call(() => {
						this.showFen(1, fen1, 1);
						rbwar.RBWUtils.fanpai();
						egret.Tween.get(this.blackCard1).to({ scaleX: 0 }, 200).call(() => { this.blackCard1.showB2Z(); }).to({ scaleX: 0.5 }, 200).call(() => {
							rbwar.RBWUtils.fanpai();
							egret.Tween.get(this.blackCard2).to({ scaleX: 0 }, 200).call(() => { this.blackCard2.showB2Z(); }).to({ scaleX: 0.5 }, 200).call(() => {
								rbwar.RBWUtils.fanpai();
								egret.Tween.get(this.blackCard3).to({ scaleX: 0.6, scaleY: 0.64 }, 200).to({ scaleX: 0 }, 200).call(() => { this.blackCard3.showB2Z(); }).to({ scaleX: 0.6, scaleY: 0.64 }, 200).to({ scaleX: 0.5, scaleY: 0.54 }, 200).call(() => {
									this.showFen(1, fen2, 2);
								}).wait(500).call(() => {
									this.showPlayerC2S();
								});
							})
						})
					})
				})
			})
		}


		private showPlayerC2S() {

			if (!Global.roomProxy.roomInfo) {
				return;
			}
			if (this.isPump) {
				this.person2.playNamesAndLoop(['normal_cry', 'cry']);
				this.person1.playNamesAndLoop(['normal_cry', 'cry']);
			} else {
				if (Global.roomProxy.roomInfo.b_isRoundWin) {
					rbwar.RBWUtils.showWinOrLose(2);
					this.person2.playNamesAndLoop(['normal_smell', 'smell']);
					this.person1.playNamesAndLoop(['normal_cry', 'cry']);
				}
				if (Global.roomProxy.roomInfo.r_isRoundWin) {
					rbwar.RBWUtils.showWinOrLose(1);
					this.person1.playNamesAndLoop(['normal_smell', 'smell']);
					this.person2.playNamesAndLoop(['normal_cry', 'cry']);
				}
			}

		}

		/**
		 * 展示红黑的牌型。
		 * num:1展示，2隐藏
		 * fen:具体牌型。
		 * color：红黑两方。
		 */
		private showFen(num, fen?, color?) {
			if (num == 1) {
				if (color == 1) {
					this.rf_group.visible = true;
					this.r_fen.source = RES.getRes("rb_" + fen + "_png");
					rbwar.RBWUtils.playSoundByFen(fen);
				} else {
					this.bf_group.visible = true;
					this.b_fen.source = RES.getRes("rb_" + fen + "_png");
					rbwar.RBWUtils.playSoundByFen(fen);
				}

			} else {
				this.rf_group.visible = false;
				this.bf_group.visible = false;
			}

		}

		private timeOut(num) {
			if (num == 1) {
				this.timeBar.y = -112;
				egret.Tween.get(this.timeBar).to({ y: -2 }, 1500, egret.Ease.circOut);
			} else if (num == 3) {
				this.timeBar.y = -112;
			}
			else if (num == 4) {
				this.timeBar.y = -2;
			}
			else if (num == 2) {
				egret.Tween.get(this.timeBar).to({ y: -112 }, 1500, egret.Ease.circOut).call(() => {
					this.vsMovie(1);
				})

			}

		}

		private initCMList() {
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			this.cmNumList = roomInfo.addBet;
		}

		private init() {
			this.initCMList();
			this.war1.init(this, 1);
			this.war2.init(this, 2);
			this.war3.init(this, 3);
			for (let i = 1; i <= 5; i++) {
				let yzBtn = this['yzBtn' + i] as RBWarYzBtn;
				yzBtn.setIndex(i);
				yzBtn.setContent(this.cmNumList[i - 1]);
			}
			this.xyBtn.setGray(true);
			this.qsBar.init();
			//默认1
			this.currentMoney = this.cmNumList[0];
			this.showTouchValue(this.currentMoney);

			//创建头顶人物
			this.createPersons();
			//显示所有玩家头像信息
			this.renderRoomInfo();
			this.showPlayers();
			this.showRoomStatus(true);

			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			let richManList = roomInfo.playerList.richManList;
			let luckey = roomInfo.playerList.winRate1st as any;

			this.start2Move(null, false, luckey.betCamp);

		}

		private renderRoomInfo() {
			this.qsBar.update();
			this.showHeaders();
			this.showCurrentBet();
		}

		/**
		 * 显示当前已经下注的筹码数
		 */
		private showCurrentBet() {
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			if (roomInfo.roundStatus != ROOM_STATUS.SETTLEMENT) {
				let roundBetInfo = roomInfo.roundBetInfo;
				if (roundBetInfo) {
					for (let key in roundBetInfo) {
						let num = roundBetInfo[key];
						this.updateWarScore(2, key, num, true);
						this.otherPeopleYZ(num, Number(key), null);
					}
				}
			}
			//显示自己的下注
			let mineData = Global.roomProxy.getMineData();
			let mineBetInfo = mineData.betInfo;
			if (mineBetInfo) {
				for (let key in mineBetInfo) {
					this.updateWarScore(1, key, mineBetInfo[key], false);
				}
			}
		}

		/**
		 * type:1 自己 2: total
		 */
		private updateWarScore(type, warIndex, total, isAdd) {
			let war = this['war' + warIndex] as RBWarRed;
			if (type == 1) {
				war.updateMyValue(total, isAdd);
			} else {
				war.updateTotalValue(total, isAdd);
			}
		}


		/**
		 * 显示玩家头像
		 */
		private showHeaders() {
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			let richManList = roomInfo.playerList.richManList;
			//富豪
			let fuhao = richManList[0];
			this.no1Header.initWithPlayer(fuhao);

			let luckey = roomInfo.playerList.winRate1st as any;
			this.luckyHeader.initWithPlayer(luckey);

			let mineData = Global.roomProxy.getMineData();
			this.header1.initWithPlayer(mineData);

			if (mineData["uid"] == fuhao["pIndex"]) {
				this.no1Header.initWithPlayer(mineData);
			} else {
				this.no1Header.initWithPlayer(fuhao);
			}
			let index = 2;
			let i = 1;
			while (index < 6) {
				let player = richManList[i];
				let header = this['header' + index] as RBWarHeader;
				if (!player) {
					header.visible = false;
					break;
				}
				// if (Global.roomProxy.checkIndexIsMe(player.pIndex)) {
				// 	i++;
				// 	continue;
				// }
				header.initWithPlayer(player);
				index++;
				i++;
			}

			this.roomid.text = "牌局编号：" + Global.roomProxy.roomInfo.roundId;
		}

		/**
		 * 找寻所有除了1之外的所有头像
		 */
		private updateTotalByHeaders(index, gold) {
			for (let i = 2; i <= 5; i++) {
				if (this['header' + i].index == index) {
					this['header' + i].updateGold(gold, false);
				}
			}
			if (this.no1Header.index == index) {
				this.no1Header.updateGold(gold, false);
			}
			if (this.luckyHeader.index == index) {
				this.luckyHeader.updateGold(gold, false);
			}
		}

		/**
		 * 结算
		 */
		private winPlayers = [];
		private updatePlayerGold = [];
		private s_roundSettlement(e: egret.Event) {
			let data = e.data;
			this.winPlayers = [];
			this.updatePlayerGold = [];
			let mineWin = false;
			if (data) {
				for (let i in data) {
					let p = { i: i, g: data[i].gainGold };
					this.updatePlayerGold.push(p);
					if (Global.roomProxy.checkIndexIsMe(i)) {
						this.winPlayers.push(this.header1);
						let mineData = Global.roomProxy.getMineData();
						mineData.gold += p.g;
						Global.roomProxy.rbwRecord_time = 0;
						let mineScores = this.war1.mineScore + this.war2.mineScore + this.war3.mineScore;
						if (p.g > mineScores) {
							mineWin = true;
						}
						Global.playerProxy.updatePlayerGold(mineData.gold);
						let header = this.getHeaderByIndex(i) as RBWarHeader;
						this.updateTotalByHeaders(i, mineData.gold);
					} else {
						let header = this.getHeaderByIndex(i);
						if (header) {
							this.winPlayers.push(header);
						}
					}
				}
			}
			if (this.luckyHeader.index == this.no1Header.index) {
				this.luckyHeader.updateGold(this.no1Header.playerInfo.gold, false);
			}
			this.changeRoomStatus(ROOM_STATUS.SETTLEMENT);
			if (this.cmGroup1.numChildren == 0 && this.cmGroup2.numChildren == 0 && this.cmGroup3.numChildren == 0) {
				return
			}

			if (this.isPump) {
				this.g_12g_2(3, 1, 2);//系统赢
			} else {
				if (Global.roomProxy.roomInfo.r_isRoundWin) {
					this.war1.winAni();
					if (this.luckyWin) {
						this.g_12g_2(2, 3, 1);
						this.war3.winAni();
					} else {
						this.g_22g_1(2, 3, 1);
					}
				}
				if (Global.roomProxy.roomInfo.b_isRoundWin) {
					this.war2.winAni();
					if (this.luckyWin) {
						this.g_12g_2(1, 3, 2);
						this.war3.winAni();
					} else {
						this.g_22g_1(1, 3, 2);
					}
				}
			}
			if (!this.isPump) {
				if (mineWin) {
					this.setAutoTimeout(() => {
						this.winDb.play("start", 1);
						rbwar.RBWUtils.mineWin();
					}, this, 2000);
				}
			}


		}


		/**
		 * 1飞2
		 */

		private g_12g_2(g1, g2, g3) {
			let list = this["cmList" + g1];
			let n1 = Math.floor(list.length / 3);
			let list_1 = list.splice(0, n1);
			let list_2 = list;
			let cm: RBWarYzBtn;
			let cm1: RBWarYzBtn;
			let gp1: eui.Group = this["cmGroup" + g1];
			let gp2: eui.Group = this["cmGroup" + g2];
			let gp3: eui.Group = this["cmGroup" + g3];
			while (list_1.length > 0) {
				cm1 = list_1.pop();
				this["cmList" + g2].push(cm1);
				let point: egret.Point = gp2.globalToLocal(cm1.localToGlobal().x, cm1.localToGlobal().y);
				cm1.x = point.x;
				cm1.y = point.y;
				gp2.addChild(cm1);
				egret.Tween.get(cm1).to({
					x: _.random(25, (gp2.width - cm1.width * 0.2)),
					y: _.random(25, (gp2.height - cm1.height * 0.2))
				}, _.random(300, 600));
			}
			while (list_2.length > 0) {
				cm = list_2.pop();
				this["cmList" + g3].push(cm);
				let point1: egret.Point = gp3.globalToLocal(cm.localToGlobal().x, cm.localToGlobal().y);
				cm.x = point1.x;
				cm.y = point1.y;
				gp3.addChild(cm);
				egret.Tween.get(cm).to({
					x: _.random(25, (gp3.width - cm.width * 0.2)),
					y: _.random(25, (gp3.height - cm.height * 0.2)),
				}, _.random(300, 600))
			}
			this.setAutoTimeout(() => {
				//等一秒
				rbwar.RBWUtils.otherPlayFjb();//声音文件
				let l1: any;
				let l2: any;
				let list = this["cmList" + g2];
				let list2 = this["cmList" + g3];
				if (this.updatePlayerGold.length > 0) {
					for (let j = 0; j < this.updatePlayerGold.length; j++) {
						this.updateGoldByIndex(this.updatePlayerGold[j].i, this.updatePlayerGold[j].g, true, true);
					}

				}
				if (this.winPlayers.length > 0) {
					l1 = list.splice(0, this.winPlayers.length * 2);
					l2 = list2.splice(0, this.winPlayers.length * 2);
					list = list;
					list2 = list2;
					this.g2ps(this.winPlayers, l1, gp2);
					this.g2ps(this.winPlayers, l2, gp3);
					if (this.isPump) {
						this.movieSystem(gp2, list);
						this.movieSystem(gp3, list2);
					} else {
						this.movieGroup(gp2, list);
						this.movieGroup(gp3, list2);

					}

				} else {
					if (this.isPump) {
						this.movieSystem(gp2, list);
						this.movieSystem(gp3, list2);
					} else {
						this.movieGroup(gp2, list);
						this.movieGroup(gp3, list2);
					}
				}
			}, this, 1000);

		}

		/**
		 * 2飞1
		 */

		private g_22g_1(g1, g2, g3) {
			let list1 = this["cmList" + g1];
			let list2 = this["cmList" + g2];
			let cm2: RBWarYzBtn;
			let cm1: RBWarYzBtn;
			let point: egret.Point;
			let point1: egret.Point;
			let gp1: eui.Group = this["cmGroup" + g1];
			let gp2: eui.Group = this["cmGroup" + g2];
			let gp3: eui.Group = this["cmGroup" + g3];
			while (list1.length > 0) {
				cm1 = list1.pop();
				this["cmList" + g3].push(cm1);
				point1 = gp3.globalToLocal(cm1.localToGlobal().x, cm1.localToGlobal().y);
				cm1.x = point1.x;
				cm1.y = point1.y;
				gp3.addChild(cm1);
				egret.Tween.get(cm1).to({
					x: _.random(25, (gp3.width - cm1.width * 0.2)),
					y: _.random(25, (gp3.height - cm1.height * 0.2))
				}, _.random(300, 600))

			}
			while (list2.length > 0) {
				cm2 = list2.pop();
				this["cmList" + g3].push(cm2);
				point = gp3.globalToLocal(cm2.localToGlobal().x, cm2.localToGlobal().y);
				cm2.x = point.x;
				cm2.y = point.y;
				gp3.addChild(cm2);
				egret.Tween.get(cm2).to({
					x: _.random(25, (gp3.width - cm2.width * 0.2)),
					y: _.random(25, (gp3.height - cm2.height * 0.2))
				}, _.random(300, 600))
			}

			if (this.updatePlayerGold.length > 0) {
				for (let j = 0; j < this.updatePlayerGold.length; j++) {
					this.updateGoldByIndex(this.updatePlayerGold[j].i, this.updatePlayerGold[j].g, true, true);
				}

			}

			this.setAutoTimeout(() => {
				//等一秒
				rbwar.RBWUtils.otherPlayFjb();
				let lists = this["cmList" + g3];
				let n: number = Math.floor(lists.length / 4);
				let list: any;
				let list3: any;
				if (this.winPlayers.length > 0) {
					list = lists.splice(0, n);
					list3 = lists;
				}
				if (this.winPlayers.length > 0) {
					this.g2ps(this.winPlayers, list, gp3);
					this.movieGroup(gp3, list3);
				} else {
					this.movieGroup(gp3, lists);
				}
			}, this, 1000);
		}

		private getHeaderByIndexType1(index) {
			for (let i = 2; i <= 5; i++) {
				if (this['header' + i].index == index) {
					return this['header' + i];
				}
			}
			return null;
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
			if (this.no1Header.index == index) {
				return this.no1Header;
			}
			if (this.luckyHeader.index == index) {
				return this.luckyHeader;
			}
			return null;
		}

		/**
		 * 根据坐标找到头像
		 * @param  {} index
		 */
		private getHeaderMovieType(index) {
			for (let i = 2; i <= 3; i++) {
				if (this['header' + i].index == index) {
					return 3;
				}
			}
			for (let i = 4; i <= 5; i++) {
				if (this['header' + i].index == index) {
					return 5;
				}
			}
			if (this.no1Header.index == index) {
				return 6;
			}
			if (this.luckyHeader.index == index) {
				return 7;
			}
			if (this.header1.index == index) {
				return 1;
			}
		}

		/**
		 * 显示幸运星的选择
		 */
		private start2Move(betInfo, ani, camp?) {
			if (ani) {
				let moveX = 0;
				let type1 = betInfo[1];
				let type2 = betInfo[2];
				let type3 = betInfo[3];
				if (!type1 && !type2 && !type3) {
					return;
				};
				if (!type1 && !type2) {
				} else {
					moveX = !!type2 ? 585 : 225;
					if (this.luckStar.x == 1000) {
						egret.Tween.get(this.luckStar).to({
							x: moveX
						}, 800, egret.Ease.sineIn);
					} else {
						this.luckStar.x = moveX;
					}

				}
				if (!type3) {
				} else {
					if (this.luckStar0.x == 1000) {
						egret.Tween.get(this.luckStar0).to({
							x: 470,
							y: 150
						}, 800, egret.Ease.sineIn);
					} else {
						this.luckStar0.x = 470;
						this.luckStar0.y = 150;
					}

				}
			} else {
				let moveX1 = 0;
				let camp1 = camp[1];
				let camp2 = camp[2];
				let camp3 = camp[3];
				if (!camp1 && !camp2 && !camp3) {
					return;
				}
				if (!camp1 && !camp2) {
				} else {
					moveX1 = !!camp2 ? 585 : 225;
					this.luckStar.x = moveX1;
				}
				if (!camp3) {

				} else {
					this.luckStar0.x = 470;
					this.luckStar0.y = 150;
				}

			}

		}

		private s_playerBet(e: egret.Event) {
			let data = e.data;
			let betInfo = data.betInfo;
			let playerIndex = data.pIndex;
			let updateHeaderAndMove = (playerHeader, moveType) => {
				if (playerHeader) {
					let total = 0;
					for (let type in betInfo) {
						let typeJSON = betInfo[type];
						for (let numValue in typeJSON) {
							let typeNumber = typeJSON[numValue];
							for (let i = 0; i < typeNumber; i++) {
								playerHeader.headerMovie(moveType);
								this.playerYZ(parseInt(numValue), parseInt(type), playerHeader);
							}
						}
						let typeTotal = this.getBetInfoTotalByType(betInfo, type);
						total += typeTotal;
						this.updateWarScore(2, type, typeTotal, true);
					}
					this.updateGoldByHeader(playerHeader, total * -1, true, false);
				} else {
					LogUtils.logD(playerHeader.index + "不存在")
				}
			}

			let isLucky = false;
			let isNo1 = false;
			let total = this.getBetInfoTotal(betInfo);
			if (playerIndex == this.luckyHeader.index) {
				isLucky = true;
				this.start2Move(betInfo, true);
				if (Global.roomProxy.checkIndexIsMe(playerIndex)) {
					this.luckyHeader.updateGold(total * -1, true);
				} else {
					updateHeaderAndMove(this.luckyHeader, 7);
				}
			}

			if (playerIndex == this.no1Header.index) {
				isNo1 = true;
				if (Global.roomProxy.checkIndexIsMe(playerIndex) || isLucky) {
					this.no1Header.updateGold(total * -1, true);
				} else {
					updateHeaderAndMove(this.no1Header, 6);
				}
			}

			let playerHeader = this.getHeaderByIndexType1(playerIndex) as RBWarHeader;
			if (playerHeader) {

				if (isLucky || isNo1 || Global.roomProxy.checkIndexIsMe(playerHeader.index)) {
					playerHeader.updateGold(total * -1, true);
				} else {
					updateHeaderAndMove(playerHeader, this.getHeaderMovieType(playerIndex));
				}
			}
		}

		public countdown(e: egret.Event) {
			let data = e.data;
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			if (!roomInfo.countdown) {
				roomInfo.countdown = {};
			}
			roomInfo.countdown = data;
			game.DateTimeManager.instance.updateServerTime(data.start);
		}

		/**
		 * 房间刷新,处理玩家列表
		 */
		private s_roomInfo(e: egret.Event) {
			this.clearRoom();
			this.changeRoomStatus(ROOM_STATUS.FREE);
			this.onLineCards(3);
			this.showFen(2);
			this.vsMovie(2);
			//修改玩家头像
			let data = e.data;
			let players = Global.roomProxy.roomInfo.players;
			Global.roomProxy.roomInfo = data;
			Global.roomProxy.roomInfo.players = players;
			this.qsBar.update();
			this.showHeaders();
			EventManager.instance.dispatch(EventNotify.ROOM_FULSH);
			this.person1.playNamesAndLoop(["normal"]);
			this.person2.playNamesAndLoop(["normal"]);
			this.playerListBtn.labelDisplay.text = data.playerList.playerCount;
		}

		private s_roomStopBet() {
			this.changeRoomStatus(ROOM_STATUS.STOP);
			rbwar.RBWUtils.beignOrStop(2);
			this.anteDBComponent.play("stop", 1);
			this.timeOut(2);
			//this.vsMovie(1);

		}

		private s_roomStartBet(e: egret.Event) {
			this.changeRoomStatus(ROOM_STATUS.BET);
			this.timeOut(1);
		}

		private changeRoomStatus(status) {
			let roomInfo = Global.roomProxy.roomInfo;
			roomInfo.roundStatus = status;
			this.showRoomStatus();
		}

		private startNewRound(e: egret.Event) {
			// this.noXiazhuCount ++;
			this.header1.showWin(1);
			this.winDb.visible = false;
			this.vsDBComponent.playDefault(1);
			this.changeRoomStatus(ROOM_STATUS.START);

			// //第三把会提示
			// if(this.noXiazhuCount == 3){
			// 	Global.alertMediator.addAlert("您已经连续3局没有下注,连续5局未下注将会请离游戏桌", null, null, true);
			// }
		}

		public onRemoved() {
			super.onRemoved();

			EventManager.instance.removeEvent(EventNotify.RBWAR_XUYA, this.xyBtnTouch, this);
			EventManager.instance.removeEvent(ServerNotify.s_playerEnter, this.playerEnter, this);
			EventManager.instance.removeEvent(EventNotify.RBWAR_CM_TOUCH, this.rbwarTouch, this);
			EventManager.instance.removeEvent(ServerNotify.s_startNewRound, this.startNewRound, this);
			EventManager.instance.removeEvent(ServerNotify.s_roomInfo, this.s_roomInfo, this);
			EventManager.instance.removeEvent(ServerNotify.s_roomInitHandCards, this.roomInitHandCards, this);
			EventManager.instance.removeEvent(ServerNotify.s_roomOpenCards, this.getNumsPokers, this);
			EventManager.instance.removeEvent(ServerNotify.s_roomStartBet, this.s_roomStartBet, this);
			EventManager.instance.removeEvent(ServerNotify.s_roomStopBet, this.s_roomStopBet, this);
			EventManager.instance.removeEvent(ServerNotify.s_playerBet, this.s_playerBet, this);
			EventManager.instance.removeEvent(ServerNotify.s_countdown, this.countdown, this);
			EventManager.instance.removeEvent(ServerNotify.s_roundSettlement, this.s_roundSettlement, this);
			EventManager.instance.removeEvent(ServerNotify.s_VPlayerBet, this.vPlayerBet, this);
			EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			EventManager.instance.removeEvent(ServerNotify.s_kickGame, this.s_kickPlayer, this);
			EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.s_enterResult, this);
		}

		private cleanAll() {
			this.war2.mineScore = this.war1.mineScore = this.war3.mineScore = 0;
			this.cmGroup1.removeChildren();
			this.cmGroup2.removeChildren();
			this.cmGroup3.removeChildren();
			this.war1.totalScore = this.war2.totalScore = this.war3.totalScore = 0;
			this.cmList1 = [];
			this.cmList2 = [];
			this.cmList2 = [];
		}

		/**
		 * 收到发牌消息
		 */
		private roomInitHandCards(e: egret.Event) {
			let data = e.data;
			this.cleanAll();
			this.vsMovie(2);
			this.changeRoomStatus(ROOM_STATUS.NEW_CARD);
			this.cardsMovies(data);
		}

		/**
		 * 发牌动画
		 */
		private rList = [];
		private bList = [];
		private async cardsMovies(data) {
			this.onLineCards(3);
			this.showFen(2);
			Global.roomProxy.roomInfo.camp = data.camp;
			Global.roomProxy.roomInfo.type = data.cards.type;
			if (data.camp == 1) {
				Global.roomProxy.roomInfo.rValue = data.cards.value;
			} else {
				Global.roomProxy.roomInfo.bValue = data.cards.value;
			}
			let camp = data.camp;
			let type = data.cards.type;
			let value = data.cards.value;

			if (camp == 1) {
				this.rList = [];
				for (let i = 1; i <= 3; i++) {
					let card = this.getNewCar();
					card.name = "rCard" + i;
					card.scaleX = 0.5;
					card.scaleY = 0.54;
					card.x = 510;
					card.y = -40;
					card.anchorOffsetX = card.width / 2;
					card.anchorOffsetY = card.height / 2;
					this.group1.addChild(card);
					this.rList.push(card);
				}
				if (Global.runBack) {
					for (let i = 1; i <= 3; i++) {
						this.group1.getChildByName("rCard" + i).y = this["redCard" + i].y;
						this.group1.getChildByName("rCard" + i).x = this["redCard" + i].x;
					}
				} else {
					try {
						this.setAutoTimeout(() => {
							egret.Tween.get(this.group1.getChildByName("rCard1")).to({
								x: this.redCard1.x,
								y: this.redCard1.y
							}, 240);
							egret.Tween.get(this.group1.getChildByName("rCard2")).to({
								x: this.redCard1.x,
								y: this.redCard1.y
							}, 300);
							egret.Tween.get(this.group1.getChildByName("rCard3")).to({
								x: this.redCard1.x,
								y: this.redCard1.y
							}, 360).wait(100).call(() => {
								for (let i = 1; i <= 3; i++) {
									egret.Tween.get(this.group1.getChildByName("rCard" + i)).to({
										x: this["redCard" + i].x,
										y: this["redCard" + i].y
									}, 150);
								}
							});
						}, this, 50);
					} catch (e) {

					}
				}
			} else {
				this.bList = [];
				for (let i = 1; i <= 3; i++) {
					let card = this.getNewCar();
					card.name = "bCard" + i;
					card.scaleX = 0.5;
					card.scaleY = 0.54;
					card.x = -55;
					card.y = -46;
					card.anchorOffsetX = card.width / 2;
					card.anchorOffsetY = card.height / 2;
					this.group2.addChild(card);
					this.bList.push(card);
				}
				if (Global.runBack) {
					for (let i = 1; i <= 3; i++) {
						this.group2.getChildByName("bCard" + i).y = this["blackCard" + i].y;
						this.group2.getChildByName("bCard" + i).x = this["blackCard" + i].x;
					}
				} else {
					try {
						this.setAutoTimeout(() => {
							egret.Tween.get(this.group2.getChildByName("bCard1")).to({
								x: this.blackCard3.x,
								y: this.blackCard3.y
							}, 240);
							egret.Tween.get(this.group2.getChildByName("bCard2")).to({
								x: this.blackCard3.x,
								y: this.blackCard3.y
							}, 300);
							egret.Tween.get(this.group2.getChildByName("bCard3")).to({
								x: this.blackCard3.x,
								y: this.blackCard3.y
							}, 360).wait(100).call(() => {
								for (let i = 1; i <= 3; i++) {
									egret.Tween.get(this.group2.getChildByName("bCard" + i)).to({
										x: this["blackCard" + i].x,
										y: this["blackCard" + i].y
									}, 150);
								}
							}).wait(500).call(() => {
								this.anteDBComponent.play("start", 1);
								rbwar.RBWUtils.beignOrStop(1);
							});
						}, this, 50);
					} catch (e) {

					}
				}

			}


		}

		/**
		 * 获取一张牌
		 */
		private getNewCar() {
			let card: RBWarCards = ObjectPool.produce("cards", RBWarCards);
			if (!card) {
				card = new RBWarCards();
			}
			return card;
		}

		/**
		 * 断线重连后牌的2种展示；
		 * 1,展示背面。
		 * 3，隐藏。
		 * 2，展示正面并赋值。
		 */
		private onLineCards(type) {
			if (type == 1) {
				for (let i = 1; i <= 3; i++) {
					let card = this["redCard" + i] as RBWarCards;
					let card1 = this["blackCard" + i] as RBWarCards;
					card.visible = card1.visible = true;
				}
			} else if (type == 3) {
				for (let i = 1; i <= 3; i++) {
					let card = this["redCard" + i] as RBWarCards;
					let card1 = this["blackCard" + i] as RBWarCards;
					card.visible = card1.visible = false;
				}
			} else {

				let data = Global.roomProxy.roomInfo;
				if (!data) {
					return;
				}
				let openCardInfo = data.openCardInfo;
				for (let i in openCardInfo) {
					if (i == "1") {
						Global.roomProxy.roomInfo.rValues = openCardInfo[i].cards.value;
						Global.roomProxy.roomInfo.r_isRoundWin = openCardInfo[i].isRoundWin;
						Global.roomProxy.roomInfo.r_roundPattern = openCardInfo[i].roundPattern;
						let rValue = Global.roomProxy.roomInfo.rValues;
						for (let i = 0; i < rValue.length; i++) {
							let redCard = this["redCard" + (i + 1)] as RBWarCards;
							redCard.visible = true;
							redCard.initWithNum(rValue[i]);
						}
					} else if (i == "2") {
						Global.roomProxy.roomInfo.bValues = openCardInfo[i].cards.value;
						Global.roomProxy.roomInfo.b_isRoundWin = openCardInfo[i].isRoundWin;
						Global.roomProxy.roomInfo.b_roundPattern = openCardInfo[i].roundPattern;
						let bValue = Global.roomProxy.roomInfo.bValues;
						for (let i = 0; i < bValue.length; i++) {
							let blackCard = this["blackCard" + (i + 1)] as RBWarCards;
							blackCard.visible = true;
							blackCard.initWithNum(bValue[i]);
						}
					} else if (i == "isPump") {
						this.isPump = data[i];
					} else {
						this.luckyWin = data[i];
					}
				}
				this.showPlayerC2S();
			}
		}
		/**
		 * 展示玩家列表
		 */
		private showPlayers() {
			let data = Global.roomProxy.roomInfo;
			let playerList = data.playerList;
			let playerCount = playerList.playerCount;
			this.playerListBtn.labelDisplay.text = playerCount;
		}

		/**
		 * 移除发的牌
		 */
		private removeCard() {
			while (this.rList.length > 0) {
				let card = this.rList.pop();
				game.UIUtils.removeSelf(card);
				ObjectPool.reclaim("cards", card);
			}

			while (this.bList.length > 0) {
				let card = this.bList.pop();
				game.UIUtils.removeSelf(card);
				ObjectPool.reclaim("cards", card);
			}


			for (let i = 1; i <= 3; i++) {
				let card = this["redCard" + i] as RBWarCards;
				let card1 = this["blackCard" + i] as RBWarCards;
				card.showZ2B();
				card1.showZ2B();
			}
		}


		/**
		 * 玩家加入
		 */
		private playerEnter(e: egret.Event) {
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			let richManList = roomInfo.playerList.richManList;
			let data = e.data;
			//	richManList.push(data.player);
			//this.updateRichManNum();
		}




		public rbwarTouch(e: egret.Event) {
			let data = e.data;
			this.currentMoney = data;
			this.showTouchValue(this.currentMoney);
		}


		private showTouchValue(value) {
			for (let i = 1; i <= 5; i++) {
				let yzBtn = this['yzBtn' + i] as RBWarYzBtn;
				yzBtn.setTouchon(value);
			}
		}

		/**
		 * 金币从group飞回来
		 */
		private coin2Component(jinbi, type, component) {
			let group = this['cmGroup' + type] as eui.Group;
			let point1 = component.localToGlobal();
			let point = group.globalToLocal(point1.x + 50, point1.y + 50);
			egret.Tween.removeTweens(jinbi);
			egret.Tween.get(jinbi).to({
				x: point.x,
				y: point.y
			}, _.random(200, 400)).call(() => {
				game.UIUtils.removeSelf(jinbi);
				game.Utils.removeArrayItem(this['cmList' + type], jinbi);
			});
		}

		private async sendBetReq(type) {
			if (this.lockYZ) {
				this.showTips("非下注阶段，无法下注");
				return;
			}

			let currentMoney = this.currentMoney;
			let player = Global.roomProxy.getMineData();
			if (player.gold < currentMoney) {
				this.showTips("金币不足");
				return;
			}
			if (!this.lastYzIsTouch) {
				this.lastYZData = {};
			}

			this.xyBtn.setGray(true);
			this.lastYzIsTouch = true;
			this.header1.headerMovie(1);
			player.gold -= currentMoney;
			this.header1.updateGold(player.gold);
			this.updateWarScore(1, type, currentMoney, true);
			this.updateWarScore(2, type, currentMoney, true);
			let data = { betInfo: {} };
			let info = data.betInfo[type] = {};
			info[currentMoney] = 1;
			//{num: this.currentMoney, type: type };
			let path = ServerPostPath.game_rbWarHandler_c_bet;
			let jinbi = this.playerYZ(currentMoney, type, this.header1);
			this.add2LastYz(currentMoney, type, 1);
			let resp: any = await Global.pomelo.request(path, data);
			if (resp && resp.error && resp.error.code != 0) {
				//错误
				this.showTips(resp.error.msg);
				// this.noXiazhuCount = 0;
				this.add2LastYz(currentMoney, type, -1);
				player.gold += currentMoney;
				this.updateWarScore(1, type, -currentMoney, true);
				this.updateWarScore(2, type, -currentMoney, true);
				this.header1.updateGold(player.gold)
				this.coin2Component(jinbi, type, this.header1);
			} else {
				player.betInfo = resp;

			}
		}

		public async yzRed() {
			if (this.war2.mineScore > 0) {
				// alert("只能选一边黑");
				this.showTips("您已经在黑方押注，无法押注红方");
				return;
			}
			this.sendBetReq(1);
		}

		public yzBlack() {
			if (this.war1.mineScore > 0) {
				this.showTips("您已经在红方押注，无法押注黑方");
				return;
			}
			this.sendBetReq(2);
		}

		public yzHuixin() {
			this.sendBetReq(3);
		}

		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.backBtn:
					this.backBtnTouch();
					break;
				case this.helpBtn:
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_RBWARHELP);
					break;
				case this.playerListBtn:
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_RBWARPL);
					break;
				case this.szBtn:
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_RBWARSET);
					break;
				case this.recordBtn:
					game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_RBWARJL);
					break;
			}
		}

		/**
		 * 获取一个筹码
		 */
		private getNewRBWarYz(index, value) {
			let jinbi: RBWarYzBtn = ObjectPool.produce("cm", RBWarYzBtn);
			if (!jinbi) {
				jinbi = new RBWarYzBtn(true);
			}
			jinbi.setIndex(index);
			jinbi.setContent(value);
			return jinbi;
		}




		/**
		 * 任何玩家下注
		 * @param  {number} num
		 * @param  {number} type
		 * @param  {eui.Component} component:那个玩家
		 */
		private playerYZ(value: number, type: number, component: eui.Component) {
			if (component != this.playerListBtn) {
				rbwar.RBWUtils.minePlayFjb();
			}
			let index = this.cmNumList.indexOf(value) + 1
			let jinbi: RBWarYzBtn = this.getNewRBWarYz(index, value);
			if (component == null) {
				this.coinMoveAni(jinbi, type, null);
			} else {
				if (component == this.luckyHeader) {
					component.x = component.x + 200;
					component.y = component.y + 40;
				}
				let startPoint = component.localToGlobal();
				this.coinMoveAni(jinbi, type, startPoint);
			}
			return jinbi;
		}

		/**
		 * 金币move动画
		 * @param  {RBWarYzBtn} jinbi
		 * @param  {number} type
		 * @param  {egret.Point} startPoint
		 */
		private coinMoveAni(jinbi: RBWarYzBtn, type: number, startPoint: egret.Point) {
			let group = this['cmGroup' + type] as eui.Group;
			game.UIUtils.setAnchorPot(jinbi);
			jinbi.rotation = 0;
			if (!startPoint) {
				group.addChild(jinbi);
				jinbi.scaleX = jinbi.scaleY = 0.4;
				jinbi.x = _.random(20, group.width - jinbi.width * 0.15);
				jinbi.y = _.random(20, group.height - jinbi.height * 0.15);
			} else {
				jinbi.scaleX = jinbi.scaleY = 0.45;
				startPoint = group.globalToLocal(startPoint.x, startPoint.y);
				jinbi.x = startPoint.x;
				jinbi.y = startPoint.y;
				group.addChild(jinbi);
				egret.Tween.get(jinbi).to({
					x: _.random(20, group.width - jinbi.width * 0.15),
					y: _.random(20, group.height - jinbi.height * 0.15),
					rotation: _.random(0, 360 * 2)
				}, _.random(400, 700), egret.Ease.sineOut).to({
					scaleX: 0.4,
					scaleY: 0.4
				}, _.random(300, 500), egret.Ease.sineOut);
			}
			this['cmList' + type].push(jinbi);
			return jinbi;
		}

		/**
		 * 非场上玩家的押注
		 */
		private otherPeopleYZ(value: number, type: number, component = this.playerListBtn) {
			let numbers = NumberFormat.chaifenScore(this.cmNumList, value);
			for (let key in numbers) {
				let num = numbers[key];
				for (let i = 0; i < num; i++) {
					this.playerYZ(parseInt(key), type, component);
				}
			}
		}

		/**
		 * 清理位置，回到初始
		 */
		private cleanCM(group: eui.Group) {
			this.contentGroup.addChild(group);
			switch (group) {
				case this.cmGroup1:
					group.x = 162.3;
					group.y = 103.97;
					break;
				case this.cmGroup2:
					group.x = 669.27;
					group.y = 103.97;
					break;
				case this.cmGroup3:
					group.x = 411.09;
					group.y = 231.27;
					break;
			}
		}

		/**
		 * group飞向玩家列表的动画
		 */
		private movieGroup(gp, list) {
			while (list.length > 0) {
				let cm = list.pop();
				let point: egret.Point = gp.globalToLocal(this.playerListBtn.localToGlobal().x, this.playerListBtn.localToGlobal().y);
				// cm.x = point.x;
				// cm.y = point.y;
				egret.Tween.get(cm).to({
					x: point.x,
					y: point.y
				}, _.random(300, 600)).call(() => {
					game.UIUtils.removeSelf(cm);
					ObjectPool.reclaim("cm", cm);
				});
			}
			this.setAutoTimeout(() => {
				this.clearRoom()
			}, this, 1000)
		}

		/**
		 * group飞向系统动画
		 */
		private movieSystem(gp, list) {
			while (list.length > 0) {
				let cm = list.pop();
				let point: egret.Point = gp.globalToLocal(this.systemImage.localToGlobal().x, this.systemImage.localToGlobal().y);
				// cm.x = point.x;
				// cm.y = point.y;
				egret.Tween.get(cm).to({
					x: point.x,
					y: point.y
				}, _.random(300, 600)).call(() => {
					game.UIUtils.removeSelf(cm);
					ObjectPool.reclaim("cm", cm);
				});
			}
			this.setAutoTimeout(() => {
				this.clearRoom()
			}, this, 1000)
		}



		/**
		 * group飞玩家们；
		 */
		private g2ps(players, lists, group) {
			while (lists.length > 0) {
				let cm = lists.pop();
				let num = _.random(0, players.length - 1);
				let player = players[num];
				let point: egret.Point;
				if (player == this.luckyHeader) {
					point = group.globalToLocal((player.localToGlobal().x + player.width * 0.7), (player.localToGlobal().y + player.height * 0.3));
				} if (player == this.no1Header) {
					point = group.globalToLocal((player.localToGlobal().x + player.width * 0.7), (player.localToGlobal().y + player.height * 0.3));
				} else {
					if (player) {
						point = group.globalToLocal((player.localToGlobal().x + player.width / 2), (player.localToGlobal().y + player.height / 2));
					}
				}
				if (Global.runBack) {
					game.UIUtils.removeSelf(cm);
					ObjectPool.reclaim("cm", cm);
				} else {
					if (point) {
						egret.Tween.get(cm).to({
							x: point.x,
							y: point.y
						}, _.random(300, 600)).call(() => {
							game.UIUtils.removeSelf(cm);
							ObjectPool.reclaim("cm", cm);
						});
					}
				}
			}

		}


		/**
		 * 显示在三个押注的数量
		 */
		private showRBBarInfo() {
			let mineData = Global.roomProxy.getMineData() as RBWPlayerInfo;
			let betInfo = mineData.betInfo;
			for (let key in betInfo) {
				let war = this['war' + key] as RBWarRed;
				war.updateMyValue(betInfo[key], false);
			}
			//差房间中其他玩家押注所有
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.RBWAR_XUYA, this.xyBtnTouch, this);
			EventManager.instance.addEvent(ServerNotify.s_playerEnter, this.playerEnter, this);
			EventManager.instance.addEvent(EventNotify.RBWAR_CM_TOUCH, this.rbwarTouch, this);
			EventManager.instance.addEvent(ServerNotify.s_startNewRound, this.startNewRound, this);
			EventManager.instance.addEvent(ServerNotify.s_roomInfo, this.s_roomInfo, this);
			EventManager.instance.addEvent(ServerNotify.s_roomInitHandCards, this.roomInitHandCards, this);
			EventManager.instance.addEvent(ServerNotify.s_roomOpenCards, this.getNumsPokers, this);
			EventManager.instance.addEvent(ServerNotify.s_roomStartBet, this.s_roomStartBet, this);
			EventManager.instance.addEvent(ServerNotify.s_roomStopBet, this.s_roomStopBet, this);
			EventManager.instance.addEvent(ServerNotify.s_playerBet, this.s_playerBet, this);
			EventManager.instance.addEvent(ServerNotify.s_countdown, this.countdown, this);
			EventManager.instance.addEvent(ServerNotify.s_roundSettlement, this.s_roundSettlement, this);
			EventManager.instance.addEvent(ServerNotify.s_VPlayerBet, this.vPlayerBet, this);
			EventManager.instance.addEvent(ServerNotify.s_enterResult, this.s_enterResult, this);
			EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
			EventManager.instance.addEvent(ServerNotify.s_kickGame, this.s_kickPlayer, this);

		}

		private s_enterResult(e: egret.Event) {
			Global.roomProxy.clearRoomInfo();
			Global.roomProxy.setRoomInfo(e.data);
			game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_RBWAR_GAME);
			game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_RBWAR_GAME);
		}

		private s_kickPlayer(e: egret.Event) {
			Global.roomProxy.clearRoomInfo();
			game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_RBWAR_GAME);
			game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_RBWAR_HALL);
			Global.alertMediator.closeViewComponent(0);
			Global.alertMediator.addAlert("您已经连续5局未下注，已被请离房间", null, null, true);
		}

		/**
		 * 虚拟玩家投注
		 */
		private vPlayerBet(e: egret.Event) {
			let data = e.data;
			egret.Tween.get(this.playerListBtn).to({ bottom: 37 }, 100).to({ bottom: 27 }, 100);
			for (let i in data) {
				let value = data[i];
				let war = this['war' + i] as RBWarRed;
				war.updateTotalValue(value, true);
				rbwar.RBWUtils.otherPlayFjb();
				this.otherPeopleYZ(value, parseInt(i));
			}
		}

		private statusLabel: eui.Label;
		private showRoomStatus(reconnect: boolean = false) {
			let roomInfo = Global.roomProxy.roomInfo;
			switch (roomInfo.roundStatus) {
				case ROOM_STATUS.FREE:
				case ROOM_STATUS.START:
					this.statusLabel.text = "准备中";
					if (reconnect) {
						this.onLineCards(3);
						this.showFen(2);
						this.showPlayers();
						this.showHeaders();
						this.timeOut(3);
						this.vsMovie(2);
					}
					break;
				case ROOM_STATUS.NEW_CARD:
					this.statusLabel.text = "准备中";
					if (reconnect) {
						this.onLineCards(1);
						this.showFen(2);
						this.showPlayers();
						this.showHeaders();
						this.timeOut(3);
						this.vsMovie(2);
					}
					break;
				case ROOM_STATUS.BET:
					this.statusLabel.text = "下注中";
					this.lastYzIsTouch = false;
					if (reconnect) {
						this.onLineCards(1);
						this.showFen(2);
						this.showPlayers();
						this.showHeaders();
						this.timeOut(4);
						this.vsMovie(2);
					}
					this.lockYZ = false;
					if (_.keys(this.lastYZData).length > 0) {
						this.xyBtn.setGray(false);
					}
					break;
				case ROOM_STATUS.STOP:
					this.lockYZ = true;
					this.statusLabel.text = "比牌中";
					if (reconnect) {
						this.onLineCards(1);
						this.showFen(2);
						this.showPlayers();
						this.showHeaders();
						this.timeOut(3);
						this.vsMovie(3);
					}
					break;
				case ROOM_STATUS.SETTLEMENT:
					this.statusLabel.text = "结算中";
					if (reconnect) {
						this.onLineCards(2);
						this.timeOut(3);
						this.vsMovie(3);
						this.showFen(1, Global.roomProxy.roomInfo.r_roundPattern, 1);
						this.showFen(1, Global.roomProxy.roomInfo.b_roundPattern, 2);
						this.showHeaders();
						this.showPlayers();
					}

					break;
			}
		}


		private updateGoldByHeader(header, gold, isAdd, bolen) {
			if (Global.roomProxy.checkIndexIsMe(header.index)) {
				this.header1.updateGold(0, isAdd);
				this.setAutoTimeout(() => {
					if (bolen) {
						this.header1.showLiushuiLabel(gold);
					}
				}, this, 1000);

			} else {
				if (header) {
					header.updateGold(gold, isAdd);
				}
			}
		}

		private updateGoldByIndex(pIndex, gold, isAdd, bolen) {
			let header: any = this.getHeaderByIndex(pIndex);
			if (Global.roomProxy.checkIndexIsMe(pIndex)) {
				this.header1.updateGold(0, isAdd);
				this.setAutoTimeout(() => {
					if (bolen) {
						this.header1.showLiushuiLabel(gold);
					}
				}, this, 1000);

			} else {
				if (header) {
					header.updateGold(gold, isAdd);
				}
			}
		}


		/**
		 * 获取一波押注的总金额
		 */
		private getBetInfoTotal(betInfo) {
			let total = 0;
			for (let type in betInfo) {
				let typeJSON = betInfo[type];
				for (let numValue in typeJSON) {
					let sum = Number(numValue) * typeJSON[numValue];
					total += sum;
				}
			}
			return total;
		}

		/**
		 * 获取某一个类型的总投注
		 */
		private getBetInfoTotalByType(betInfo, type) {
			let total = 0;
			let types = betInfo[type];
			if (types) {
				for (let numValue in types) {
					let sum = Number(numValue) * types[numValue];
					total += sum;
				}
			}
			return total;
		}

		private getLastYzTotal() {
			let gold = 0;
			for (var key in this.lastYZData) {
				let numJson = this.lastYZData[key];
				for (let num in numJson) {
					let count = numJson[num];
					gold += count * Number(num);
				}
			}
			return gold;
		}


		public clearRoom() {
			this.cmGroup1.removeChildren();
			this.cmGroup2.removeChildren();
			this.cmGroup3.removeChildren();
			this.cmList1 = [];
			this.cmList2 = [];
			this.cmList3 = [];
			this.clearWarScores();
			this.luckStar.x = 1000;
			this.luckStar0.x = 1000;
			this.luckStar0.y = 0;
		}

		public clearWarScores() {
			for (let i = 1; i <= 3; i++) {
				this.updateWarScore(1, i, 0, false);
				this.updateWarScore(2, i, 0, false);
			}
		}

		//续压有关
		private async xyBtnTouch() {
			if (this.lockYZ) {
				this.showTips("非下注阶段，无法下注");
				return;
			}
			let total = this.getLastYzTotal();
			if (!Global.roomProxy.checkGold(total)) {
				this.showTips("金币不足");
				return
			}
			this.xyBtn.setGray(true);
			this.lastYzIsTouch = true;
			let lastXiazhu = this.lastYZData;
			let path = ServerPostPath.game_rbWarHandler_c_bet;
			let data = { betInfo: lastXiazhu };
			let resp: any = await Global.pomelo.request(path, data);
			if (resp && resp.error && resp.error.code != 0) {
				this.lastYzIsTouch = false;
				this.xyBtn.setGray(false);
				this.showTips(resp.error.msg);
			} else {
				let player = Global.roomProxy.getMineData();
				player.betInfo = resp;
				this.header1.updateGold(total * -1, true);
				this.showXYAni(lastXiazhu);
			}
		}

		private showXYAni(lastYZData) {
			//飞金币
			//  {type:{1: value}}
			for (let key in lastYZData) {
				// {1: value}
				let typeTotal = 0;
				let valueJson = lastYZData[key];
				for (let num in valueJson) {
					let count = valueJson[num];
					typeTotal += count * Number(num);
					for (let i = 0; i < count; i++) {
						this.playerYZ(Number(num), Number(key), this.header1);
					}
				}
				let war = this['war' + key] as RBWarRed;
				war.updateMyValue(typeTotal, true);
				war.updateTotalValue(typeTotal, true);
			}
		}

		/**
		 * {type:{1: value}}
		 */
		private lastYzIsTouch = false;
		private add2LastYz(money, type, num) {
			if (!this.lastYZData) {
				this.lastYZData = {};
			}

			if (!this.lastYZData[type]) {
				this.lastYZData[type] = {};
			}

			if (!this.lastYZData[type][money]) {
				this.lastYZData[type][money] = 1;
			} else {
				this.lastYZData[type][money] += num;
			}
		}

		/**
         * 断线重连
         */
		private async reconnectSuc(e: egret.Event) {
			//对局已经结束不做处理
			let reqData = Global.gameProxy.lastGameConfig;
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
				this.reloadGame();
				let text = GameConfig.GAME_CONFIG['long_config']['10006'].content || "对局已结束";
				Global.alertMediator.addAlert(text, null, null, true);
				//弹出提示
			}
		}


		/**
		 * vs动画
		 */
		private vsMovie(type) {
			if (type == 1) {
				egret.Tween.removeTweens(this.vs_s);
				egret.Tween.removeTweens(this.vs_v);
				this.vs_v.y = -30;
				this.vs_s.y = 56;
				this.vs_g.visible = false;
				this.vsGroup.visible = true;
				egret.Tween.get(this.vs_v).to({ y: 8 }, 120).to({ y: 5 }, 80);
				egret.Tween.get(this.vs_s).to({ y: 19 }, 120);
				this.setAutoTimeout(() => {
					this.vs_g.visible = true;
				}, this, 120);
				this.setAutoTimeout(() => {
					this.vs_g.visible = false;
				}, this, 200)
			} else if (type == 3) {
				this.vsGroup.visible = true;
				this.vs_g.visible = false;
			} else {
				this.vsGroup.visible = false;
			}

		}
	}
}
const ROOM_STATUS = {
	FREE: 1, //空闲状态
	START: 2, //开始
	NEW_CARD: 3, //发牌
	BET: 4, //押注
	STOP: 5, //停止
	SETTLEMENT: 6, //结算
};

const RBW_PATTERN = {
	0: "散牌",
	1: "对子",
	2: "顺子",
	3: "金花",
	4: "顺金",
	5: "豹子",
	6: "对七"
}
