/*
 * @Author: li mengchan 
 * @Date: 2018-10-19 11:08:11 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-12-07 11:52:52
 * @Description: 统一界面跳转
 */
class HallForwardFac {
	public static redirectHall() {
		if (Global.gameProxy.roomState && Global.gameProxy.roomState == 1) {
			game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
			return;
		}
		switch (ServerConfig.gid) {
			case "mjxlch":
			case "mjxzdd":
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
				break;
			default:
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
				break;

		}
	}

	public static redirectScene(resp, data, callback) {
		let roomInfo = resp.roomInfo;
		let gameId = roomInfo.gameId;
		Global.gameProxy.roomState = null;
		switch (gameId) {
			case "mjxlch":
			case "mjxzdd":
				Global.gameProxy.currentSceneId = data.sceneId;
				Global.gameProxy.setRoomInfo(resp);
				Global.gameProxy.diWen = resp.roomInfo.gameId;
				game.DateTimeManager.instance.updateServerTime(resp.roomInfo.serverTime);
				Global.playerProxy.playerStatus = PlayerStatusEnum.RUUNING;
				Global.gameProxy.lastGameConfig.diFen = resp.roomInfo.betBase;
				//如果是重连并且是游戏中得状态
				RotationLoading.instance.load("majiang", "", async () => {
					if (resp.roomInfo && resp.roomInfo.playing) {
						await Global.gameProxy.req2updateRoom();
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG);
					} else {
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG_MATCH);
					}
					callback && callback();
				});
				break;


		}
	}
}