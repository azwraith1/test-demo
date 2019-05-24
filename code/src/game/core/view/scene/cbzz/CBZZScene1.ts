/*
 * @Author: wangtao 
 * @Date: 2019-05-08 15:29:07 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 17:49:10
 * @Description: 
 */
module cbzz {
    export class CBZZScene1 extends game.BaseScene {
        public resizeGroup: eui.Group;
        public effectGroup: eui.Group;
        public scroller: cbzz.CBZZScroller;
        public lineScoreGroup: eui.Group;
        public lineNum: eui.BitmapLabel;
        public memuBtn: eui.Button;
        public tipsBtn: eui.Button;
        public menuGroup: eui.Group;
        public recordBtn: eui.Button;
        public setingBtn: eui.Button;
        public maxBet: eui.Image;
        public beishu: eui.Label;
        public playerGold: eui.Label;
        public winNum: eui.Label;
        public subbet: eui.Button;
        public addbet: eui.Button;
        public totalBet: eui.Label;
        public spinGroup: eui.Group;
        public autoGameBtn: eui.Button;
        public startBtn: eui.Image;
        public timesLabel: eui.BitmapLabel;
        public maskRect: eui.Rect;
        public quitBtn: eui.Button;
        public testGroup: eui.Group;
        public pscen1: eui.EditableText;
        public startBtn0: eui.Button;
        public spinresult: eui.EditableText;
        public lable2: eui.Label;
        public lable1: eui.Label;

        private ownGold: number; //玩家当前金钱
        private winGold: number = 0;
        private bet: number = 1;
        private bgAni1: DBComponent //背景特效1
        private bgAni2: DBComponent //背景特效2
        private spinAni1: DBComponent //spin初始特效
        private spinAni2: DBComponent //spin旋转特效
        private spin2stop: DBComponent //旋转时stop的按钮特效
        private startSpinAni: DBComponent //开始spin时按钮特效
        private bigWinPanel: CBZZBigwinGroup;
        private HuiAtr: Array<Array<number>> = [[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]];
        public bgMusic: string;
        public constructor() {
            super();
            this.skinName = new CBZZScene1Skin();
        }

