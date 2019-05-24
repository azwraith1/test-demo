class ServerPostPath {
	//获取房间信息
	public static hall_sceneHandler_c_enter: string = "hall.sceneHandler.c_enter";
	//换三张选择手牌
	public static game_mjHandler_c_selectHSZ: string = "game.mjHandler.c_selectHSZ";
	//选择定缺花色
	public static game_mjHandler_c_selectColor: string = "game.mjHandler.c_selectColor";
	//玩家碰牌
	public static game_mjHandler_c_pengTask: string = "game.mjHandler.c_pengTask";
	//杠
	public static game_mjHandler_c_gangTask: string = "game.mjHandler.c_gangTask";
	//过
	public static game_mjHandler_c_passTask: string = "game.mjHandler.c_passTask";
	//胡
	public static game_mjHandler_c_huTask: string = "game.mjHandler.c_huTask";
	//
	public static game_roomHandler_c_queryRoomInfo: string = "game.roomHandler.c_queryRoomInfo";
	//玩家退出等待界面
	public static game_roomHandler_c_quitRoom: string = "game.roomHandler.c_quitRoom";
	//玩家取消托管操作
	public static game_mjHandler_c_cancelTrustee: string = "game.mjHandler.c_cancelTrustee"
	//玩家发文字表情
	public static game_mjHandler_c_chat: string = "game.roomHandler.c_chat";
	//查询用户是否在房间
	public static hall_sceneHandler_c_queryGameState: string = "hall.sceneHandler.c_queryGameState";
	//玩家流水记录
	public static hall_userHandler_c_getReportInfo: string = "hall.userHandler.c_getReportInfo";
	//在线人数
	public static hall_sceneHandler_c_getGameOnlineCountInfo: string = "hall.sceneHandler.c_getGameOnlineCountInfo";
	//退出房间
	public static hall_sceneHandler_c_leave: string = "hall.sceneHandler.c_leave";

	public static connector_entryHandler_c_ping: string = "connector.entryHandler.c_ping";	
}