/*
 * @Author: li mengchan 
 * @Date: 2018-09-11 10:57:15 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-14 10:44:13
 * @Description: 
 */
enum PathTypeEnum {
	//192.168.2.98
	NEI_TEST1,
	//192.168.2.188
	NEI_TEST,
	//外网测试 35.221.192.46
	WAI_TEST,

	//外网正式 
	WAI_PRODUCT,
	//QA专用测试
	QA_TEST,
	//预发布服务器
	PUBLISH_TEST,
	//国际外网测试服
	INTDEMO_TEST,
	//国内外测试服
	DEMO_TEST,

	ZIDINGYI
}

class PathConfig {
	//http 或者 https
	public http_header: string;
	//http地址
	public http_server: string;
	//http端口
	public http_port: string;
	//socket头部 ws wss
	public socket_header: string;
	//socket地址
	public socket_path: string;

	public socket_path_1: string = "";
	//是否使用oss
	public use_oss: boolean = false;
	//oss地址
	public oss_path: string;
	//日志等级
	public log_level: number;
	public json_path: string;

	public debug_model: boolean = false;

	public token_login: boolean = false;
}

class PathConfigFac {
	public static getPathByType(type: number): PathConfig {
		let pathConfig = new PathConfig();
		pathConfig.log_level = 2;
		switch (type) {
			case PathTypeEnum.NEI_TEST1:
				pathConfig.http_header = "http://";
				pathConfig.http_server = "192.168.2.234";
				pathConfig.http_port = "3002";
				pathConfig.socket_header = "ws://";
				pathConfig.socket_path = "192.168.2.234";
				pathConfig.use_oss = false;
				pathConfig.log_level = LogUtils.DEBUG;
				pathConfig.debug_model = true;
				break;
			case PathTypeEnum.NEI_TEST:
				pathConfig.http_header = "http://";
				pathConfig.http_server = "192.168.2.188";
				pathConfig.http_port = "3002";
				pathConfig.socket_header = "ws://";
				pathConfig.socket_path = "192.168.2.188";
				pathConfig.use_oss = false;
				pathConfig.log_level = LogUtils.DEBUG;
				pathConfig.debug_model = false;
				break;
			case PathTypeEnum.WAI_PRODUCT:
				pathConfig.http_header = "https://";
				pathConfig.http_server = "game.xiaoxiongshequ.com";
				pathConfig.http_port = "443";
				pathConfig.log_level = LogUtils.INFO;
				pathConfig.socket_header = "wss://";
				pathConfig.socket_path = "game.xiaoxiongshequ.com";
				pathConfig.debug_model = false;
				pathConfig.token_login = true;
				return pathConfig;
			//国外测试服
			case PathTypeEnum.INTDEMO_TEST:
				pathConfig.http_header = "https://";
				pathConfig.http_server = "intdemo-game.bblgmm.com";
				pathConfig.http_port = "443";
				pathConfig.log_level = LogUtils.INFO;
				pathConfig.socket_header = "wss://";
				pathConfig.socket_path = "intdemo-game.bblgmm.com";
				pathConfig.debug_model = false;
				break;
			//国内测试服
			case PathTypeEnum.DEMO_TEST:
				pathConfig.http_header = "https://";
				pathConfig.http_server = "demo-game.bblgmm.com";
				pathConfig.http_port = "443";
				pathConfig.log_level = LogUtils.INFO;
				pathConfig.socket_header = "wss://";
				pathConfig.socket_path = "demo-game.bblgmm.com";
				pathConfig.debug_model = false;
				break;
			//QA测试测试服	
			case PathTypeEnum.QA_TEST:
				pathConfig.http_header = "https://";
				pathConfig.http_server = "test-game.bblgmm.com";
				pathConfig.http_port = "443";
				pathConfig.log_level = LogUtils.INFO;
				pathConfig.socket_header = "wss://";
				pathConfig.socket_path = "test-game.bblgmm.com";
				pathConfig.debug_model = false;
				pathConfig.log_level = LogUtils.DEBUG;
				pathConfig.token_login = true;
				break;
			//预发布服务器	
			case PathTypeEnum.PUBLISH_TEST:
				pathConfig.http_header = "https://";
				pathConfig.http_server = "publish-game.bblgmm.com";
				pathConfig.http_port = "443";
				pathConfig.log_level = LogUtils.ERROR;
				pathConfig.socket_header = "wss://";
				pathConfig.socket_path = "publish-game.bblgmm.com";
				pathConfig.debug_model = false;
				pathConfig.token_login = true;
				break;
			case PathTypeEnum.ZIDINGYI:
				let ip = game.Utils.getURLQueryString("target");
				pathConfig.http_header = "http://";
				pathConfig.http_server = ip;
				pathConfig.http_port = "3002";
				pathConfig.socket_header = "ws://";
				pathConfig.socket_path = ip;
				pathConfig.use_oss = false;
				pathConfig.log_level = LogUtils.DEBUG;
				pathConfig.debug_model = true;
				break
		}
		let windowHerf = window.location.href;
		if (windowHerf.indexOf("127.0.0.1") > -1 || windowHerf.indexOf("172.19") > -1) {
			pathConfig.log_level = LogUtils.DEBUG;
			pathConfig.debug_model = true;
		}
		return pathConfig;
	}

}