/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:26:11 
 * @Last Modified by: li mengchan
 * @Description: 游戏数据代理，所有游戏数据都从这里获取
 */
module game {
	export class GameProxy extends ResourceProxyBase {
		public static NAME: string = "GameProxy";
		//socket服务器地址
		public connectorInfo: ConnectInfoBean;		//游戏数据表
		public gameNums: any;
		//游戏房间数据
		public roomInfo: GameRoomInfoBean;
		//游戏玩家数据
		public playerInfo: GamePlayerInfoBean;
		//当前对局信息
		public roundData: GameRoundData;
		public reconnect: boolean = false;
		//当前对局玩法
		public lastGameConfig: any = {};
		//游戏类型底纹
		public diWen: any;
		//选择的是血流还是血战
		public gameType: number = 0;
		//跑马灯
		public pMd: any;
		//0 有房间 1没有房间
		public roomState: any;
		//游戏记录对局：
		public gameRecord_xl: any;
		public gameRecord_xz: any;
		public gameRecord_nn: any;
		//血流和血战的请求次数。一分钟刷新一次。
		public gameRecord_time: number = 0;
		public gameRecord_time1: number = 0;
		public currentSceneId: number;

		public peoplesCounts: any;

		private init() {
			Global.gameProxy = this;
			this.listenOnCall();
		}


		/**
		 * 抢杠杠变成碰
		 */
		public changeGang2Peng(card) {
			let playerData = Global.gameProxy.getMineGameData();
			let index = playerData.gangCards.indexOf(card);
			if (index > -1) {
				Utils.removeArrayItem(playerData.gangCards, card);
				playerData.pengCards.push(card);
			}
		}

		/**
		 * 主动拉取更新房间信息
		 */
		public async req2updateRoom() {
			var handler = ServerPostPath.game_roomHandler_c_queryRoomInfo;
			let resp: EnterSceneResp = await game.PomeloManager.instance.request(handler, this.lastGameConfig) as EnterSceneResp;
			if (!resp) {
				return;
			}
			LogUtils.logD("resp %j=", resp)
			return new Promise((resolve, reject) => {
				if (resp && resp.roomInfo) {
					if (!this.roomInfo) {
						this.setRoomInfo(resp);
					} else {
						this.playerInfo = resp.playerInfo;
						_.extendOwn(this.roomInfo, resp.roomInfo);
					}
					if (resp.roomInfo['serverTime']) {
						DateTimeManager.instance.updateServerTime(resp.roomInfo['serverTime']);
					}
					resolve();
				}
			});
		}

		/**
		 * 重新连接room
		 */
		public async reconnectRoom() {
			var handler = ServerPostPath.hall_sceneHandler_c_enter;
			let config = this.lastGameConfig;
			config['isContinue'] = false;
			let resp: any = await game.PomeloManager.instance.request(handler, config);
			if (!resp) {
				return;
			}
			// LogUtils.logD("reconnect %j=", resp)
			return new Promise((resolve, reject) => {
				if (resp && resp.code == 0) {
					//还在匹配中
					resolve(false);
					return
				}
				else if (resp.roomInfo) {
					this.reconnect = resp.reconnect;
					if (!this.playerInfo) {
						this.playerInfo = new GamePlayerInfoBean();
					}
					_.extendOwn(this.playerInfo, resp.playerInfo);
					if (!this.roomInfo) {
						this.roomInfo = new GameRoomInfoBean();
					}
					_.extendOwn(this.roomInfo, resp.roomInfo);
					resolve(true);
				}
			});
		}

		/**
		 * 获取玩家本人的index
		 */
		public getMineIndex() {
			if (!this.playerInfo) {
				return null;
			}
			return this.playerInfo.playerIndex;
		}

		/**
		 * 获取玩家本人的游戏数据
		 */
		public getMineGameData(): PlayerGameDataBean {
			if (!this.roomInfo) {
				return;
			}
			return this.roomInfo.players[this.getMineIndex()];
		}

		public listenOnCall() {
			EventManager.instance.addEvent(ServerNotify.s_publicCardChanged, this.updatePublicCardPush, this);
		}

		/**
		 * 更新剩余手牌数量
		 * @param  {egret.Event} e
		 */
		public updatePublicCardPush(e: egret.Event) {
			var data = e.data;
			if (this.roomInfo) {
				this.roomInfo.publicCardNum = data.cardNum;
			}
		}

		/**
		 * 更新剩余手牌数量
		 * @param  {egret.Event} e
		 */
		public addPublicCardPush(num) {
			if (this.roomInfo) {
				this.roomInfo.publicCardNum += num;
				// EventManager.instanc
				return this.roomInfo.publicCardNum;
			}
			return 0;
		}

		/**
		 * 设置游戏玩家数据
		 * @param  {} playerInfo
		 */
		public setPlayerInfo(playerInfo) {
			this.playerInfo = playerInfo;
		}

		/**
		 * 玩家加入房间
		 * @param  {majiang.PlayerGameDataBean} playerGameDataBean
		 */
		public joinPlayer(index: number, playerGameDataBean: PlayerGameDataBean) {
			if (this.roomInfo) {
				this.roomInfo.players[index] = playerGameDataBean;
			}
		}

