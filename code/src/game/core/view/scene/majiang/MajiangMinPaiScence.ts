module majiang {
    export class MajiangMinPaiScene extends game.BaseScene {
        public pmdKey: string = "mjxlch";
        //计时器组件
        private timeDirectionBar: TimerDirectionBar;
        //x血流还是血战
        private wanfaImage: eui.Image;
        //底注
        private dizhu: eui.Label;
        //房间信息
        private roomIdLable: eui.Label;
        //ui麻将牌组
        private uiGroup: eui.Group;
        //碰牌和杠牌
        private leftPgGroup: MjLeftGroup;
        private rightPgGroup: MjRightGroup;
        private topPgGroup: MjTopGroup;
        private minePgGroup: MjMineGroup;

        //剩余多少牌
        private syLabel: eui.BitmapLabel;

        //我出牌UI
        private mineChupaiGroup: MineChupaiGroup;

        private topChupaiGroup: TopChupaiGroup;

        private leftChupaiGroup: LeftChupaiGroup;

        private rightChupaiGroup: RightChupaiGroup;

        private mainGroup: eui.Group;

        private directions: any;

        //EXML中对应id为tweenGroup的动画组对象
        private dingque: egret.tween.TweenGroup;

        // EXML中对应id为button的按钮对象
        private player: eui.Button;

        //选中的手牌
        private hszShoupaiArr: MineShoupai[] = [];
        private touchShoupai: MineShoupai;
        //换三张提示
        private hszBar: HSZBar;
        //换三张
        private topHsz: eui.Group;
        private rightHsz: eui.Group;
        private leftHsz: eui.Group;
        private mineHsz: eui.Group;
        private majiangStatus: MajiangStatusEnum;
        //胡牌group
        private mineHupaiGroup: MajiangHupaiGroup;
        private leftHupaiGroup: MajiangHupaiGroup;
        private rightHupaiGroup: MajiangHupaiGroup;
        private topHupaiGroup: MajiangHupaiGroup;
        //胡牌展示group
        private leftPai: LeftShowPai;
        private rightPai: RightShowPai;
        private topPai: TopShowPai;
        private minePai: MineShowPai;

        //胡牌展示group
        private leftHuShowGroup: LeftShowPai;
        private rightHuShowGroup: RightShowPai;
        private topHuShowGroup: TopShowPai;
        private mineHuShowGroup: MineShowPai;

        private exitBtn: eui.Button;

        private duijujieshu: eui.Image;
        //----UI层级

        //动画效果的group
        private effectGroup: eui.Group;
        //可点击的层级
        private touchGroup: eui.Group;
        //提示警报
        private msg_jinbao: eui.Image;
        //是否显示过

        private roomInfo: any;

        private paiQiang: PaiQiangComponent;

        private showQingqueTipState: boolean = false;

        private isShowHszTip = false;

        private auto = true;

        private nextBtn: eui.Button;

        private startBtn: eui.Button;

        private restartBtn: eui.Button;

        private isAuto: boolean;
        public constructor(isAuto: boolean = false) {
            super();
            this.isAuto = isAuto;
            this.skinName = new majiang.MajiangMingPaiSceneSkin();
        }

        public onRemoved() {
            super.onRemoved();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
        }

        /**
         * time
         */
        private time2Next(time, callback) {
            egret.setTimeout(() => {
                if (this.auto) {
                    callback();
                } else {
                    this.lastCallback = callback;
                }
            }, this, time);
        }

        public onTouchTap(e: egret.TouchEvent) {
            switch (e.target) {
                case this.nextBtn:
                    if (this.lastCallback) {
                        this.lastCallback()
                    }
                    break;
                case this.exitBtn:
                    ReplayData.data = null;
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_CESI);
                    break;
                case this.startBtn:
                    this.startReplay();
                    this.startBtn.visible = false;
                    break;
                case this.restartBtn:
                    ReplayData.data = JSON.parse(this.backStr);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_CESI);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_CESI, true);
                    break;
            }
        }



        private findPlayerByIndex(index) {
            return this.roomInfo.players[index];
        }


        private s_roomInfo(itemData, callback) {
            this.roomInfo = _.clone(itemData) as GameRoomInfoBean;
            //渲染room信息
            this.roomIdLable.text = "房间编号：" + this.roomInfo.roundId;
            let gameId = this.roomInfo.gameId;
            let sceneId = this.roomInfo.sceneId;
            let gameConfig = Global.gameProxy.getSceneConfigByGame(gameId, sceneId);
            this.dizhu.text = "底注:" + gameConfig.bet_base;
            if (gameId == "mjxlch") {
                this.wanfaImage.source = RES.getRes("xlch_hsz_png");
            } else {
                this.wanfaImage.source = RES.getRes("xzdd_hsz_png");
            }

            this.directions = MajiangUtils.getDirectionByMine(1);
            this.showHeaders();
            if (this.auto) {
                callback();
            } else {
                this.lastCallback = callback;
            }
        }


        private s_startNewRound(itemData, callback) {
            let dealer = itemData.dealer;
            let direction = this.directions[dealer];
            let header: WidgetHeader = this[direction + 'Header'];
            header.showIsZhuang(true);
            this.paiQiang.showPaiQiangByData(this.directions, this.roomInfo);
            this.paiQiang.reloadPaiQiangByRoomInfo(55);
            if (this.auto) {
                callback();
            } else {
                this.lastCallback = callback;
            }
        }

        private hszTipBar: HSZTipBar;
        public showHSZSucTip(type) {
            this.hszTipBar = new HSZTipBar(type);
            this.touchGroup.addChild(this.hszTipBar);
            this.hszTipBar.horizontalCenter = 0;
            this.hszTipBar.verticalCenter = -42;
            egret.setTimeout(() => {
                game.UIUtils.removeSelf(this.hszTipBar);
            }, this, 1500);
        }

        private hszOver() {
            let players = this.roomInfo.players;
            for (let key in players) {
                let playerIndex = Number(key);
                let dir = this.directions[playerIndex];
                let playerData = this.findPlayerByIndex(playerIndex);
                let paiComp = this[dir + 'Pai'];
                if (paiComp.updateShoupai && paiComp.clearGaidong) {
                    paiComp.clearGaidong();
                    paiComp.updateShoupai(playerData.cards);
                }
                let cards = playerData.selectedHsz;
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i];
                    if (paiComp.selectUpOrDown) {
                        paiComp.selectUpOrDown(card, false);
                    }
                }
            }
        }

        private async s_HSZCardExchanged(itemData, callback) {
            if (!this.isShowHszTip) {
                this.isShowHszTip = true;
                this.showHSZSucTip(itemData.type);
            }
            // egret.setTimeout(() => {
            let type = itemData.type;
            let cards = itemData.cards;
            let playerIndex = itemData.playerIndex;
            let playerData = this.findPlayerByIndex(playerIndex);
            playerData.selectedHsz = cards
            // let paiComp = this[dir + 'Pai'];
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                this.updateWanjiaShoupai(playerIndex, card, 1);
            }
            // }, this, 2000);

            callback();
        }


        private updateShengyu() {
            this.syLabel.text = this.roomInfo.remain;
        }

        private s_initHandCards(itemData, callback) {
            let cards = itemData.cards;
            this.roomInfo.remain = itemData.remain;
            let player = this.findPlayerByIndex(itemData.playerIndex);
            player.cards = cards;
            let cardsArr = MajiangUtils.getCardArrByIndex(player);
            this.showPlayerPai(player.cards, itemData.playerIndex)
            this.updateShengyu();
            if (this.auto) {
                callback();
            } else {
                this.lastCallback = callback;
            }
        }

        /**
      * 牌局结束显示自己手上的牌。
      */
        private showPlayerPai(arr, index) {
            if (index == 1) {
                this.minePai = new MineShowPai(arr, 2);
                this.mineHuShowGroup.addChild(this.minePai);
                this.mineHuShowGroup.visible = true;
            } else if (index == 2) {
                this.rightPai = new RightShowPai(arr, 2);
                this.rightHuShowGroup.addChild(this.rightPai);
                this.rightHuShowGroup.visible = true;
            } else if (index == 3) {
                let tops = new TopShowPai(arr, 2);
                this.topHuShowGroup.addChild(tops);
                this.topHuShowGroup.visible = true;
                this.topPai = tops;
            } else if (index == 4) {
                let lefts = new LeftShowPai(arr, 2);
                this.leftHuShowGroup.addChild(lefts);
                this.leftHuShowGroup.visible = true;
                this.leftPai = lefts;
            }
        }


        /**
         * 展现玩家头像
         */
        private showHeaders() {
            let players = this.roomInfo.players;
            for (let key in players) {
                let dir = this.directions[key];
                let header: WidgetHeader = this[dir + 'Header'];
                header.initWithData(players[key], dir);
                header.visible = true;
            }
        }

        private createBefore() {
            let arr = [1, 1, 1, 1, 1, 1];
            async.eachSeries(arr, (index, callback) => {
                let item = this.replayData.shift();
                this[item.route](_.clone(item.msg), callback);
            }, () => {
                this.paiQiang.reloadPaiQiangByRoomInfo(this.roomInfo);
                if (this.isAuto) {
                    this.startReplay();
                    this.startBtn.visible = false;
                }
            });
        }

        private startReplay() {
            async.eachSeries(this.replayData, (item: any, callback) => {
                this.lastCallback = null;
                if (this[item.route]) {
                    this[item.route](item.msg, callback);
                } else {
                }
            });
        }

        private s_playerSelectColor(itemData, callback) {
            callback();
        }

        private s_playerGangCard(itemData, callback) {
            let card = itemData.card, from = itemData.from, gangType = itemData.gang, playerIndex = itemData.playerIndex;
            let targets = itemData.targets;

            let direction = this.directions[playerIndex];
            var playerData = this.findPlayerByIndex(playerIndex) as PlayerGameDataBean;
            playerData.lastCard = 0;
            //记录玩家杠牌
            this.recordPlayerGang(card, playerIndex, gangType);
            this.updatePlayerShouPai(playerIndex);
            this.addEffectAni(direction, "gang");

            this.hideChupaiTips();
            switch (gangType) {
                case 1://碰变杠,吊4个正面，巴雨
                    // this.addGangAni("right", "xiayu", GameConfig.curWidth() * 0.5, GameConfig.curHeight() * 0.3);
                    // this.addGangAni("right", "guafeng", GameConfig.curWidth() * 0.41, GameConfig.curHeight() * 0.24);
                    this.addGangAni("guafeng", GameConfig.curWidth() * 0.5 + 5, GameConfig.curHeight() * 0.4 + 5, 2);
                    break;
                case 4://调1个正面，3个背面。暗杠，起手就有三张，摸一张。
                    this.addGangAni("xiayu", GameConfig.curWidth() * 0.5 + 10, GameConfig.curHeight() * 0.4 + 5);
                    break;
                case 2://调1个正面，3个背面。暗杠，起手就有四张。不一定第一轮就杠，可能会过几轮。
                    this.addGangAni("xiayu", GameConfig.curWidth() * 0.5 + 10, GameConfig.curHeight() * 0.4 + 5);
                    // group.removeLastPai();
                    //手上四张暗杠
                    break;
                case 3://点杠
                    let lastDirection = this.directions[from];
                    this[lastDirection + "ChupaiGroup"].removeLastChupai();
                    this.addGangAni("guafeng", GameConfig.curWidth() * 0.5 + 5, GameConfig.curHeight() * 0.4 + 5, 2);
                    break;
            }

            let cardArr = MajiangUtils.getCardArrByIndex(playerData);

            //以上玩家数据修改 以下 玩家UI修改
            switch (gangType) {
                case 1://碰变杠,吊4个正面，巴雨
                    switch (direction) {
                        case "left":
                            this.leftPai.updateShoupaiByArr(cardArr)
                            this.leftPgGroup.add(1, card, 1);
                            break;
                        case "right":
                            this.rightPai.updateShoupaiByArr(cardArr)
                            this.rightPgGroup.add(1, card, 1);
                            break
                        case "top":
                            this.topPai.updateShoupaiByArr(cardArr)
                            this.topPgGroup.add(1, card, 1);
                            break;
                        case "mine":
                            this.minePai.updateShoupaiByArr(cardArr)
                            this.minePgGroup.add(1, card, 1);
                            break;
                    }
                    // majiang.MajiangUtils.playHPGSound(playerData.sex, 2);
                    break;
                case 4://调1个正面，3个背面。暗杠，起手就有三张，摸一张。
                    switch (direction) {
                        case "left":
                            this.leftPgGroup.add(4, card);
                            break;
                        case "right":
                            this.rightPgGroup.add(4, card);
                            break
                        case "top":
                            this.topPgGroup.add(4, card);
                            break;
                        case "mine":
                            this.minePgGroup.add(4, card);
                            break;
                    }
                    // majiang.MajiangUtils.playHPGSound(playerData.sex, 3);
                    break;
                case 2://调1个正面，3个背面。暗杠，起手就有四张。不一定第一轮就杠，可能会过几轮。

                    switch (direction) {
                        case "left":
                            this.leftPgGroup.add(2, card);
                            break;
                        case "right":
                            this.rightPgGroup.add(2, card);
                            break
                        case "top":
                            this.topPgGroup.add(2, card);
                            break;
                        case "mine":
                            this.minePgGroup.add(2, card);
                            break;
                    }
                    // majiang.MajiangUtils.playHPGSound(playerData.sex, 3);
                    break;
                case 3://碰变杠,调4个正面，这里是自己碰，别人点。

                    switch (direction) {
                        case "left":
                            this.leftPgGroup.add(3, card);
                            break;
                        case "right":
                            this.rightPgGroup.add(3, card);
                            break;
                        case "top":
                            this.topPgGroup.add(3, card);
                            break;
                        case "mine":
                            this.minePgGroup.add(3, card);
                            break;
                    }
                    // majiang.MajiangUtils.playHPGSound(playerData.sex, 2);
                    break;
            }
            this.time2Next(times.s_playerGangCard, callback);
        }




        private s_playerSelectHSZ(itemData, callback) {
            let cards = itemData.cards;
            let playerIndex = itemData.playerIndex;
            let playerData = this.findPlayerByIndex(playerIndex);
            let dir = this.directions[playerIndex];
            let paiComp = this[dir + 'Pai'];
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                this.updateWanjiaShoupai(playerIndex, card, -1);
                if (paiComp.selectUpOrDown) {
                    paiComp.selectUpOrDown(card, true);
                }
            }
            this.time2Next(times.s_playerSelectHSZ, callback)
        }

        private enterFrame() {
            if (this.lastCallback && !this.auto) {
                this.nextBtn.visible = true
            } else {
                this.nextBtn.visible = false;
            }
        }

        private renderHupaiGroup() {
            for (let i = 1; i <= 4; i++) {
                let direction = this.directions[i];
                let hupaiGroup: MajiangHupaiGroup = this[direction + "HupaiGroup"];
                hupaiGroup.removeChildren();
                hupaiGroup.initWithDirection(direction);
                hupaiGroup.visible = true;
                hupaiGroup.initWithArr([]);
            }
        }

        private s_passTask(itemData, callback) {
            callback();
        }


        private s_trustee(itemData, callback) {
            callback();
        }


        private replayData: any;
        private backStr = "";
        public createChildren() {
            super.createChildren();
            let newData = [];
            this.backStr = JSON.stringify(ReplayData.data);
            this.replayData = ReplayData.data;
            this.createBefore();
            this.renderHupaiGroup();
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
        }

        /**
         * 换三张结束
         */
        private s_roomHSZFinished(itemData, callback) {
            if (this.auto) {
                egret.setTimeout(() => {
                    this.hszOver();
                }, this, 2000);
            } else {
                this.hszOver();
            }
            egret.setTimeout(callback, this, 4000);
        }

        /**
         * 定缺结束
         */
        private s_playerColorSelected(itemData, callback) {
            let players = itemData.players;
            for (let key in players) {
                let playerData = this.findPlayerByIndex(key);
                playerData.selectColor = players[key];
                this.getHeaderByDirection(key);
            }
            //差一个动画
            this.dingqueOver(players);
            for (let key in players) {
                let playerData = this.findPlayerByIndex(key);
                let dir = this.directions[key];
                let paiComp = this[dir + 'Pai'];
                let cards = MajiangUtils.getCardArrByIndex(playerData);
                if (paiComp.updateShoupai && paiComp.clearGaidong) {
                    paiComp.updateShoupaiByArr(cards);
                }
            }
            this.time2Next(times.s_playerColorSelected, callback);
        }


        /**
         * 定缺完毕
         */
        private dingqueOver(player) {
            //重新排序手牌
            let roomInfo = this.roomInfo;
            roomInfo.curPlay = roomInfo.dealer;
            let direction = this.directions[roomInfo.curPlay];
            //定缺动画
            for (let i in player) {
                let name = i + "_DqImage";
                let image = GameCacheManager.instance.getCache(name, eui.Image) as eui.Image;
                image.width = image.height = 100;
                switch (this.directions[i]) {
                    case "left":
                        image.x = GameConfig.curWidth() / 2 - 190; //这里是获取中间计时器的坐标。计时器不偏离，这个就不得偏离。
                        image.y = GameConfig.curHeight() / 2 - 100;
                        break;
                    case "right":
                        image.x = GameConfig.curWidth() / 2 + 110;
                        image.y = GameConfig.curHeight() / 2 - 100;
                        break;
                    case "top":
                        image.x = GameConfig.curWidth() / 2 - 40;
                        image.y = GameConfig.curHeight() / 2 - 215;
                        break;
                    case "mine":
                        image.x = GameConfig.curWidth() / 2 - 40;
                        image.y = GameConfig.curHeight() / 2 + 25;
                        break;

                }
                this.dqtubiao(player[i], image);
                this.effectGroup.addChild(image);
                this.dqDonghua(i, player[i], image);
            }




        }

        /**
         * 定缺动画
         */
        public dqDonghua(i, pi, img) {
            let tw = egret.Tween.get(img);
            tw.to({ scaleX: 1, scaleY: 1 }, 300).to({}, 300).to({ x: this.getHeaderByDirection(i).x + 133.5, y: this.getHeaderByDirection(i).y - 19, scaleX: 0.35, scaleY: 0.35 }, 500).call(() => {
                // img.visible = false;
                game.UIUtils.removeSelf(img);
                this.getHeaderByDirection(i).showColor(pi);

            });//这里是获得头像的坐标。

        }

        /**
         * 定缺图标赋值
         */
        public dqtubiao(nums, img) {

            if (nums == 1) {
                img.source = "dq_color_1_png";

            }
            if (nums == 2) {
                img.source = "dq_color_2_png";

            }
            if (nums == 3) {
                img.source = "dq_color_3_png";

            }
        }

        private lastPlayCard;
        private lastCallback;
        /**
         * 玩家出牌
         */
        private s_playCard(itemData, callback) {
            let playerIndex = itemData.playerIndex;
            let card = itemData.card;
            let playerData = this.findPlayerByIndex(playerIndex);
            this.updateWanjiaShoupai(playerIndex, card, -1);
            playerData.lastCard = 0;
            let paiComp = this[this.directions[playerIndex] + 'Pai'];
            let cards = MajiangUtils.getCardArrByIndex(playerData);
            paiComp.updateShoupaiByArr(cards);
            this.showChupaiAni1(playerIndex, card);
            this.time2Next(times.s_playCard, callback);
            // MajiangUtils.playCardSound(playerData.sex, card);
        }

        private s_newCard(itemData, callback) {
            let playerIndex = itemData.playerIndex;
            let card = itemData.card;
            this.roomInfo.remain = itemData.remain;
            this.updateShengyu();
            let playerData = this.findPlayerByIndex(playerIndex);
            playerData.lastCard = card;
            this.updateWanjiaShoupai(playerIndex, card, 1);
            let cards = MajiangUtils.getCardArrByIndex(playerData);
            let paiComp = this[this.directions[playerIndex] + 'Pai'];
            paiComp.updateShoupaiByArr(cards);
            this.paiQiang.removeNumByIndex();
            this.time2Next(times.s_newCard, callback);
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
                    break;
                case "right":
                    game.UIUtils.setUI2CenterY(tempChupai);
                    tempChupai.x = GameConfig.curWidth() * 0.7;
                    tempChupai.y -= 50;
                    targetMajiang = this.rightChupaiGroup.addChupai(value);
                    targetMajiang.visible = false;
                    break;
                case "top":
                    game.UIUtils.setUI2CenterX(tempChupai);
                    tempChupai.y = GameConfig.curHeight() * 0.2;
                    targetMajiang = this.topChupaiGroup.addChupai(value);
                    targetMajiang.visible = false;
                    break;
            }
            game.UIUtils.setAnchorPot(tempChupai);
            tempChupai.scaleX = 0;
            tempChupai.scaleY = 0;
            let pos = targetMajiang.localToGlobal();
            this.lastPlayCard = targetMajiang;
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


        /**
         * 显示出牌的提示
         * @param  {eui.Component} image
         */
        private chupaiTips: eui.Image;
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
                    // this.chupaiTips.verticalCenter = widthHalf
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
         * 轮到谁
         */
        private s_curPlay(itemData, callback) {
            this.roomInfo.curPlay = itemData.curPlay;
            this.timeDirectionBar.showLightByDirection(this.directions[this.roomInfo.curPlay]);
            callback();
        }


        private s_hangupTask(itemData, callback) {
            callback();
        }


        /**
         * 胡碰杠
         * @param  {} direction
         * @param  {} effectName
         */
        private addEffectAni(direction, effectName) {
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

        private hideChupaiTips() {
            this.lastPlayCard = null;
            if (this.chupaiTips) {
                this.chupaiTips.visible = false;
                egret.Tween.removeTweens(this.chupaiTips);
            }
        }

        private s_playerReconnect(itemData, callback) {
            callback();
        }

        private s_playerOffline(itemData, callback) {
            callback();
        }

        /**
         * 更新玩家手牌
         */
        private updatePlayerShouPai(playerIndex) {
            let direction = this.directions[playerIndex];
            let playerData = this.findPlayerByIndex(playerIndex);
            let cardArr = MajiangUtils.getCardArrByIndex(playerData);
            let pai = this[direction + "Pai"];
            pai.updateShoupaiByArr(cardArr, 2);

        }

        /**
         * 玩家碰牌
         */
        private s_playerPengCard(itemData, callback) {
            let card = itemData.card;
            let playerIndex = itemData.playerIndex;
            this.updateWanjiaShoupai(playerIndex, card, -2);
            this.updatePlayerShouPai(playerIndex);
            game.UIUtils.removeSelf(this.lastPlayCard);
            let direction = this.directions[playerIndex];
            //播放碰牌动画
            let lastDirection = this.directions[itemData.from];
            this[lastDirection + "ChupaiGroup"].removeLastChupai();
            this.addEffectAni(direction, "peng");
            this.hideChupaiTips();
            let playerData = this.findPlayerByIndex(playerIndex);
            let cards = MajiangUtils.getCardArrByIndex(playerData);
            switch (direction) {
                case "left":
                    //这里Add方法里面的两个参数第一个是1，2，3.1代表碰，2明杠，3暗杠。   color是牌面的花色值,还有个可选参数pbg?即碰变杠。
                    this.leftPgGroup.add(5, card);
                    break;
                case "right":
                    this.rightPgGroup.add(5, card);
                    break;
                case "top":
                    this.topPai.updateShoupaiByArr(cards, 2);
                    this.topPgGroup.add(5, card);
                    break;
                case "mine":
                    this.minePgGroup.add(5, card);
                    break;
            }
            this.time2Next(times.s_playerPengCard, callback);
            //播放碰牌音效
            // majiang.MajiangUtils.playHPGSound(playerData.sex, 1);

        }

        /**
         * 获取玩家头像
         * @param  {number} index
         */
        private getHeaderByDirection(index): WidgetHeader {
            return this[this.directions[index] + "Header"]
        }

        /**
		 * 更新玩家手牌
		 * @param  {} value
		 */
        public updateWanjiaShoupai(playerIndex, value, addNum) {
            let mineData: PlayerGameDataBean = this.findPlayerByIndex(playerIndex);
            var cards = mineData.cards;
            var num = cards[value];
            if (!num) {
                if (addNum > 0) {
                    cards[value] = addNum;
                }
            } else {
                num += addNum;
                if (num < 1) {
                    delete cards[value];
                } else {
                    cards[value] = num;
                }
            }
        }

        /**
         * 同步金币
         */
        public s_syncGold(itemData, callback) {
            // egret.setTimeout(() => {
            this.syncGold(itemData);
            this.time2Next(times.s_syncGold, callback);
            // }, this, 200)
        }

        /*
         * 更新金币。
         */
        public syncGold(syncData) {
            for (let key in syncData) {
                let dirction = this.directions[key];
                let info = syncData[key].info;
                if (syncData[key].type == 6) {
                    egret.setTimeout(() => {
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
                    egret.setTimeout(() => {
                        this.createRenshuFont(dirction);
                    }, this, 1000);
                }
            }
        }

        /**
         * 玩家认输
         * @param  {} direction
         */
        private createRenshuFont(direction) {
            let roomInfo = this.roomInfo;
            if (roomInfo.remain < 1) {
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
         */
        private createFontByDirection(direction, value) {
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

        /**
		 * 记录玩家杠牌
		 * @param  {} resp
		 */
        public recordPlayerGang(card, playerIndex, gangType) {
            this.updateWanjiaShoupai(playerIndex, card, -1);
            this.updateWanjiaShoupai(playerIndex, card, -1);
            this.updateWanjiaShoupai(playerIndex, card, -1);
            this.updateWanjiaShoupai(playerIndex, card, -1);
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

        public g2p: number = 0;
        private s_cancelGangForQG(itemData, callback) {
            this.g2p = 1;
            let direction = this.directions[itemData.playerIndex];
            let color = itemData.gangInfo["card"];
            this[direction + 'PgGroup'].add(5, color, 3);
        }

        /**
         * 玩家胡牌
         */
        private s_playerHu(itemData, callback) {
            let card = itemData.card, from = itemData.from, gsh = itemData.gsh, isZM = itemData.isZM, playerIndex = itemData.playerIndex;
            let mainCard = itemData.mainCard;
            let direction = this.directions[playerIndex];
            this.hideChupaiTips();
            let player = this.findPlayerByIndex(playerIndex);
            if (isZM) {
                this.updateWanjiaShoupai(playerIndex, card, -1);
                this.updatePlayerShouPai(playerIndex);
                player.lastCard = 0;
                if (gsh.gsh) {
                    this.addEffectAni(direction, "gsh")
                } else {
                    this.addEffectAni(direction, "zimo")
                }
                this[direction + "HupaiGroup"].addHu(itemData, 2);
                // majiang.MajiangUtils.playHPGSound(huPlayerData.sex, 4);
            } else {
                //点炮
                let lastDirection = this.directions[from];
                this.addEffectAni(direction, "hu");
                if (this.g2p == 1) {
                    egret.setTimeout(() => {
                        this[direction + "HupaiGroup"].addHu(itemData, 1);
                    }, this, 400)
                } else {
                    let time = this[lastDirection + "ChupaiGroup"].showDianpaoAni(mainCard);
                    egret.setTimeout(() => {
                        this[direction + "HupaiGroup"].addHu(itemData, 1);
                    }, this, time)
                }
                this.g2p = 0;
                // majiang.MajiangUtils.playHPGSound(huPlayerData.sex, 5);
            }
            this.time2Next(times.s_playerHu, callback);
        }

        private isOver: boolean = false;
        private s_roundSettlement(itemData, callback) {
            if (this.isOver) {
                callback();
                return;
            }
            this.isOver = true;
            let players = itemData.players;
            this.showDuijuAni(() => {
                this.checkChajiao(itemData.options.hpts, () => {
                    // game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_JIESUAN, { players: players, status: resp.status });
                });
            })
            this.time2Next(3000, callback);
        }



        private s_roundRoomResult(itemData, callback) {
            callback();

        }

        /**
         * 花猪和查大叫
         * type 3 : 5 一组
         * @param  {} records
         */
        private checkChajiao(records, callback) {
            let huazuArr = records[4] || {};
            let chajiaoArr = records[3] || {};
            let roomInfo = this.roomInfo;
            let data = {};
            for (let playerIndex in roomInfo.players) {
                let playerData = roomInfo.players[playerIndex] as PlayerGameDataBean;
                if (huazuArr[playerIndex]) {
                    let score = huazuArr[playerIndex];
                    playerData.gold += score.gainGold;
                    data[playerIndex] = { score: score.gainGold, type: 4 };
                } else if (chajiaoArr[playerIndex]) {
                    let score = chajiaoArr[playerIndex];
                    playerData.gold += score.gainGold;
                    data[playerIndex] = { score: score.gainGold, type: 3 };
                }
            }
            let time = 0;
            for (var key in data) {
                time = 3000;
                this.showScoreAni(key, data[key]);
            }
            egret.setTimeout(() => {
                this.checkTuishui(records, callback);
            }, this, time);
            // let myLiushui = records[Global.gameProxy.getMineIndex()];
        }


        /**
         * 退税
         * @param  {} records
         */
        private checkTuishui(records, callback) {
            let tuishuiArr = records[5] || {};
            let roomInfo = this.roomInfo;
            if (!roomInfo) {
                return;
            }
            let data = {};
            for (let playerIndex in roomInfo.players) {
                let playerData = roomInfo.players[playerIndex] as PlayerGameDataBean;
                if (tuishuiArr[playerIndex]) {
                    let score = tuishuiArr[playerIndex];
                    playerData.gold += score.gainGold;
                    data[playerIndex] = { score: score.gainGold, type: 5 };
                }
            }
            let time = 0;
            for (var key in data) {
                time = 3000;
                if (data[key].score != 0) {
                    this.showScoreAni(key, data[key]);
                }
            }
            egret.setTimeout(() => {
                callback();
                this.restartBtn.visible = true;
            }, this, time);

        }

        /**
         * 展现漂分动画
         * type score
         * @param  {} scoreData
         */
        private showScoreAni(playerIndex, scoreData) {
            let directionStr = this.directions[playerIndex];
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
                let playerData = this.findPlayerByIndex(playerIndex) as PlayerGameDataBean;
                this.getHeaderByDirection(playerIndex).updateGold(playerData.gold);
            }, this)
            // }

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
    }
}

enum times {
    s_playCard = 1500,
    s_playerSelectHSZ = 10,
    s_playerColorSelected = 2000,
    s_newCard = 1000,
    s_playerPengCard = 2000,
    s_playerGangCard = 2000,
    s_syncGold = 2000,
    s_playerHu = 2000
}