/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:24:47 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 18:18:15
 * @Description: 场景的消息通知
 */
class SceneNotify {
	public constructor() {

	}

	//打开加载
	public static OPEN_LOADING: string = "SceneNotify_OPEN_LOADING";

	//关闭加载
	public static CLOSE_LOADING: string = "SceneNotify_CLOSE_LOADING";

	//打开大厅 
	public static OPEN_MAIN_HALL: string = "SceneNotify_OPEN_MAIN_HALL";

	//关闭大厅 
	public static CLOSE_MAIN_HALL: string = "SceneNotify_CLOSE_MAIN_HALL";

	//打开主城场景
	public static OPEN_MAJIANG_HALL: string = "SceneNotify_OPEN_MAJIANG_HALL";

	//关闭主城场景
	public static CLOSE_MAJIANG_HALL: string = "SceneNotify_CLOSE_MAJIANG_HALL";

	//打开麻将游戏界面
	public static OPEN_MAJIANG: string = "OPEN_MAJIANG";

	//关闭麻将游戏界面
	public static CLOSE_MAJIANG: string = "CLOSE_MAJIANG";

	public static FLUSH_MAJIANG: string = "FLUSH_MAJIANG";

	//打开麻将匹配界面
	public static OPEN_MAJIANG_MATCH: string = "OPEN_MAJIANG_MATCH";

	//关闭麻将匹配界面
	public static CLOSE_MAJIANG_MATCH: string = "CLOSE_MAJIANG_MATCH";


	//打开主城场景
	public static PRE_OPEN_HOME: string = "SceneNotify_PRE_OPEN_HOME";

	//关闭主城场景
	public static PRE_CLOSE_HOME: string = "SceneNotify_PRE_CLOSE_HOME";


	//打开游戏场景
	public static OPEN_GAME: string = "SceneNotify_OPEN_GAME";

	//关闭游戏场景
	public static CLOSE_GAME: string = "SceneNotify_CLOSE_GAME";

	//打开游戏场景
	public static OPEN_RANK: string = "SceneNotify_OPEN_RANK";

	//关闭游戏场景
	public static CLOSE_RANK: string = "SceneNotify_CLOSE_RANK";

	//关闭游戏场景
	public static GAME_NEXT_QUESTION: string = "GAME_NEXT_QUESTION";

	public static CLOSE_TOUCH_GROUP: string = "CLOSE_TOUCH_GROUP"
	//打开结算
	public static OPEN_JIESUAN: string = "OPEN_JIESUAN";

	public static CLOSE_JIESUAN: string = "CLOSE_JIESUAN"
	//打开测试
	public static CLOSE_CESI: string = "CLOSE_CESI";
	public static OPEN_CESI: string = "OPEN_CESI";


	//--------------------------------------niuniu star

	//牛牛选场
	public static CLOSE_NIUNIUSELECT: string = "CLOSE_NIUNIUSELECT";
	public static OPEN_NIUNIUSELECT: string = "OPEN_NIUNIUSELECT";

	//牛牛匹配
	public static CLOSE_NIUNIU_MATCHING: string = "CLOSE_NIUNIU_MATCHING";
	public static OPEN_NIUNIU_MATCHING: string = "OPEN_NIUNIU_MATCHING";

	//牛牛游戏场景(竖版)
	public static CLOSE_NIUNIUGAMES: string = "CLOSE_NIUNIUGAMES";
	public static OPEN_NIUNIUGAMES: string = "OPEN_NIUNIUGAMES";

	//牛牛结算
	public static CLOSE_NIUNIUJIESUAN: string = "CLOSE_NIUNIUJIESUAN";
	public static OPEN_NIUNIUJIESUAN: string = "OPEN_NIUNIUJIESUAN";


	//niuniu--over

	//--------------------------------------sangong star

	//三公首页
	public static OPEN_SANGONG_HALL: string = "OPEN_SANGONG_HALL";
	public static CLOSE_SANGONG_HALL: string = "CLOSE_SANGONG_HALL";

	//牛牛等待
	public static OPEN_SANGONG_WATING: string = "OPEN_SANGONG_WATING";
	public static CLOSE_SANGONG_WATING: string = "CLOSE_SANGONG_WATING";

