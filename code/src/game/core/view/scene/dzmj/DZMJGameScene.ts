module majiang {
    export class DZMJGameScene extends game.BaseGameScene {
        public pmdKey: string = "dzmj";
        //剩余多少牌
        private syLabel: eui.BitmapLabel;
        //我手牌UI
        private mineShoupaiGroup: MineShoupaiGroup;
        //我出牌UI
        private mineChupaiGroup: MineChupaiGroup;

        private topChupaiGroup: TopChupaiGroup;

        private leftChupaiGroup: LeftChupaiGroup;

        private rightChupaiGroup: RightChupaiGroup;

        //计时器组件
        private timeDirectionBar: TimerDirectionBar;
        //上家手牌UI
        private leftShoupaiGroup: LeftShoupaiGroup;
        //右侧玩家手牌UI
        private rightShoupaiGroup: RightShoupaiGroup;
        //对家手牌UI
        private topShoupaiGroup: TopShoupaiGroup;

        private leftGroup: eui.Group;

        private rightGroup: eui.Group;

        private mineGroup: eui.Group;

        private topGroup: eui.Group;

        private mainGroup: eui.Group;

        private directions: any;

        private leftPgGroup: MjLeftGroup;
        private rightPgGroup: MjRightGroup;
        private topPgGroup: MjTopGroup;
        private minePgGroup: MjMineGroup;

        //EXML中对应id为tweenGroup的动画组对象
        private dingque: egret.tween.TweenGroup;

        // EXML中对应id为button的按钮对象
        private player: eui.Button;
        private touchShoupai: MineShoupai;
        //最大手牌可以同时选定
        private maxTouchShoupai: number = 0;

        private majiangStatus: MajiangStatusEnum;
        //胡牌group
        private mineHupaiGroup: MajiangHupaiGroup;
        private leftHupaiGroup: MajiangHupaiGroup;
        private rightHupaiGroup: MajiangHupaiGroup;
        private topHupaiGroup: MajiangHupaiGroup;
        //胡牌展示group
        private leftHuShowGroup: LeftShowPai;
        private rightHuShowGroup: RightShowPai;
        private topHuShowGroup: TopShowPai;
        private mineHuShowGroup: MineShowPai;

        private chupaiTips: eui.Image;
        private duijujieshu: eui.Image;
        //右上角功能按钮
        public gnBtn: eui.Button;
        //功能组
        private gnGroup: eui.Group;
        private btn_shou: eui.Button;
        private btn_set: eui.Button;
        private btn_help: eui.Button;
        //----UI层级
        //ui麻将牌组
        private uiGroup: eui.Group;
        //动画效果的group
        private effectGroup: eui.Group;
        //弹出的层级
        private panelGroup: eui.Group;
        //可点击的层级
        private touchGroup: eui.Group;

        private mineKoupaiGroup: MineKoupai;
        //底注
        private dizhu: eui.Label;
        //提示警报
        private msg_jinbao: eui.Image;
        //房间信息
        private roomIdLable: eui.Label;
        //x血流还是血战
        private wanfaImage: eui.Image;

        private timeLabel: eui.Label;

        private cacheHua: boolean = false;
        public constructor() {
            super();
            this.skinName = new majiang.DZMJGameSceneSkin();
            this.leftHuShowGroup.removeChildren();
            this.rightHuShowGroup.removeChildren();
            this.topHuShowGroup.removeChildren();
            this.mineHuShowGroup.removeChildren();
        }

        /**
         * 开始发牌动画
         */
        public fapaiAni() {
            this.majiangStatus = MajiangStatusEnum.FAPAI;
            //庄家几号位
            this.syLabel.text = "144";
            Global.gameProxy.roomInfo.publicCardNum = 144;
            let zhuangIndex = Global.gameProxy.roomInfo.dealer;
            let sortDir = MajiangUtils.getDirectionSortByZhuang(zhuangIndex);
            //开始第一轮发牌
            this.fapaiRound1(sortDir);
        }

        private lastChupai: eui.Component;
        private hideChupaiTips() {
            this.lastChupai = null;
            if (this.chupaiTips) {
                this.chupaiTips.visible = false;
                egret.Tween.removeTweens(this.chupaiTips);
            }
        }

        /**
         * 显示出牌的提示
         * @param  {eui.Component} image
         */
        private showChupaiTips(image: eui.Component, dirction: string) {
            if (!this.chupaiTips) {
                this.chupaiTips = new eui.Image("img_cptip_png");
                this.effectGroup.addChild(this.chupaiTips);
            }
            this.chupaiTips.visible = true;
            egret.Tween.removeTweens(this.chupaiTips);
            let widthHalf = GameConfig.curWidth() / 2;
            let heightHalf = GameConfig.curHeight() / 2;
            switch (dirction) {
                case "mine":
                    this.chupaiTips.x = image.x + 7;
                    this.chupaiTips.y = image.y - 15;
                    break;
                case "left":
                    this.chupaiTips.x = image.x + 17;
                    this.chupaiTips.y = image.y - 20;
                    break;
                case "right":
                    this.chupaiTips.x = image.x + 17;
                    this.chupaiTips.y = image.y - 20;
                    break;
                case "top":
                    this.chupaiTips.x = image.x + 5;
                    this.chupaiTips.y = image.y - 15;
                    break;
            }

            let y = this.chupaiTips.y;
            egret.Tween.get(this.chupaiTips, { loop: true }).to({
                y: y - 10
            }, 1000).to({
                y: y
            }, 1000);
        }

        /**
         * 4张牌4张牌落下动画
         * @param  {} num
         */
        private mineFapaiAni(num) {
            let mineNum = this.mineShoupaiGroup.mainGroup.numChildren;
            for (let i = num; i < num + 4; i++) {
                // this.paiQiang.removeNumByIndex();
                let minePai = this.mineShoupaiGroup.mainGroup.getChildByName("mj" + i) as MineShoupai;
                if (minePai && minePai.value) {
                    let y = minePai.y;
                    minePai.visible = true;
                    if (!Global.runBack) {
                        minePai.y -= minePai.height / 2;
                        egret.Tween.get(minePai).to({
                            y: y
                        }, game.UIUtils.getTweenTime(150));
                    }
                }
            }
        }

        /**
         * 其他人得手牌，改变visible属性
         * @param  {} index
         * @param  {} num
         */
        private otherFapaiAni(index, num) {
            let direction = this.directions[index];
            let mineNum = this[direction + 'ShoupaiGroup'].mainGroup.numChildren;
            for (let i = num; i < num + 4; i++) {
                // this.paiQiang.removeNumByIndex();
                let minePai = this[direction + 'ShoupaiGroup'].mainGroup.getChildByName("mj" + i);
                if (minePai) {
                    minePai.visible = true;
                }
            }
        }

        /**
         * 展现剩余的牌数量
         */
        public showShengyuPai() {
            this.syLabel.text = Global.gameProxy.roomInfo.publicCardNum.toString();

        }

        /**
         * 第一轮发牌
         */
        private fapaiRound1(sortDir) {
            let fapaiCall = (index) => {
                if (index == Global.gameProxy.playerInfo.playerIndex + "") {//Global.gameProxy.playerInfo.playerIndex){
                    this.mineFapaiAni(1);
                } else {
                    this.otherFapaiAni(index, 1)
                }
                this.updateSypai();
                this.removePaiQiang(4);
            }
            if (Global.runBack) {
                for (let i = 0; i < sortDir.length; i++) {
                    fapaiCall(sortDir[i]);
                }
                this.fapaiRound2(sortDir);
            } else {
                async.eachSeries(sortDir, (index, callback) => {
                    fapaiCall(index);
                    this.setAutoTimeout(callback, this, GameConfig.time_config['200']);
                }, () => {
                    this.fapaiRound2(sortDir);
                })
            }
        }

        private removePaiQiang(length) {
            for (var i = 0; i < length; i++) {
                this.paiQiang.removeNumByIndex();
            }
        }

        /**
         * 第二轮发牌
         */
        private fapaiRound2(sortDir) {
            let fapaiCall = (index) => {
                if (index == Global.gameProxy.playerInfo.playerIndex + "") {//Global.gameProxy.playerInfo.playerIndex){
                    this.mineFapaiAni(5);
                } else {
                    this.otherFapaiAni(index, 5)
                }
                this.updateSypai();
                this.removePaiQiang(4);
            }
            if (Global.runBack) {
                for (let i = 0; i < sortDir.length; i++) {
                    fapaiCall(sortDir[i]);
                }
                this.fapaiRound3(sortDir);
            } else {
                async.eachSeries(sortDir, (index, callback) => {
                    fapaiCall(index);
                    this.setAutoTimeout(callback, this, GameConfig.time_config['200']);
                }, () => {
                    this.fapaiRound3(sortDir);
                })
            }
        }


        /**
         * 第三轮发牌
         */
        private fapaiRound3(sortDir) {
            let fapaiCall = (index) => {
                if (index == Global.gameProxy.playerInfo.playerIndex + "") {//Global.gameProxy.playerInfo.playerIndex){
                    this.mineFapaiAni(9);
                } else {
                    this.otherFapaiAni(index, 9)
                }
                this.updateSypai();
                this.removePaiQiang(4);
            }

            if (Global.runBack) {
                for (let i = 0; i < sortDir.length; i++) {
                    fapaiCall(sortDir[i]);
                }
                this.fapaiRound4(sortDir);
            } else {
                async.eachSeries(sortDir, (index, callback) => {
                    fapaiCall(index);
                    this.setAutoTimeout(callback, this, GameConfig.time_config['200']);
                }, () => {
                    this.fapaiRound4(sortDir);
                })
            }
        }


        // /**
        // * 第四轮发牌，发完牌过后吧主玩家手牌顺序排序
        // */
        // private checkHua = false;
        // private fapaiRound4(sortDir) {
        //     let indexNum = 0;
        //     async.eachSeries(sortDir, (index, callback) => {
        //         if (indexNum == 0) {
        //             this.paiQiang.removeNumByIndex();
        //             this.paiQiang.removeNumByIndex();
        //             this.updateSypai();
        //         } else if (indexNum == 1) {
        //             this.paiQiang.removeNumByIndex();
        //             this.updateSypai();
        //         } else {
        //             this.paiQiang.removeNumByIndex();
        //             this.updateSypai();
        //         }
        //         if (index == Global.gameProxy.playerInfo.playerIndex) {
        //             this.mineFapaiAni(13);
        //         } else {
        //             this.otherFapaiAni(index, 13);
        //         }
        //         indexNum++;
        //         this.setAutoTimeout(callback, this, 100);
        //     }, () => {
        //         egret.Tween.get(this).wait(400).call(() => {
        //             if (!Global.gameProxy.roomInfo) {
        //                 return;
        //             }
        //             this.mineShoupaiGroup.visible = false;
        //             this.mineKoupaiGroup.visible = true;
        //             this.mineShoupaiGroup.sortShoupais();
        //         }, this).wait(400).call(() => {
        //             if (!Global.gameProxy.roomInfo) {
        //                 return;
        //             }
        //             this.mineShoupaiGroup.visible = true;
        //             this.mineKoupaiGroup.visible = false;
        //         }, this).wait(500).call(() => {
        //             this.runBuhuaAni();
        //         }, this)
        //     });
        // }


        /**
        * 第四轮发牌，发完牌过后吧主玩家手牌顺序排序
        */
        private fapaiRound4(sortDir) {
            let indexNum = 0;
            let fapaiCall = (index) => {
                if (indexNum == 0) {
                    this.paiQiang.removeNumByIndex();
                    this.paiQiang.removeNumByIndex();
                    this.updateSypai();
                } else if (indexNum == 1) {
                    this.paiQiang.removeNumByIndex();
                    this.updateSypai();
                } else {
                    this.paiQiang.removeNumByIndex();
                    this.updateSypai();
                }
                if (index == Global.gameProxy.playerInfo.playerIndex) {
                    this.mineFapaiAni(13);
                } else {
                    this.otherFapaiAni(index, 13);
                }
                indexNum++;
            }

            if (Global.runBack) {
                for (let i = 0; i < sortDir.length; i++) {
                    fapaiCall(sortDir[i]);
                }
                this.updateSypai();
                this.mineShoupaiGroup.sortShoupais();
                this.runBuhuaAni();
                return;
            }


            async.eachSeries(sortDir, (index, callback) => {
                fapaiCall(index);
                this.setAutoTimeout(callback, this, GameConfig.time_config['200']);
            }, () => {
                this.setAutoTimeout(() => {
                    if (!Global.gameProxy.roomInfo) {
                        return;
                    }
                    this.mineShoupaiGroup.visible = false;
                    this.mineKoupaiGroup.visible = true;
                    // this.paiQiang.currentNumber++;
                    this.updateSypai();
                    this.mineShoupaiGroup.sortShoupais();
                    this.setAutoTimeout(() => {
                        if (!Global.gameProxy.roomInfo) {
                            return;
                        }
                        this.mineShoupaiGroup.visible = true;
                        this.mineKoupaiGroup.visible = false;
                        this.setAutoTimeout(() => {
                            this.runBuhuaAni();
                        }, this, 400);
                    }, this, 400);
                }, this, 400);
            });
        }


        private runBuhuaAni() {
            let roomInfo = Global.gameProxy.roomInfo;
            let players = roomInfo.players;
            for (let key in players) {
                let player = players[key] as PlayerGameDataBean;
                let outCard = player.initHuaCards || [];
                let newCard = player.huaNewCards || [];
                if (outCard.length > 0) {
                    this.playerAddBuhua(outCard, newCard, key);
                }
            }
            Global.gameProxy.roomInfo.publicCardNum = this.paiQiang.getPaiQiangNum();
            this.updateSypai();
            this.timeDirectionBar.startTime(this);
            this.setAutoTimeout(() => {
                roomInfo.curPlay = roomInfo.dealer;
                this.checkChupaiStatus();
            }, this, 1000);
        }
        /**
         * 检查补花状态
         */
        private checkHuaStatus() {
            let roomInfo = Global.gameProxy.roomInfo;
            let players = roomInfo.players;
            for (let key in players) {
                let player = players[key] as PlayerGameDataBean;
                let outCard = player.huaCards;
                let newCard = player.huaNewCards;
                if (outCard.length > 0) {
                    this.playerAddBuhua(outCard, newCard, key);
                }
            }
            this.timeDirectionBar.startTime(this);
            this.setAutoTimeout(() => {
                roomInfo.curPlay = roomInfo.dealer;
                this.checkChupaiStatus();
            }, this, 300);
        }


        private playerAddBuhua(outCard, newCard, playerIndex) {
            let direction = this.directions[playerIndex];
            let playerData = Global.gameProxy.getPlayerByIndex(playerIndex);
            if (Global.gameProxy.checkIndexIsMe(playerIndex)) {
                let mineShoupaiGroup = this.mineShoupaiGroup;
                for (let i = 0; i < outCard.length; i++) {
                    let card = outCard[i];
                    Global.gameProxy.updateWanjiaShoupai(card, -1);
                    mineShoupaiGroup.hidePaiByValue(card, false);
                    // mineShoupaiGroup.removeShoupaiByValue(card, 1);
                    this.add2HuGroup(card, playerIndex);
                }
                if (newCard && newCard.length > 0) {
                    this.setAutoTimeout(() => {
                        for (let i = 0; i < newCard.length; i++) {
                            let card = newCard[i];
                            Global.gameProxy.updateWanjiaShoupai(card, 1);
                            this.paiQiang.removeNumByIndex();
                            this.updateSypai();
                        }
                        if (newCard.length > 0) {
                            MajiangUtils.playMJPTHSound(playerData.sex, "buhua");
                        }
                        let cards = Global.gameProxy.getMineShuopaiArr();
                        mineShoupaiGroup.sortShoupaiByValue(cards, false);
                    }, this, 300);
                }
            } else {
                let shoupaiGroup = this[`${direction}ShoupaiGroup`] as LeftShoupaiGroup;
                shoupaiGroup.hideRightByCount(outCard.length, false);
                for (let i = 0; i < outCard.length; i++) {
                    let card = outCard[i];
                    this.add2HuGroup(card, playerIndex);
                }
                this.setAutoTimeout(() => {
                    for (let i = 0; i < outCard.length; i++) {
                        this.paiQiang.removeNumByIndex();
                        this.updateSypai();
                    }
                    if (outCard.length > 0) {
                        MajiangUtils.playMJPTHSound(playerData.sex, "buhua");
                    }
                    shoupaiGroup.hideRightByCount(outCard.length, true);
                }, this, 300);
            }
        }

        /**
         * todo不花
         */
        private playerBuhua(e: egret.TouchEvent) {
            let datas = e.data.huaInfo;
            let playerIndex = e.data.playerIndex;
            this.clearTingStatus()
            let direction = this.directions[playerIndex];
            let shoupaiGroup = this[`${direction}ShoupaiGroup`] as MineShoupaiGroup;
            let hupaiGroup = this[`${direction}HupaiGroup`] as MajiangHupaiGroup;
            // this.taskBar.hideAllBtns();
            this.newCard({ card: datas[0].cards[0], playerIndex: playerIndex });
            async.eachSeries(datas, (data: any, callback) => {
                let outCard = data.cards;
                let newCard = data.newCards || [];
                let playerData = Global.gameProxy.getPlayerByIndex(playerIndex);
                this.lockChupai = true;
                playerData.cardNum--;
                playerData.lastCard = 0;
                if (direction == "mine") {
                    Global.gameProxy.updateWanjiaShoupai(outCard[0], -1);
                    //隐藏胡牌的箭头
                }
                this.setAutoTimeout(() => {
                    shoupaiGroup.hideMopai();
                    hupaiGroup.addBuhua(outCard[0]);
                    MajiangUtils.playMJPTHSound(playerData.sex, "buhua");
                    if (this.paiQiang.getPaiQiangNum() == 0) {
                        callback();
                        return;
                    }
                    this.setAutoTimeout(() => {
                        this.newCard({ card: newCard[0], playerIndex: playerIndex, notHideBtn: true });
                        callback();
                    }, this, 400);
                }, this, 500);
            }, () => {
                this.lockChupai = false;
                this.checkHuTips();
            })
        }

        private checkChupaiStatus() {
            let roomInfo = Global.gameProxy.roomInfo;
            let direction = this.directions[roomInfo.curPlay];
            this.timeDirectionBar.showLightByDirection(direction);
            this.showHeaderTips(roomInfo);
            this.checkOutPutByDirection();
            //这里判断如果手牌=14 则把最后一张牌给change出去
            let playerData = Global.gameProxy.getPlayerByIndex(roomInfo.curPlay);
            this.maxTouchShoupai = 1;
            this.showShoupai(direction);
            this.checkTask();
            this.checkShowTips();

        }


        /**
         * 手动适配组件位子
         */
        public eventResize(data?: any) {
            super.eventResize();
            if (egret.Capabilities.isMobile) {
                if (GameConfig.WINSIZE_BILI_WIDTH >= 1) {
                    this.mineGroup.scaleX = this.mineShoupaiGroup.scaleY = GameConfig.WINSIZE_BILI_WIDTH;
                    this.mineGroup.bottom = 0;
                }
            }
            if (this.chupaiTips) {
                this.chupaiTips.visible = false;
            }
        }

        //----回显胡牌 

        private getHupaiArrByHuTask(playerIndex) {
            let roomInfo = Global.gameProxy.roomInfo;
            let huTasks = roomInfo.huTasks;
            let huTaskGroup = _.groupBy(huTasks, "playerIndex");
            let findArr = huTaskGroup[playerIndex];
            return findArr || [];
        }

        private reloadHuas() {
            let roomInfo = Global.gameProxy.roomInfo;
            for (let key in roomInfo.players) {
                let player: PlayerGameDataBean = roomInfo.players[key];
                let direction = this.directions[key];
                let hupaiGroup: MajiangHupaiGroup = this[direction + "HupaiGroup"];
                hupaiGroup.removeChildren();
                hupaiGroup.initWithDirection(direction);
                hupaiGroup.visible = true;
                let huaCard = player.huaCards;
                for (let i = 0; i < huaCard.length; i++) {
                    hupaiGroup.addBuhua(huaCard[i]);
                }
            }
        }

        //---回显胡牌end----------------------------------------------

        /**
         * 显示重新连接上来的UI
         */
        private showReconnectUI() {
            let roomInfo = Global.gameProxy.roomInfo;
            // this.checkHszStatus(roomInfo);
            this.checkChupaiStatus();
            this.checkTrusteeStatus();
        }

        /**
         * 检查托管状态
         */
        private checkTrusteeStatus() {
            let mineData = Global.gameProxy.getMineGameData();
            this.tgGroup.visible = mineData.isTrustee == true;
        }

        /**
         * 展现玩家头像
         */
        private showHeaders() {
            let players = Global.gameProxy.getPlayers();
            let zhuangId = Global.gameProxy.roomInfo.dealer;
            for (let key in players) {
                let playerData = players[key];
                let dir = this.directions[key];
                let header: WidgetHeader = this[dir + 'Header'];
                header.initWithData(playerData, dir);
                header.showIsZhuang(game.Utils.valueEqual(zhuangId, key));
                header.visible = true;
                if (playerData.isBaoTing) {
                    header.showTingImages(false);
                }
            }
        }


        private renderContent() {
            this.tipBtn.visible = false;
            //显示玩家头像
            this.showHeaders();
            //创建功能条
            this.createTaskBar();
            //重连的话不需要发牌
            if (Global.gameProxy.reconnect) {
                this.paiQiang.reloadPaiQiang();
                for (let i = 1; i <= 4; i++) {
                    this.showShoupaiByIndex(i, true);
                }
                this.timeDirectionBar.startTime(this);
                this.reloadPlayerChupais();
                this.showShengyuPai();
                this.showReconnectUI();
                this.checkPlayerIsOver();
                this.checkPlayerHasJiao();
            } else {
                this.showStartAni(() => {
                    //展现牌局开始动画
                    for (let i = 1; i <= 4; i++) {
                        this.showShoupaiByIndex(i, false);
                    }
                    this.setAutoTimeout(this.fapaiAni, this, 500);
                })
            }
        }

        /**
         * 检查玩家是否有叫
         */
        private currentTings = [];
        private async checkPlayerHasJiao() {
            let mineInfo = Global.gameProxy.getMineGameData();
            if (mineInfo['isBaoTing']) {
                this.mineShoupaiGroup.playerTing();
            }
            // if (mineInfo['isTing']) {
            // let route = ServerPostPath.game_mjHandler_c_queryTings;
            // let data = {};
            // let resp: any = await Global.pomelo.request(route, data);
            this.currentTings = mineInfo.tingInfo
            this.tipBtn.visible = this.currentTings.length > 0;
            // }
            this.checkHuTips();
            //  this.showHuTips();
        }

        /**
         * 检查玩家是已经输光
         */
        private checkPlayerIsOver() {
            let players = Global.gameProxy.roomInfo.players;
            for (let playerIndex in players) {
                let player = players[playerIndex] as PlayerGameDataBean;
                if (player.gold <= 0) {
                    let direction = this.directions[playerIndex];
                    this.createRenshuFont(direction);
                    if (Global.gameProxy.roomInfo.publicCardNum != 0) {
                        this.huPaiOrGameOver(direction);
                    }
                }
            }
        }


        /**
         * 牌局开始的动画
         * @param  {} callback
         */
        private showStartAni(callback) {
            let mc: egret.MovieClip = GameCacheManager.instance.getMcCache("start", "mine_start", null);//game.MCUtils.getMc("start")
            this.effectGroup.addChild(mc);
            mc.x = GameConfig.curWidth() / 2 + 5;
            mc.y = GameConfig.curHeight() * 0.42;
            let mcCallback = () => {
                mc.removeEventListener(egret.MovieClipEvent.COMPLETE, mcCallback, this);
                game.UIUtils.removeSelf(mc);
            }
            this.setAutoTimeout(callback, this, 500);
            mc.addEventListener(egret.MovieClipEvent.COMPLETE, mcCallback, this);
            mc.play(1);
        }


        private paiQiang: PaiQiang144;
        private gmGroup: eui.Group;
        public async createChildren() {
            super.createChildren();
            let showGm = ServerConfig.PATH_TYPE == PathTypeEnum.NEI_TEST || ServerConfig.PATH_TYPE == PathTypeEnum.QA_TEST;
            this.gmGroup.visible = showGm;
            // if (!Global.gameProxy.roomInfo) {
            // await Global.gameProxy.req2updateRoom();
            // }
            this.dizhu.bold = true;
            this.dizhu.text = "底注：" + Global.gameProxy.lastGameConfig.diFen;//this.difeng;
            //设置玩家座位标示
            this.majiangStatus = MajiangStatusEnum.READY;
            //记录玩家坐标
            this.directions = MajiangUtils.getDirectionByMine(Global.gameProxy.getMineIndex());
            this.paiQiang.showPaiQiang(this.directions);
            this.renderChupaiGroups();
            this.reloadHuas();
            this.renderContent();
            this.backMovie();
            this.wanfaImage.source = RES.getRes("wanfa_dzmj_png");
            this.roomIdLable.text = "房间编号：" + Global.gameProxy.roomInfo.roomId;
            SoundManager.getInstance().playMusic("playingingame_mp3");
        }

        /**
        *  玩家回显胡牌展示。
        */
        private backMovie() {
            let roomInfo = Global.gameProxy.roomInfo;
            for (let key in roomInfo.players) {
                let player: PlayerGameDataBean = roomInfo.players[key];
                let direction = this.directions[key];
                switch (direction) {
                    case "left":
                        if (player.huCards.length > 0) {
                            this.huPaiOrGameOver(direction);
                        }
                        break;
                    case "top":
                        if (player.huCards.length > 0) {
                            this.huPaiOrGameOver(direction);
                        }
                        break;
                    case "right":
                        if (player.huCards.length > 0) {
                            this.huPaiOrGameOver(direction);
                        }
                        break;
                }
                //  let hupaiGroup: MajiangHupaiGroup = this[direction + "HupaiGroup"];
                // hupaiGroup.removeChildren();
                // hupaiGroup.initWithDirection(direction);
                // hupaiGroup.visible = true;
                // let hus = player.huCards || [];
                // hupaiGroup.initWithArr(hus);
            }

        }

        private reloadScene() {
            this.renderContent();
            this.renderChupaiGroups();
            this.reloadHuas();
        }

        public updateGold() {
            this['mineHeader'].updateGold(Global.playerProxy.playerData.gold);
        }
        /**
         * 显示出牌group
         */
        public renderChupaiGroups() {
            this.mineChupaiGroup.visible = true;
            this.mineChupaiGroup.clearDatas();
            let data = [];
            //  let data1 = [19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19];
            this.mineChupaiGroup.createByArr(data)

            this.leftChupaiGroup.visible = true;
            this.leftChupaiGroup.clearDatas();
            this.leftChupaiGroup.createByArr(data);

            this.topChupaiGroup.visible = true;
            this.topChupaiGroup.clearDatas();
            this.topChupaiGroup.createByArr(data);

            this.rightChupaiGroup.visible = true;
            this.rightChupaiGroup.clearDatas();
            this.rightChupaiGroup.createByArr(data);
        }

        /**
         * 展示我的手牌
         */
        public showShoupaiByMine(flag: boolean = true) {
            let cardsArr = Global.gameProxy.getMineShuopaiArr();
            if (!flag) {
                cardsArr = _.shuffle(cardsArr);
            }
            this.mineShoupaiGroup.initWithArr(cardsArr, flag);
        }

        /**
         * 显示其他玩家的手牌, 如果新创建则隐藏起来，做动画
         * @param  {number} index
         */
        public showShoupaiByIndex(index: number, isVisible: boolean = true) {
            //显示重连
            let direction = this.directions[index];
            let mineData: PlayerGameDataBean = Global.gameProxy.getPlayerByIndex(index);
            if (direction == "mine") {
                this.showShoupaiByMine(isVisible);
                if (mineData.huCards.length > 0) {
                    this.mineShoupaiGroup.lockHu();
                }
                return;
            }

            if (mineData) {
                if (mineData.cards && this[direction + 'ShoupaiGroup'].initWithCards) {
                    this[direction + 'ShoupaiGroup'].initWithCards(index, isVisible);
                    return;
                }
                let number = mineData.cardNum;
                this[direction + 'ShoupaiGroup'].initWithArr(number, isVisible);
            }
        }

        private gmBtn: eui.Button;
        private gmStop: eui.Button;
        private gmRun: eui.Button;
        private tgGroup: eui.Group;
        private qxtgBtn: eui.Button;
        public async onTouchTap(e: egret.TouchEvent) {
            e.stopPropagation();
            switch (e.target) {
                case this.restartBtn:
                    if (this.restartBtn.visible) {
                        this.allowBack = true;
                    }
                    this.backBtnTouch();
                    break;
                case this.chatBtn:
                    if (this.huTipsBar) {
                        this.huTipsBar.hideBar();
                    }
                    this.chatBtnTouch();
                    break;
                case this.tipBtn:
                    if (this.ctBar) {
                        this.ctBar.hideBar();
                    }
                    this.tipsBtnTouch();
                    break;
                case this.ctBar:
                    break;
                case this.qxtgBtn:
                    this.cacelTuoguan();
                    break;
                case this.gnBtn://点击功能按钮
                    this.gnBtn.visible = false;
                    this.gnGroup.visible = true;
                    this.touchGroup.addChild(this.gnGroup);
                    break;
                case this.btn_shou://收起展开的功能组
                    this.gnBtn.visible = true;
                    this.gnGroup.visible = false;
                    break;
                case this.btn_set://设置按钮，控制音乐音效的
                    game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING, { setIndex: 2 });
                    this.gnBtn.visible = true;
                    this.gnGroup.visible = false;
                    break;
                case this.btn_help://帮助按钮
                    game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_DZMJ_HELP);
                    this.gnBtn.visible = true;
                    this.gnGroup.visible = false;
                    break;
                case this.touchGroup:
                    if (this.touchShoupai) {
                        this.touchShoupai.change2NoSelect();
                        this.touchShoupai = null;
                        EventManager.instance.dispatch(EventNotify.FIND_COLOR, 0);
                    }
                    if (this.isTingStatus) {
                        this.clearTingStatus()
                        this.taskBar.visible = true;
                        this.mineShoupaiGroup.unLockAll();
                    }
                    this.hideBars();
                    break;
                case this.backBtn:
                    this.backBtnTouch();
                    break;
                case this.gmBtn:
                    this.showMajiangTest();
                    break;
                case this.gmStop:
                    var handler = ServerPostPath.game_mjHandler_c_setAIThinkTime;
                    let multi = { multi: 10 };
                    let resp: any = await game.PomeloManager.instance.request(handler, multi);
                    if (resp.error && resp.error.code != 0) {
                        Global.alertMediator.addAlert("失败，重试", null, null, true);
                    }
                    break;
                case this.gmRun:
                    var handler1 = ServerPostPath.game_mjHandler_c_setAIThinkTime;
                    let multi1 = { multi: 0 };
                    let resp1: any = await game.PomeloManager.instance.request(handler1, multi1);
                    if (resp.error && resp.error.code != 0) {
                        Global.alertMediator.addAlert("失败，重试", null, null, true);
                    }
                    break;
            }
        }

        private showMajiangTest() {
            let majiangTest = new MajiangTestScene();
            this.addChild(majiangTest);
            majiangTest.initData();
        }

        private changGnBtnStat(e?: egret.Event) {
            this.gnBtn.visible = true;
            this.gnGroup.x = 2560;
        }

        /**
         * 取消托管
         */
        private async cacelTuoguan() {
            var handler = ServerPostPath.game_mjHandler_c_cancelTrustee;
            let resp: any = await game.PomeloManager.instance.request(handler, null);
        }


        //提牌，换三张，打牌的效果。
        public shoupaiTouchOn(e: egret.TouchEvent) {
            let touchShoupai: MineShoupai = e.data;
            //出牌状态
            if (this.maxTouchShoupai == 1) {
                //已经有选择的牌
                if (this.touchShoupai == touchShoupai) {
                    if (Global.gameProxy.getMineGameData().isBaoTing && this.touchShoupai != this.mineShoupaiGroup.mopai) {
                        LogUtils.logD("听了啊")
                        return;
                    }
                    if (!Global.gameProxy.checkIsRoundMe()) {
                        LogUtils.logD("没轮到我出牌")
                        return;
                    }
                    if (this.lockChupai) {
                        LogUtils.logD("锁定出牌")
                        return;
                    }
                    //如果是轮到出牌
                    EventManager.instance.dispatch(EventNotify.FIND_COLOR, 0);
                    this.chupaiReq(touchShoupai);
                    return;
                    //出牌
                } else {
                    if (this.touchShoupai) {
                        this.touchShoupaiClear();
                    }
                    this.touchShoupai = touchShoupai;
                    this.touchShoupai.selectUp();
                    EventManager.instance.dispatch(EventNotify.FIND_COLOR, this.touchShoupai.value);
                    this.showHuTips();
                }
            }
        }

        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(ServerNotify.s_countdown, this.countDownPush, this);
            EventManager.instance.addEvent(EventNotify.SHOUPAI_TOUCH, this.shoupaiTouchOn, this);
            EventManager.instance.addEvent(ServerNotify.s_curPlay, this.curPlayPush, this);
            EventManager.instance.addEvent(ServerNotify.s_playCard, this.playCardPush, this);
            EventManager.instance.addEvent(ServerNotify.s_publicCardChanged, this.publicCardChangedPush, this);
            EventManager.instance.addEvent(ServerNotify.s_newCard, this.newCardPush, this);
            EventManager.instance.addEvent(ServerNotify.s_playerPengCard, this.playerPengCardPush, this);
            EventManager.instance.addEvent(ServerNotify.s_hangupTask, this.hangupTaskPush, this);
            EventManager.instance.addEvent(ServerNotify.s_playerGangCard, this.playerGangCard, this);
            EventManager.instance.addEvent(ServerNotify.s_playerHu, this.hupaiPush, this);
            EventManager.instance.addEvent(ServerNotify.s_syncGold, this.syncGoldPush, this);
            EventManager.instance.addEvent(ServerNotify.s_roundSettlement, this.settlementData, this);
            EventManager.instance.addEvent(ServerNotify.s_roomFinished, this.roomGameOver, this);
            EventManager.instance.addEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
            EventManager.instance.addEvent(ServerNotify.s_playerClearWaitTimeout, this.clearCountDown, this);
            EventManager.instance.addEvent(ServerNotify.s_trustee, this.tuoguanStatusPush, this);
            EventManager.instance.addEvent(ServerNotify.s_cancelGangForQG, this.qiangGangHu, this);
            EventManager.instance.addEvent(EventNotify.SHOW_GNBTN, this.changGnBtnStat, this);
            EventManager.instance.addEvent(ServerNotify.s_roomChat, this.sendMessage, this);
            EventManager.instance.addEvent(ServerNotify.s_playHua, this.playerBuhua, this);
            EventManager.instance.addEvent(ServerNotify.s_playerChiCard, this.playerChiCard, this);
            EventManager.instance.addEvent(ServerNotify.s_playerBaoTing, this.playerBaoTingPush, this);
            EventManager.instance.addEvent(ServerNotify.s_tings, this.tingInfoPush, this);
            EventManager.instance.addEvent(ServerNotify.s_passTask, this.passTaskPush, this);
        }

        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(ServerNotify.s_countdown, this.countDownPush, this);
            EventManager.instance.removeEvent(EventNotify.SHOUPAI_TOUCH, this.shoupaiTouchOn, this);
            EventManager.instance.removeEvent(ServerNotify.s_curPlay, this.curPlayPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_playCard, this.playCardPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_publicCardChanged, this.publicCardChangedPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_newCard, this.newCardPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerPengCard, this.playerPengCardPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_hangupTask, this.hangupTaskPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerGangCard, this.playerGangCard, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerHu, this.hupaiPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_syncGold, this.syncGoldPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_roundSettlement, this.settlementData, this);
            EventManager.instance.removeEvent(ServerNotify.s_roomFinished, this.roomGameOver, this);
            EventManager.instance.removeEvent(EventNotify.RECONNECT_SUC, this.reconnectSuc, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerClearWaitTimeout, this.clearCountDown, this);
            EventManager.instance.removeEvent(ServerNotify.s_trustee, this.tuoguanStatusPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_cancelGangForQG, this.qiangGangHu, this);
            EventManager.instance.removeEvent(EventNotify.SHOW_GNBTN, this.changGnBtnStat, this);
            EventManager.instance.removeEvent(ServerNotify.s_roomChat, this.sendMessage, this);
            EventManager.instance.removeEvent(ServerNotify.s_playHua, this.playerBuhua, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerChiCard, this.playerChiCard, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerBaoTing, this.playerBaoTingPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_passTask, this.passTaskPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_tings, this.tingInfoPush, this);
        }

        private tingInfoPush(e: egret.TouchEvent) {
            let data = e.data;
            let playerData = Global.gameProxy.getMineGameData() as PlayerGameDataBean;
            playerData.tingInfo = this.currentTings = data;
        }

        private add2HuGroup(card, playerIndex) {
            let direction = this.directions[playerIndex];
            this[`${direction}HupaiGroup`].addBuhua(card);
        }

        /**
         * 给玩家广播消息。
         */
        private sendMessage(e: egret.TouchEvent) {
            let data = e.data;
            let playerIndex = data.playerIndex;
            let message = data.message;
            let direction = this.directions[playerIndex];
            let header: WidgetHeader = this[direction + 'Header'];
            if (MajiangConfig.msgType.Word == data.type) {
                for (let i = 0; i < MajiangConfig.commonMessage.length; i++) {
                    let item = MajiangConfig.commonMessage[i];
                    if (item["id"] == message) {
                        header.showMsgAndImg(direction, item["message"], message, playerIndex, 0);
                    }
                }
            } else {
                header.showMsgAndImg(direction, 0, 0, 0, message);
            }
        }

        private tuoguanStatusPush(e: egret.TouchEvent) {
            let resp = e.data;
            this.clearTingStatus()
            this.tgGroup.visible = resp.isTrustee;
        }


        /**
         * 玩家报听推送
         */
        private playerBaoTingPush(e: egret.TouchEvent) {
            let resp = e.data;
            let playerIndex = resp.playerIndex;
            let playerData = Global.gameProxy.getPlayerByIndex(playerIndex);
            playerData['isBaoTing'] = true;
            this.addEffectAni(this.directions[playerIndex], "ting");
            let header = this.getHeaderByDirection(playerIndex);
            header.showTingImages(true);
            if (playerIndex == Global.gameProxy.getMineIndex()) {
                LogUtils.logD("玩家报听")
                this.mineShoupaiGroup.playerTing();
            }
        }

        /**
         * 清除倒计时
         * @param  {egret.TouchEvent} e
         */
        private clearCountDown() {
            if (Global.gameProxy.roomInfo) {
                Global.gameProxy.roomInfo.countdown = null;
            }
            this.taskBar.visible = false;
        }


        /**
         * 倒计时推送
         * @param  {egret.Event} e
         */
        public countDownPush(e: egret.Event) {
            let resp = e.data;
            if (Global.gameProxy.roomInfo) {
                Global.gameProxy.roomInfo.countdown = resp;
            }
        }

        /**
         * 断线重连
         */
        private async reconnectSuc(e: egret.Event) {
            //对局已经结束不做处理
            if (this.allowBack) {
                Global.alertMediator.addAlert("对局已经结束", null, null, true);
                this.backHall();
                return;
            }
            let reqData = Global.gameProxy.lastGameConfig;
            if (!reqData) reqData = {};
            if (!Global.gameProxy.roomInfo || !Global.gameProxy.roomInfo.roomId) {
                this.backHall();
                return;
            }
            reqData.roomId = Global.gameProxy.roomInfo.roomId;
            this.reconnectCall(reqData, Global.gameProxy);
        }

        /**
         * 游戏积分变化
         * @param  {egret.Event} e
         */
        public syncGoldPush(e: egret.Event) {
            let resp: any = e.data;
            this.setAutoTimeout(() => {
                this.syncGold(resp);
            }, this, 500);

        }
        /**
         * 在重新连接上来过后或者才发完手牌之后改变最后一张为摸牌
         * @param  {} direction
         */
        private showShoupai(direction) {
            this[direction + "ShoupaiGroup"].changeLast2Mopai();
        }

        /**
         * 获取玩家头像
         * @param  {number} index
         */
        private getHeaderByDirection(index): WidgetHeader {
            return this[this.directions[index] + "Header"]
        }

        //-------打牌-----

        /**
         * 更新该谁打牌
         * 
         * {"curPlay":2,"newCard":true}
         * @param  {egret.TouchEvent} e
         */
        private roundMe: boolean = false;
        private curPlayPush(e: egret.TouchEvent) {
            let resp = e.data;
            this.maxTouchShoupai = 1;
            this.timeDirectionBar.showLightByDirection(this.directions[resp.curPlay]);
            Global.gameProxy.roomInfo.curPlay = resp.curPlay;
            // if (this.cacheHua) {
            //     this.checkChupaiStatus();
            //     this.cacheHua = false;
            // }
            this.checkOutPutByDirection();
            this.showHeaderTips(Global.gameProxy.roomInfo);
            // if (this.checkHua) {
            //     this.checkChupaiStatus();
            //     this.checkHua = false;
            // }
        }

        /**
         * 展现header
         */
        private showHeaderTips(roomInfo) {
            for (let key in roomInfo.players) {
                this.getHeaderByDirection(key).showTip(game.Utils.valueEqual(key, roomInfo.curPlay));
            }
        }


        /**
         * 根据座位选择谁开始打牌
         */
        private checkOutPutByDirection() {
            let roomInfo = Global.gameProxy.roomInfo;
            let curPlay = roomInfo.curPlay;
            let direction = this.directions[curPlay];
            if (direction == "mine") {
                this.majiangStatus = MajiangStatusEnum.MINE_CHUPAI;
            } else {
                this.majiangStatus = MajiangStatusEnum.OTHER_CHUPAI;
            }
        }

        /**
         * 玩家出牌
         */
        public lockChupai: boolean = false;
        private async chupaiReq(touchShoupai: MineShoupai) {
            this.majiangStatus = MajiangStatusEnum.BLANK;
            let pai = this.touchShoupai;
            // this.touchShoupaiClear();
            let resp: any = await Global.pomelo.request('game.mjHandler.c_playCard', { card: pai.value, isBaoTing: this.isTingStatus });
            if (resp && resp.error && resp.error.code == 0) {
                EventManager.instance.dispatch(EventNotify.SHOUPAI_TOUCH_SUC, touchShoupai);
                this.majiangStatus = MajiangStatusEnum.OTHER_CHUPAI;
            } else if (resp && resp.error && resp.error.code == -10101) {
                Global.pomelo.disConnect();
            } else {
                this.majiangStatus = MajiangStatusEnum.MINE_CHUPAI;
            }
        }


        private chupaiCallback() {
            this.mineShoupaiGroup.hideMopai();
            Global.gameProxy.clearTasks();
            Global.gameProxy.clearCurPlay();
            this.mineShoupaiGroup.shoupaiDowns();
            if (this.mineShoupaiGroup.isMopais(this.mineShoupaiGroup.shoupais.length)) {
                this.mineShoupaiGroup.removeLastPai();
            }

        }

        /**
         * 玩家吃牌推送
         */
        private playerChiCard(e: egret.Event) {
            this.clearCountDown();
            this.clearTingStatus()
            let resp: any = e.data;
            let playerIndex = resp.playerIndex;
            let chiMaxCard = resp.selectCard;
            let direction = this.directions[playerIndex];
            let from = resp.from;
            let playCard = resp.card;
            //记录玩家碰牌
            Global.gameProxy.recordPlayerChis(playerIndex, playCard, chiMaxCard, resp);
            //最后一张出牌UI删掉
            Global.gameProxy.recordChu2Dianpao(from);
            let lastDirection = this.directions[from];
            this[lastDirection + "ChupaiGroup"].removeLastChupai();
            let playerData = Global.gameProxy.getPlayerByIndex(playerIndex) as PlayerGameDataBean;
            //调用碰
            if (direction != "mine") {
                this[direction + "ShoupaiGroup"].removeShoupaiByChi();
                this[direction + "ShoupaiGroup"].changeLast2Mopai(0);
            } else {
                this.mineShoupaiGroup.removeShoupaiByChi(playCard, chiMaxCard);
                this.touchShoupaiClear();
                this.mineShoupaiGroup.sortShoupais();
                this.mineShoupaiGroup.changeLast2Mopai();
                this.hideBars();
                this.taskBar.hideAllBtns();
                Global.gameProxy.roomInfo.curPlay = Global.gameProxy.getMineIndex();
                this.checkShowTips();
                this.lockChupai = false;
            }
            //播放碰牌动画
            this.addEffectAni(direction, "chi");
            this.hideChupaiTips();
            let pgGroup = this[`${direction}PgGroup`] as MjMineGroup;
            let pengItem = pgGroup.add(5, chiMaxCard);
            pengItem.peng2Chi(chiMaxCard);

            //播放吃牌音效
            majiang.MajiangUtils.playMJPTHSound(playerData.sex, "chi");
        }

        private clearTingStatus() {
            if (this.isTingStatus) {
                this.isTingStatus = false;
                let mineData = Global.gameProxy.getMineGameData();
                this.mineShoupaiGroup.unLockAll();
                if (mineData.isBaoTing) {
                    this.mineShoupaiGroup.playerTing();
                }
            }
        }


        /**
         * 玩家出牌推送
         * {"playerIndex":1,"card":28}
         * @param  {egret.Event} e
         */
        private playCardPush(e: egret.Event) {
            this.clearCountDown();
            this.clearTingStatus()
            let resp: any = e.data;
            let playerIndex = resp.playerIndex;
            let card = resp.card;
            let direction = this.directions[playerIndex];
            let playerData = Global.gameProxy.getPlayerByIndex(playerIndex);
            playerData.cardNum--;
            playerData.lastCard = 0;
            Global.gameProxy.roomInfo.hangupTaskSource = null;
            playerData.playCards.push(card);
            if (direction == "mine") {
                this.updateTingByValue(card);
                this.closeGameTipsGroup();
                Global.gameProxy.updateWanjiaShoupai(card, -1);
                playerData.hangupTasks = null;
                this.taskBar.visible = false;
                this.taskBar.hideAllBtns();
                Global.gameProxy.clearTasks();
                //隐藏胡牌的箭头
                this.mineShoupaiGroup.changePaiToVisible(false);
                this.mineShoupaiGroup.sortShoupaisByChupai(card);
                this.chupaiCallback();
                this.clearTouchOn();
                if (this.huTipsBar) {
                    this.huTipsBar.hideBar();
                }
            } else {
                Global.gameProxy.updateWanjiaShoupaiByIndex(card, -1, playerIndex);
            }
            this.showChupaiAni1(playerIndex, card);
            MajiangUtils.playMJPTHSound(playerData.sex, card);
        }

        7


        private clearTouchOn() {
            if (this.touchShoupai) {
                this.touchShoupai.change2NoSelect();
                this.touchShoupai = null;
                // this.hideBars();
                EventManager.instance.dispatch(EventNotify.FIND_COLOR, 0);
            }
        }

        /**
         * 展现动画
         * @param  {} playerIndex
         * @param  {} value
         */
        private showChupaiAni1(playerIndex, value) {
            let direction = this.directions[playerIndex];
            let name = direction + "_ChuShoupai";
            let tempChupai = GameCacheManager.instance.getCache(name, MineShoupai) as MineShoupai;
            tempChupai.resetValue(value);
            // let tempChupai = new MineShoupai(value);
            this.effectGroup.addChild(tempChupai);
            let targetMajiang;
            switch (direction) {
                case "mine":
                    game.UIUtils.setUI2CenterX(tempChupai);
                    tempChupai.y = GameConfig.curHeight() * 0.65;
                    targetMajiang = this.mineChupaiGroup.addChupai(value);
                    targetMajiang.visible = false;
                    break;
                case "left":
                    game.UIUtils.setUI2CenterY(tempChupai);
                    tempChupai.x = GameConfig.curWidth() * 0.2;
                    tempChupai.y -= 50;
                    targetMajiang = this.leftChupaiGroup.addChupai(value);
                    targetMajiang.visible = false;
                    this[direction + 'ShoupaiGroup'].showOtherChupaiAni();
                    break;
                case "right":
                    game.UIUtils.setUI2CenterY(tempChupai);
                    tempChupai.x = GameConfig.curWidth() * 0.7;
                    tempChupai.y -= 50;
                    targetMajiang = this.rightChupaiGroup.addChupai(value);
                    targetMajiang.visible = false;
                    this[direction + 'ShoupaiGroup'].showOtherChupaiAni();
                    break;
                case "top":
                    game.UIUtils.setUI2CenterX(tempChupai);
                    tempChupai.y = GameConfig.curHeight() * 0.2;
                    targetMajiang = this.topChupaiGroup.addChupai(value);
                    targetMajiang.visible = false;
                    this[direction + 'ShoupaiGroup'].showOtherChupaiAni();
                    break;
            }
            let pos = targetMajiang.localToGlobal();
            if (Global.runBack) {
                this.showChupaiTips(pos, direction);
                game.UIUtils.removeSelf(tempChupai);
                targetMajiang.visible = true;
                return;
            }
            game.UIUtils.setAnchorPot(tempChupai);
            tempChupai.scaleX = 0;
            tempChupai.scaleY = 0;
            this.lastChupai = targetMajiang;
            egret.Tween.get(tempChupai).to({
                scaleX: 1,
                scaleY: 1
            }, 50).wait(500).to({
                scaleX: 0.5,
                scaleY: 0.5,
                y: pos.y + targetMajiang.height / 2,
                x: pos.x + targetMajiang.width / 2 + 10
            }, 100).call(() => {
                this.showChupaiTips(pos, direction);
                game.UIUtils.removeSelf(tempChupai);
                targetMajiang.visible = true;
            }, this);
        }

        //-----胡碰杠的检测
        /**
         * 检查任务状态
         */
        private taskBar: MajiangTaskBar;

        private createTaskBar() {
            if (!this.taskBar) {
                this.taskBar = new MajiangTaskBar();
                this.touchGroup.addChild(this.taskBar);
                this.taskBar.width = 520;
                this.taskBar.height = 132;
                this.taskBar.setRoot(this);
                this.taskBar.right = 230;
                this.taskBar.bottom = 160;
            }
        }

        /**
          * 玩家task推送
          * @param  {egret.Event} e
          */
        private hangupTaskPush(e: egret.Event) {
            let resp: any = e.data;
            let mine = Global.gameProxy.getMineGameData();
            mine.hidePass = resp.hidePass;
            mine.hangupTasks = resp.task;
            mine.taskIndex = resp.taskIndex;
            this.clearTingStatus()
            Global.gameProxy.roomInfo.hangupTaskSource = {};
            this.checkTask();
            this.checkHuTips();
            // this.setAutoTimeout(, this, 200);
        }


        /**
         * 检查task状态
         */
        private checkTask() {
            let roomInfo = Global.gameProxy.roomInfo;
            let startX = roomInfo.curPlay;
            let direction = this.directions[startX];
            //如果房间中是有任务状态
            if (roomInfo.hangupTaskSource) {
                let mine = Global.gameProxy.getMineGameData();
                this.taskBar.showBtnsByData(mine);
                this.touchGroup.addChild(this.taskBar);
            }
        }


        private

        /**
        * 玩家碰牌
        * {"playerIndex":1,"from":2,"card":12}
        * @param  {egret.Event} e
        */
        private playerPengCardPush(e: egret.Event) {
            this.clearCountDown();
            this.clearTingStatus()
            let resp = e.data;
            let playerIndex = resp.playerIndex;
            let from = resp.from;
            let color = resp.card;
            //记录玩家碰牌
            Global.gameProxy.recordPlayerPengs(playerIndex, resp.card, resp.from);
            //碰牌吧最后一张出牌UI删掉
            Global.gameProxy.recordChu2Dianpao(from);
            let lastDirection = this.directions[from];
            this[lastDirection + "ChupaiGroup"].removeLastChupai();
            let playerData = Global.gameProxy.getPlayerByIndex(playerIndex) as PlayerGameDataBean;
            playerData.hangupTasks = null;
            //以上玩家数据修改 以下 玩家UI修改
            let direction = this.directions[playerIndex];
            //调用碰
            this[direction + "ShoupaiGroup"].removeShoupaiByPeng(color);
            //播放碰牌动画
            this.addEffectAni(direction, "peng");
            this.hideChupaiTips();
            this.taskBar.hideAllBtns();
            switch (direction) {
                case "left":
                    //这里Add方法里面的两个参数第一个是1，2，3.1代表碰，2明杠，3暗杠。   color是牌面的花色值,还有个可选参数pbg?即碰变杠。
                    this.leftShoupaiGroup.changeLast2Mopai(0);
                    this.leftPgGroup.add(5, color);
                    break;
                case "right":
                    this.rightShoupaiGroup.changeLast2Mopai(0);
                    this.rightPgGroup.add(5, color);
                    break;
                case "top":
                    this.topShoupaiGroup.changeLast2Mopai(0);
                    this.topPgGroup.add(5, color);
                    break;
                case "mine":
                    this.touchShoupaiClear();
                    this.mineShoupaiGroup.sortShoupais();
                    this.mineShoupaiGroup.changeLast2Mopai();
                    this.hideBars();
                    this.minePgGroup.add(5, color);
                    Global.gameProxy.roomInfo.curPlay = Global.gameProxy.getMineIndex();
                    this.lockChupai = false;
                    this.checkShowTips();
                    break;
            }
            //播放碰牌音效
            majiang.MajiangUtils.playMJPTHSound(playerData.sex, "peng");
        }

        private touchShoupaiClear() {
            if (this.touchShoupai) {
                this.touchShoupai.selectDown();
                this.touchShoupai = null;
                EventManager.instance.dispatch(EventNotify.FIND_COLOR, 0);
            }
        }

        /**
         * 玩家杠牌
         * {"playerIndex":1,"from":2,"card":12}
         * @param  {egret.Event} e
         */
        private playerGangCard(e: egret.Event) {
            this.clearCountDown();
            this.clearTingStatus()
            let resp = e.data;
            let playerIndex = resp.playerIndex;
            let from = resp.from;
            let direction = this.directions[playerIndex];
            let group: BaseShoupaiGroup = this[direction + "ShoupaiGroup"];
            var playerData = Global.gameProxy.getPlayerByIndex(playerIndex) as PlayerGameDataBean;
            //记录玩家杠牌
            Global.gameProxy.recordPlayerGang(resp);
            if (direction == "mine") {
                Global.gameProxy.clearLastPai();
                this.mineShoupaiGroup.changePaiToVisible(false);
                this.hideBars();
                this.touchShoupaiClear();
            }
            this.addEffectAni(direction, "gang");
            this.hideChupaiTips();
            playerData.hangupTasks = null;
            this.taskBar.hideAllBtns();
            if (direction == "mine") {
                this.mineShoupaiGroup.removeShoupaiByGang(resp.card);
                this[direction + 'ShoupaiGroup'].hideMopai();
                // if(resp.gang == 2 || resp.gang == 4){
                //     this.updateTingByValue(resp.card);
                // }
            }

            switch (resp.gang) {
                case 1://碰变杠,吊4个正面，巴雨
                    // this.addGangAni("right", "xiayu", GameConfig.curWidth() * 0.5, GameConfig.curHeight() * 0.3);
                    // this.addGangAni("right", "guafeng", GameConfig.curWidth() * 0.41, GameConfig.curHeight() * 0.24);
                    // this.addGangAni("guafeng", GameConfig.curWidth() * 0.5 + 5, GameConfig.curHeight() * 0.4 + 5, 2);
                    break;
                case 4://调1个正面，3个背面。暗杠，起手就有三张，摸一张。
                    if (direction != "mine") {
                        group.removeLastPai();
                        group.removeLastPai();
                        group.removeLastPai();
                    }
                    // this.addGangAni("xiayu", GameConfig.curWidth() * 0.5 + 10, GameConfig.curHeight() * 0.4 + 5);
                    break;
                case 2://调1个正面，3个背面。暗杠，起手就有四张。不一定第一轮就杠，可能会过几轮。
                    if (direction != "mine") {
                        group.removeLastPai();
                        group.removeLastPai();
                        group.removeLastPai();
                    }

                    // this.addGangAni("xiayu", GameConfig.curWidth() * 0.5 + 10, GameConfig.curHeight() * 0.4 + 5);
                    // group.removeLastPai();
                    //手上四张暗杠
                    break;
                case 3://点杠
                    if (direction != "mine") {
                        group.removeLastPai();
                        group.removeLastPai();
                        group.removeLastPai();
                    }
                    let lastDirection = this.directions[from];
                    this[lastDirection + "ChupaiGroup"].removeLastChupai();
                    // this.addGangAni("guafeng", GameConfig.curWidth() * 0.5 + 5, GameConfig.curHeight() * 0.4 + 5, 2);
                    break;
            }


            //玩家在胡牌后，当玩家再次产生杠牌的时候，需要减少扣下的牌。
            switch (direction) {
                case "left":
                    if (this.leftHuShowGroup.visible == true) {
                        this.huPaiOrGameOver(direction);
                    }
                    break;
                case "right":
                    if (this.rightHuShowGroup.visible == true) {
                        this.huPaiOrGameOver(direction);
                    }
                    break;
                case "top":
                    if (this.topHuShowGroup.visible == true) {
                        this.huPaiOrGameOver(direction);
                    }
                    break;
            }

            //以上玩家数据修改 以下 玩家UI修改
            switch (resp.gang) {
                case 1://碰变杠,吊4个正面，巴雨
                    switch (direction) {
                        case "left":
                            this.leftPgGroup.add(1, resp.card, 1);
                            break;
                        case "right":
                            this.rightPgGroup.add(1, resp.card, 1);
                            break
                        case "top":
                            this.topPgGroup.add(1, resp.card, 1);
                            break;
                        case "mine":
                            this.minePgGroup.add(1, resp.card, 1);
                            break;
                    }

                    break;
                case 4://调1个正面，3个背面。暗杠，起手就有三张，摸一张。

                    switch (direction) {
                        case "left":
                            this.leftPgGroup.add(4, resp.card);
                            break;
                        case "right":
                            this.rightPgGroup.add(4, resp.card);
                            break
                        case "top":
                            this.topPgGroup.add(4, resp.card);
                            break;
                        case "mine":
                            this.minePgGroup.add(4, resp.card);
                            break;
                    }
                    break;
                case 2://调1个正面，3个背面。暗杠，起手就有四张。不一定第一轮就杠，可能会过几轮。
                    switch (direction) {
                        case "left":
                            this.leftPgGroup.add(2, resp.card);
                            break;
                        case "right":
                            this.rightPgGroup.add(2, resp.card);
                            break
                        case "top":
                            this.topPgGroup.add(2, resp.card);
                            break;
                        case "mine":
                            this.minePgGroup.add(2, resp.card);
                            break;
                    }

                    break;
                case 3://碰变杠,调4个正面，这里是自己碰，别人点。

                    switch (direction) {
                        case "left":
                            this.leftPgGroup.add(3, resp.card);
                            break;
                        case "right":
                            this.rightPgGroup.add(3, resp.card);
                            break;
                        case "top":
                            this.topPgGroup.add(3, resp.card);
                            break;
                        case "mine":
                            this.minePgGroup.add(3, resp.card);
                            break;
                    }

                    break;
            }
            majiang.MajiangUtils.playMJPTHSound(playerData.sex, "gang");
            group.hideMopai();
            //再次检查
            // this.checkTask();
        }

        //-----胡碰杠的检测


        ///------打牌end

        //---回显玩家打过的牌
        private reloadPlayerChupais() {
            let players = Global.gameProxy.getPlayers();
            for (let key in players) {
                let playerData: PlayerGameDataBean = players[key];
                let direction = this.directions[key];
                this[direction + 'PgGroup'].removeChildren();
                this[direction + "ChupaiGroup"].createByArr(playerData.playCards || [])
            }
            this.reloadPlayerPengs();
        }
        //---回显玩家打过的牌

        //回显玩家胡碰杠的牌

        /**
         * 回显玩家碰牌
         */
        private reloadPlayerPengs() {
            let players = Global.gameProxy.getPlayers();
            for (let key in players) {
                let playerData: PlayerGameDataBean = players[key];
                let direction = this.directions[key];
                let pengs = playerData.pengCards;
                for (let i = 0; i < pengs.length; i++) {
                    this[direction + 'PgGroup'].add(5, pengs[i], 2);
                }
            }
            this.reloadPlayerGangs();
        }

        /**
         * 回显玩家杠牌
         */
        private reloadPlayerGangs() {
            let players = Global.gameProxy.getPlayers();
            for (let key in players) {
                let playerData: PlayerGameDataBean = players[key];
                let direction = this.directions[key];
                let pengs = playerData.gangCards;
                for (let i = 0; i < pengs.length; i++) {
                    this[direction + 'PgGroup'].add(pengs[i].gang, pengs[i].card, 2);
                }
            }
            this.reloadPlayerChis();
        }



        private reloadPlayerChis() {
            let players = Global.gameProxy.getPlayers();
            for (let key in players) {
                let playerData: PlayerGameDataBean = players[key];
                let direction = this.directions[key];
                let chiCards = playerData.chiCards || [];
                for (let i = 0; i < chiCards.length; i++) {
                    let chiItem = this[direction + 'PgGroup'].add(5, chiCards[i].selectCard, 2) as BasePGItem;
                    chiItem.peng2Chi(chiCards[i].selectCard);
                }
            }
        }



        //--回显玩家胡碰杠的牌

        //---更新剩余牌
        private updateSypai() {
            this.syLabel.text = this.paiQiang.getPaiQiangNum() + ""//Global.gameProxy.addPublicCardPush(num) + "";
        }


        public publicCardChangedPush(e: egret.Event) {
            let resp = e.data;
            if (resp.cardNum > 91) {
                return;
            }
            // this.syLabel.text = resp.cardNum;
            // if (resp.cardNum <= 55 && resp.cardNum > 0) {
            //     egret.Tween.get(this.syLabel, { loop: true }).to({ scaleX: 0.5, scaleY: 0.5 }, 1000).to({ scaleX: 0.6, scaleY: 0.6 }, 1000).to({ scaleX: 0.5, scaleY: 0.5 }, 1000);
            // }
        }
        //---更新剩余牌

        //---摸牌

        /**
         * 摸牌推送
         * {"playerIndex":2,"card":24,"remain":80,existHangup:}
         * @param  {egret.Event} e
         */
        public newCardPush(e: egret.Event) {
            let resp = e.data;
            // this.taskBar.hideAllBtns();
            this.clearTingStatus()
            this.newCard(resp);
        }

        /**
         * 玩家过操作
         */
        public passTaskPush(e: egret.Event) {
            let resp = e.data;
            let playerIndex = resp.playerIndex;
            if (Global.gameProxy.checkIndexIsMe(playerIndex)) {
                this.taskBar.hideAllBtns();
            }
        }

        private newCard(resp) {
            this.paiQiang.removeNumByIndex();
            this.updateSypai();
            let direction = this.directions[resp.playerIndex];
            let playerData = Global.gameProxy.getPlayerByIndex(resp.playerIndex);
            playerData.cardNum++;
            if (direction == "mine") {
                //先刷新自己手牌
                Global.gameProxy.updateWanjiaShoupai(resp.card, 1);
                playerData.lastCard = resp.card;
                if (playerData.isTrustee && Math.floor(resp.card / 5) == 0) {
                } else {
                    this.mineShoupaiGroup.playerNewCardPush(playerData.lastCard);
                    this.checkShowTips();
                    this.lockChupai = true;
                    egret.clearTimeout(this.lockChupaiTimeout);
                    this.lockChupaiTimeout = this.setAutoTimeout(function () {
                        this.lockChupai = false;;
                    }, this, 300);
                }
            } else {
                this[direction + "ShoupaiGroup"].playerNewCardPush();
                playerData.lastCard = 1;
            }

        }


        private lockChupaiTimeout;
        //---摸牌end

        /**
         * 正常胡牌与牌局结束牌面展示
         */
        private huPaiOrGameOver(direction) {
            switch (direction) {//添加胡牌扣牌的效果。
                case "left":
                    this.leftHuShowGroup.removeChildren();
                    let lefts = new LeftShowPai(this.leftShoupaiGroup.shoupais, 1);
                    this.leftHuShowGroup.addChild(lefts);
                    this.leftHuShowGroup.visible = true;
                    this.leftShoupaiGroup.shoupaisVisible();//手牌影藏。

                    break;
                case "top":
                    this.topHuShowGroup.removeChildren();
                    let tops = new TopShowPai(this.topShoupaiGroup.shoupais, 1);
                    this.topHuShowGroup.addChild(tops);
                    this.topHuShowGroup.visible = true;
                    this.topShoupaiGroup.shoupaisVisible();

                    break;
                case "right":
                    this.rightHuShowGroup.removeChildren();
                    let rights = new RightShowPai(this.rightShoupaiGroup.shoupais, 1);
                    this.rightHuShowGroup.addChild(rights);
                    this.rightHuShowGroup.visible = true;
                    this.rightShoupaiGroup.shoupaisVisible();

                    break;
            }
        }

        //---胡牌


        /**
         * 胡牌推送
         *  {"playerIndex":1,"card":23,"from":1,"syncGold":{"1":{"1":{"type":2,"info":{"gainGold":3,"pumpGold":0,"ownGold":9503,"card":23}}
         * "2":{"type":2,"info":{"gainGold":-3,"pumpGold":0,"ownGold":9497,"card":23}}}}}
         * @param  {egret.Event} e
         */
        private async hupaiPush(e: egret.Event) {
            this.clearCountDown();
            this.clearTingStatus()
            let resp: any = e.data;
            let playerIndex = resp.playerIndex;
            let card = resp.card;
            let from = resp.from;
            let mainCard = resp.mainCard;
            let mineData = Global.gameProxy.getMineGameData();
            Global.gameProxy.addHuTasks(resp);
            let huPlayerData = Global.gameProxy.getPlayerByIndex(playerIndex);
            huPlayerData.huCards.push(card);
            let direction = this.directions[playerIndex];
            this.hideChupaiTips();
            this.taskBar.hideAllBtns();
            //zimo 
            if (Global.gameProxy.roomInfo.publicCardNum != 0) {//判断是否是最后一张胡牌。
                this.huPaiOrGameOver(direction);
            }
            if (direction == "mine") {
                this[direction + "ShoupaiGroup"].lockHu();
                this.touchShoupaiClear();
                this.mineShoupaiGroup.changePaiToVisible(false);
                if (Global.gameProxy.roomInfo.gameId.indexOf("xlch") > -1) {
                    this.setAutoTimeout(() => {
                        this.showGameTipGroup(3);
                    }, this, 2000);
                }
            }
            if (game.Utils.valueEqual(playerIndex, from)) {
                this[direction + "ShoupaiGroup"].hideMopai();
                if (direction == "mine") {
                    huPlayerData.lastCard = 0;
                    this.clearTouchOn();
                    Global.gameProxy.updateWanjiaShoupai(card, -1);
                    // this.mineShoupaiGroup.sortMineShoupai();
                }
                if (resp.gsh) {
                    this.addEffectAni(direction, "gsh")
                } else {
                    this.addEffectAni(direction, "zimo")
                }
                this[direction + "HupaiGroup"].addHu(resp, 2);
                majiang.MajiangUtils.playMJPTHSound(huPlayerData.sex, "zimo");
            } else {
                //点炮
                let lastDirection = this.directions[from];
                this.addEffectAni(direction, "hu");
                Global.gameProxy.recordChu2Dianpao(from);
                if (this.g2p == 1) {
                    this.setAutoTimeout(() => {
                        this[direction + "HupaiGroup"].addHu(resp, 1);
                    }, this, 400)
                } else {
                    let time = this[lastDirection + "ChupaiGroup"].showDianpaoAni(mainCard);
                    this.setAutoTimeout(() => {
                        this[direction + "HupaiGroup"].addHu(resp, 1);
                    }, this, time)
                }
                this.g2p = 0;
                majiang.MajiangUtils.playMJPTHSound(huPlayerData.sex, "hu");
            }
        }
        //--回显胡牌end
        /**
         * 显示换桌子按钮
         */
        private checkShowrestartBtn() {
            let roomInfo = Global.gameProxy.roomInfo;
            let notHuIndex = 0;
            for (let key in roomInfo.players) {
                if (roomInfo.players[key].huCards && roomInfo.players[key].huCards.length < 1) {
                    notHuIndex++;
                }
            }
            this.checkShowTips();
            this.restartBtn.visible = !(notHuIndex == 1);
            if (this.restartBtn.visible && ServerConfig.PATH_TYPE != PathTypeEnum.WAI_PRODUCT) {
                let count = NativeApi.instance.showIsFirstLogin();
                if (parseInt(count) % 3 == 1) {
                    this.showGameTipGroup2();
                }
                NativeApi.instance.addPlayCount();
            }
        }


        /**
         * 玩家报听
         */
        public playerBaoTing(tasks) {
            this.isTingStatus = true;
            let tings = tasks[0].tings;
            this.mineShoupaiGroup.lockHu();
            if (this.mineShoupaiGroup.mopai) {
                this.mineShoupaiGroup.mopai.huLight();
            }
            for (let i = 0; i < tings.length; i++) {
                let task = tings[i];
                let out = task.out;
                this.mineShoupaiGroup.unLockByValue(out);
            }
        }

        /**
         * 胡碰杠
         * @param  {} direction
         * @param  {} effectName
         */
        private addEffectAni(direction, effectName) {
            if (Global.runBack) {
                return;
            }
            GameCacheManager.instance.getMcCache(effectName, direction + "_" + effectName, (mv: egret.MovieClip) => {
                if (mv) {
                    mv.scaleX = mv.scaleY = 1.2;

                    let mcCallback = () => {
                        mv.removeEventListener(egret.MovieClipEvent.COMPLETE, mcCallback, this);
                        game.UIUtils.removeSelf(mv);
                    }

                    mv.addEventListener(egret.MovieClipEvent.COMPLETE, mcCallback, this)
                    this.effectGroup.addChild(mv);
                    switch (direction) {
                        case "mine":
                            mv.x = GameConfig.curWidth() * 0.5;
                            mv.y = GameConfig.curHeight() * 0.75;
                            break;
                        case "left":
                            mv.x = GameConfig.curWidth() * 0.22;
                            mv.y = GameConfig.curHeight() * 0.4;
                            break;
                        case "right":
                            mv.x = GameConfig.curWidth() * 0.77;
                            mv.y = GameConfig.curHeight() * 0.4;
                            break;
                        case "top":
                            mv.x = GameConfig.curWidth() * 0.5;
                            mv.y = GameConfig.curHeight() * 0.2;
                            break;
                    }
                    mv.gotoAndPlay(1, 1);
                }
            });
        }

        /**
        * 刮风下雨
        * @param  {} direction
        * @param  {} effectName
        */
        private addGangAni(effectName, offerX, offerY, scale = 1) {
            GameCacheManager.instance.getMcCache(effectName, effectName, (mv: egret.MovieClip) => {
                if (mv) {
                    let mcCallback = () => {
                        mv.removeEventListener(egret.MovieClipEvent.COMPLETE, mcCallback, this);
                        game.UIUtils.removeSelf(mv);
                    }

                    mv.addEventListener(egret.MovieClipEvent.COMPLETE, mcCallback, this)
                    this.effectGroup.addChild(mv);
                    // game.UIUtils.setAnchorPot(mv);
                    mv.x = offerX;
                    mv.y = offerY;
                    mv.scaleX = mv.scaleY = scale;
                    mv.play(1);
                }
            });
        }


        public getOfferSetPos(direction, effect) {
            let poses = {
                mine: { x: 0, y: 0 },
                left: { x: 0, y: 0 },
                right: { x: 0, y: 0 },
                top: { x: 0, y: 0 },
            }
            switch (effect) {
                case "hu":
                    poses.mine.x = -50;
                    poses.top.x = -50;
                    break;
                case "gsh":

                    break;
            }
            return poses[direction];
        }

        private testAni() {
            // this.taskBar.showAllBtns()
        }

        /**
         * 玩家认输
         * @param  {} direction
         */
        private createRenshuFont(direction) {
            return;
            let roomInfo = Global.gameProxy.roomInfo;
            if (roomInfo.publicCardNum < 1) {
                return;
            }
            //认输使用缓存
            let name = direction + "_renshuImage";
            let image = GameCacheManager.instance.getCache(name, eui.Image) as eui.Image;
            if (!image.source) {
                image.source = RES.getRes("wz_rs_png");
            }
            game.UIUtils.setAnchorPot(image);
            image.alpha = 0;
            this.effectGroup.addChild(image);
            switch (direction) {
                case "mine":
                    image.horizontalCenter = 0;
                    image.bottom = 100;
                    break;
                case "left":
                    image.left = 210;
                    image.verticalCenter = -50;
                    break;
                case "right":
                    image.right = 210;
                    image.verticalCenter = -50;
                    break;
                case "top":
                    image.horizontalCenter = 0;
                    image.top = 100;
                    break;
            }
            egret.Tween.get(image).to({
                alpha: 1
            }, 1000);
        }



        /**
         * 呼叫转移漂分
         * @param  {} direction
         * @param  {} value
         */
        private createHJZYByDirection(direction, value) {
            let name = direction + "_hjzy";
            let hjzyTip = GameCacheManager.instance.getCache(name, HjzyTip) as HjzyTip;
            hjzyTip.showText(value);
            switch (direction) {
                case "mine":
                    hjzyTip.horizontalCenter = -15;
                    hjzyTip.bottom = 130;
                    break;
                case "left":
                    hjzyTip.left = 180;
                    hjzyTip.verticalCenter = -44;
                    break;
                case "right":
                    hjzyTip.right = 180;
                    hjzyTip.verticalCenter = -44;
                    break;
                case "top":
                    hjzyTip.horizontalCenter = -15;
                    hjzyTip.top = 100;
                    break;
            }
            this.effectGroup.addChild(hjzyTip);
            hjzyTip.showAni();
        }

        /**
         * 创建金币减少
         * @param  {} direction
         * @param  {} value
         */0
        private createFontByDirection(direction, value) {
            if (Global.runBack) {
                return;
            }
            let text = value;
            if (value >= 0) {
                text = "+" + value;
            } else {
                text = value + "";
            }
            let label = new eui.BitmapLabel(text)
            if (value >= 0) {
                label.font = "ying_font_fnt"; //RES.getRes("");
            } else {
                label.font = "shu_font_fnt";//RES.getRes("");
            }
            label.text = text;
            label.alpha = 0;
            label.scaleX = label.scaleY = 0.5;
            this.effectGroup.addChild(label);
            let pos = { x: 0, y: 0 };
            game.UIUtils.setAnchorPot(label);
            let endX;
            let endY;
            switch (direction) {
                case "mine":
                    label.x = GameConfig.curWidth() * 0.5 + pos.x;
                    label.y = GameConfig.curHeight() * 0.7 + pos.y;
                    break;
                case "left":
                    label.x = GameConfig.curWidth() * 0.28 + pos.x;
                    label.y = GameConfig.curHeight() * 0.4 + pos.y;
                    break;
                case "right":
                    label.x = GameConfig.curWidth() * 0.72 + pos.x;
                    label.y = GameConfig.curHeight() * 0.4 + pos.y;
                    break;
                case "top":
                    label.x = GameConfig.curWidth() * 0.5 + pos.x;
                    label.y = GameConfig.curHeight() * 0.2 + pos.y;
                    break;
            }

            egret.Tween.get(label).to({
                x: label.x + 30,
                alpha: 1
            }, 300).to({
                alpha: 0
            }, 1000).call(() => {
                game.UIUtils.removeSelf(label);
            });
        }


        /*
         * 更新金币。
         */
        public syncGold(syncData) {
            for (let key in syncData) {
                let dirction = this.directions[key];
                let info = syncData[key].info;
                info.gainGold = info.gainGold;
                info.ownGold = info.ownGold;
                LogUtils.logD("info.gainGold= " + info.gainGold);
                if (dirction == "mine") {
                    Global.gameProxy.getMineGameData().gold = info.ownGold;
                    Global.playerProxy.playerData.gold = info.ownGold;
                    Global.gameProxy.addRecord(syncData[key]);
                }
                if (syncData[key].type == 6) {
                    this.setAutoTimeout(() => {
                        if (info.gainGold < 0) {
                            this.createHJZYByDirection(dirction, info.gainGold);
                        } else {
                            this.createFontByDirection(dirction, info.gainGold);
                        }
                    }, this, 1000);
                } else {
                    this.createFontByDirection(dirction, info.gainGold);
                }
                this.getHeaderByDirection(key).updateGold(info.ownGold);
                //输光了豆子
                if (info.isDefeat) {
                    this.setAutoTimeout(() => {
                        this.createRenshuFont(dirction);
                        if (Global.gameProxy.roomInfo.publicCardNum != 0) {
                            this.huPaiOrGameOver(dirction);
                        }
                    }, this, 1000);
                }
            }
        }

        /**
         * 牌局结束，暂时没有用。
         */
        private roomGameOver(e: egret.Event) {
            let resp = e.data;
        }

        /**
         * 对局结束
         */
        private showDuijuAni(callback: Function) {
            var name = "duijujieshu";
            let image = GameCacheManager.instance.getCache(name, eui.Image) as eui.Image;
            image.source = RES.getRes("duijujieshu_png");
            image.horizontalCenter = -30;
            image.verticalCenter = - 50;
            this.addChild(image);
            image.alpha = 0;
            image.x = image.x - 120;
            egret.Tween.get(image)
                .to({ horizontalCenter: -30, alpha: 0 })
                .to({ horizontalCenter: 30, alpha: 1 }, 1000)
                .to({ alpha: 0 }, 500)
                .wait(1000).call(callback, this);
        }


        private showHuangZhuang(callback: Function) {
            var name = "dzmj_hpts";
            let image = new eui.Image(RES.getRes("dzmj_hpts_png"));
            image.horizontalCenter = -30;
            image.verticalCenter = - 50;
            this.addChild(image);
            image.alpha = 0;
            image.x = image.x - 120;
            egret.Tween.get(image)
                .to({ horizontalCenter: -30, alpha: 0 })
                .to({ horizontalCenter: 30, alpha: 1 }, 1000)
                .to({ alpha: 0 }, 500)
                .wait(1000).call(callback, this).call(() => {
                    game.UIUtils.removeSelf(image);
                    image = null;
                });
        }

        /**
         * 游戏数据结算信息。
         */
        private async settlementData(e: egret.Event) {
            this.restartBtn.visible = false;
            this.majiangStatus = MajiangStatusEnum.OVER;
            this.timeDirectionBar.removeTimer();
            this.tgGroup.visible = false;
            let resp = e.data;
            let players = resp.players;
            this.tgGroup.visible = false;//解决牌局结束，托管不消失。
            this.gameOverShow(players);
            if (resp.winPlayer == -1) {
                this.showHuangZhuang(() => {
                    this.restartBtn.visible = true;
                    this.restartBtn.alpha = 0;
                    egret.Tween.get(this.restartBtn).to({
                        alpha: 1
                    }, 300);
                })
                return;
            }
            this.showDuijuAni(() => {
                if (!Global.gameProxy.roomInfo) {
                    return;
                }
                //修改所有玩家金币至抽水过后的金币
                for (let index in players) {
                    let goldData = players[index];
                    let header = this.getHeaderByDirection(index) as WidgetHeader;
                    goldData.ownGold = goldData.ownGold;
                    header.updateGold(goldData.ownGold);
                }
                let mineData = Global.gameProxy.getMineGameData();
                Global.playerProxy.updatePlayerGold(mineData.gold);
                game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DZMJ_OVER, { players: players, status: resp.status, winPlayer: resp.winPlayer });
            })
        }

        /**
         * 展现漂分动画
         * type score
         * @param  {} scoreData
         */
        private showScoreAni(playerIndex, scoreData) {
            let directionStr = this.directions[playerIndex];
            if (Global.runBack) {
                let playerData = Global.gameProxy.getPlayerByIndex(playerIndex) as PlayerGameDataBean;
                this.getHeaderByDirection(playerIndex).updateGold(playerData.gold);
                return;
            }
            let image = new eui.Image(RES.getRes("over_type_" + scoreData.type + "_png"));
            image.alpha = 0;
            game.UIUtils.resetAnchorPoint(image);
            this.effectGroup.addChild(image);
            game.UIUtils.setAnchorPot(image);
            switch (directionStr) {
                case "mine":
                    image.x = GameConfig.curWidth() * 0.5;
                    image.y = GameConfig.curHeight() * 0.7;
                    break;
                case "left":
                    image.x = GameConfig.curWidth() * 0.24;
                    image.y = GameConfig.curHeight() * 0.4;
                    break;
                case "right":
                    image.x = GameConfig.curWidth() * 0.72;
                    image.y = GameConfig.curHeight() * 0.4;
                    break;
                case "top":
                    image.x = GameConfig.curWidth() * 0.5
                    image.y = GameConfig.curHeight() * 0.2
                    break;
            }
            if (scoreData.score > 0) {
                image.visible = false;
            }
            egret.Tween.get(image).to({ alpha: 1, x: image.x + 50 }, 300).wait(1000).call(() => {
                game.UIUtils.removeSelf(image);
                /**
                 * @param  {} directionStr
                 */
                this.createFontByDirection(directionStr, scoreData.score);
                let playerData = Global.gameProxy.getPlayerByIndex(playerIndex) as PlayerGameDataBean;
                this.getHeaderByDirection(playerIndex).updateGold(playerData.gold);
            }, this)
            // }

        }

        /**
       * 牌局结束显示自己手上的牌。
       */
        private gameOverShow(players) {
            for (var key in players) {
                let data = players[key]
                if (Global.gameProxy.checkIndexIsMe(key)) {
                    let mines = new MineShowPai(data["handCards"], 2);
                    this.mineHuShowGroup.addChild(mines);
                    this.mineHuShowGroup.visible = true;
                    this.mineGroup.removeChildren();
                } else {
                    this.showOthers(data, key);
                }
            }
        }



        /**
           * 牌局结束显示别人手上的牌。
           */
        private showOthers(data, key) {
            //this.directions = MajiangUtils.getDirectionByMine(Global.gameProxy.getMineIndex());
            var players = Global.gameProxy.getPlayers();
            switch (this.directions[key]) {
                case "left":
                    this.leftHuShowGroup.removeChildren();
                    let lefts = new LeftShowPai(data["handCards"], 2);
                    this.leftHuShowGroup.addChild(lefts);
                    this.leftHuShowGroup.visible = true;
                    this.leftGroup.removeChildren();
                    break;
                case "top":
                    this.topHuShowGroup.removeChildren();

                    let tops = new TopShowPai(data["handCards"], 2);
                    this.topHuShowGroup.addChild(tops);
                    this.topHuShowGroup.visible = true;
                    this.topGroup.removeChildren();
                    break;
                case "right":
                    this.rightHuShowGroup.removeChildren();
                    let rights = new RightShowPai(data["handCards"], 2);
                    this.rightHuShowGroup.addChild(rights);
                    this.rightHuShowGroup.visible = true;
                    this.rightGroup.removeChildren();
            }
        }

        //----------右侧3个按钮
        /**
         * 听牌提示按钮
         */
        private tipBtn: eui.Button;
        /**
         * 聊天按钮
         */
        private chatBtn: eui.Button;

        private huTipsBar: HuTipsBar;

        private ctBar: ChatBar;

        public chatBtnTouch() {
            if (!this.ctBar) {
                this.ctBar = new ChatBar();
                this.panelGroup.addChild(this.ctBar);
            }

            if (this.ctBar.visible) {
                this.ctBar.hide();
                return;
            }
            this.ctBar.show();
            this.ctBar.scaleX = this.ctBar.scaleY = 1.5
            this.ctBar.x = GameConfig.curWidth() * 0.8 - this.ctBar.width;
            this.ctBar.y = GameConfig.curHeight() * 0.7 - this.ctBar.height;
        }

        public hideBars() {
            if (this.huTipsBar) {
                this.huTipsBar.hideBar();
            }
            if (this.ctBar) {
                this.ctBar.hideBar();
            }
        }

        /**
         * 听牌提示
         */
        public tipsBtnTouch() {
            if (!this.huTipsBar) {
                this.huTipsBar = new HuTipsBar();
                this.panelGroup.addChild(this.huTipsBar);
            }
            if (this.huTipsBar.visible) {
                this.huTipsBar.hideBar();
                return;
            }
            this.lastHuTips = this.currentTings;
            this.showhupaiBar();
        }

        /**
        * 抢杠胡牌
        */
        private g2p: number = 0;
        private qiangGangHu(e: egret.TouchEvent) {
            this.g2p = 1;
            let resp = e.data;
            let direction = this.directions[resp.playerIndex];
            let color = resp.gangInfo["card"];
            this[direction + 'PgGroup'].add(5, color, 3);
            // this.addEffectAni(direction, "hu");
        }

        //---检查有没有可以胡牌
        public huCards: any[] = [];

        /**
         * 刷新胡牌提示
         */
        public tipsBarFlush() {
            if (!this.huTipsBar) {
                this.huTipsBar = new HuTipsBar();
                this.panelGroup.addChild(this.huTipsBar);
            }
            this.showhupaiBar();
        }

        public showhupaiBar() {
            for (var i = 0; i < this.lastHuTips.length; i++) {
                let huTip = this.lastHuTips[i];
                let count = majiang.MajiangUtils.findValueLess(huTip.value || huTip.card);
                huTip.count = count;
            }
            this.huTipsBar.showBar(this.lastHuTips);
        }

        /**
         * 检查当前手牌能否胡牌
         */
        public updateTingByValue(value) {
            let playerData = Global.gameProxy.getMineGameData();
            if (playerData.hangupTasks && playerData.hangupTasks[5]) {
                let task5 = playerData.hangupTasks[5];
                let tings = task5.tings;
                playerData.tingInfo = this.currentTings = this.getTingArr(tings, value);
                this.tipBtn.visible = this.currentTings.length > 0
            }

        }

        private lastHuTips: any = [];

        private isTingStatus: boolean = false;

        /**
         * 展现胡牌
         */
        private showHuTips() {
            let mineShoupai = this.touchShoupai;
            if (Global.gameProxy.getMineGameData().huCards.length > 0) {
                return;
            }
            let value = mineShoupai.value;
            let mineData = Global.gameProxy.getMineGameData();
            //听牌状态
            if (mineData.hangupTasks && mineData.hangupTasks[5]) {
                let task5 = mineData.hangupTasks[5];
                let tings = task5.tings;
                this.lastHuTips = this.getTingArr(tings, mineShoupai.value);
                this.tipsBarFlush();
            }
        }


        private getTingArr(tings, value) {
            for (let i = 0; i < tings.length; i++) {
                let ting = tings[i];
                if (ting.out == value) {
                    return ting.tings;
                }
            }
            return [];
        }

        /**
         * 检测胡牌提示
         */
        private checkHuTips() {
            let mineData = Global.gameProxy.getMineGameData();
            if (Global.gameProxy.checkIsRoundMe()) {
                let task = mineData.hangupTasks;
                if (task && task[5]) {
                    let tings = task[5].tings
                    for (let i = 0; i < tings.length; i++) {
                        let data = tings[i].out;
                        this.mineShoupaiGroup.showHuTipsByValue(data);
                    }
                }
            }
        }
        //-------游戏内提示
        private gameTipsGroup: eui.Group;
        private gameTipsLabel: eui.Label;
        private gameTipTimeOut;
        private currentTipsType: number;

        private gameTipsLabel2: eui.Label;
        private gameTipsGroup2: eui.Group;

        private showGameTipGroup2() {
            this.gameTipsGroup2.visible = true;
            this.gameTipsLabel2.text = "牌局结束前离开可能收不到花猪和退税的收入";
            this.gameTipsGroup2.visible = true;
            this.gameTipsGroup2.alpha = 1;
        }

        private showGameTipGroup(type) {
            if (this.currentTipsType == 3) {
                return;
            }
            this.currentTipsType = type;
            egret.clearTimeout(this.gameTipTimeOut);
            egret.Tween.removeTweens(this.gameTipsGroup);
            this.gameTipsGroup.visible = true;
            this.gameTipsGroup.alpha = 1;
            if (type == 1) {
                this.gameTipsLabel.text = "你是庄家,请先出牌";
            } else if (type == 2) {
                this.gameTipsLabel.text = "牌局结束未打完缺牌会被扣分哦";
            } else if (type == 3) {
                this.gameTipsLabel.text = "胡牌后将由系统代打";
            }
            if (type != 3) {
                this.gameTipTimeOut = this.setAutoTimeout(() => {
                    this.closeGameTipsGroup();
                }, this, 2000);
            }
        }

        private closeGameTipsGroup() {
            if (this.currentTipsType == 3) {
                return;
            }
            egret.clearTimeout(this.gameTipTimeOut);
            this.gameTipTimeOut = null;
            egret.Tween.get(this.gameTipsGroup).to({
                alpha: 0
            }, 200).call(() => {
                this.gameTipsGroup.visible = false;
                this.gameTipsGroup.alpha = 1;
            })

        }


        private checkShowTips() {
            let roomInfo = Global.gameProxy.roomInfo;
            if (roomInfo.curPlay != Global.gameProxy.getMineIndex()) {
                return;
            }
            //显示庄家提示
            if (roomInfo.publicCardNum == 144 && roomInfo.dealer == Global.gameProxy.getMineIndex()) {
                this.showGameTipGroup(1);
            }
        }

        //new
		/**
		 * 打开游戏界面通知
		 */
        public GAME_SCENE_NOTIFY: string = SceneNotify.OPEN_DZMJ;

		/**
		 * 关闭游戏界面通知
		 */
        public HALL_SCENE_NOTIFY: string = SceneNotify.OPEN_DZMJ_HALL;

		/**
		 * 关闭当前界面通知
		 */
        public CLOSE_NOTIFY: string = SceneNotify.CLOSE_DZMJ;

		/**
		 * 对应匹配界面通知
		 */
        public MATCHING_SCENE_NOTIFY: string = SceneNotify.OPEN_DZMJ_MATCHING;
    }
}
