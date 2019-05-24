/*
 * @Author: li mengchan 
 * @Date: 2018-10-19 11:08:11 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-22 15:06:48
 * @Description: 统一界面跳转
 */
class HallForwardFac {
	public static redirectHall(callback) {
		switch (ServerConfig.gid) {
			case "mjxlch":
			case "mjxzdd":
				RotationLoading.instance.load(["majiang_hall"], "majiang_bg_jpg", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG_HALL)
				});
				break;
			case "blnn":
				RotationLoading.instance.load(["niuniu_hall"], "majiang_bg_jpg", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_NIUNIUSELECT);
				});
				break;
			case "sangong":
				RotationLoading.instance.load(["sangong_hall"], "", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_SANGONG_HALL);
				});
				break;
			case "slot":
				let scene = game.Utils.getURLQueryString("scene") || "";
				switch (scene) {
					case "dntg":
						RotationLoading.instance.load(["dntg_hall"], "", () => {
							DNTGLoadingScene.instance.load("dntg_game", () => {
								RES.loadGroup("dntg_back");
								game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DNTG);
							})
						});
						break;
					case "sdxl":
						RotationLoading.instance.load(["sdxl_hall"], "", () => {
							SDXLLoadingScene.instance.load("sdxl_game", () => {
								RES.loadGroup("sdxl_back");
								game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_SDXL);
							})
						});
						break;
					default:
						RotationLoading.instance.load(["slot_hall"], "", () => {
							game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LAOHUJI_HALL);
						});
						break;
				}
				break;

			case "rbwar":
				RotationLoading.instance.load(["rbwar_hall"], "", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_RBWAR_HALL);
				});
				break;
			case "dzmj":
				RotationLoading.instance.load(["dzmj_hall"], "majiang_bg_jpg", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DZMJ_HALL)
				});
				break;
			case "zjh":
				RotationLoading.instance.load(["zhajinhua_hall"], "", () => {
					game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_ZJHSELECT);
				});
				break;
			default:
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
				break;
		}
		callback && callback();
	}

	public static async redirectScene(resp, data, callback) {
		let roomInfo = resp.roomInfo;
		let gameId = roomInfo.gameId;
		Global.gameProxy.roomState = null;
		switch (gameId) {
			case "blnn":
				Global.roomProxy.currentSceneId = data.sceneId;
				Global.roomProxy.setRoomInfo(resp);
				Global.gameProxy.lastGameConfig.diFen = resp.roomInfo.betBase;
				// Global.roomProxy.diWen = resp.roomInfo.gameId;
				game.DateTimeManager.instance.updateServerTime(resp.roomInfo.serverTime);
				Global.playerProxy.playerStatus = PlayerStatusEnum.RUUNING;
				RotationLoadingShu.instance.load(["niuniu_game"], "", async () => {
					RES.loadGroup("niuniu_hall");
					await Global.roomProxy.req2updateRoom();
					let roomInfo = Global.roomProxy.roomInfo;
					if (roomInfo && roomInfo.playing) {
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_NIUNIUGAMES);
					} else {
						Global.roomProxy.clearRoomInfo();
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_NIUNIU_MATCHING);
					}
					callback && callback(roomInfo.playing);
				})
				break;
			case "sangong":
				Global.roomProxy.currentSceneId = data.sceneId;
				Global.roomProxy.setRoomInfo(resp);
				Global.gameProxy.lastGameConfig.diFen = resp.roomInfo.betBase;
				game.DateTimeManager.instance.updateServerTime(resp.roomInfo.serverTime);
				Global.playerProxy.playerStatus = PlayerStatusEnum.RUUNING;
				RotationLoadingShu.instance.load(["sangong_game"], "", async () => {
					RES.loadGroup("sangong_hall");
					await Global.roomProxy.req2updateRoom();
					let roomInfo = Global.roomProxy.roomInfo;
					if (roomInfo && roomInfo.playing) {
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_SANGONG_GAME);
					} else {
						Global.roomProxy.clearRoomInfo();
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_SANGONG_WATING);
					}
					callback && callback(roomInfo.playing);
				})
				break;
			case "mjxlch":
			case "mjxzdd":
				Global.gameProxy.currentSceneId = data.sceneId;
				Global.gameProxy.setRoomInfo(resp);
				Global.gameProxy.diWen = resp.roomInfo.gameId;
				game.DateTimeManager.instance.updateServerTime(resp.roomInfo.serverTime);
				Global.playerProxy.playerStatus = PlayerStatusEnum.RUUNING;
				Global.gameProxy.lastGameConfig.diFen = resp.roomInfo.betBase;

				//如果是重连并且是游戏中得状态
				RotationLoading.instance.load(["majiang_game"], "", async () => {
					RES.loadGroup("majiang_hall");
					await Global.gameProxy.req2updateRoom();
					let roomInfo = Global.gameProxy.roomInfo;
					if (roomInfo && roomInfo.playing) {
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG);
					} else {
						Global.gameProxy.clearRoomInfo();
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG_MATCH);
					}
					callback && callback(roomInfo.playing);
				});
				break;
			case "dzmj":
				Global.gameProxy.currentSceneId = data.sceneId;
				Global.gameProxy.setRoomInfo(resp);
				Global.gameProxy.diWen = resp.roomInfo.gameId;
				game.DateTimeManager.instance.updateServerTime(resp.roomInfo.serverTime);
				Global.playerProxy.playerStatus = PlayerStatusEnum.RUUNING;
				Global.gameProxy.lastGameConfig.diFen = resp.roomInfo.betBase;
				//如果是重连并且是游戏中得状态
				RotationLoading.instance.load(["majiang_game"], "", async () => {
					RES.loadGroup("dzmj_hall");
					await Global.gameProxy.req2updateRoom();
					let roomInfo = Global.gameProxy.roomInfo;
					if (roomInfo && roomInfo.playing) {
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DZMJ);
					} else {
						Global.gameProxy.clearRoomInfo();
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG_MATCH);
					}
					callback && callback(roomInfo.playing);
				});
				break;
			case "zjh":
				Global.gameProxy.currentSceneId = data.sceneId;
				Global.roomProxy.setRoomInfo(resp);
				Global.roomProxy.diWen = resp.roomInfo.gameId;
				game.DateTimeManager.instance.updateServerTime(resp.roomInfo.serverTime);
				Global.playerProxy.playerStatus = PlayerStatusEnum.RUUNING;
				Global.gameProxy.lastGameConfig.diFen = resp.roomInfo.betBase;
				//如果是重连并且是游戏中得状态
				RotationLoading.instance.load(["zhajinhua_game"], "", async () => {
					RES.loadGroup("zhajinhua_hall");
					await Global.roomProxy.req2updateRoom();
					let roomInfo = Global.roomProxy.roomInfo;
					if (roomInfo && roomInfo.playing) {
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_ZJHGAME);
					} else {
						Global.roomProxy.clearRoomInfo();
						Global.alertMediator.addAlert("对局已结束", null, null, true);
					}
					callback && callback(roomInfo.playing);
				});
				break;
		}
	}
}