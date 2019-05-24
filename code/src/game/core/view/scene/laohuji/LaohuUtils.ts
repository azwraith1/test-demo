/*
 * @Author: wangtao 
 * @Date: 2019-03-27 14:23:42 
 * @Last Modified by: wangtao
 * @Last Modified time: 2019-05-20 18:25:48
 * @Description: 
 */
// TypeScript file   用于存储老虎机本地数据的文件
module game {
    export class LaohuUtils {
        public static atr_top: number[][];
        //tips 窗口对应数据
        public static mul: number = 1;
        public static bet: number = 0.01;
        public static bets: number[] = [];
        public static muls: number[] = [];

        public static auto_time: number = 0;// 选取后不会随自动游戏而减少的自动游戏次数
        public static auto_times: number = 0;
        public static isAutoGame: boolean = false;
        public static totalWin: number = 0;    //玩家赢取总金额条件
        public static totalAdd: number = 0;   //玩家总下注条件
        public static oneMax: number = 0; //玩家单次赢取最多量条件
        public static stopAuto: boolean = false; //中免费游戏后自动游戏停止

        public static totalBet: number = 0; //玩家总下注金额
        public static FreeTimeMulIndex: number = 0;
        public static FreeTimeMul: any[] = [];//用于进入游戏存放游戏的倍率
        public static FreeAtr_bottom: any[] = [];//免费游戏的所有转动奖励
        public static FreeAtr_top: any[] = [];//免费游戏的转动结果
        public static freeWin: number = 0;   //免费游戏赢取
        public static totoalWinGold: number = 0;  //总赢取
        public static freeTimes: number = 0; //免费游戏次数
        public static speed: number = 48; //转轴速度

        public static ToTalMoney: number = 0;//进入游戏时的玩家总余额
        public static scoreguang: DBComponent;
        public static titaleChangeAni: DBComponent;

        public static common_speed: number = 320;
        public static fast_speed: number = 250;
        public static fantan_high: number = 30;
        public static fantan_time: number = 330;

        public static group1_length: number = 2 * 8 - 2;
        public static group2_length: number = 2 * 11 - 2;
        public static group3_length: number = 2 * 14 - 2;
        public static group4_length: number = 2 * 17 - 2;
        public static group5_length: number = 2 * 20 - 2;

        public static downTime1: number = 0;
        public static downTime2: number = 400;
        public static downTime3: number = 800;
        public static downTime4: number = 1200;
        public static downTime5: number = 1600;

        //自动游戏选择免费次数
        public static free_time_times: number = 0;

        public static time_icon: number = 300;


        private static s_instance: LaohuUtils
        public static get instance(): LaohuUtils {
            if (LaohuUtils.s_instance == null) {
                LaohuUtils.s_instance = new LaohuUtils();
            }
            return LaohuUtils.s_instance;
        }

        public big_win_texiao(str: string, x: number, y: number, num: number, scalx: number) {
            let scycle: dragonBones.EgretArmatureDisplay = new dragonBones.EgretArmatureDisplay();
            scycle = DBFactory.instance.getDBAsync1(str);
            scycle.x = x;
            scycle.y = y;
            scycle.scaleX = scalx;
            scycle.scaleY = scalx;
            scycle.animation.play("", num);
            return scycle;
        }

        public big_win_pool: Array<any> = [];
        public maga_win_pool: Array<any> = [];
        public super_win_pool: Array<any> = [];
        public big_win() {
            this.big_win_pool = [];
            for (let i = 0; i < 20; i++) {
                let texiao = this.big_win_texiao("coin1", Math.floor(Math.random() * 1280), Math.floor(Math.random() * 200), 10, Math.ceil(Math.random()) * Math.ceil(Math.random() * 3));
                this.big_win_pool.push(texiao);
            }
            return this.big_win_pool;
        }
        public mega_win() {
            this.maga_win_pool = [];
            for (let i = 0; i < 30; i++) {
                let texiao = this.big_win_texiao("coin1", Math.floor(Math.random() * 1280), Math.floor(Math.random() * 200), 15, Math.ceil(Math.random()) * Math.ceil(Math.random() * 3));
                this.maga_win_pool.push(texiao);
            }
            return this.maga_win_pool;
        }
        public super_win() {
            this.super_win_pool = [];
            for (let i = 0; i < 40; i++) {
                let texiao = this.big_win_texiao("coin1", Math.floor(Math.random() * 1280), Math.floor(Math.random() * 200), 20, Math.ceil(Math.random()) * Math.ceil(Math.random() * 3));
                this.super_win_pool.push(texiao);
            }
            return this.super_win_pool;
        }

    }
    export class SDXLUtils {
        public static bet: number = 0.01;
        public static mul: number = 1;
        public static bets: number[] = []; //bet数组
        public static muls: number[] = []; //mul数组
        public static isAutoGame: boolean = false; //是否为自动游戏
        public static auto_times: number = 0;//自动游戏次数
        public static freeWin: number = 0; //免费游戏赢取
        public static FreeTimeMulIndex: number = 0; //免费游戏中奖倍数index
        public static FreeTimeMul: any[] = [];//用于进入游戏存放游戏的倍率
        public static scene: number = 1 //场景1或3；
        public static freeTimes: number = 0;//免费游戏次数
        public static ToTalMoney: number = 0;//玩家金额
        public static sakura: DBComponent; //bigwin场景樱花特效
        public static titleChaneAni: DBComponent //bigwin场景字体变化背景特效
    }

    export class CBZZUtils {
        public static bet: number = 0.01;
        public static mul: number = 1;
        public static bets: number[] = []; //bet数组
        public static muls: number[] = []; //mul数组
        public static isAutoGame: boolean = false; //是否为自动游戏
        public static auto_times: number = 0;//自动游戏次数
        public static freeWin: number = 0; //免费游戏赢取
        public static FreeTimeMulIndex: number = 0; //免费游戏中奖倍数index
        public static FreeTimeMul: any[] = [];//用于进入游戏存放游戏的倍率
        public static scene: number = 1 //场景1或3；
        public static freeTimes: number = 0;//免费游戏次数
        public static ToTalMoney: number = 0;//玩家金额
        public static bigwinAni1: DBComponent; // bigwin场景特效1
        public static bigwinDiFire: DBComponent; //bigwin底部火光
    }

    export class SDMNUtils {
        public static bet: number = 0.01;
        public static mul: number = 1;
        public static bets: number[] = []; //bet数组
        public static muls: number[] = []; //mul数组
        public static isAutoGame: boolean = false; //是否为自动游戏
        public static auto_times: number = 0;//自动游戏次数
        public static freeWin: number = 0; //免费游戏赢取
        public static FreeTimeMulIndex: number = 0; //免费游戏中奖倍数index
        public static FreeTimeMul: any[] = [];//用于进入游戏存放游戏的倍率
        public static scene: number = 1 //场景1或3；
        public static freeTimes: number = 0;//免费游戏次数
        public static ToTalMoney: number = 0;//玩家金额
    }
}
//icon坐标配置
const slotIconCommon = {
    "dntg": { 1: [10, 10], 2: [] }
}