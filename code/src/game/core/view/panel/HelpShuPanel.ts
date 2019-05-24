/*
 * @Author: he bing 
 * @Date: 2018-07-31 15:05:10 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-11-19 14:16:05
 * @Description: 
 */
class HelpShuPanel extends game.BaseComponent {
    private closeBtn: eui.Button;
    private texts: eui.Label;
    public resizeGroup: eui.Group;
    private jbgzbtn: eui.Image;
    private pxjsbtn: eui.Image;
    private pxdxbtn: eui.Image;
    private jbgzbtn0: eui.Image;
    private pxjsbtn0: eui.Image;
    private pxdxbtn0: eui.Image;
    private rects: eui.Rect;
    private help_scroller: eui.Scroller;
    private textGroup: eui.Group;
    private type: string;
    public constructor(type) {
        super();
        this.type = type;
        this.skinName = new NiuniuHelpSkin();
    }

    protected createChildren() {
        super.createChildren();
        this.showOrFalse(1);
        this.texts.textFlow = (new egret.HtmlTextParser).parser(this.textLable(1));
    }

    //记录选择的游戏帮助的按钮
    private btnTimer: number = 0;
    public onTouchTap(e: egret.TouchEvent) {
        e.stopPropagation();
        switch (e.target) {
            case this.jbgzbtn:
            case this.jbgzbtn0:
                majiang.MajiangUtils.playClick();//管理声音的
                this.textGroup.removeChildren();
                this.help_scroller.viewport.scrollV = 0;
                this.texts.height = 880;
                this.texts.textFlow = (new egret.HtmlTextParser).parser(this.textLable(1));
                this.textGroup.addChild(this.texts);
                this.showOrFalse(1);
                break;
            case this.pxjsbtn:
            case this.pxjsbtn0:
                majiang.MajiangUtils.playClick();//管理声音的
                this.textGroup.removeChildren();
                this.help_scroller.viewport.scrollV = 0;
                this.texts.height = 780;
                this.texts.textFlow = (new egret.HtmlTextParser).parser(this.textLable(2));
                this.textGroup.addChild(this.texts);
                this.showOrFalse(2);
                break;

            case this.pxdxbtn:
            case this.pxdxbtn0:
                majiang.MajiangUtils.playClick();//管理声音的
                this.textGroup.removeChildren();
                this.help_scroller.viewport.scrollV = 0;
                this.texts.height = 280;
                this.texts.text = this.textLable(3);
                this.textGroup.addChild(this.texts);
                this.showOrFalse(3);
                break;
            case this.closeBtn:
            case this.rects:
                this.rects.visible = false;
                game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_HELP_SHU);
                break;
        }
    }

	/**
	 * 是否显示或者隐藏文字类容
	 */
    public showOrFalse(number) {
        switch (number) {
            case 1:
                this.jbgzbtn.alpha = 1;
                this.pxdxbtn.alpha = 0.5;
                this.pxjsbtn.alpha = 0.5;
                break;
            case 2:
                this.pxjsbtn.alpha = 1;
                this.jbgzbtn.alpha = 0.5;
                this.pxdxbtn.alpha = 0.5;
                break;
            case 3:
                this.pxdxbtn.alpha = 1;
                this.jbgzbtn.alpha = 0.5;
                this.pxjsbtn.alpha = 0.5;
                break;
        }
    }


    private showNiuniuContent(textLables) {
        switch (textLables) {
            case 1:
                return '<font color="#18dc95" size="23"   >抢庄：</font>' + '\n'
                    + '每个玩家选择是否抢庄及抢庄的倍数，倍数最高的为庄家，当多个玩家倍数相同时，随机一名玩家当庄，随机和自身金币携带量有关，金币携带越多则随机的概率越大；所有玩家不抢庄时，系统随机选择一名玩家为庄家' + '\n'
                    + '<font color="#18dc95" size="23"   >加倍：</font>' + '\n'
                    + '闲家加倍，金币越多，可选择的倍数越大' + '\n'
                    + '<font color="#18dc95" size="23"   >拼牌：</font>' + '\n'
                    + '在5张手牌中选择三张牌组合成10点的整数倍' + '\n'
                    + '<font color="#18dc95" size="23"   >比牌：</font>' + '\n'
                    + '庄家和每个闲家分别比牌，闲家之间不会相互比牌' + '\n'
                    + '<font color="#18dc95" size="23"   >结算：</font>' + '\n'
                    + 'A：房间底注' + '\n'
                    + 'M：庄家牌型倍数' + '\n'
                    + 'N：闲家牌型倍数' + '\n'
                    + 'X：抢庄倍数' + '\n'
                    + 'Y：加倍倍数' + '\n'
                    + '庄家胜利赢得游戏币：A * M * X * Y - 抽水' + '\n'
                    + '庄家失败所输游戏币：A * N * X * Y' + '\n'
                    + '闲家胜利赢得游戏币：A * N * X * Y - 抽水' + '\n'
                    + '闲家失败所输游戏币：A * M * X * Y' + '\n'
                    + '<font color="#18dc95" size="23"   >防止以小博大机制：</font>' + '\n'
                    + '带入游戏币多少，输赢游戏币不大于带入金币' + '\n'
                    + '<font color="#18dc95" size="23"   >抽水比例：</font>' + '\n'
                    + '5 %'

            case 2:
                return '<font color="#18dc95" size="23"   >用牌:</font>' + '\n'
                    + '除开大小王52张牌' + '\n'
                    + '<font color="#18dc95" size="23"   >牌面:</font>' + '\n'
                    + '10、J、Q、K为10点，其余牌为自身牌面点数' + '\n'
                    + '<font color="#18dc95" size="23"   >没牛:</font>' + '\n'
                    + '5张手牌中任意3张牌点数之和不为10的整数倍' + '\n'
                    + '<font color="#18dc95" size="23"   >有牛:</font>' + '\n'
                    + '5张手牌中任意3张牌点数之和为10的整数倍，剩下两张点数和的个位即为牛几' + '\n'
                    + '<font color="#18dc95" size="23"   >牛牛:</font>' + '\n'
                    + '5张手牌中任意3张牌点数之和为10的整数倍，剩下两张点数和同为10的整数倍' + '\n'
                    + '<font color="#18dc95" size="23"   >四花牛:</font>' + '\n'
                    + '5张手牌中4张牌为J、Q、K，剩余一张牌为10，例如：JQQK10' + '\n'
                    + '<font color="#18dc95" size="23"   >五花牛:</font>' + '\n'
                    + '5张手牌全部为J、Q、K，例如：JQQKK' + '\n'
                    + '<font color="#18dc95" size="23"   >炸弹:</font>' + '\n'
                    + '5张手牌中4张牌相同和任意一张牌，例如：5555K' + '\n'
                    + '<font color="#18dc95" size="23"   >五小牛:</font>' + '\n'
                    + '5张手牌中所有手牌都点数都小于5，且点数之和小于等于10，例如：AA223'

            case 3:
                return '没牛~牛五：1倍' + '\n'
                    + '牛六~牛九：2倍' + '\n'
                    + '牛牛：3倍' + '\n'
                    + '四花牛~五花牛：4倍' + '\n'
                    + '炸弹：5倍' + '\n'
                    + '五小牛：6倍'
        }
    }


    private textLable(textLables) {
        switch (this.type) {
            case "blnn":
                return this.showNiuniuContent(textLables);
            case "sangong":
                return this.showSangongContent(textLables);
        }

    }


    private showSangongContent(textLables) {
        switch (textLables) {
            case 1:
                return '<font color="#18dc95" size="23"   >抢庄：</font>' + '\n'
                    + '四个人开始后开始抢庄，点过抢庄的人有机会成为庄家，当多个玩家倍数相同时，随机一名玩家当庄，随机和自身金币携带量有关，金币携带越多则随机的概率越大；所有玩家不抢庄时，系统随机选择一名玩家为庄家' + '\n'
                    + '<font color="#18dc95" size="23"   >押注：</font>' + '\n'
                    + '闲家加倍，金币越多，可选择的倍数越大' + '\n'
                    + '<font color="#18dc95" size="23"   >比牌：</font>' + '\n'
                    + '所有玩家翻牌后，庄家和每个闲家分别比牌，闲家之间不会相互比牌' + '\n'
                    + '<font color="#18dc95" size="23"   >结算：</font>' + '\n'
                    + 'A：房间底注' + '\n'
                    + 'M：庄家牌型倍数' + '\n'
                    + 'N：闲家牌型倍数' + '\n'
                    + 'X：加倍倍数' + '\n'
                    + '庄家胜利赢得游戏币：A * M * X - 抽水' + '\n'
                    + '庄家失败所输游戏币：A * N * X' + '\n'
                    + '闲家胜利赢得游戏币：A * N * X - 抽水' + '\n'
                    + '闲家失败所输游戏币：A * M * X' + '\n'
                    + '<font color="#18dc95" size="23"   >防止以小博大机制：</font>' + '\n'
                    + '带入游戏币多少，输赢游戏币不大于带入金币' + '\n'
                    + '<font color="#18dc95" size="23"   >抽水比例：</font>' + '\n'
                    + '5 %'

            case 2:
                return '<font color="#18dc95" size="23"   >用牌:</font>' + '\n'
                    + '除开大小王52张牌' + '\n'
                    + '<font color="#18dc95" size="23"   >点数牌:</font>' + '\n'
                    + 'A~9为1~9点，10为0点' + '\n'
                    + '<font color="#18dc95" size="23"   >公牌:</font>' + '\n'
                    + 'J、Q、K为公牌，公牌计为0' + '\n'
                    + '<font color="#18dc95" size="23"   >至尊:</font>' + '\n'
                    + '3张3构成的牌型' + '\n'
                    + '<font color="#18dc95" size="23"   >大三公:</font>' + '\n'
                    + '3张相同的牌构成的牌型，如：QQQ、222' + '\n'
                    + '<font color="#18dc95" size="23"   >三公:</font>' + '\n'
                    + '3张公仔牌构成的牌型，如：JQK、KKQ' + '\n'
                    + '首先比较牌型，牌型相同比单张，单张相同比花色' + '\n'
                    + '牌型大小顺序：' + '\n'
                    + '至尊＞大三公＞三公＞9点＞…＞0点' + '\n'
                    + '单张牌大小顺序：' + '\n'
                    + 'K＞Q＞J＞10＞9＞8＞7＞6＞5＞4＞3＞2＞A' + '\n'
                    + '花色大小顺序：' + '\n'
                    + '黑桃＞红桃＞梅花＞方块' + '\n'
            case 3:
                return '0点 ~ 6点：1倍' + '\n'
                    + '7点 ~ 9点：2倍' + '\n'
                    + '三公：3倍' + '\n'
                    + '大三公：4倍' + '\n'
                    + '至尊：5倍' + '\n'
        }
    }

    public onAdded() {
        super.onAdded();
    }
}