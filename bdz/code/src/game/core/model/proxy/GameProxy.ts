module game {
	export class GameProxy extends ResourceProxyBase {
		//socket服务器地址
		public connectorInfo: ConnectInfoBean;

		public peoplesCounts: any;

		public gameNums: any;

		public pMd;


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

		/**
			 * 开启在线人数请求
			 */
		public startDs() {
			egret.setInterval(() => { this.people() }, this, 60000, );
		}

		private init() {
			Global.gameProxy = this;
			this.listenOnCall();
		}

		public listenOnCall() {
		}
	}
}