        public createChildren() {
            super.createChildren();
            this.startGame();
            //判断是否为pc端
            let isPC = NativeApi.instance.IsPC();
            if (isPC) {
                mouse.enable(this.stage);
                this.addMouseOnEvent();
            }
            if (Global.playerProxy.playerData.nickname == "test004" || Global.playerProxy.playerData.nickname == "test001" || Global.playerProxy.playerData.nickname == "test002" || Global.playerProxy.playerData.nickname == "test003" || Global.playerProxy.playerData.nickname == "test005" || Global.playerProxy.playerData.nickname == "test006" || Global.playerProxy.playerData.nickname == "test007" || Global.playerProxy.playerData.nickname == "test008" || Global.playerProxy.playerData.nickname == "test009" || Global.playerProxy.playerData.nickname == "test010") {
                if (ServerConfig.PATH_TYPE == PathTypeEnum.QA_TEST) {
                    this.testGroup.visible = true;
                }
            }
            if (ServerConfig.OP_RETURN_TYPE == "3") {
                this.quitBtn.visible = false;
            }
            this.bgAni1 = DBComponent.create("cbzz_bg1", "cbzz_bg_ani1");
            this.bgAni2 = DBComponent.create("cbzz_bg2", "cbzz_bg_ani2");
            this.spinAni1 = DBComponent.create("cb_spin1", "cbzz_mouseon");
            this.spinAni2 = DBComponent.create("cb_spin2", "cbzz_spin_ani1");
            this.spin2stop = DBComponent.create("cb_spin2stop", "cbzz_stop_stop");
            this.startSpinAni = DBComponent.create("cb_startSpinAni", "cbzz_spin_gunang");
            game.CBZZUtils.bigwinAni1 = DBComponent.create("cb_bigwinAni1", "cbzz_bigwin_ani1");
            this.spinAni1.touchEnabled = this.spinAni2.touchEnabled = this.startSpinAni.touchEnabled = this.spin2stop.touchEnabled = false;

            this.spinAni1.play("", 0);
            this.spinAni1.horizontalCenter = 1;
            this.spinAni1.bottom = 41;
            this.spinGroup.addChild(this.spinAni1);
            this.spinAni1.resetPosition();

            this.bgAni1.play("", 0);
            this.resizeGroup.addChild(this.bgAni1);
            this.bgAni1.horizontalCenter = 0; this.bgAni1.bottom = 300;
            this.bgAni2.horizontalCenter = this.bgAni2.bottom = 0;
            this.bgAni1.touchEnabled = this.bgAni2.touchEnabled = false;
            this.bgAni1.resetPosition();
            this.bgAni2.play("", 0);
            this.effectGroup.addChild(this.bgAni2);
            this.bgAni2.resetPosition();
            this.scroller.showFirst(1);
        }
        /**
         * 开始游戏发送请求
         */
        public async startGame() {
            let resp1: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_queryGameState, {});
            let data = { "gameId": Global.gameProxy.gameIds["slot"], "sceneId": 1003 }
            let resp: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_enter, data);
            if (resp.error.code != 0) {
                let text = resp.error.msg;
                Global.alertMediator.addAlert(text, () => {
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_CBZZ);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_LAOHUJI_HALL);
                }, "", true);
                return;
            }
        }

        public onAdded() {
            super.onAdded();
            SoundManager.getInstance().playMusic("cbzz_background_mus_mp3");
            EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterGame, this);
            EventManager.instance.addEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
            EventManager.instance.addEvent(EventNotify.CBZZ_ENTER_COMMOM_GAME, this.free2Commom, this);
            EventManager.instance.addEvent(EventNotify.AUTO_GAME, this.startAutoGame, this);
        }
        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterGame, this);
            EventManager.instance.removeEvent(EventNotify.LHJ_ITEM_OVER, this.scrollerEnd, this);
            EventManager.instance.removeEvent(EventNotify.CBZZ_ENTER_COMMOM_GAME, this.free2Commom, this);
            EventManager.instance.removeEvent(EventNotify.AUTO_GAME, this.startAutoGame, this);
        }
        /**
         * 进入游戏数据处理
         * @param  {egret.Event} e
         */
        public enterGame(e: egret.Event) {
            let resp = e.data;
            game.CBZZUtils.bets = [];
            game.CBZZUtils.muls = [];
            for (let i = 0; i < resp.roomInfo.gamePayTable.bets.length; i++) {
                game.CBZZUtils.bets.push(resp.roomInfo.gamePayTable.bets[i]);
            }
            for (let j = 0; j < resp.roomInfo.gamePayTable.muls.length; j++) {
                game.CBZZUtils.muls.push(resp.roomInfo.gamePayTable.muls[j]);
            }
            if (resp.roomInfo.gamePayTable) {
                game.CBZZUtils.FreeTimeMul = [];
                for (let k = 0; k < resp.roomInfo.gamePayTable.freeGameMuls.length; k++) {
                    game.CBZZUtils.FreeTimeMul.push(resp.roomInfo.gamePayTable.freeGameMuls[k]);
                }
                game.CBZZUtils.FreeTimeMulIndex = resp.roomInfo.players.freeMulIndex;
                game.CBZZUtils.FreeTimeMul = game.CBZZUtils.FreeTimeMul[game.CBZZUtils.FreeTimeMulIndex];
                game.CBZZUtils.freeTimes = resp.roomInfo.players.freeTimes;
            }
            this.ownGold = resp.roomInfo.players.gold;
            this.playerGold.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
            game.CBZZUtils.ToTalMoney = this.ownGold;
            game.CBZZUtils.bet = game.CBZZUtils.bets[0];
            game.CBZZUtils.mul = game.CBZZUtils.muls[0];
            //判断是否为免费游戏
            if (resp.roomInfo.players.isScatter == 1 && resp.roomInfo.players.freeTimes == 0) {
                EventManager.instance.dispatch(EventNotify.CBZZ_ENTER_FREE_GAME_SCENE);
            } else if (resp.roomInfo.players.isScatter == 0 && resp.roomInfo.players.freeTimes != 0) {
                game.LaohuUtils.freeWin = resp.roomInfo.players.freeWinGold;
                game.LaohuUtils.freeTimes = resp.roomInfo.players.freeTimes;
                game.CBZZUtils.bet = resp.roomInfo.players.lastBet;
                game.CBZZUtils.mul = resp.roomInfo.players.lastMul;
                EventManager.instance.dispatch(EventNotify.CBZZ_START_FREE_GAME_SCENE);
            }
            //重连后倍数判断
            switch ((game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) {
                case 0.5:
                    this.bet = 1;
                    break;
                case 1:
                    this.bet = 2;
                    break;
                case 2:
                    this.bet = 3;
                    break;
                case 5:
                    this.bet = 4;
                    break;
                case 10:
                    this.bet = 5;
                    break;
                case 15:
                    this.bet = 6;
                    break;
                case 30:
                    this.bet = 7;
                    break;
                case 50:
                    this.bet = 8;
                    break;
                case 70:
                    this.bet = 9;
                    break;
                case 100:
                    this.bet = 10;
                    break;
            }
            this.totalBet.text = NumberFormat.handleFloatDecimal((game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) + "";
            this.beishu.text = parseInt(game.CBZZUtils.bet * game.CBZZUtils.mul * 100 + "") + "";
            this[`maxWinLabel`].text = "最高可得: " + parseInt(game.CBZZUtils.bet * game.CBZZUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
        }
        /**
         * 鼠标手势库
         */
        public addMouseOnEvent() {
            this.memuBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeMenuBtn, this);
            this.memuBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeMenuBtn2, this);
            this.setingBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changesettingBtn, this);
            this.setingBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changesettingBtn2, this);
            this.tipsBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changetipsBtn, this);
            this.tipsBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changetipsBtn2, this);
            this.addbet.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeBetAddBtn, this);
            this.addbet.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeBetAddBtn2, this);
            this.subbet.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeBetSubBtn, this);
            this.subbet.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeBetSubBtn2, this);
            this.maxBet.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeyazhuBtn, this);
            this.maxBet.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeyazhuBtn2, this);
            this.autoGameBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeAutoRunBtn, this);
            this.autoGameBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeAutoRunBtn2, this);
            this.recordBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeGameRecord, this);
            this.recordBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeGameRecord2, this);
            this.quitBtn.addEventListener(mouse.MouseEvent.MOUSE_OVER, this.changeOutBtn, this);
            this.quitBtn.addEventListener(mouse.MouseEvent.MOUSE_OUT, this.changeOutBtn2, this);
        }

        private changeMenuBtn() {
            this.memuBtn.currentState = "down";
        }
        private changeMenuBtn2() {
            this.memuBtn.currentState = "up";
        }
        private changesettingBtn() {
            this.setingBtn.currentState = "down";
        }
        private changesettingBtn2() {
            this.setingBtn.currentState = "up";
        }
        private changetipsBtn() {
            this.tipsBtn.currentState = "down";
        }
        private changetipsBtn2() {
            this.tipsBtn.currentState = "up";
        }
        private changeBetAddBtn() {
            this.addbet.currentState = "down";
            this[`betTtipsGroup`].visible = true;
        }
        private changeBetAddBtn2() {
            this.addbet.currentState = "up";
            egret.setTimeout(() => { this[`betTtipsGroup`].visible = false; }, this, 5000)
        }
        private changeBetSubBtn() {
            this.subbet.currentState = "down";
            this[`betTtipsGroup`].visible = true;
        }
        private changeBetSubBtn2() {
            this.subbet.currentState = "up";
            egret.setTimeout(() => { this[`betTtipsGroup`].visible = false; }, this, 5000)
        }
        private changeyazhuBtn() {
            this.maxBet.source = RES.getRes("sdxl_bet2_png");
        }
        private changeyazhuBtn2() {
            this.maxBet.source = RES.getRes("sdxl_bet1_png");
        }
        private changeAutoRunBtn() {
            this.autoGameBtn.currentState = "down";
        }
        private changeAutoRunBtn2() {
            this.autoGameBtn.currentState = "up";
        }
        private changeGameRecord() {
            this.recordBtn.currentState = "down";
        }
        private changeGameRecord2() {
            this.recordBtn.currentState = "up";
        }

        private changeOutBtn() {
            this.quitBtn.currentState = "donw";
        }
        private changeOutBtn2() {
            this.quitBtn.currentState = "up";
        }
        /**
         * 点击事件
         * @param  {egret.TouchEvent} e
         */
        public onTouchTap(e: egret.TouchEvent) {
            switch (e.target) {
                //spin按钮
                case this.startBtn:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    this.startBtnTouch();
                    break;
                //退出按钮
                case this.quitBtn:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    this.leaveCBZZ();
                    break;
                //最大bet按钮
                case this.maxBet:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    this.setMaxBet();
                    break;
                //赔付表按钮
                case this.tipsBtn:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    this.opencbzzTips();
                    break;
                //减少bet按钮
                case this.subbet:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    this.reduceBet();
                    break;
                //增加bet按钮
                case this.addbet:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    this.addBetFunc();
                    break;
                //自动游戏窗口
                case this.autoGameBtn:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_CBZZ_AUTO_PANEL);
                    break;
                //转轴快速停止
                case this.maskRect:
                    this.scrollerFastGame();
                    break;
                //菜单按钮
                case this.memuBtn:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    if (this.menuGroup.visible == false) {
                        this.menuGroup.visible = true;
                    } else {
                        this.menuGroup.visible = false;
                    }
                    break;
                //游戏记录按钮
                case this.recordBtn:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    this.openGameRecord();
                    this.menuGroup.visible = false;
                    break;
                //游戏设置按钮
                case this.setingBtn:
                    SoundManager.getInstance().playEffect("cbzz_button_mp3");
                    game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING);
                    this.menuGroup.visible = false;
                    break;
                //测试按钮
                case this.startBtn0:
                    this.startBtnTouch0();
                    break;
            }
        }
        /**
         * spin按钮点击处理
         */
        public startBtnTouch() {
            //判断余额
            if (game.CBZZUtils.bet * game.CBZZUtils.mul * 50 > this.ownGold) {
                let text = "金币不足";
                Global.alertMediator.addAlert(text, () => {
                    this.resetOtherBtn();
                    Global.playerProxy.playerData.gold = this.ownGold;
                }, "", true);
                return;
            }
            // this.menuGroup.visible = false;
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
                        this.resetOtherBtn();
                        this.startBtn.source = "cbzz_startbtn_png";
                        this.timesLabel.text = "";
                        game.LaohuUtils.speed = 48;
                        this.runningType = RUNNING_TYPE.EMPTY;
                        SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
                        this.resetStartBtn();
                        return;
                    }
                    //判断是否为免费游戏并且是否有满足总下注条件
                    if (game.LaohuUtils.totalAdd && game.LaohuUtils.isAutoGame) {
                        if (game.LaohuUtils.totalBet >= game.LaohuUtils.totalAdd) {
                            game.LaohuUtils.isAutoGame = false;
                            this.resetOtherBtn();
                            this.startBtn.source = "cbzz_startbtn_png";
                            this.timesLabel.text = "";
                            game.LaohuUtils.speed = 48;
                            this.runningType = RUNNING_TYPE.EMPTY;
                            SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
                            this.resetStartBtn();
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
                            this.resetOtherBtn();
                            this.startBtn.source = "cbzz_startbtn_png";
                            this.timesLabel.text = "";
                            game.LaohuUtils.speed = 48;
                            this.runningType = RUNNING_TYPE.EMPTY;
                            SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
                            this.resetStartBtn();
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
                    this.resetOtherBtn();
                    this.resetStartBtn();
                    return;
                } //为满足完成自动游戏条件，开始自动游戏旋转
                else if (!game.LaohuUtils.isAutoGame) {
                    this.setStartBtn();
                    game.LaohuUtils.speed = 48;
                }
                this.winNum.text = 0 + "";
                this.startBtn.filters = [colorFlilter];
                this.runningType = RUNNING_TYPE.LOOP;
                this.removeLastAni();
                this.scroller.stopIconDb();
                this.isStopAni = true;
                this.setOtherBtn();
                this.scroller.run();
                SoundManager.getInstance().playEffect("cbzz_reel_mp3", true);
                this.messageSend();
            }
            //是否为快速停止状态
            else if (this.runningType == RUNNING_TYPE.RESULT) {
                game.LaohuUtils.auto_times = 0;
                this.timesLabel.text = "";
                this.fastGame();
                game.LaohuUtils.isAutoGame = false;
            }
            //停止状态点击无效果
            else if (this.runningType == RUNNING_TYPE.STOP) {
            }
        }

        /**
		 * 测试按钮
		 */
        public isTest: boolean = false;
        public spinTest: number = 0;
        public wheel: Array<Array<number>>;
        public async startBtnTouch0() {
            this.isTest = true;
            this.wheel = [[], [], [], [], []];
            let data = this.spinresult.text;
            for (let i = 0; i < 5; i++) {
                let j = data.split(":")[i];
                let l = j.split(",");
                for (let m = 0; m < l.length; m++) {
                    let n = parseInt(l[m]);
                    this.wheel[i].push(n);
                }
            }
            let data2 = this.pscen1.text;
            this.spinTest = parseInt(data2);
            this.removeLastAni();
            this.setStartBtn();
            this.scroller.stopIconDb();
            this.scroller.run();
            this.messageSend();
        }
        /**
		 * 快速结束转动
		 */
        private fastGame() {
            //转轴加速情况
            if (this.scatterIcon >= 2) {
                this.fastEnd = true;
                egret.clearTimeout(this.scatter4timeout);
                egret.clearTimeout(this.scatter5timeout);

                this.scroller.removeScatterAni();
                this.scroller.item4.speed = 48;
                this.scroller.item5.speed = 48;
                this.startBtn.source = "cbzz_startbtn_png";
                this.scroller.runResultFast();
                for (let i = 1; i <= 4; i++) {
                    this.scroller[`item${i}`].resetSpecilHui();
                }

            }
            //自动游戏情况
            if (game.LaohuUtils.isAutoGame) {
                game.LaohuUtils.speed = 48;
                egret.clearTimeout(this.autoGameTimeout);
                if (this.scatter != 1) this.resetOtherBtn();
                this.resetStartBtn();
                this.timesLabel.text = "";
                game.LaohuUtils.isAutoGame = false;
                game.LaohuUtils.auto_times = 0;
                this.startBtn.source = "cbzz_startbtn_png";
                game.LaohuUtils.oneMax = 0;
                game.LaohuUtils.totalAdd = 0;
                game.LaohuUtils.totalBet = 0;
                this.spin2stop.play("", 1);
                this.spin2stop.horizontalCenter = 1;
                this.spin2stop.bottom = 85;
                this.spinGroup.addChild(this.spin2stop);
                this.spin2stop.resetPosition();

                this.spin2stop.callback = () => {
                    game.UIUtils.removeSelf(this.spin2stop);
                }
                game.LaohuUtils.free_time_times = game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
                this.scroller.runResultFast();
            }
            //其他情况下，正常处理快速停止
            else {
                this.startBtn.source = "cbzz_startbtn_png";
                // this.setBgColor();
                if (this.scroller.runResultFast()) {
                    this.runningType = RUNNING_TYPE.LOOP;
                }

            }
            SoundManager.getInstance().stopEffectByName("cbzz_reel_fast_spin_mp3");
            SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
        }
		/**
		 * 点击转轴区域快速停止游戏
		 */
        public scrollerFastGame() {
            //是否已经收到消息
            if (this.runningType == RUNNING_TYPE.RESULT) {
                if (this.scatterIcon >= 2) {
                    this.fastEnd = true;
                    egret.clearTimeout(this.scatter4timeout);
                    egret.clearTimeout(this.scatter5timeout);
                    this.scroller.removeScatterAni();
                    this.scroller.item4.speed = 48;
                    this.scroller.item5.speed = 48;
                    for (let i = 1; i <= 4; i++) {
                        this.scroller[`item${i}`].resetSpecilHui();
                    }
                    // this.scroller.runResultFast();

                }
                // this.setBgColor();
                this.scroller.runResultFast();
                SoundManager.getInstance().stopEffectByName("cbzz_reel_fast_spin_mp3");
                SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
            }
        }
        /**
         * 置灰屏蔽其他按钮
         */
        private setOtherBtn() {
            var colorMatrix = [
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0.3, 0.6, 0, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.memuBtn.filters = this.autoGameBtn.filters = this.tipsBtn.filters = this.addbet.filters = this.subbet.filters = this.maxBet.filters = [colorFlilter];
            this.quitBtn.touchEnabled = this.memuBtn.touchEnabled = this.autoGameBtn.touchEnabled = this.tipsBtn.touchEnabled = this.addbet.touchEnabled = this.subbet.touchEnabled = this.maxBet.touchEnabled = false;
        }
        /**
         * 还原其他按钮
         */
        private resetOtherBtn() {
            var colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
            this.memuBtn.filters = this.autoGameBtn.filters = this.tipsBtn.filters = this.addbet.filters = this.subbet.filters = this.maxBet.filters = [colorFlilter];
            this.quitBtn.touchEnabled = this.memuBtn.touchEnabled = this.autoGameBtn.touchEnabled = this.tipsBtn.touchEnabled = this.addbet.touchEnabled = this.subbet.touchEnabled = this.maxBet.touchEnabled = true;
        }
        /**
         * spin按钮旋转动画
         */
        private setStartBtn() {
            game.UIUtils.removeSelf(this.spinAni1);
            this.startSpinAni.play("", 1);
            this.startSpinAni.horizontalCenter = 1;
            this.startSpinAni.bottom = 41;
            this.spinAni2.play("", 0);
            this.spinAni2.horizontalCenter = 1;
            this.spinAni2.bottom = 41;
            this.spinGroup.addChild(this.spinAni2);
            this.spinAni2.resetPosition();
            this.spinGroup.addChild(this.startSpinAni);
            this.startSpinAni.resetPosition();
        }
        /**
         * 开始免费游戏
         */
        private startAutoGame() {
            //余额判断
            if (game.CBZZUtils.bet * game.CBZZUtils.mul * 50 > this.ownGold) {
                let text = "金币不足";
                Global.alertMediator.addAlert(text, "", "", true);
                return;
            }
            game.UIUtils.removeSelf(this.spinAni1);
            this.startBtn.source = "cbzz_stopbtn_png";
            game.LaohuUtils.isAutoGame = true;
            game.LaohuUtils.speed = 70;
            //无穷次数情况
            if (game.LaohuUtils.auto_times > 1000) {
                this.timesLabel.text = "s";
            } else {
                this.timesLabel.text = game.LaohuUtils.auto_times + "";
            }
            this.startBtnTouch();
        }
        /**
         * 还原spin按钮动画
         */
        private resetStartBtn() {
            game.UIUtils.removeSelf(this.spinAni2);
            this.spinAni1.play("", 0);
            this.spinAni1.horizontalCenter = 1;
            this.spinAni1.bottom = 41;
            this.spinGroup.addChild(this.spinAni1);
            this.spinAni1.resetPosition();
        }
        //移除旋转中奖上次动画
        private eachLineTimeOut: any
        public removeLastAni() {
            if (this.winGold > 0) {
                egret.clearTimeout(this.sethuiTimeout);
                for (let i = 1; i <= 5; i++) {
                    this.scroller[`item${i}`].resetSpecilHui();
                }
            }
            game.UIUtils.removeSelf(this.commomScore);
            this.lineScoreGroup.visible = false;
            this.fastEnd = false;
            this.scroller.stopIconDb();
            egret.clearTimeout(this.removeScoreTimeout);
            egret.clearTimeout(this.eachLineTimeOut);
            egret.clearTimeout(this.showIconTimeOut);
            // game.UIUtils.removeSelf(this.winGoldDiAni);
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
            if (this.isTest) {
                if (this.spinTest == 1) {
                    data2 = { "spinType": this.spinTest, "bet": game.CBZZUtils.bet, "multiple": game.CBZZUtils.mul, "lineCount": 243, "activityId": 0, "freeWheel": this.wheel };
                } else {
                    data2 = { "spinType": this.spinTest, "bet": game.CBZZUtils.bet, "multiple": game.CBZZUtils.mul, "lineCount": 243, "activityId": 0, "wheel": this.wheel };
                }
            } else {
                data2 = { "spinType": 0, "bet": game.CBZZUtils.bet, "multiple": game.CBZZUtils.mul, "lineCount": 243, "activityId": 0 };
            }
            let resp2: any = await Global.pomelo.request(ServerPostPath.game_slotHandler_c_bet, data2);
            if (resp2.error) {
                let text = resp2.error.msg;
                Global.alertMediator.addAlert(text, "", "", true);
                game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
                game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_CBZZ);
                return;
            }
            this.ownGold -= game.CBZZUtils.bet * game.CBZZUtils.mul * 50;
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
        /**
         * 每列转轴结束监听
         * @param  {egret.Event} e
         */
        private scrollerEnd(e: egret.Event) {
            let data = e.data;
            //场景判断
            if (data.sceneIndex != 1) {
                return;
            }
            let index = e.data.index;
            switch (index) {
                case 5:
                    if (this.showAtr) {
                        //自动游戏是否满足单次赢取条件
                        if (game.LaohuUtils.oneMax && game.LaohuUtils.isAutoGame) {
                            if (this.winGold >= game.LaohuUtils.oneMax) {
                                game.LaohuUtils.isAutoGame = false;
                                game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
                                game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
                                this.resetOtherBtn();
                                this.startBtn.source = "cbzz_startbtn_png";
                                this.timesLabel.text = "";
                                game.LaohuUtils.speed = 48;
                                this.runningType = RUNNING_TYPE.EMPTY;
                                this.resetStartBtn();
                            }
                        }
                        //图标数组非空校验
                        if (this.showAtr.length != 0) {
                            for (let i = 0; i < this.showAtr[4].length; i++) {
                                //判断第5列上是否有scatter
                                if (this.showAtr[4][i] == 2) {
                                    for (let j = 0; j < 3; j++) {
                                        if (this.showAtr[2][j] == 2) {
                                            for (let k = 0; k < 3; k++) {
                                                if (this.showAtr[0][k] == 2) {
                                                    SoundManager.getInstance().playEffect("cbzz_scat_mp3");
                                                    this.scroller.addFoGuang1(5, i, "cbzz_icon_2_guang");
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                                }
                            }
                        }
                        this.scroller.removeIconHui(this.HuiAtr);
                        this.playerGold.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
                        this.winNum.text = this.winGold + "";
                        SoundManager.getInstance().stopEffectByName("cbzz_reel_mp3");
                        //自动游戏自动次数大于0
                        if (game.LaohuUtils.auto_times >= 0 && game.LaohuUtils.isAutoGame) {
                            this.winNum.text = NumberFormat.handleFloatDecimal(this.winGold) + "";
                            if (this.scatter == 1) {
                                this.quitBtn.touchEnabled = false;
                                this.checkBonusIcon();
                                return;
                            }
                            egret.setTimeout(() => {
                                LogUtils.logD("empty4");
                                if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
                            }, this, 500);
                            if (this.winGold > 0) {
                                this.autoGameTimeout = egret.setTimeout(this.startBtnTouch, this, 1500);
                            } else {
                                this.autoGameTimeout = egret.setTimeout(this.startBtnTouch, this, 1000);
                            }
                        }
                        //不是自动游戏
                        else {
                            if (this.scatter != 1) this.resetOtherBtn();
                            this.resetStartBtn();
                            egret.setTimeout(() => {
                                LogUtils.logD("empty5");
                                if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
                            }, this, 500);
                        }
                        this.playerGold.text = NumberFormat.handleFloatDecimal(this.ownGold) + "";
                        this.checkBonusIcon();
                    }
                    break;
                case 4:
                    SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                    break;
                case 3:
                    for (let i = 0; i < this.showAtr[2].length; i++) {
                        //判断第三列上是否有scatter
                        if (this.showAtr[2][i] == 2) {
                            for (let j = 0; j < 3; j++) {
                                if (this.showAtr[0][j] == 2) {
                                    SoundManager.getInstance().playEffect("cbzz_scat_mp3");
                                    this.scroller.addFoGuang1(3, i, "cbzz_icon_2_guang");
                                }
                            }

                        } else {
                            SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                        }
                    }
                    if (this.showAtr) {
                        //第四列第五列转轴加速
                        if (this.scatterIcon >= 2) {
                            let atr: Array<Array<number>> = [[0, 1, 2], [0, 1, 2], [0, 1, 2]];
                            this.scroller.setSpecilHui(atr);
                            //快速停止则跳过加速并且四五列特效
                            if (this.fastEnd) return;
                            this.scroller.item4.clearDownTimeOut();
                            this.scroller.item5.clearDownTimeOut();
                            this.scroller.item4.speed = 64;
                            this.scroller.item5.speed = 64;
                            this.scroller.addScatterAni(4);
                            this.scroller.speed = 64;
                            let item4 = this.scroller[`item${4}`];
                            let item5 = this.scroller[`item${5}`];
                            SoundManager.getInstance().playEffect("cbzz_reel_fast_spin_mp3")
                            this.scatter4timeout = egret.setTimeout(() => {
                                item4.changeResult(this.showAtr[3]);
                                this.scroller.removeScatterAni(4);
                                this.scroller.addScatterAni(5);
                                this.scroller.setSpecilHui([[], [], [], [0, 1, 2], []]);
                            }, this, 2800);
                            this.scatter5timeout = egret.setTimeout(() => {
                                item5.changeResult(this.showAtr[4]);
                                this.scroller.removeScatterAni(5);
                                SoundManager.getInstance().stopEffectByName("cbzz_reel_fast_spin_mp3")
                                egret.clearTimeout(this.autoGameTimeout);
                                this.scroller.removeIconHui(this.HuiAtr);
                            }, this, 5400);
                        }
                    }

                    break;
                case 2:
                    SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                    break;
                case 1:
                    for (let i = 0; i < this.showAtr[0].length; i++) {
                        //判断第1列上是否有scatter
                        if (this.showAtr[0][i] == 2) {
                            SoundManager.getInstance().playEffect("cbzz_scat_mp3");
                            this.scroller.addFoGuang1(1, i, "cbzz_icon_2_guang");
                        } else {
                            SoundManager.getInstance().playEffect("cbzz_reelstop1_mp3");
                        }
                    }
                    break;
            }
        }
        /**
         * 免费游戏结束后到正常游戏
         */
        private free2Commom() {
            this.scatter = 0;
            this.runningType = RUNNING_TYPE.EMPTY;
            this.quitBtn.touchEnabled = true;
            this.scroller.speed = 48;
            SoundManager.getInstance().playMusic("cbzz_background_mus_mp3");
            //是否满足免费游戏停止条件
            if (game.LaohuUtils.stopAuto) {
                game.LaohuUtils.isAutoGame = false;
                game.LaohuUtils.free_time_times = game.LaohuUtils.totalAdd = game.LaohuUtils.totalBet = game.LaohuUtils.oneMax = 0;
                game.LaohuUtils.totoalWinGold = game.LaohuUtils.totalWin = 0;
                game.LaohuUtils.speed = 48;
                this.runningType = RUNNING_TYPE.EMPTY;
                this.resetOtherBtn();
            }
            //继续自动游戏
            if (game.LaohuUtils.isAutoGame) {
                game.UIUtils.removeSelf(this.spinAni1);
                egret.setTimeout(() => { this.startAutoGame(); }, this, 1000)
            }
            else {
                this.resetOtherBtn();
            }
            this.playerGold.text = NumberFormat.handleFloatDecimal(game.CBZZUtils.ToTalMoney) + "";
            this.ownGold = game.CBZZUtils.ToTalMoney;
            game.CBZZUtils.freeWin = 0;
        }

        public commomScore: eui.BitmapLabel = new eui.BitmapLabel(); //中奖展示金额数字
        private removeScoreTimeout: any; //提前移除金额数字timeout
        private isStopAni: boolean = false;//播放stop动画flag
        /**
         * 播放总的中奖连线以及判断是否中bigwin
         */
        private checkBonusIcon() {
            //是否满足bigwin条件
            if (this.scatter == 1 && !game.LaohuUtils.isAutoGame) this.resetStartBtn();
            //自动游戏进入scatter
            if (this.scatter == 1 && game.LaohuUtils.isAutoGame) {
                this.startBtn.source = "cbzz_startbtn_png";
                this.timesLabel.visible = false;
                this.resetStartBtn();
            }
            //满足bigwin
            if (this.winGold >= (game.CBZZUtils.bet * game.CBZZUtils.mul * 50) * 15) {
                egret.clearTimeout(this.autoGameTimeout);
                //非空判断
                if (this.bonusAtr.length > 0 && this.winGold > 0) {
                    let func = () => {
                        this.bigWinPanel.touchEnabled = false;
                        // game.UIUtils.removeSelf(this.bigWinPanel);
                        this.bigWinPanel.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);

                        if (this.scatter != 1) this.startBtn.touchEnabled = true;
                        if (!game.LaohuUtils.isAutoGame) {
                            this.runningType = RUNNING_TYPE.EMPTY;
                        }
                        /**
                         * bigwin结束窗口效果
                         */
                        this.bigWinPanel.stopShowBigWin(() => {
                            if (game.LaohuUtils.isAutoGame && this.scatter != 1) {
                                this.autoGameTimeout = egret.setTimeout(() => {
                                    this.startBtnTouch();
                                }, this, 1500);
                            }
                            if (!game.LaohuUtils.isAutoGame) { this.runningType = RUNNING_TYPE.EMPTY; }
                            if (this.scatter != 1) this.memuBtn.touchEnabled = this.maxBet.touchEnabled = this.addbet.touchEnabled = this.subbet.touchEnabled = this.autoGameBtn.touchEnabled = this.tipsBtn.touchEnabled = this.quitBtn.touchEnabled = true;
                            if (this.scatter == 1) this.addEachLineAni();
                        });
                        //未中scatter，播放一次总连线
                        if (this.scatter != 1) {
                            egret.setTimeout(() => {
                                this.scroller.setIconHui();
                                this.scroller.removeIconHui(this.allAtr);
                                this.scroller.addBonusAni(this.allAtr, this.winGold);
                                if (!game.LaohuUtils.isAutoGame) {
                                    this.eachLineTimeOut = egret.setTimeout(() => {
                                        this.addEachLineAni();
                                    }, this, 1500)
                                }
                            }, this, 5000)
                        }
                    }

                    this.bigWinPanel = new CBZZBigwinGroup();

                    this.bigWinPanel.touchEnabled = false;
                    egret.setTimeout(() => {
                        this.bigWinPanel.touchEnabled = true;
                        this.bigWinPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, func, this)
                    }, this, 1500);
                    /**
                     * bigwin窗口
                     * @param score,callback?
                     */
                    this.bigWinPanel.showScore(this.winGold, () => {
                        game.UIUtils.removeSelf(this.commomScore);
                        //自动游戏bigwin后开始下一把
                        if (game.LaohuUtils.isAutoGame && this.scatter != 1) {
                            this.autoGameTimeout = egret.setTimeout(() => {
                                this.startBtnTouch();
                            }, this, 1500);
                        }
                        if (this.scatter != 1) {
                            this.startBtn.touchEnabled = true; this.scroller.stopIconDb();
                            this.scroller.setIconHui();
                            this.scroller.removeIconHui(this.allAtr);
                            this.scroller.addBonusAni(this.allAtr, this.winGold);
                            if (!game.LaohuUtils.isAutoGame) {
                                this.eachLineTimeOut = egret.setTimeout(() => {
                                    this.addEachLineAni();
                                }, this, 1500)
                            }
                            this.memuBtn.touchEnabled = this.maxBet.touchEnabled = this.addbet.touchEnabled = this.subbet.touchEnabled = this.autoGameBtn.touchEnabled = this.tipsBtn.touchEnabled = this.quitBtn.touchEnabled = true;
                        }
                        if (!game.LaohuUtils.isAutoGame) { this.runningType = RUNNING_TYPE.EMPTY; }
                        if (this.scatter == 1) this.addEachLineAni();
                        game.UIUtils.removeSelf(this.bigWinPanel);
                    })
                    this.resizeGroup.addChild(this.bigWinPanel);
                }//bigwin后中免费游戏 
                else {
                    //中了scatter
                    if (this.scatter == 1) {
                        this.runningType = RUNNING_TYPE.STOP;
                        this.quitBtn.touchEnabled = false;
                        SoundManager.getInstance().playEffect("cbzz_scatin1_mp3");
                        this.scroller.addFoGuang(1, this.yudiAtr[0], "cbzz_icon_2");
                        this.scroller.addFoGuang(3, this.yudiAtr[1], "cbzz_icon_2");
                        this.scroller.addFoGuang(5, this.yudiAtr[2], "cbzz_icon_2");
                        EventManager.instance.dispatch(EventNotify.CBZZ_ENTER_FREE_GAME_SCENE);
                        // this.resetBtnColor();
                        if (!game.LaohuUtils.isAutoGame) this.resetStartBtn();
                        //自动游戏中了scatter
                        if (this.scatter == 1 && game.LaohuUtils.isAutoGame) {
                            this.startBtn.source = "cbzz_startbtn_png";
                            this.timesLabel.visible = false;
                            this.resetStartBtn();
                        }
                    }
                }
            }
            //未中bigwin 

            //中奖
            else {
                //展示图标非空判断
                if (this.bonusAtr.length > 0 && this.winGold > 0) {
                    SoundManager.getInstance().playEffect("cbzz_win_mp3");
                    if (this.scatter == 1) this.runningType = RUNNING_TYPE.STOP;
                    this.scroller.setIconHui();
                    this.scroller.removeIconHui(this.allAtr);
                    this.scroller.addBonusAni(this.allAtr, this.winGold);
                    let data = Number(new Big(this.winGold).mul(100));
                    this.lineNum.text = NumberFormat.handleFloatDecimal(data) + "";
                    this.lineScoreGroup.visible = true;

                    this.sethuiTimeout = egret.setTimeout(() => { this.scroller.setIconHui(); }, this, 1500)
                    this.removeScoreTimeout = egret.setTimeout(() => {
                        this.lineScoreGroup.visible = false;
                        this.addEachLineAni();
                    }, this, 1600);
                }
                //未中奖 
                else {
                    //未中奖中了scatter
                    if (this.scatter == 1) {
                        this.runningType = RUNNING_TYPE.STOP;
                        // this.quitBtn.touchEnabled = false;
                        SoundManager.getInstance().playEffect("cbzz_scatin1_mp3");
                        this.scroller.addFoGuang(1, this.yudiAtr[0], "cbzz_icon_2");
                        this.scroller.addFoGuang(3, this.yudiAtr[1], "cbzz_icon_2");
                        this.scroller.addFoGuang(5, this.yudiAtr[2], "cbzz_icon_2");
                        egret.setTimeout(() => {
                            EventManager.instance.dispatch(EventNotify.CBZZ_ENTER_FREE_GAME_SCENE);
                        }, this, 2500);
                    }
                }
            }


        }

        private showIconTimeOut: any; //每条连线循环播放的timeout
        public runningType: number = 3;//选择类型
        private sethuiTimeout: any; //icon置灰timeout
        /**
         * 每条连线动画
         */
        private addEachLineAni() {
            //非空判断
            if (this.bonusAtr.length > 0 && this.winGold > 0) {
                if (this.scatter == 1) { this.quitBtn.touchEnabled = false; this.resetStartBtn(); }
                this.scroller.stopIconDb();
                let count = 0;
                //逐个展示中奖连线
                async.eachSeries(this.bonusAtr, (index, callback) => {
                    if (this.isStopAni) return;
                    this.lineScoreGroup.visible = false;
                    this.scroller.setSpecilHui([[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]]);
                    for (let j = 0; j < index.length; j++) {
                        let k = j + 1;
                        this.scroller[`item${k}`].resetIconHui(index[j]);
                        this.scroller[`item${k}`].showAni(index[j]);
                        this.commomScore.font = "cbzz_commomnum_fnt";
                        let data = Number(new Big(this.eachLineScore[count]).mul(100));
                        this.commomScore.text = NumberFormat.handleFloatDecimal(data, 0) + "";
                        this.commomScore.verticalCenter = ((index[2] - 1)) * 184;
                        this.commomScore.horizontalCenter = 0;
                        this.commomScore.textAlign = "center";
                        this.commomScore.scaleX = 0.8;
                        this.commomScore.scaleY = 0.8;
                        this.scroller.addChild(this.commomScore);
                    }
                    //单一连线
                    if (this.bonusAtr.length == 1) {
                        if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
                        this.sethuiTimeout = egret.setTimeout(() => {
                            this.scroller.setIconHui();
                            game.UIUtils.removeSelf(this.commomScore);
                        }, this, 1500)
                        this.showIconTimeOut = egret.setTimeout(callback, this, 1600);
                    }
                    //多条连线
                    if (this.bonusAtr.length > 1) {
                        if (this.scatter != 1) this.runningType = RUNNING_TYPE.EMPTY;
                        this.sethuiTimeout = egret.setTimeout(() => {
                            this.scroller.setIconHui();
                            game.UIUtils.removeSelf(this.commomScore);
                        }, this, 1500)
                        this.showIconTimeOut = egret.setTimeout(callback, this, 1600);
                    }
                    count++;
                }, () => {
                    //callback 判断结果是否为scatter
                    if (this.scatter == 1) {
                        game.UIUtils.removeSelf(this.commomScore);
                        this.runningType = RUNNING_TYPE.STOP;
                        this.scroller.removeIconHui(this.HuiAtr);
                        SoundManager.getInstance().playEffect("cbzz_scatin1_mp3");
                        this.scroller.addFoGuang(1, this.yudiAtr[0], "cbzz_icon_2");
                        this.scroller.addFoGuang(3, this.yudiAtr[1], "cbzz_icon_2");
                        this.scroller.addFoGuang(5, this.yudiAtr[2], "cbzz_icon_2");
                        egret.setTimeout(() => {
                            EventManager.instance.dispatch(EventNotify.CBZZ_ENTER_FREE_GAME_SCENE);
                            this.resetOtherBtn();
                        }, this, 2500)
                        if (!game.LaohuUtils.isAutoGame) this.resetStartBtn();
                        if (this.scatter == 1 && game.LaohuUtils.isAutoGame) {
                            this.startBtn.source = "cbzz_startbtn_png";
                            this.timesLabel.visible = false;
                            this.resetStartBtn();
                        }
                    }
                    else {
                        count = 0;
                        this.scroller.setIconHui();
                        game.UIUtils.removeSelf(this.commomScore);
                        return this.addEachLineAni();
                    }

                })
            }
        }
        /**
         * 退出赤壁之战
         */
        private leaveCBZZ() {
            if (this.scatter == 1) return;
            game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_LEAVE_LAOHU_PANEL);
        }
        /**
		 * 打开游戏记录
		 */
        private openGameRecord() {
            game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_DNTG_RECORD_PANEL);
        }
        /**
         * 设置最大倍数
         */
        private setMaxBet() {
            game.CBZZUtils.bet = game.CBZZUtils.bets[4];
            game.CBZZUtils.mul = game.CBZZUtils.muls[9];
            //金币是否满足条件
            if (game.CBZZUtils.mul * game.CBZZUtils.bet * 50 > this.ownGold) {
                let text = "金币不足";
                Global.alertMediator.addAlert(text, "", "", true);
                return;
            }
            this[`betTtipsGroup`].visible = true;
            this[`maxWinLabel`].text = "最高可得: " + parseInt(game.CBZZUtils.bet * game.CBZZUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
            this.totalBet.text = NumberFormat.handleFloatDecimal(game.CBZZUtils.bet * game.CBZZUtils.mul * 50) + "";
            this.bet = 10;
            egret.setTimeout(() => { this[`betTtipsGroup`].visible = false }, this, 5000);
            this.beishu.text = parseInt(game.CBZZUtils.bet * game.CBZZUtils.mul * 100 + "") + "";
        }
        /**
         * 减少倍数
         */
        private reduceBet() {
            //倍数判断
            if (this.bet <= 1) {
                return;
            } else {
                game.LaohuUtils.totalWin = 0;
                this.bet -= 1;
                switch (this.bet) {
                    case 1:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[0];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[0];
                        break;
                    case 2:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[0];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[1];
                        break;
                    case 3:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[0];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[3];
                        break;
                    case 4:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[0];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[9];
                        break;
                    case 5:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[1];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[9];
                        break;
                    case 6:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[2];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[5];
                        break;
                    case 7:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[3];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[5];
                        break;
                    case 8:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[3];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[9];
                        break;
                    case 9:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[4];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[6];
                        break;
                    case 10:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[4];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[9];
                        break;
                }
            }
            this.beishu.text = parseInt(game.CBZZUtils.bet * game.CBZZUtils.mul * 100 + "") + "";
            this.totalBet.text = NumberFormat.handleFloatDecimal((game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) + "";
            this[`maxWinLabel`].text = "最高可得: " + parseInt(game.CBZZUtils.bet * game.CBZZUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
        }
        private addBetFunc() {
            //是否超出倍数范围
            if (this.bet <= 9) {
                game.LaohuUtils.totalWin = 0;
                this.bet += 1;
                switch (this.bet) {
                    case 1:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[0];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[0];
                        break;
                    case 2:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[0];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[1];

                        break;
                    case 3:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[0];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[3];
                        break;
                    case 4:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[0];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[9];
                        break;
                    case 5:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[1];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[9];
                        break;
                    case 6:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[2];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[5];
                        break;
                    case 7:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[3];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[5];
                        break;
                    case 8:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[3];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[9];
                        break;
                    case 9:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[4];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[6];
                        break;
                    case 10:
                        game.CBZZUtils.bet = game.CBZZUtils.bets[4];
                        game.CBZZUtils.mul = game.CBZZUtils.muls[9];
                        break;
                }
            }
            this.beishu.text = parseInt(game.CBZZUtils.bet * game.CBZZUtils.mul * 100 + "") + "";
            this.totalBet.text = NumberFormat.handleFloatDecimal((game.CBZZUtils.bet * game.CBZZUtils.mul * 50)) + "";
            this[`maxWinLabel`].text = "最高可得: " + parseInt(game.CBZZUtils.bet * game.CBZZUtils.mul * 100 * (20 * 3 * 30 + 20 * 18 + 15 * 8) + "") + "";
            if ((game.CBZZUtils.bet * game.CBZZUtils.mul * 50) > this.ownGold) {
                let text = "金币不足";
                Global.alertMediator.addAlert(text, "", "", true);
                this.reduceBet();
            }
        }
        /**
         * 打开赤壁之战赔付表
         */
        private opencbzzTips() {
            game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_CBZZ_TIPS_PANEL);
        }
    }
}