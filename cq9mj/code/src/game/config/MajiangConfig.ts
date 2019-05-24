class MajiangConfig {
    public static Task = {
        "HU": 1,         // 胡牌
        "GANG": 2,      // 杠牌
        "PENG": 3,      // 碰牌
        "CHI": 4,       // 吃牌

        "TING": 5,      // 听牌
        "CUSTOM": 8,   // 自定义

        /* 虚拟任务 */
        "PASS": 11,     // 全过
        "PLAY": 12,     // 出牌
    };
    public static MJXLCH: string = "mjxlch";
    public static MJXZDD: string = "mjxzdd";
    
    public static MJ_SOUND_CONFIG;

    public static getSoundConfig(){
        if(MajiangConfig.MJ_SOUND_CONFIG){
            return MajiangConfig.MJ_SOUND_CONFIG
        }
        MajiangConfig.MJ_SOUND_CONFIG = RES.getRes("mj_sound_json");
        return MajiangConfig.MJ_SOUND_CONFIG; 
    }

    public static commonMessage: Array<Object> = [
        {
            message: "你太牛了",
            id: 1
        },
        {
            message: "哈哈！手气真好",
            id: 2
        },
        {
            message: "快点出牌噢~",
            id: 3
        },
        {
            message: "今天真高兴",
            id: 4
        },
        {
            message: "你放炮，我不胡",
            id: 5
        },
        {
            message: "你家里是开银行的吧",
            id: 6
        },
        {
            message: "你的牌打得太好啦",
            id: 7
        },
        {
            message: "大家好，很高兴见到各位",
            id: 8
        },
        {
            message: "怎么又断线啦！",
            id: 9
        }
    ];
    
    public static msgType = {
        Word:1,//文字
        Expression:2, //表情
    };
}