// TypeScript file
class NNRoomInfoBean {
  //创建者ID
  public creator: number;
  //当前操作玩家
  public curPlay: number;
  //当前局数
  public curRound: number;
  //当前任务
  public curTask: number;
  //庄家
  public dealer: number;
  //连庄局数
  public randomDealers: any;
  
  public dealerLZ: number;
  //游戏类型
  public gameId: string;

  public players: any;
  //玩法
  public options: any;
  //游戏状态
  public playing: boolean;

  public roomId: number;

  public round;
  //玩法场
  public sceneId: number;

  public countdown: any;

  public steps: number[];

  public roundStatus;

  public constructor() {

  }

  /**
   * 设置对局轮次
   * @param  {GameRoundData} roundData
   */
  public setRoundData(roundData: GameRoundData) {
    this.curRound = roundData.curRound;
    this.dealer = roundData.dealer;
    this.dealerLZ = roundData.dealerLZ;
    this.curPlay = roundData.dealer;
  }

}