		/**
		 * 获取玩家
		 * @param  {} playerIndex
		 */
		public getPlayerByIndex(playerIndex): PlayerGameDataBean {
			if (!this.roomInfo) {
				return;
			}
			return this.roomInfo.players[playerIndex];
		}


		public getPlayers() {
			if (!this.roomInfo) {
				return [];
			}
			return this.roomInfo.players;
		}

		/**
		 * 设置游戏房间数据
		 * @param  {} roomInfo
		 */
		public setRoomInfo(enterSceneResp: EnterSceneResp) {
			LogUtils.logDJ(enterSceneResp);
			Global.gameProxy.currentSceneId = enterSceneResp.roomInfo.sceneId;
			this.reconnect = enterSceneResp.reconnect;
			this.playerInfo = new GamePlayerInfoBean();
			_.extendOwn(this.playerInfo, enterSceneResp.playerInfo);
			if (this.roomInfo == null) {
				this.roomInfo = new GameRoomInfoBean();
				_.extendOwn(this.roomInfo, enterSceneResp.roomInfo);
				this.roomInfo.getRoomId();
			}
		}

		public clearRoomInfo() {
			this.reconnect = null;
			this.playerInfo = null;
			this.roomInfo = null;
		}
		/**
		 * 获取玩家手牌
		 */
		public getMineShuopaiArr() {
			let mineData: PlayerGameDataBean = Global.gameProxy.getMineGameData();
			var cards = mineData.cards;
			var queCards = [];
			var cardsArr = [];
			let lastMajiang = mineData.lastCard;
			for (var key in cards) {
				var num = cards[key];
				for (var i = 0; i < num; i++) {
					if (Math.floor(parseInt(key) / 10) == mineData.selectColor) {
						queCards.push(parseInt(key));
					} else {
						cardsArr.push(parseInt(key));
					}
				}
			}
			let returnCard = cardsArr.concat(queCards);
			if (mineData.lastCard) {
				Utils.removeArrayItem(returnCard, lastMajiang);
				returnCard.push(lastMajiang);
			}
			return returnCard;
		}


		/**
		 * 获取其他玩家手牌
		 */
		public getOthersShuopaiArr(index) {
			let otherData: PlayerGameDataBean = Global.gameProxy.getPlayerByIndex(index);
			var cards = otherData.cards;
			var queCards = [];
			var cardsArr = [];
			let lastMajiang = otherData.lastCard;
			for (var key in cards) {
				var num = cards[key];
				for (var i = 0; i < num; i++) {
					if (Math.floor(parseInt(key) / 10) == otherData.selectColor) {
						queCards.push(parseInt(key));
					} else {
						cardsArr.push(parseInt(key));
					}
				}
			}
			let returnCard = cardsArr.concat(queCards);
			if (otherData.lastCard) {
				Utils.removeArrayItem(returnCard, lastMajiang);
				returnCard.push(lastMajiang);
			}
			return returnCard;



		}
		/**
		 * 更新玩家手牌
		 * @param  {} value
		 */
		public updateWanjiaShoupai(value, addNum) {
			let mineData: PlayerGameDataBean = Global.gameProxy.getMineGameData();
			var cards = mineData.cards;
			var num = cards[value];
			if (!num) {
				if (addNum > 0) {
					cards[value] = addNum;
				}
			} else {
				num += addNum;
				if (num < 1) {
					delete cards[value];
				} else {
					cards[value] = num;
				}
			}
		}


		/**
		 * 更新玩家手牌
		 * @param  {} value
		 */
		public updateWanjiaShoupaiByIndex(value, addNum, playerIndex) {
			let mineData: PlayerGameDataBean = Global.gameProxy.getPlayerByIndex(playerIndex);
			var cards = mineData.cards;
			if (!cards) {
				return;
			}
			var num = cards[value];
			if (!num) {
				if (addNum > 0) {
					cards[value] = addNum;
				}
			} else {
				num += addNum;
				if (num < 1) {
					delete cards[value]
				} else {
					cards[value] = num;
				}
			}
		}

		/**
		 * 检查是否轮到我
		 */
		public checkIsRoundMe() {
			return game.Utils.valueEqual(this.roomInfo.curPlay, this.playerInfo.playerIndex);
		}

		/**
		 * 当前Index是否是我自己
		 * @param  {} index
		 */
		public checkIndexIsMe(index) {
			return game.Utils.valueEqual(index, this.playerInfo.playerIndex);
		}

		/**
		 * 记录玩家碰牌
		 * @param  {} playerIndex
		 * @param  {} card
		 */
		public recordPlayerPengs(playerIndex, card, from) {
			let playerData = Global.gameProxy.getPlayerByIndex(playerIndex);
			if (playerData.cards) {
				Global.gameProxy.updateWanjiaShoupaiByIndex(card, -1, playerIndex);
				Global.gameProxy.updateWanjiaShoupaiByIndex(card, -1, playerIndex);
			}
			playerData.cardNum -= 2;
			if (!playerData.pengCards) {
				playerData.pengCards = []
			}
			// LogUtils.logI("pengCards" + card, this.getMineShuopaiArr());
			playerData.pengCards.push(card);
		}

