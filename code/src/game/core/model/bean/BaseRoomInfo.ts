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

	public curGameTurn: number;

	public curTurns: number;
	//当前押注
	public minYZ: number;

	public r_isRoundWin: boolean = false;
	public b_isRoundWin: boolean = false;

	public r_roundPattern: number;
	public b_roundPattern: number;
	//开牌信息。
	public openCardInfo: any;
	//玩家列表。
	public playerList: any;
	

	public randomDealers;
}