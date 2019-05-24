class RBWRoomInfo extends BaseRoomInfo {
	public playerList = {
		richManList: [],
		winRate1st: {},
	};

	public lastRBReport: number[];

	public lastWinPattern: any[];

	public addBet: number[];

	public roundBetInfo: any;

	public r_isRoundWin: boolean = false;

	public r_roundPattern: number;

	public b_isRoundWin: boolean = false;

	public b_roundPattern: number;

	public betMulti: any;
}