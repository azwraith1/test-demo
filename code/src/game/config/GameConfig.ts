/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:23:06 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-20 19:01:09
 * @Description: 游戏配置 
 */
module GameConfig {

    export var WINSIZE_WIDTH: number = 1280;

    export var WINSIZE_HEIGHT: number = 720;

    export var CURRENT_WIDTH: number = 1280;

    export var CURRENT_HEIGHT: number = 720;

    export var PC_WINSIZE_WIDTH: number = 1280;

    export var PC_WINSIZE_HEIGHT: number = 720;

    export var WINSIZE_BILI_WIDTH: number = 1;

    export var WINSIZE_BILI_HEIGHT: number = 1;

    export var GAME_SCORE_CONFIG: any;

    export var JS_VERSION: string;

    export var RES_VERSION: string;

    export var IS_RUNNING: boolean = true;

    export var CURRENT_DIRECTION: string = "landscape";

    export var CURRENT_ISSHU: boolean = false;

    //获得浏览器类型 pc android ios -- 可扩展为其他 如 微信、qqzone、qq、微博、校内、facebook
    export function systemType(): string {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if (("" + ua.match(/windows nt/i)) == "windows nt") {
            return "windows";
        } else if (("" + ua.match(/iphone/i)) == "iphone") {
            return "ios";
        } else if (("" + ua.match(/android/i)) == "android") {
            return "android";
        } else if (("" + ua.match(/ipad/i)) == "ipad") {
            return "ipad";
        } else if (("" + ua.match(/linux/i)) == "linux") {
            return "linux";
        } else if (("" + ua.match(/mac/i)) == "mac") {
            return "mac";
        } else if (("" + ua.match(/ucbrower/i)) == "ucbrower") {
            return "ucbrower";
        } else {
            LogUtils.logD("未知系统类型");
        }
    }

    //获得平台类型 如 微信、qqzone、qq、微博、校内、facebook
    export function platformType(): string {
        var ua = window.navigator.userAgent.toLowerCase();
        if (("" + ua.match(/micromessenger/i)) == "micromessenger") {
            return "micromessenger";
        } else if (("" + ua.match(/qzone/i)) == "qzone") {
            return "qzone";
        } else if (("" + ua.match(/weibo/i)) == "weibo") {
            return "weibo";
        } else if (("" + ua.match(/qq/i)) == "qq") {
            return "qq";
        } else if (("" + ua.match(/renren/i)) == "renren") {
            return "renren";
        } else if (("" + ua.match(/txmicroblog/i)) == "txmicroblog") {
            return "txmicroblog";
        } else if (("" + ua.match(/douban/i)) == "douban") {
            return "douban";
        } else {
            return "other";
        }
    }

    //当前舞台
    export function curStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }

    //当前面板
    export var curPanel: egret.DisplayObjectContainer;

    //当前游戏宽度
    export function curWidth(): number {
        return egret.MainContext.instance.stage.stageWidth;
    }

    //当前游戏宽度
    export function curHeight(): number {
        return egret.MainContext.instance.stage.stageHeight;
    }

    export var time_config = {
        500: 500,
        200: 100,
        100: 100,
        1000: 1000,
        300: 300,
        400: 400,
    }

    export var MUSIC_NAME = "music_flag";

    export var SOUND_NAME = "sound_flag";

    export var SOUND_VOMULE = "sound_vomule";

    export var EFFECT_VOMULE = "effect_vomule";

    export var DEFUALT_NAME = "login_name2";

    export var GAME_CONFIG;

}



