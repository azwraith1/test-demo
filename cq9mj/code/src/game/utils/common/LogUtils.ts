/*
 * @Author: li mengchan 
 * @Date: 2018-09-10 10:30:35 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-11 14:24:47
 * @Description: 日志输出等级  1 debug 2 info 3 error
 */
class LogUtils{
	public static DEBUG: number = 1;
	public static INFO: number = 2;
	public static ERROR: number = 3;
	public static loglevel = 1;
	/**
	 * 输出DEBUG JSON格式日志
	 */
	public static logDJ(data) {
		if (LogUtils.loglevel == LogUtils.DEBUG) {
			console.log("json param=%j", data);
		}
	}

	/**
	 * 输出DEBUG日志
	 */
	public static logD(message?: any, ...optionalParams: any[]) {
		if (LogUtils.loglevel == LogUtils.DEBUG) {
			console.log("debug" + message , optionalParams);
		}
	}
	/**
	 * 输出错误日志
	 * @param  {} data
	 */
	public static logE(data) {
		if (LogUtils.loglevel == LogUtils.ERROR) {
			console.log("error ", data);
		}
	}

	/**
	 * 输出info等级日志
	 * @param  {} data
	 */
	public static logI(message?: any, ...optionalParams: any[]) {
		if (LogUtils.loglevel == LogUtils.INFO) {
			console.log("info" + message , optionalParams);
		}
	}

	

}