		/**
		 * 点炮的玩家移除最后一张
		 * @param  {} playerIndex
		 * @param  {} card
		 */
		public recordChu2Dianpao(playerIndex) {
			let playerData = Global.gameProxy.getPlayerByIndex(playerIndex);
			playerData.playCards.pop();
		}

		/**
		 * 记录玩家杠牌
		 * @param  {} resp
		 */
		public recordPlayerGang(resp) {
			let card = resp.card;
			let playerIndex = resp.playerIndex;
			let playerData = Global.gameProxy.getPlayerByIndex(playerIndex);
			if (playerData.cards) {
				Global.gameProxy.updateWanjiaShoupaiByIndex(card, -1, playerIndex);
				Global.gameProxy.updateWanjiaShoupaiByIndex(card, -1, playerIndex);
				Global.gameProxy.updateWanjiaShoupaiByIndex(card, -1, playerIndex);
				Global.gameProxy.updateWanjiaShoupaiByIndex(card, -1, playerIndex);
			}
			switch (resp.gang) {
				case 1:
					playerData.cardNum -= 1;
					game.Utils.removeArrayItem(playerData.pengCards, card);
					break;
				case 2:
					playerData.cardNum -= 4;
					break;
				case 3:
					playerData.cardNum -= 3;
					break;
				case 4:
					playerData.cardNum -= 3;
					break;
			}
			if (!playerData.gangCards) {
				playerData.gangCards = []
			}
			// LogUtils.logI("gang" + resp.gang, this.getMineShuopaiArr());
			playerData.gangCards.push(card);
		}

		public clearCurPlay() {
			this.roomInfo.curPlay = 0;
		}


		public clearTasks() {
			let mine = Global.gameProxy.getMineGameData();
			mine.hangupTasks = {};
			this.roomInfo.hangupTaskSource = null
		}


		public clearLastPai() {
			this.getMineGameData().lastCard = 0;
		}


		public addRecord(record) {
			let mine = Global.gameProxy.getMineGameData();
			if (!mine.bills) {
				mine.bills = [];
			}
			mine.bills.push(record);
		}


		public getSceneConfig(sceneId) {
			return this.gameNums[sceneId];
		}


		public getSceneConfigByGame(gameId, sceneId) {
			return this.gameNums[gameId][sceneId];
		}

		/**
		 * 获取低注
		 */
		public getSceneDizhu() {
			return this.gameNums[this.roomInfo.sceneId].bet_base;
		}

		/**
		 * 玩家出牌
		 * @param  {} playerIndex
		 * @param  {} value
		 */
		public addPlayerCard(playerIndex, value) {
			let player = this.roomInfo.players[playerIndex] as PlayerGameDataBean;
			player.playCards.push(value);
		}


		public addHuTasks(task) {
			this.roomInfo.huTasks.push(task);
		}

		/**
		 * 获取玩家手牌
		 */
		public getCardArrByIndex(playerIndex: number) {
			let playerData: PlayerGameDataBean = this.getPlayerByIndex(playerIndex);
			var cards = playerData.cards;
			var queCards = [];
			var cardsArr = [];
			let lastMajiang = playerData.lastCard;
			for (var key in cards) {
				var num = cards[key];
				for (var i = 0; i < num; i++) {
					if (Math.floor(parseInt(key) / 10) == playerData.selectColor) {
						queCards.push(parseInt(key));
					} else {
						cardsArr.push(parseInt(key));
					}
				}
			}
			let returnCard = cardsArr.concat(queCards);
			if (playerData.lastCard) {
				Utils.removeArrayItem(returnCard, lastMajiang);
				returnCard.push(lastMajiang);
			}
			return returnCard;
		}
		/**
		 * 开启在线人数请求
		 */
		public startDs() {
			egret.setInterval(() => { this.people() }, this, 60000, );
		}
		/**
		 * 更新在线人数。
		 */
		public async people() {
			let route = ServerPostPath.hall_sceneHandler_c_getGameOnlineCountInfo;
			let resp: any = await Global.pomelo.request(route, null);
			if (resp != null) {
				this.peoplesCounts = resp;
				EventManager.instance.dispatch(EventNotify.UPDATE_PLAYER_COUNT);
			}
		}


		public findHasQueColor() {
			let playerData: PlayerGameDataBean = this.getPlayerByIndex(this.getMineIndex());
			if (playerData.huCards.length > 0) {
				return false;
			}
			var cards = playerData.cards;
			var queCards = [];
			let lastMajiang = playerData.lastCard;
			if (Math.floor(parseInt(key) / 10) == lastMajiang) {
				return true;
			}
			for (var key in cards) {
				var num = cards[key];
				for (var i = 0; i < num; i++) {
					if (Math.floor(parseInt(key) / 10) == playerData.selectColor) {
						return true;
					}
				}
			}
			return false;
		}
	}
}