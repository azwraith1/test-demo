/*
 * @Author: li mengchan 
 * @Date: 2018-09-11 10:57:15 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2019-01-22 12:18:05
 * @Description: 
 */
enum PathTypeEnum {
	//192.168.2.98
	NEI_TEST,
	
	CQ9_TEST,

	CQ9_PRODUCT
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
			case PathTypeEnum.NEI_TEST:
				pathConfig.http_header = "http://";
				pathConfig.http_server = "192.168.2.188";
				pathConfig.http_port = "3002";
				pathConfig.socket_header = "ws://";
				pathConfig.socket_path = "192.168.2.188";
				pathConfig.use_oss = false;
				pathConfig.log_level = LogUtils.DEBUG;
				pathConfig.debug_model = false;
				pathConfig.token_login = false;
				break;
			case PathTypeEnum.CQ9_TEST:
				pathConfig.http_header = "https://";
				pathConfig.http_server = "cqtest-game.bblgmm.com";
				pathConfig.http_port = "443";
				pathConfig.socket_header = "wss://";
				pathConfig.socket_path = "cqtest-game.bblgmm.com";
				pathConfig.use_oss = false;
				pathConfig.log_level = LogUtils.DEBUG;
				pathConfig.debug_model = false;
				pathConfig.token_login = true;
				break;
			case PathTypeEnum.CQ9_PRODUCT:
				pathConfig.http_header = "https://";
				pathConfig.http_server = "awgame.hbwyzg.com";
				pathConfig.http_port = "443";
				pathConfig.socket_header = "wss://";
				pathConfig.socket_path = "awgame.hbwyzg.com";
				pathConfig.use_oss = false;
				pathConfig.log_level = LogUtils.INFO;
				pathConfig.debug_model = false;
				pathConfig.token_login = true;
				break;
		}
		return pathConfig;
	}

}