/*
 * @Author: He Bing 
 * @Date: 2018-07-04 16:51:08 
 * @Last Modified by: he bing
 * @Last Modified time: 2018-09-03 18:01:05
 @Description: 用户登录数据配置表
 */

class PlayerInfoBean {
	//用户ID
	public id: number;
	//用户名
	public username: string;
	//用户密码
	public password: string;
	//用户电话
	public phone: string;
	//用户邮箱
	public email: string;
	//用户QQ
	public qq: string;
	//用户昵称
	public nickname: string;
	// public lastName: string;
	// public firstName: string;
	//用户生日
	public birthday: string;
	//用户个性签名
	public signature: string;
	//用户性别0，保密 1，男 2，女
	public sex: string;
	//用户年龄
	public age: number;
	//用户头像
	public figure_url: string;
	//用户平台Id
	public openid: string;
	//用户设备类型 1，安卓 2，ios 3，其他
	public devType: number;
	//用户设备id
	public devId: string;
	//邀请人ID
	public inviteId: number;
	//玩家1  测试2   管理员3
	public role: number;
	//用户金币
	public gold: number;
	//用户砖石
	public diamond: number;
	//用户积分
	public score: number;
	// //会话token
	// public token:string;
}