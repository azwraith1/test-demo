// TypeScript file
class BJLRoomInfo extends BaseRoomInfo {
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

    public pIndex: number;

    public gold: number;

    public lastBet: number;

    public lastWin: number;

    public name: number;

    public sex: number;

    public url: number;
    
    public betInfo: any;

    public usedNum:number;

    public remainNum:number;

    public wayBillInfo:any;

    public zoneTotalBet:any;
}