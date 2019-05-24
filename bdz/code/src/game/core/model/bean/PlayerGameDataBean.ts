/*
 * @Author: li mengchan 
 * @Date: 2018-07-06 10:31:18 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-04-04 16:51:51
 * @Description: 麻将游戏玩家数据
 */
class PlayerGameDataBean {
	public background: boolean;
	//头像
	public figure_url: string;
	public gmLevel: number;
	public gold: number;
	public gps;
	public loginIp: string;
	public nickname: string;
	public online: boolean;
	public playing: boolean;
	public ready: boolean;
	public sex: number;
	public uid: number;

	//手牌数量
	public cardNum: number;
	//手牌集合
	public cards: any;
	//吃牌的集合
	public chiCards: any[];
	//杠牌的集合
	public gangCards: any[];
	//胡牌
	public huCards: number[]= [2,3,3,4];
	// huCardsType = [1,1,1,2]
	public isBaoTing: boolean;
	// 是否托管
	public isTrustee: boolean;

	public lastCard: number;

	public pengCards: any[];

	public pengCardsFrom: any;

	public score: number;
	//定缺的花色
	public selectColor: number;

	public selectedHSZCards: any[];

	public hangupTasks: any;

	public playCards: any[];

	public huaCards: number[];

	public huaNewCards: number[];

	public bills: any[]; 
	public hidePass;
	public taskIndex: number;


	//bdz -----------
	//type value
	public handCards;

	public isAllIn;

	public playerBet;

	public resultCards;

	public switchCardNum;

	public gameTurn;

	public handCardsNum;

	public gameStatus;

	public task;

	public tipCards: number[];

	public roundPattern;

	public taskInfo
}
