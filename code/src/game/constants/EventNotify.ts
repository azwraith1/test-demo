/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:24:11 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-16 18:32:51
 * @Description: 游戏内事件通知定义
 */
class EventNotify {
	//浏览器窗口大小改变
	public static EVENT_RESIZE: string = "EVENT_RESIZE";
	//前台运行
	public static RUN_FORTEND: string = "RUN_FORTEND";
	//后台运行
	public static RUN_BACKEND: string = "RUN_BACKEND";

	public static EVENT_USER_LOGIN_SUC: string = "EVENT_USER_LOGIN_SUC";
	//点击加入金币场
	public static ENTER_GOLD_SCENE: string = "ENTER_GOLD_SCENE";

	public static JOIN_SCENE_GAMEID: string = "JOIN_SCENE_GAMEID";

	public static READY: string = "SysNotify_READY";
	//游戏开始
	public static START_GAME: string = "SysNotify_START_GAME";
	//发送表情
	public static SEND_EMOJI: string = "SysNotify_SEND_EMOJI";
	//玩家落子
	public static PLAYER_LUOZI: string = "SysNotify_PLAYER_LUOZI";
	//求和
	public static QIU_HE: string = "SysNotify_ANSWER_QIUHE";
	//游戏结束
	public static GAME_OVER: string = "EventNotify_GAME_OVER";
	//游戏结束
	public static RESTART_GAME: string = "EventNotify_RESTART_GAME";
	//手牌点击
	public static SHOUPAI_TOUCH: string = "EventNotify_SHOUPAI_TOUCH";
	//选择出来的牌
	public static HSZ_SELECT_NUM: string = "EventNotify_HSZ_SELECT_NUM";
	//杠牌选择
	public static GANG_SELECT: string = "EventNotify_GANG_SELECT";
	//断线重连回来
	public static RECONNECT_SUC: string = "EventNotify_RECONNECT_SUC";
	//功能按钮
	public static SHOW_GNBTN: string = "EventNotify_SHOW_GNBTN";
	//断线重连回来
	public static FIND_COLOR: string = "EventNotify_FIND_COLOR";
	//手牌出牌成功
	public static SHOUPAI_TOUCH_SUC: string = "EventNotify_SHOUPAI_TOUCH_SUC"

	public static UPDATE_PLAYER_COUNT: string = "EventNotify_UPDATE_PLAYER_COUNT";

	//--------------------------------------niuniu_star
	//牛牛计算
	public static CACULATOR_VALUE: string = "CACULATOR_VALUE";
	// 老虎自动游戏
	public static AUTO_GAME: string = "AUTO_GAME";
	//老虎机接收消息
	public static LAOHU_RECIVE: string = "LAOHU_RECIVE";
	//老虎机旋转
	public static LAOHU_START_SPIN: string = "LAOHU_SPIN";

	public static LAOHU_GROUP_COMPLETE: string = "LAOHU_GROUP_COMPLETE";
	//老虎机金币下落
	public static LAOHU_GOLD_DOWN: string = "LAOHU_GOLD_DOWN";

	public static RBWAR_CM_TOUCH: string = "RBWAR_CM_TOUCH";

	public static RBWAR_XUYA: string = "RBWAR_XUYA";

	//------------------------------------------toixiang
	public static CHANG_PLAYER_HEADER: string = "EventNotify_CHANG_PLAYER_HEADER";
	public static CHANG_PLAYER: string = "EventNotify_CHANG_PLAYER";

	//红黑
	public static ROOM_FULSH: string = "ROOM_FULSH";

	//杠牌选择
	public static CHI_SELECT: string = "EventNotify_CHI_SELECT";

	//-------------------------------扎金花
	public static ZJH_CM_TOUCH: string = "ZJH_CM_TOUCH";
	public static ZJH_HEADER_TOUCH: string = "ZJH_HEADER_TOUCH";

	//老虎机单列旋转完成
	public static LHJ_ITEM_OVER: string = "LHJ_ITEM_OVER";

	//大闹天宫进入免费游戏
	public static DNTG_ENTER_FREE_GAME: string = "DNTG_ENTER_FREE_GAME";
	public static DNTG_ENTER_FREE_GAME_SCENE: string = "DNTG_ENTER_FREE_GAME_SCENE";
	//大闹天宫开始免费游戏
	public static DNTG_START_FREE_GAME: string = "DNTG_START_FREE_GAME";
	public static DNTG_START_FREE_GAME_SCENE: string = "DNTG_START_FREE_GAME_SCENE";
	//大闹天宫免费游戏完成
	public static DNTG_QUIT_FREE_GAME: string = "DNTG_QUIT_FREE_GAME";
	//大鬧天宮免費遊戲完成后進入普通遊戲
	public static DNTG_ENTER_COMMON_GAME: string = "DNTG_ENTER_COMMON_GAME";

	//神雕侠侣进入免费游戏
	public static SDXL_ENTER_FREE_GAME: string = "SDXL_ENTER_FREE_GAME";
	//神雕侠侣进入免费游戏场景
	public static SDXL_ENTER_FREE_GAME_SCENE: string = "SDXL_ENTER_FREE_GAME_SCENE";
	//神雕侠侣开始免费游戏
	public static SDXL_START_FREE_GAME: string = "SDXL_START_FREE_GAME";
	public static SDXL_START_FREE_GAME_SCENE: string = "SDXL_START_FREE_GAME_SCENE";
	//神雕侠侣免费游戏完成进入普通游戏
	public static SDXL_QUIT_FREE_GAME: string = "SDXL_QUIT_FREE_GAME";
	public static SDXL_ENTER_COMMON_GAME: string ="SDXL_ENTER_COMMON_GAME";

	//赤壁之战
	public static CBZZ_ENTER_FREE_GAME: string = "CBZZ_ENTER_FREE_GAME";
	public static CBZZ_ENTER_FREE_GAME_SCENE: string = "CBZZ_ENTER_FREE_GAME_SCENE";
	public static CBZZ_START_FREE_GAME: string = "CBZZ_START_FREE_GAME";
	public static CBZZ_START_FREE_GAME_SCENE: string = "CBZZ_START_FREE_GAME_SCENE";
	public static CBZZ_QUIT_FREE_GAME: string = "CBZZ_QUIT_FREE_GAME";
	public static CBZZ_ENTER_COMMOM_GAME: string = "CBZZ_ENTER_COMMOM_GAME";
	public static CBZZ_AUTO_GAME: string = "CBZZ_AUTO_GAME";
	//四大美女
	public static SDMN_ENTER_FREE_GAME: string = "SDMN_ENTER_FREE_GAME";
	public static SDMN_ENTER_FREE_GAME_SCENE: string = "SDMN_ENTER_FREE_GAME_SCENE";
	public static SDMN_START_FREE_GAME: string = "SDMN_START_FREE_GAME";
	public static SDMN_START_FREE_GAME_SCENE: string = "SDMN_START_FREE_GAME_SCENE";
	public static SDMN_QUIT_FREE_GAME: string = "SDMN_QUIT_FREE_GAME";
	public static SDMN_ENTER_COMMOM_GAME: string = "SDMN_ENTER_COMMOM_GAME";
	public static SDMN_AUTO_GAME: string = "SDMN_AUTO_GAME";
}