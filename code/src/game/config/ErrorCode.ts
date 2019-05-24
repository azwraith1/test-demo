const ErrorCode = {
    OK: 0, //成功
    FAIL: -1, //失败
    SYSTEM_ERROR: -2, //系统错误
    NETWORK_ERROR: -3, //网络错误
    DB_ERROR: -4, //数据库访问错误
    PARAM_INVALID: -5, //参数无效
    SERVER_OVERLOAD: -6, //服务器负载过高
    CLASS_VIRTUAL_INTERFACE: -7, //虚接口无法调用，请重写接口
    SERVER_INTERNAL_ERROR: -8, //服务器内部错误
    SERVER_NOT_READY: -9, //服务器未准备就绪
    GAME_ROUTE_INVALID: -10, //游戏消息不支持
    GAME_TYPE_INVALID: -11, //游戏类型无效
    GAME_SUB_TYPE_INVALID: -12, //游戏子类型无效
    GAME_SCENE_INVALID: -13, //游戏场景无效
    GM_LEVEL_LIMIT: -14,  // GM权限不足
    GM_NOT_AGENT: -15,    // 不是代理
    INTERFACE_NOT_SUPPORT: -16,    // 不支持此接口
    GAME_ID_INVALID: -17,    // 游戏ID无效
    DATA_IS_EMPTY: -18,    // 游戏数据不存在
    SYSTEM_MAINTENANCE: -19,    //系统维护中,敬请期待
    INTERFACE_MAINTENANCE: -20, //接口维护中,敬请期待
    CONFIG_EXCEPTION: -21, //配置文件异常
    GAME_MAINTENANCE: -22, //游戏维护中,敬请期待
    CALL_TOO_OFTEN: -23, //接口调用太频繁
    WILL_OPEN_GAME: -24, //即将开放，敬请期待
    NOT_SUPPORT_GAME: -25, //不支持此游戏
    GAME_PLUGIN_NOT_LOAD: -26, //游戏组件未启动
    GAME_RECORD_EXPIRE: -27, //游戏回放记录过期
    GAME_PUBLISH_NOT_TEST: -28, //正式版本不支持测试登录
    THIRD_PARTY_AUTH_ERROR: -29, //第三方授权失败
    PARAM_MISSING: -30, //参数缺失
    NETWORK_TIMEOUT: -31, //网络超时
    EWALLET_RECHARGE: -32, //游戏币转入游戏失败
    EWALLET_CASH: -33, //游戏币转出游戏失败
    CHECKING_BILL: -34, //个人账单核对中，稍后再试
    SDK_INTERFACE_ERROR: -35, //第三方SDK接口调用失败
    SDK_OBJ_NOT_EXIST: -36, //第三方SDK对象不存在
    EWALLET_REBACK: -37, //游戏异常，退款失败
    REGION_NOT_SUPPORT: -38, //本地区用户暂时不开放
    CURRENCY_NOT_SUPPORT: -39, //不支持此币种用户
    SERVER_NODE_CONFIG_ERROR: -40, //服务器节点配置错误

    USER_NOT_EXIST: -100, //用户不存在
    USER_TOKEN_INVALID: -101, //用户token无效
    USER_NOT_SUPPORT_CHANNEL: -102, //不支持此渠道用户
    USER_CODE_INVALID: -103, //手机验证码无效
    USER_CODE_EXPIRES: -104, //手机验证码过期
    USER_INVITER_INVALID: -105, //邀请人无效
    USER_DATA_EXCEPTION: -106, //玩家数据异常
    USER_CHEAT: -107, //账号锁定
    USER_TOKEN_EXPIRES: -108, //用户token过期
    USERNAME_PASSWORD_ERROR: -109, //用户名或者密码错误
    USER_LOGOUT_FAIL: -110, //用户登出失败
    USER_ILLEGAL: -111, //用户非法登录
    USER_ROB_LOGIN: -112, //异地登录
    USER_CACHE_EXPIRE: -113, //用户缓存过期
    USER_SDK_TOKEN_INVALID: -114, //用户第三方token无效
    USER_GM_TOKEN_INVALID: -115, //用户GMtoken无效
    USER_BIND_GAME: -116, //游戏绑定，无法开启其他游戏

    ROOM_PLAYING: -200, //正在游戏
    ROOM_STARTED: -201, //房间已开始
    ROOM_NOT_CREATOR: -202, //不是房主
    ROOM_SCENE_INVALID: -203, //无效的房间场次
    ROOM_NOT_PLAYING: -204, //房间未开始
    ROOM_USER_ALREADY_IN: -205, //玩家已经在房间中
    ROOM_ALLOC_FAILED: -206, //房间分配失败
    ROOM_EXIST: -207, //房间已经存在
    ROOM_NOT_EXIST: -208, //房间不存在
    ROOM_CHECK_FAILED: -209, //房间异常
    ROOM_INVALID: -210, //房间无效
    ROOM_FULL: -211, //房间已满
    ROOM_USER_NOT_IN: -212, //玩家不在房间中
    ROOM_ROUND_FINISHED: -213, //牌局已经结束
    ROOM_JOIN_FAIL: -214, //加入游戏失败，请重试
    ROOM_ALREADY_DESTROY: -215, //房间已经解散
    ROOM_EXCEPTION_DESTROY: -216, //房间异常销毁
    ROOM_EMPTY_TIMEOUT_DESTROY: -217, //空房间超时销毁
    ROOM_GAME_RECORD_NOT_EXIST: -218, //游戏记录不存在
    ROOM_PLAYING_NOT_ENTER_OTHER: -219, //正在游戏中，无法加入其它游戏

    LACK_OF_RESOURCE: -300,           // 金币钻石等资源不足
    LACK_OF_CARD: -301,               // 房卡不足
    LACK_OF_DIAMOND: -302,            // 钻石不足
    LACK_OF_GOLD: -303,               // 金币不足
    GOLD_TOO_LOW: -304,               // 金币太少，无法开始
    GOLD_NOT_ENOUGH_FIXED: -305,     // 金币不够支付房费

    LIMIT_GOLD_MAX: -400,            // 金币超过上限

    PAY_GAMING_NOT_CASH: -500, //游戏中无法转入转出
    PAY_AMOUNT_INVALID: -501, //转出金额无效
    PAY_AMOUNT_NOT_ENOUGH: -502, //余额不足
    PAY_GET_BALANCE: -503, //电子钱包余额获取失败
    PAY_GOLD_RECHARGE: -504, //金币转入失败，请重试
    PAY_ORDER_NOT_EXIST: -505, //订单不存在
    PAY_ORDER_REPAIR: -506, //平台API接口补单失败
};
