/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:24:11 
 * @Last Modified by: Li MengChan
 * @Last Modified time: 2018-12-25 18:16:47
 * @Description: 游戏内事件通知定义
 */
class EventNotify {
	//浏览器窗口大小改变
	public static EVENT_RESIZE: string = "EVENT_RESIZE";

	public static EVENT_USER_LOGIN_SUC: string = "EVENT_USER_LOGIN_SUC";
	//点击加入金币场
	public static ENTER_GOLD_SCENE: string = "ENTER_GOLD_SCENE";

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

	//------------------------------------------toixiang
	public static CHANG_PLAYER_HEADER: string = "EventNotify_CHANG_PLAYER_HEADER";
	public static CHANG_PLAYER: string = "EventNotify_CHANG_PLAYER";
}