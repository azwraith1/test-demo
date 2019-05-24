/*
 * @Author: li mengchan 
 * @Date: 2018-10-19 11:08:11 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-12-07 11:52:52
 * @Description: 统一界面跳转
 */
class HallForwardFac {
	public static redirectHall() {
		if (Global.roomProxy.roomState && Global.roomProxy.roomState == 1) {
			game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_HALL);
			return;
		}
		switch (ServerConfig.gid) {
			case "bdz":
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_HALL);
				break;
			default:
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_HALL);
				break;

		}
	}

	public static redirectScene(resp, data, callback) {
		let roomInfo = resp.roomInfo;
		let gameId = roomInfo.gameId;
		Global.roomProxy.roomState = null;
		switch (gameId) {
			case "bdz":
				Global.roomProxy.currentSceneId = data.sceneId;
				Global.roomProxy.setRoomInfo(resp);
				Global.roomProxy['diWen'] = resp.roomInfo.gameId;
				game.DateTimeManager.instance.updateServerTime(resp.roomInfo.serverTime);
				Global.playerProxy.playerStatus = PlayerStatusEnum.RUUNING;
				Global.roomProxy.lastGameConfig.diFen = resp.roomInfo.betBase;
				RotationLoading.instance.load(["bdz_game"], "", () => {
					RES.loadGroup("bdz_back");
					if (resp.reconnect && resp.roomInfo && resp.roomInfo.playing) {
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_GAME);
					} else {
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BDZ_HALL);
					}
					callback && callback();
				})
				break;
		}
	}
}