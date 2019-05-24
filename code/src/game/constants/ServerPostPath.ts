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
	//获取回访
	public static hall_userHandler_c_getPlaybackInfo: string = "hall.userHandler.c_getPlaybackInfo";

	public static game_mjHandler_c_queryTings: string = "game.mjHandler.c_queryTings";
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
	//GM工具
	public static game_mjHandler_c_setAIThinkTime: string = "game.mjHandler.c_setAIThinkTime";

	//----------------------------------------niuniu star
	public static game_nnHandler_c_robDealer: string = "game.blnnHandler.c_robDealer";
	public static game_nnHandler_c_addAnte: string = "game.blnnHandler.c_addAnte";
	public static game_nnHandle_rc_playCards: string = "game.blnnHandler.c_playCards";
	//----------------------------------------niuniu end
	public static game_sangongHandler_c_robDealer: string = "game.sangongHandler.c_robDealer";
	public static game_sangongHandler_c_addAnte: string = "game.sangongHandler.c_addAnte";
	public static game_sangongHandler_c_openCard: string = "game.sangongHandler.c_openCard";

	public static game_slotHandler_c_bet: string = "game.slotHandler.c_bet";
	public static game_slotHandler_c_selectBonusGame: string = "game.slotHandler.c_selectBonusGame";


	//rbwar
	public static game_rbWarHandler_c_bet: string = "game.rbWarHandler.c_bet";

	public static game_bccaratHandler_c_bet: string = "game.bccaratHandler.c_bet";
	bccaratHandler

	public static connector_entryHandler_c_ping: string = "connector.entryHandler.c_ping";

	//-------dazhong
	public static game_mjHandler_c_chiTask: string = "game.mjHandler.c_chiTask";

	public static game_mjHandler_c_baoTing: string = "game.mjHandler.c_baoTing";


	//zajinhua--------------------------
	//加注
	public static game_zjhHandler_c_addBet: string = "game.zjhHandler.c_addBet";
	//弃牌
	public static game_zjhHandler_c_abandonCard: string = "game.zjhHandler.c_abandonCard";
	//跟注
	public static game_zjhHandler_c_followBet: string = "game.zjhHandler.c_followBet";
	//看牌
	public static game_zjhHandler_c_lookCard: string = "game.zjhHandler.c_lookCard";
	//比牌
	public static game_zjhHandler_c_compareCard: string = "game.zjhHandler.c_compareCard";
	//超时保护
	public static game_zjhHandler_c_timeOutProject: string = "game.zjhHandler.c_timeOutProject";

}