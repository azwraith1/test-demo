module game {
	export class ZajinhuaProxy extends ResourceProxyBase {
		public static NAME: string = "ZajinhuaProxy";

		public roomInfo: ZajinhuaRoomInfoBean;
		public playerInfo;
		public gameRecord_nn: any;
		//血流和血战的请求次数。一分钟刷新一次。
		public gameRecord_time: number = 0;
		//当前对局玩法
		public lastGameConfig: any = {};
		public currentSceneId: number;
		
		public reconnect: boolean = false;
		private init() {
			Global.zajinhuaProxy = this;
			this.listenOnCall();
		}

		public listenOnCall() {

		}

		public async req2updateRoom() {
			var handler = ServerPostPath.game_roomHandler_c_queryRoomInfo;
			let resp: EnterSceneResp = await game.PomeloManager.instance.request(handler, this.lastGameConfig) as EnterSceneResp;
			// LogUtils.logD("resp %j=", resp)
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
		 * 设置游戏房间数据
		 * @param  {} roomInfo
		 */
		public setRoomInfo(enterSceneResp: EnterSceneResp) {
			LogUtils.logDJ(enterSceneResp);
			Global.zajinhuaProxy.currentSceneId = enterSceneResp.roomInfo.sceneId;
			this.reconnect = enterSceneResp.reconnect;
			this.playerInfo = new GamePlayerInfoBean();

			_.extendOwn(this.playerInfo, enterSceneResp.playerInfo);
			if (this.roomInfo == null) {
				this.roomInfo = new ZajinhuaRoomInfoBean();
				_.extendOwn(this.roomInfo, enterSceneResp.roomInfo);
			}
		}

		public updatePlayer(index, player) {
			if (!this.roomInfo) {
				return;
			}
			this.roomInfo.players[index] = player;

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

		/**
		 * 得到游戏玩家
		 */
		public getPlayers() {
			if (!this.roomInfo) {
				return [];
			}
			return this.roomInfo.players;
		}

		public getPlayersLength() {
			return _.keys(this.roomInfo.players).length;
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
		 * 当前Index是否是我自己
		 * @param  {} index
		 */
		public checkIndexIsMe(index) {
			return game.Utils.valueEqual(index, this.playerInfo.playerIndex);
		}

		public getMineInfo(): ZajinhuaRoomInfoBean {
			return this.roomInfo.players[this.playerInfo.playerIndex];
		}

		public getPlayerInfoByIndex(index) {
			return this.roomInfo.players[index];
		}

		public clearRoomInfo() {
			this.roomInfo = null;
			this.playerInfo = null;
			this.reconnect = false;
		}


		/**
	 * 根据自己的位子获取方位
	 * @param  {number} mineIndex
	 */
		public static getDirectionByMine(mineIndex: number) {
			var direction: any = {};
			switch (mineIndex) {
				case 1:
					direction["1"] = "1";
					direction["2"] = "2";
					direction["3"] = "3";
					direction['4'] = "4";
					direction['5'] = "5";
					break;
				case 2:
					direction["2"] = "1";
					direction["3"] = "2";
					direction["4"] = "3";
					direction['5'] = "5";
					direction['1'] = "4";
					break;
				case 3:
					direction["3"] = "1";
					direction["4"] = "2";
					direction['5'] = "5";
					direction["1"] = "3";
					direction['2'] = "4";
					break;
				case 4:
					direction["4"] = "1";
					direction['5'] = "5";
					direction["1"] = "2";
					direction["2"] = "3";
					direction['3'] = "4";
					break;
				case 5:
					direction['5'] = "5";
					direction["4"] = "1";
					direction["1"] = "2";
					direction["2"] = "3";
					direction['3'] = "4";
					break;
			}
			return direction;
		}
	}
}