	//牛牛游戏场景
	public static OPEN_SANGONG_GAME: string = "OPEN_SANGONG_GAME";
	public static CLOSE_SANGONG_GAME: string = "CLOSE_SANGONG_GAME";

	//sangong--over
	//老虎机场景
	public static OPEN_LAOHU_GAME: string = "OPEN_LAOHU_GAME";
	public static CLOSE_LAOHU_GAME: string = "CLOSE_LAOHU_GAME";
	public static OPEN_LAOHU_LOADING: string = "OPENLAOHU_LAODING";
	public static CLOSE_LAOHU_LOADING: string = "CLOSE_LAOHU_LOADING";
	public static OPEN_LAOHUJI_HALL: string = "OPEN_LAOHUJI_HALL";
	public static CLOSE_LAOHUJI_HALL: string = "CLOSE_LAOHUJI_HALL";

	//tiger over 

	//rbwar-----------------------------------------------------
	//红黑大厅

	public static OPEN_RBWAR_HALL: string = "OPEN_RBWAR_HALL";
	public static CLOSE_RBWAR_HALL: string = "CLOSE_RBWAR_HALL";
	//红黑游戏

	public static OPEN_RBWAR_GAME: string = "OPEN_RBWAR_GAME";
	public static CLOSE_RBWAR_GAME: string = "CLOSE_RBWAR_GAME";

	//--------------大众麻将
	public static OPEN_DZMJ: string = "OPEN_DZMJ";
	public static CLOSE_DZMJ: string = "CLOSE_DZMJ";
	public static OPEN_DZMJ_HALL: string = "OPEN_DZMJ_HALL";
	public static CLOSE_DZMJ_HALL: string = "CLOSE_DZMJ_HALL";
	public static OPEN_DZMJ_OVER: string = "OPEN_DZMJ_OVER";
	public static CLOSE_DZMJ_OVER: string = "CLOSE_DZMJ_OVER";

	public static FLUSH_DZMJ: string = "FLUSH_DZMJ";

	//------------------------------------------扎金花
	//扎金花选场界面
	public static OPEN_ZJHSELECT: string = "OPEN_ZJHSELECT";
	public static CLOSE_ZJHSELECT: string = "CLOSE_ZJHSELECT";

	//游戏界面
	public static OPEN_ZJHGAME: string = "OPEN_ZJHGAME";
	public static CLOSE_ZJHGAME: string = "CLOSE_ZJHGAME";

	//游戏匹配界面
	public static OPEN_ZJH_MATCHING: string = "OPEN_ZJH_MATCHING";
	public static CLOSE_ZJH_MATCHING: string = "CLOSE_ZJH_MATCHING";

	public static OPEN_DNTG: string = "OPEN_DNTG";
	public static CLOSE_DNTG: string = "CLOSE_DNTG";
	// 神雕侠侣界面
	public static OPEN_SDXL: string = "OPEN_SDXL";
	public static CLOSE_SDXL: string = "CLOSE_SDXL";
	//赤壁之战界面
	public static OPEN_CBZZ: string = "OPEN_CBZZ";
	public static CLOSE_CBZZ: string = "CLOSE_CBZZ";
	//四大美女
	public static OPEN_SDMN: string = "OPEN_SDMN";
	public static CLOSE_SDMN: string = "CLOSE_SDMN";

	//打开麻将匹配界面
	public static OPEN_DZMJ_MATCHING: string = "OPEN_DZMJ_MATCHING";

	//关闭麻将匹配界面
	public static CLOSE_DZMJ_MATCHING: string = "CLOSE_DZMJ_MATCHING";


	//关闭麻将匹配界面
	public static CLOSE_MJ_JIESSUAN: string = "CLOSE_MJ_JIESSUAN";

	//百家乐
	public static OPEN_BJLGAME: string = "OPEN_BJLGAME";
	public static CLOSE_BJLGAME: string = "CLOSE_BJLGAME";

	public static OPEN_BJLHALL: string = "OPEN_BJLHALL";
	public static CLOSE_BJLHALL: string = "CLOSE_BJLHALL";


}



