module sdmn {
    export class SDMNScene1 extends game.BaseScene {
        public resizeGroup: eui.Group;
        public gameGroup: eui.Group;
        public bottomGroup: eui.Group;
        public tipsBtn: eui.Button;
        public menuBtn: eui.Button;
        public maxBetBtn: eui.Button;
        public playerGold: eui.Label;
        public winNum: eui.Label;
        public subbet: eui.Button;
        public addbet: eui.Button;
        public totalBet: eui.Label;
        public spinGroup: eui.Group;
        public autoGameBtn: eui.Button;
        public startBtn: eui.Image;
        public timesLabel: eui.BitmapLabel;
        public scroller: SDMNScroller;

        private ownGold: number; //玩家当前金钱

        public constructor() {
            super();
            this.skinName = "SDMNScene1Skin";
        }
        public createChildrean() {
            super.createChildren();
            this.startGame();
            this[`scroller`].showFirst(1);
        }
        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterGame, this);
            // EventManager.instance.addEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
            // EventManager.instance.addEvent(EventNotify.SDMN_ENTER_COMMOM_GAME, this.free2Commom, this);
            // EventManager.instance.addEvent(EventNotify.AUTO_GAME, this.startAutoGame, this);
        }
        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterGame, this);
            // EventManager.instance.removeEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
            // EventManager.instance.removeEvent(EventNotify.SDMN_ENTER_COMMOM_GAME, this.free2Commom, this);
            // EventManager.instance.removeEvent(EventNotify.AUTO_GAME, this.startAutoGame, this);
        }
        /**
         * 开始游戏，请求数据
         */
        public async startGame() {
            let resp1: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_queryGameState, {});
            let data = { "gameId": Global.gameProxy.gameIds["slot"], "sceneId": 1004 }
            let resp: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_enter, data);
            //消息判断
            if (resp.error.code != 0) {
                let text = resp.error.msg;
                Global.alertMediator.addAlert(text, () => {
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDMN);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LAOHUJI_HALL);
                }, "", true);
                return;
            }
        }
        /**
         * 进入游戏消息
         * @param  {egret.Event} e
         */
        public enterGame(e: egret.Event) {
            let resp = e.data;
            game.SDMNUtils.bets = [];
            game.SDMNUtils.muls = [];
            for (let i = 0; i < resp.roomInfo.gamePayTable.bets.length; i++) {
                game.SDMNUtils.bets.push(resp.roomInfo.gamePayTable.bets[i]);
            }
            for (let j = 0; j < resp.roomInfo.gamePayTable.muls.length; j++) {
                game.SDMNUtils.muls.push(resp.roomInfo.gamePayTable.muls[j]);
            }
            //免费游戏倍数
            if (resp.roomInfo.gamePayTable) {
                game.SDMNUtils.FreeTimeMul = [];
                for (let k = 0; k < resp.roomInfo.gamePayTable.freeGameMuls.length; k++) {
                    game.SDMNUtils.FreeTimeMul.push(resp.roomInfo.gamePayTable.freeGameMuls[k]);
                }
                game.SDMNUtils.FreeTimeMulIndex = resp.roomInfo.players.freeMulIndex;
                game.SDMNUtils.FreeTimeMul = game.SDMNUtils.FreeTimeMul[game.SDMNUtils.FreeTimeMulIndex];
                game.SDMNUtils.freeTimes = resp.roomInfo.players.freeTimes;
            }
            this.ownGold = resp.roomInfo.players.gold;
            this.playerGold.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
            game.SDMNUtils.ToTalMoney = this.ownGold;
            game.SDMNUtils.bet = game.SDMNUtils.bets[0];
            game.SDMNUtils.mul = game.SDMNUtils.muls[0];
        }

        /**
         * 点击事件
         * @param  {egret.TouchEvent} e
         */
        public onTouchTap(e: egret.TouchEvent) {
            switch (e.target) {
                //spin按钮
                case this.startBtn:
                    // SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    this.startBtnTouch();
                    break;
                //退出按钮
                // case this.quitBtn:
                //     SoundManager.getInstance().playEffect("cbzz_button_mp3");
                //     this.leaveCBZZ();
                //     break;
                //最大bet按钮
                case this.maxBetBtn:
                    // SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    // this.setMaxBet();
                    break;
                //赔付表按钮
                case this.tipsBtn:
                    // SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    // this.opensdmnTips();
                    break;
                //减少bet按钮
                case this.subbet:
                    // SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    // this.reduceBet();
                    break;
                //增加bet按钮
                case this.addbet:
                    // SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    // this.addBetFunc();
                    break;
                //自动游戏窗口
                case this.autoGameBtn:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_CBZZ_AUTO_PANEL);
                    break;
                //转轴快速停止
                // case this.maskRect:
                //     this.scrollerFastGame();
                //     break;
                //菜单按钮
                case this.menuBtn:
                    // SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    // if (this.menuGroup.visible == false) {
                    //     this.menuGroup.visible = true;
                    // } else {
                    //     this.menuGroup.visible = false;
                    // }
                    break;
                //游戏记录按钮
                case this.recordBtn:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    // this.openGameRecord();
                    // this.menuGroup.visible = false;
                    break;
                //游戏设置按钮
                // case this.settingBtn:
                //     SoundManager.getInstance().playEffect("cbzz_button_mp3");
                //     game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING);
                //     this.menuGroup.visible = false;
                //     break;
                //测试按钮
                // case this.startBtn0:
                //     this.startBtnTouch0();
                //     break;
            }
        }

        private showIconTimeOut: any; //每条连线循环播放的timeout
        public runningType: number = 3;//选择类型
        private sethuiTimeout: any; //icon置灰timeout
        private isStopAni: boolean = false;//播放stop动画flag
        /**
         * spin按钮点击处理
         */
        public startBtnTouch() {
            //判断余额
            if (game.CBZZUtils.bet * game.CBZZUtils.mul * 50 > this.ownGold) {
                let text = "金币不足";
                Global.alertMediator.addAlert(text, () => {
                    // this.resetOtherBtn();
                    Global.playerProxy.playerData.gold = this.ownGold;
                }, "", true);
                return;
            }
            var colorMatrix = [
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            //转轴是否准备就绪
            if (this.runningType == RUNNING_TYPE.EMPTY) {
                if (this.scatter == 1) return;
                // 判断是否为免费游戏并且是否有剩余的免费次数
                if (game.LaohuUtils.isAutoGame && game.LaohuUtils.auto_times >= 1) {
                    if (game.LaohuUtils.isAutoGame && game.LaohuUtils.auto_times <= 0) {
                        game.LaohuUtils.isAutoGame = false;
                        game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
                        game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
                        // this.resetOtherBtn();
                        this.startBtn.source = "cbzz_startbtn_png";
                        this.timesLabel.text = "";
                        game.LaohuUtils.speed = 48;
                        this.runningType = RUNNING_TYPE.EMPTY;
                        SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
                        // this.resetStartBtn();
                        return;
                    }
                    //判断是否为免费游戏并且是否有满足总下注条件
                    if (game.LaohuUtils.totalAdd && game.LaohuUtils.isAutoGame) {
                        if (game.LaohuUtils.totalBet >= game.LaohuUtils.totalAdd) {
                            game.LaohuUtils.isAutoGame = false;
                            // this.resetOtherBtn();
                            this.startBtn.source = "cbzz_startbtn_png";
                            this.timesLabel.text = "";
                            game.LaohuUtils.speed = 48;
                            this.runningType = RUNNING_TYPE.EMPTY;
                            SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
                            // this.resetStartBtn();
                            return;
                        }
                    }
                    //判断是否为免费游戏并且是否有满足总赢取条件
                    if (game.LaohuUtils.totalWin && game.LaohuUtils.isAutoGame) {
                        //自动游戏总赢取条件满足
                        if (game.LaohuUtils.totoalWinGold >= game.LaohuUtils.totalWin) {
                            game.LaohuUtils.isAutoGame = false;
                            game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
                            game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
                            // this.resetOtherBtn();
                            this.startBtn.source = "cbzz_startbtn_png";
                            this.timesLabel.text = "";
                            game.LaohuUtils.speed = 48;
                            this.runningType = RUNNING_TYPE.EMPTY;
                            SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
                            // this.resetStartBtn();
                            return;
                        }
                    }
                    game.LaohuUtils.auto_times -= 1;
                    this.timesLabel.visible = true;
                    this.timesLabel.text = game.LaohuUtils.auto_times + "";
                    game.LaohuUtils.totalBet += game.CBZZUtils.bet * game.CBZZUtils.mul * 50
                    if (game.LaohuUtils.auto_times > 1000) {
                        this.timesLabel.text = "s";
                    }
                }
                //自动游戏次数完场
                else if (game.LaohuUtils.isAutoGame && game.LaohuUtils.auto_times <= 0) {
                    this.timesLabel.visible = false;
                    game.LaohuUtils.isAutoGame = false;
                    this.startBtn.source = "cbzz_startbtn_png";
                    // this.resetOtherBtn();
                    // this.resetStartBtn();
                    return;
                } //为满足完成自动游戏条件，开始自动游戏旋转
                else if (!game.LaohuUtils.isAutoGame) {
                    // this.setStartBtn();
                    game.LaohuUtils.speed = 48;
                }
                this.winNum.text = 0 + "";
                this.startBtn.filters = [colorFlilter];
                this.runningType = RUNNING_TYPE.LOOP;
                // this.removeLastAni();
                this.scroller.stopIconDb();
                this.isStopAni = true;
                // this.setOtherBtn();
                this.scroller.run();
                SoundManager.getInstance().playEffect("cbzz_reel_mp3", true);
                this.messageSend();
            }
            //是否为快速停止状态
            else if (this.runningType == RUNNING_TYPE.RESULT) {
                game.LaohuUtils.auto_times = 0;
                this.timesLabel.text = "";
                // this.fastGame();
                game.LaohuUtils.isAutoGame = false;
            }
            //停止状态点击无效果
            else if (this.runningType == RUNNING_TYPE.STOP) {
            }
        }

        private showAtr: Array<Array<number>>; //所有图标展示数组
        private bonusAtr: Array<Array<number>>;//获奖图标数组
        private scatterIcon: number; //scatterIcon数量 
        private eachLineScore: Array<number>;//每条连线的中奖金额 
        private yudiAtr: Array<number>;//scatter图标位置数组 
        private allAtr: Array<Array<number>>;//所有连线图标数组
        private scatter: number;//是否为scatter 
        private messageTimeOut: any;//收到消息后延迟停止转动timeout
        private fastEnd: boolean = false;
        private scatter4timeout: any;
        private scatter5timeout: any;
        private autoGameTimeout: any;
        private winGold: number = 0;

        /**
        * 发送c_bet请求
        */
        private async messageSend() {
            this.showAtr = [];
            this.bonusAtr = [];
            this.scatterIcon = 0;
            this.eachLineScore = [];
            this.yudiAtr = [];
            this.allAtr = [];
            this.scatter = 0;
            let data2: any;
            //测试专用消息
            // if (this.isTest) {
            //     if (this.spinTest == 1) {
            //         data2 = { "spinType": this.spinTest, "bet": game.CBZZUtils.bet, "multiple": game.CBZZUtils.mul, "lineCount": 243, "activityId": 0, "freeWheel": this.wheel };
            //     } else {
            //         data2 = { "spinType": this.spinTest, "bet": game.CBZZUtils.bet, "multiple": game.CBZZUtils.mul, "lineCount": 243, "activityId": 0, "wheel": this.wheel };
            //     }
            // } else {
            data2 = { "spinType": 0, "bet": game.SDMNUtils.bet, "multiple": game.SDMNUtils.mul, "lineCount": 243, "activityId": 0 };
            // }
            let resp2: any = await Global.pomelo.request(ServerPostPath.game_slotHandler_c_bet, data2);
            if (resp2.error) {
                let text = resp2.error.msg;
                Global.alertMediator.addAlert(text, "", "", true);
                game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
                game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_SDMN);
                return;
            }
            this.ownGold -= game.SDMNUtils.bet * game.SDMNUtils.mul * 50;
            this.playerGold.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
            var colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.startBtn.filters = [colorFlilter];
            // if (!game.LaohuUtils.isAutoGame) this.dbGameRun.filters = [colorFlilter];
            let resp1: any = resp2.spinRes;
            this.showAtr = [resp1.matrix[0], resp1.matrix[1], resp1.matrix[2], resp1.matrix[3], resp1.matrix[4]];
            this.messageTimeOut = egret.setTimeout(() => {
                this.scroller.runResult(this.showAtr);
            }, this, 300);
            this.runningType = RUNNING_TYPE.RESULT;
            this.winGold = resp2.winCount;
            this.ownGold = resp2.own_gold;
            this.scatter = resp2.sactter;
            if (resp1.rmIndex) {
                for (let i in resp1.rmIndex) {
                    this.allAtr.push(resp1.rmIndex[i]);
                }
            }
            //消息判断
            if (resp1.winnerInfo) {
                for (let i = 0; i < resp1.winnerInfo.length; i++) {
                    for (let j = 0; j < resp1.winnerInfo[i].length; j++) {
                        resp1.winnerInfo[i][j] = resp1.winnerInfo[i][j].myReplace(" ", "");
                        let aaa = resp1.winnerInfo[i][j];
                        let str_lingshi: number[] = [];
                        let temp: any = [];
                        temp = resp1.winnerInfo[i][j].split(":")[2];
                        let temp2 = resp1.winnerInfo[i][j].split(":")[1];
                        temp = temp.myReplace("{", "");
                        temp = temp.myReplace("}", "");
                        let arr = temp.split(",")
                        this.eachLineScore.push(temp2);
                        for (let k = 0; k < arr.length; k++) {
                            str_lingshi.push(parseInt(arr[k]));
                        }
                        this.bonusAtr.push(str_lingshi);
                    }
                }
            } else {
                this.bonusAtr = [];
            }
            //是否为scatter
            if (resp2.sactter == 1) {
                let scatternum = 0;
                this.yudiAtr = [];
                for (let i = 0; i <= 4; i++) {
                    for (let j = 0; j < this.showAtr[i].length; j++) {
                        if (this.showAtr[i][j] == 2) {
                            this.yudiAtr.push(j);
                        }
                    }
                }
            }
            //免费游戏情况下累加赢取金额
            if (game.LaohuUtils.isAutoGame) {
                game.LaohuUtils.totoalWinGold += this.winGold;
            }
            this.isStopAni = false;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < this.showAtr[i].length; j++) {
                    //判断前三列几个玉帝
                    if (this.showAtr[i][j] == 2) {
                        this.scatterIcon++;
                    } else {
                        this.startBtn.touchEnabled = true;
                        this.scroller.touchEnabled = true;
                    }
                }
            }
        }
    }
}