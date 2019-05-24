class BaseRoomInfo {
	public betBase: number;

	public countdown: any;

	public gameId: string;

	public players: any;

	public playing: boolean;

	public roomId: number;

	public roundId: number;

	public sceneId: number;

	public serverTime: number;

	public roundStatus: number;

	public camp: number;
	public camps: number;

	public type: number;
	public types: number;

	public rValue: any;
	public rValues: any;

	public bValue: any;
	public bValues: any;

	//庄家
	public dealer: number;

	public maxTurn: number;

	public curTurns: number;
	//当前押注
	public minYZ: number;

	//开牌信息。
	public openCardInfo: any;
	//玩家列表。
	public playerList: any;

	//游戏当前阶段
	public curGameTurn;

	public totalBet;

	public curPlay;
}