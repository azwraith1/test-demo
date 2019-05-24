module majiang {
    export class MajiangScene extends game.BaseScene {
        public pmdKey: string = "mjxlch";
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

        //选中的手牌
        private hszShoupaiArr: MineShoupai[] = [];
        private touchShoupai: MineShoupai;
        //最大手牌可以同时选定
        private maxTouchShoupai: number = 0;
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
        private leftHuShowGroup: LeftShowPai;
        private rightHuShowGroup: RightShowPai;
        private topHuShowGroup: TopShowPai;
        private mineHuShowGroup: MineShowPai;

        private exitBtn: eui.Button;
        private gmBtn: eui.Button;
        private gmStop: eui.Button;
        private gmRun: eui.Button;
        private chupaiTips: eui.Image;
        private duijujieshu: eui.Image;

        //右上角功能按钮
        public gnBtn: eui.Button;
        //功能组
        private gnGroup: eui.Group;
        private btn_shou: eui.Button;
        private btn_set: eui.Button;
        private btn_help: eui.Button;
        public mj_btn_fdsx: eui.Button;
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
        private
        //底注
        private dizhu: eui.Label;
        //提示警报
        private msg_jinbao: eui.Image;
        //提示其他玩家正在选择。
        public otherChose: eui.Group;
        //房间信息
        private roomIdLable: eui.Label;
        //x血流还是血战
        private wanfaImage: eui.Image;

        private hzBtn: eui.Button;

        private timeLabel: eui.Label;

        //是否显示过
        private showQingqueTipState: boolean = false;
        public constructor() {
            super();
            this.skinName = new majiang.MajiangSceneSkin();
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
            this.syLabel.text = "108";
            Global.gameProxy.roomInfo.publicCardNum = 108;
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
                    minePai.y -= minePai.height / 2;
                    egret.Tween.get(minePai).to({
                        y: y
                    }, 150);
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
            async.eachSeries(sortDir, (index, callback) => {
                if (index == Global.gameProxy.playerInfo.playerIndex) {//Global.gameProxy.playerInfo.playerIndex){
                    this.mineFapaiAni(1);
                } else {
                    this.otherFapaiAni(index, 1)
                }
                this.updateSypai();
                this.removePaiQiang(4);
                egret.setTimeout(callback, this, GameConfig.time_config['200']);
            }, () => {
                this.fapaiRound2(sortDir);
            })
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
            async.eachSeries(sortDir, (index, callback) => {
                if (index == Global.gameProxy.playerInfo.playerIndex) {//Global.gameProxy.playerInfo.playerIndex){
                    this.mineFapaiAni(5);
                } else {
                    this.otherFapaiAni(index, 5)
                }
                this.updateSypai();
                this.removePaiQiang(4);
                egret.setTimeout(callback, this, GameConfig.time_config['200']);
            }, () => {
                this.fapaiRound3(sortDir);
            });
        }


        /**
         * 第三轮发牌
         */
        private fapaiRound3(sortDir) {
            async.eachSeries(sortDir, (index, callback) => {
                if (index == Global.gameProxy.playerInfo.playerIndex) {
                    this.mineFapaiAni(9);
                } else {
                    this.otherFapaiAni(index, 9)
                }
                this.updateSypai();
                this.removePaiQiang(4);
                egret.setTimeout(callback, this, GameConfig.time_config['200']);
            }, () => {
                this.fapaiRound4(sortDir);
            });
        }


        /**
        * 第四轮发牌，发完牌过后吧主玩家手牌顺序排序
        */
        private fapaiRound4(sortDir) {
            let indexNum = 0;
            async.eachSeries(sortDir, (index, callback) => {
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
                egret.setTimeout(callback, this, GameConfig.time_config['200']);
            }, () => {
                egret.setTimeout(() => {
                    if (!Global.gameProxy.roomInfo) {
                        return;
                    }
                    this.mineShoupaiGroup.visible = false;
                    this.mineKoupaiGroup.visible = true;
                    this.updateSypai();
                    this.mineShoupaiGroup.sortShoupais();
                    egret.setTimeout(() => {
                        if (!Global.gameProxy.roomInfo) {
                            return;
                        }
                        this.mineShoupaiGroup.visible = true;
                        this.mineKoupaiGroup.visible = false;

                        egret.setTimeout(this.checkHszStatus, this, 400);
                    }, this, 400);
                }, this, 400);
            });
        }

        // /**
        //  * 玩家手牌排序
        //  */
        // public sortMineShoupai() {
        //     let majiangArr = Global.gameProxy.getMineShuopaiArr();//[11, 13, 15, 16, 21, 21, 24, 25, 33, 34, 35, 36, 39];
        //     for (let i = 0; i < majiangArr.length; i++) {
        //         let value = majiangArr[i];
        //         this.mineShoupaiGroup.changeShoupaiValue("mj" + (i + 1), value);
        //     }
        // }

        /**
         * 这里是自动给玩家推荐三张牌的方法
         */
        public tishiSanzhang() {
            let num: any = this.mineShoupaiGroup.randomChoseThree()
            let temp = [];
            let arr1 = _.values(num)
            //这里是区分有好多种花色
            switch (_.keys(arr1).length) {
                case 3://三种花色
                    if (arr1[0].length < 3 && arr1[1].length < 3) {
                        return arr1[2];
                    }
                    else if (arr1[0].length < 3 && arr1[2].length < 3) {
                        return arr1[1];
                    }
                    else if (arr1[1].length < 3 && arr1[2].length < 3) {
                        return arr1[0];
                    }
                    else if (arr1[0].length <= 3 && arr1[1].length >= 3 && arr1[2].length >= 3) {
                        if (arr1[0].length == 3) {
                            return arr1[0];
                        }
                        else if (arr1[1].length > arr1[2].length) {
                            return arr1[2];
                        } else if (arr1[1].length < arr1[2].length) {
                            return arr1[1];
                        } else {
                            //这里是相等的情况个数相等。
                            let i = Math.floor(Math.random() * 2);
                            if (i == 1) {
                                return arr1[2];
                            } else {
                                return arr1[1];
                            }
                        }
                    }
                    else if (arr1[1].length <= 3 && arr1[2].length >= 3 && arr1[0].length >= 3) {
                        if (arr1[1].length == 3) {
                            return arr1[1];
                        }
                        else if (arr1[2].length > arr1[0].length) {
                            return arr1[0];
                        } else if (arr1[2].length < arr1[0].length) {
                            return arr1[2];
                        } else {
                            let i = Math.floor(Math.random() * 2);
                            if (i == 1) {
                                return arr1[2];
                            } else {
                                return arr1[0];
                            }
                        }

                    }
                    else if (arr1[2].length <= 3 && arr1[0].length >= 3 && arr1[1].length >= 3) {
                        if (arr1[2].length == 3) {
                            return arr1[2];
                        }
                        else if (arr1[0].length > arr1[1].length) {
                            return arr1[1];
                        } else if (arr1[0].length < arr1[1].length) {
                            return arr1[0];
                        } else {
                            let i = Math.floor(Math.random() * 2);
                            if (i == 1) {
                                return arr1[1];
                            } else {
                                return arr1[0];
                            }
                        }
                    }
                    else if (arr1[2].length > 3 && arr1[0].length > 3 && arr1[1].length > 3) {
                        if (arr1[2].length == 4 && arr1[0].length == 4) {
                            let i = Math.floor(Math.random() * 2);
                            if (i == 1) {
                                return arr1[2];
                            } else {
                                return arr1[0];
                            }
                        }
                        if (arr1[1].length == 4 && arr1[0].length == 4) {
                            let i = Math.floor(Math.random() * 2);
                            if (i == 1) {
                                return arr1[1];
                            } else {
                                return arr1[0];
                            }
                        }
                        if (arr1[2].length == 4 && arr1[1].length == 4) {
                            let i = Math.floor(Math.random() * 2);
                            if (i == 1) {
                                return arr1[2];
                            } else {
                                return arr1[1];
                            }
                        }
                        if (arr1[2].length == 5 && arr1[1].length == 5) {
                            return arr1[0];
                        }
                        if (arr1[2].length == 5 && arr1[0].length == 5) {
                            return arr1[1];
                        }
                        if (arr1[0].length == 5 && arr1[1].length == 5) {
                            return arr1[2];
                        }
                    }
                    break;
                case 2: //只有两种花色。
                    if (arr1[0].length > arr1[1].length) {
                        return arr1[1];
                    } else {
                        return arr1[0];
                    }
                case 1://只有一种花色。
                    return arr1[0];

            }
        }



        /**
         * 这里将随机的三张牌加进去。
         */
        public showHSZTip() {
            let items = this.tishiSanzhang();
            items = _.shuffle(items)
            try {
                for (let i = 0; i < 3; i++) {
                    items[i].selectTouch();
                    this.hszShoupaiArr.push(items[i]);
                }
            } catch (e) {
                console.error(items);
            }

            if (!this.hszBar) {
                this.hszBar = new HSZBar();
                this.hszBar.horizontalCenter = 0;
                this.hszBar.bottom = 163;
                this.touchGroup.addChild(this.hszBar);
            }
            this.hszBar.onStart(this);
            this.hszBar.visible = true;
            this.maxTouchShoupai = 3;
            EventManager.instance.dispatch(EventNotify.HSZ_SELECT_NUM, this.hszShoupaiArr.length);

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

        private renderHupaiGroup() {
            let roomInfo = Global.gameProxy.roomInfo;
            for (let key in roomInfo.players) {
                let player: PlayerGameDataBean = roomInfo.players[key];
                let direction = this.directions[key];
                let hupaiGroup: MajiangHupaiGroup = this[direction + "HupaiGroup"];
                hupaiGroup.removeChildren();
                hupaiGroup.initWithDirection(direction);
                hupaiGroup.visible = true;
                let huCardsArr = this.getHupaiArrByHuTask(key);
                if (huCardsArr && huCardsArr.length > 0) {
                    this.addXZDDHuTip(huCardsArr[0].from, huCardsArr[0].playerIndex, true);
                }
                if (direction == "mine") {
                    if (Global.gameProxy.roomInfo.gameId.indexOf("xlch") > -1 && huCardsArr.length > 0) {
                        this.showGameTipGroup(3);
                    }
                }
                // let hus = player.huCards || [];
                hupaiGroup.initWithArr(huCardsArr);
            }
        }

        //---回显胡牌end----------------------------------------------

        /**
         * 显示重新连接上来的UI
         */
        private showReconnectUI() {
            let roomInfo = Global.gameProxy.roomInfo;
            this.checkHszStatus(roomInfo);
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
         * 检测是否是换三张状态
         * @param  {GameRoomInfoBean} roomInfo
         */
        private checkHszStatus(roomInfo: GameRoomInfoBean = Global.gameProxy.roomInfo) {
            //status == 0 则是换三张有完成状态
            let step = roomInfo.steps;
            this.timeDirectionBar.startTime(this);
            if (roomInfo.hszStatus == 0 && step.indexOf(0) > -1) {
                this.majiangStatus = MajiangStatusEnum.HSZ;
                let players = roomInfo.players;
                for (let key in players) {
                    let player: PlayerGameDataBean = players[key];
                    //如果长度为0 则展现没有换三张的状态
                    if (player.selectedHSZCards.length == 0) {
                        this.showNoSelectHszUI(parseInt(key));
                    } else {
                        this.showSelectedHszUI(parseInt(key));
                    }
                }
            } else {
                this.checkDQStatus();
            }
        }

        /**
         * 移除和换三张有关的UI
         */
        private removeHszUI() {
            for (let key in this.directions) {
                let direction = this.directions[key];
                game.UIUtils.removeSelf(this[direction + "NoHsz"]);
                game.UIUtils.removeSelf(this[direction + "Hsz"]);
                game.UIUtils.removeSelf(this.hszBar);
                if (this.otherChose) {
                    this.otherChose.visible = false;
                }
            }
        }

        /**
         * 移除和换三张有关的UI
         */
        private hideHszUI() {
            for (let key in this.directions) {
                let direction = this.directions[key];
                if (this[direction + "NoHsz"]) {
                    this[direction + "NoHsz"].visible = false;
                }
                if (this[direction + "Hsz"]) {
                    this[direction + "Hsz"].visible = false;
                }
                if (this.hszBar) {
                    this.hszBar.visible = false;
                }
                if (this.otherChose) {
                    this.otherChose.visible = false;
                }
            }
        }


        /**
         * 移除定缺UI
         */
        private removeDQUI() {
            if (this.mjDqBar) {
                this.mjDqBar.visible = false;
                game.UIUtils.removeSelf(this.mjDqBar);
                this.mjDqBar = null;
                this.otherChose.visible = false;
                if (this.otherChose) {
                    this.otherChose.visible = false;
                }
            }
        }

        /**
         * 展示玩家没有换三张的状态
         * @param  {number} index
         */
        private showNoSelectHszUI(index: number) {
            //如果是本人
            let direction = this.directions[index];
            if (direction == "mine") {
                this.showHSZTip();
            } else {
                let image: eui.Group = this[direction + "NoHsz"];
                let image1 = image.getChildAt(1) as eui.Image;
                let image2 = image.getChildAt(2) as eui.Image;
                let image3 = image.getChildAt(3) as eui.Image;
                image.visible = true;
                egret.Tween.get(this, { loop: true }).call(() => {
                    image1.visible = true;
                }).wait(200).call(() => {
                    image2.visible = true;
                }).wait(200).call(() => {
                    image3.visible = true;
                }).wait(200).call(() => {
                    image2.visible = image3.visible = false;
                })
            }
        }

        /**
        * 展示玩家没有定缺的状态。
        * @param  {number} index
        */
        private showNoSelectDqUI(index: number) {
            //如果是本人
            let direction = this.directions[index];
            if (direction == "mine") {
                let mine = Global.gameProxy.getMineGameData();
                if (mine.selectColor == -1) {
                    this.showDingQue();
                }
            } else {
                let image: eui.Group = this[direction + "NoHsz"];
                let image1 = image.getChildAt(1) as eui.Image;
                let image2 = image.getChildAt(2) as eui.Image;
                let image3 = image.getChildAt(3) as eui.Image;
                image.visible = true;
                egret.Tween.get(this, { loop: true }).call(() => {
                    image1.visible = true;
                }).wait(200).call(() => {
                    image2.visible = true;
                }).wait(200).call(() => {
                    image3.visible = true;
                }).wait(200).call(() => {
                    image2.visible = image3.visible = false;
                })
            }
        }
        /**
         * 展现换三张已经选择OK的界面
         * @param  {number} index
         */
        private showSelectedHszUI(index: number) {
            let direction = this.directions[index];
            //扣牌组
            let group: eui.Group = this[direction + "Hsz"];
            let shoupaiGroup: BaseShoupaiGroup = this[direction + "ShoupaiGroup"];
            //隐藏三张
            shoupaiGroup.hideRight3pais();
            if (direction == "mine") {
                this.otherChose.visible = true;
            }
            group.visible = true;
        }

        /**
       * 展现定缺已经选择OK的界面
       * @param  {number} index
       */
        private showSelectedDqUI(index: number) {
            let direction = this.directions[index];
            if (direction == "mine") {
                this.otherChose.visible = true;
            }
        }


        /**
         * 展示换三张动画
         * @param  {number} index
         * @param  {boolean} flag
         */
        private showHszAni(index: number) {
            let direction = this.directions[index];
            //扣牌组
            let group: eui.Group = this[direction + "Hsz"];
            //如果不是我
            let image: eui.Group = this[direction + "NoHsz"];
            if (image) {
                image.visible = false;
            }
            this[direction + "ShoupaiGroup"].hideRight3pais();
            //等待换三张的图片
            group.visible = true;
            switch (direction) {
                case "top":
                    egret.Tween.get(group).to({
                        top: group.top + 15
                    }, 300, egret.Ease.sineIn);
                    break;
                case "mine":
                    egret.Tween.get(group).to({
                        bottom: group.bottom + 15
                    }, 300, egret.Ease.sineIn);
                    break;
                case "left":
                    egret.Tween.get(group).to({
                        horizontalCenter: group.horizontalCenter + 15
                    }, 300, egret.Ease.sineIn);
                    break;
                case "right":
                    egret.Tween.get(group).to({
                        horizontalCenter: group.horizontalCenter - 15
                    }, 300, egret.Ease.sineIn);
                    break;

            }
        }


        /**
         * 展现玩家头像
         */
        private showHeaders() {
            let players = Global.gameProxy.getPlayers();
            let zhuangId = Global.gameProxy.roomInfo.dealer;
            for (let key in players) {
                let dir = this.directions[key];
                let header: WidgetHeader = this[dir + 'Header'];
                header.initWithData(players[key], dir);
                header.showIsZhuang(game.Utils.valueEqual(zhuangId, key));
                header.visible = true;
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
                // this.timeDirectionBar.startTime(this);
                this.reloadPlayerChupais();
                this.showShengyuPai();
                this.showReconnectUI();
                this.checkPlayerIsOver();
            } else {
                this.showStartAni(() => {
                    //展现牌局开始动画
                    for (let i = 1; i <= 4; i++) {
                        this.showShoupaiByIndex(i, false);
                    }
                    egret.setTimeout(this.fapaiAni, this, 500);
                })
            }
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
            mc.addEventListener(egret.MovieClipEvent.COMPLETE, () => {
                game.UIUtils.removeSelf(mc);
                // game.MCUtils.reclaim("start", mc);
                callback && callback();
            }, this);
            mc.play(1);
        }


        private paiQiang: PaiQiangComponent;

        public async createChildren() {
            super.createChildren();
            if (NativeApi.instance.isiOSDevice) {
                this.mj_btn_fdsx.visible = false;
            }
            if (!Global.gameProxy.roomInfo) {
                await Global.gameProxy.req2updateRoom();
            }
            this.dizhu.bold = true;
            this.dizhu.text = "底注：" + Global.gameProxy.lastGameConfig.diFen;//this.difeng;
            //设置玩家座位标示
            this.majiangStatus = MajiangStatusEnum.READY;
            //记录玩家坐标
            this.directions = MajiangUtils.getDirectionByMine(Global.gameProxy.getMineIndex());
            this.paiQiang.showPaiQiang(this.directions);
            this.renderChupaiGroups();
            this.renderHupaiGroup();
            this.renderContent();
            this.backMovie();
            this.testAni();
            if (Global.gameProxy.diWen == "mjxlch") {
                this.wanfaImage.source = RES.getRes("xlch_hsz_png");
            } else {
                this.wanfaImage.source = RES.getRes("xzdd_hsz_png");
            }
            this.roomIdLable.text = "单号：" + Global.gameProxy.roomInfo.roundId;
            game.AudioManager.getInstance().playBackgroundMusic("playingingame_mp3");
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
            this.renderHupaiGroup();
        }

        public updateGold() {
            // this['mineHeader'].updateGold(Global.playerProxy.playerData.gold);
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

        private tgGroup: eui.Group;
        private qxtgBtn: eui.Button;
        public async onTouchTap(e: egret.TouchEvent) {
            e.stopPropagation();
            switch (e.target) {
                case this.mj_btn_fdsx:
                    game.UIUtils.windowFullscreen();
                    break;
                case this.exitBtn:
                    var quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
                    if (quitResp) {
                        if (quitResp.error && quitResp.error.code != 0) {
                            let text = GameConfig.GAME_CONFIG['long_config']['10002'].content
                            Global.alertMediator.addAlert(text, () => {
                            }, null, true);
                            return;
                        }
                        Global.gameProxy.clearRoomInfo();
                        if (quitResp.gold) {
                            Global.playerProxy.playerData.gold = quitResp.gold;
                        }
                        game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG);
                        game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
                        return;
                    }
                    let text = GameConfig.GAME_CONFIG['long_config']['10002'].content
                    Global.alertMediator.addAlert(text, () => {

                    }, null, true);
                    break;
                case this.gmBtn:

                    this.showMajiangTest();
                    break;
                case this.lsBtn:
                    if (this.huTipsBar) {
                        this.huTipsBar.hideBar();
                    }
                    if (this.ctBar) {
                        this.ctBar.hideBar();
                    }
                    this.lsBtnTouch();
                    break;
                case this.chatBtn:
                    if (this.recordBar) {
                        this.recordBar.hide();
                    }
                    if (this.huTipsBar) {
                        this.huTipsBar.hideBar();
                    }
                    this.chatBtnTouch();
                    break;
                case this.tipBtn:
                    if (this.recordBar) {
                        this.recordBar.hide();
                    }
                    if (this.ctBar) {
                        this.ctBar.hideBar();
                    }
                    this.tipsBtnTouch();
                    break;
                case this.recordBar:
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
                    game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_SETTING);
                    this.gnBtn.visible = true;
                    this.gnGroup.visible = false;
                    break;
                case this.btn_help://帮助按钮
                    game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_HELP);
                    this.gnBtn.visible = true;
                    this.gnGroup.visible = false;
                    break;
                case this.touchGroup:
                    if (this.touchShoupai) {
                        this.touchShoupai.change2NoSelect();
                        this.touchShoupai = null;
                        EventManager.instance.dispatch(EventNotify.FIND_COLOR, 0);
                    }
                    this.hideBars();
                    break;
                case this.hzBtn:
                    this.hzBtnTouch();
                    break;
            }
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
                    if (!Global.gameProxy.checkIsRoundMe()) {
                        LogUtils.logI("没轮到我出牌")
                        return;
                    }
                    if (this.lockChupai) {
                        LogUtils.logI("锁定出牌")
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
            } else if (this.maxTouchShoupai == 3) {
                //换三张
                if (touchShoupai.selected) {
                    touchShoupai.selectTouch();
                    game.Utils.removeArrayItem(this.hszShoupaiArr, touchShoupai);
                } else {
                    //判断花色
                    if (this.hszShoupaiArr.length < 3) {
                        if (this.hszShoupaiArr.length == 0) {
                            touchShoupai.selectTouch();
                            this.hszShoupaiArr.push(touchShoupai);
                        } else if (this.hszShoupaiArr.length > 0) {
                            let shoupai = this.hszShoupaiArr[0];
                            if (MajiangUtils.checkMajiangSameColor(shoupai.value, touchShoupai.value)) {
                                touchShoupai.selectTouch();
                                this.hszShoupaiArr.push(touchShoupai);
                            } else {
                                for (let i = 0; i < this.hszShoupaiArr.length; i++) {
                                    this.hszShoupaiArr[i].selectTouch();
                                }
                                this.hszShoupaiArr = []
                                touchShoupai.selectTouch();
                                this.hszShoupaiArr.push(touchShoupai);
                            }
                        }
                    } else if (this.hszShoupaiArr.length == 3) {
                        let shoupai = this.hszShoupaiArr[0];
                        if (MajiangUtils.checkMajiangSameColor(shoupai.value, touchShoupai.value)) {
                            this.hszShoupaiArr[0].selectTouch();
                            game.Utils.removeArrayItem(this.hszShoupaiArr, this.hszShoupaiArr[0]);
                            touchShoupai.selectTouch();
                            this.hszShoupaiArr.push(touchShoupai);
                        } else {
                            for (let i = 0; i < this.hszShoupaiArr.length; i++) {
                                this.hszShoupaiArr[i].selectTouch();
                            }
                            this.hszShoupaiArr = []
                            touchShoupai.selectTouch();
                            this.hszShoupaiArr.push(touchShoupai);
                        }
                    }
                }
                EventManager.instance.dispatch(EventNotify.HSZ_SELECT_NUM, this.hszShoupaiArr.length);
            }
        }

        /**
         * 接收服务器换三张结束 开始走非定缺
         * @param  {egret.TouchEvent} e
         */
        private roomHszFinishiedPush(e: egret.TouchEvent) {
            this.otherChose.visible = false;
            // this.checkDQStatus();
        }

        public onAdded() {
            super.onAdded();
            EventManager.instance.addEvent(EventNotify.SHOUPAI_TOUCH, this.shoupaiTouchOn, this);
            EventManager.instance.addEvent(ServerNotify.s_playerSelectHSZ, this.playerSelectHSZPush, this);
            EventManager.instance.addEvent(ServerNotify.s_HSZCardExchanged, this.hSZCardExchangedPush, this);
            EventManager.instance.addEvent(ServerNotify.s_roomHSZFinished, this.roomHszFinishiedPush, this);

            EventManager.instance.addEvent(ServerNotify.s_playerSelectColor, this.playerSelectColorPush, this);
            EventManager.instance.addEvent(ServerNotify.s_playerColorSelected, this.playerColorSelected, this);
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
            EventManager.instance.addEvent(ServerNotify.s_countdown, this.countDownPush, this);
            EventManager.instance.addEvent(ServerNotify.s_playerClearWaitTimeout, this.clearCountDown, this);
            EventManager.instance.addEvent(ServerNotify.s_trustee, this.tuoguanStatusPush, this);
            EventManager.instance.addEvent(ServerNotify.s_cancelGangForQG, this.qiangGangHu, this);
            EventManager.instance.addEvent(EventNotify.SHOW_GNBTN, this.changGnBtnStat, this);
            EventManager.instance.addEvent(ServerNotify.s_roomChat, this.sendMessage, this);
        }

        public onRemoved() {
            super.onRemoved();
            EventManager.instance.removeEvent(EventNotify.SHOUPAI_TOUCH, this.shoupaiTouchOn, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerSelectHSZ, this.playerSelectHSZPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_HSZCardExchanged, this.hSZCardExchangedPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_roomHSZFinished, this.roomHszFinishiedPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerSelectColor, this.playerSelectColorPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerColorSelected, this.playerColorSelected, this);
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
            EventManager.instance.removeEvent(ServerNotify.s_countdown, this.countDownPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_trustee, this.tuoguanStatusPush, this);
            EventManager.instance.removeEvent(ServerNotify.s_playerClearWaitTimeout, this.clearCountDown, this);
            EventManager.instance.removeEvent(ServerNotify.s_cancelGangForQG, this.qiangGangHu, this);
            EventManager.instance.removeEvent(EventNotify.SHOW_GNBTN, this.changGnBtnStat, this);
            EventManager.instance.removeEvent(ServerNotify.s_roomChat, this.sendMessage, this);
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
            this.tgGroup.visible = resp.isTrustee;
        }


        /**
         * 清除倒计时
         * @param  {egret.TouchEvent} e
         */
        private clearCountDown(e: egret.TouchEvent) {
            if (Global.gameProxy.roomInfo) {
                Global.gameProxy.roomInfo.countdown = null;
            }
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
            if (this.majiangStatus == MajiangStatusEnum.OVER) {
                game.NetReconnect.instance.hide();
                return;
            }
            let reqData = Global.gameProxy.lastGameConfig;
            if (!reqData) reqData = {};
            if (!Global.gameProxy.roomInfo || !Global.gameProxy.roomInfo.roomId) {
                game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
                game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG);
                return;
            }
            reqData.roomId = Global.gameProxy.roomInfo.roomId;
            Global.playerProxy.updatePlayerInfo(async () => {
                if (this.majiangStatus == MajiangStatusEnum.OVER) {
                    // game.NetReconnect.instance.hide();
                    return;
                }
                let handler = ServerPostPath.hall_sceneHandler_c_enter;
                reqData['isContinue'] = false;
                let resp: any = await game.PomeloManager.instance.request(handler, reqData);
                if (!resp) {
                    return;
                }
                if (!resp.error) {
                    resp.error = {};
                    resp.error.code = 0;
                }
                //游戏房间已经解散
                if (resp.error.code == -213) {
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG);
                    let text = GameConfig.GAME_CONFIG['long_config']['10006'].content || "对局已结束";
                    Global.alertMediator.addAlert(text);
                    //弹出提示
                } else if (resp.error.code == 0) {
                    Global.gameProxy.clearRoomInfo();
                    Global.gameProxy.setRoomInfo(resp);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG);
                }
            })

            // game.NetReconnect.instance.hide();
        }


        /**
         * 有玩家确定换三张的推送
         * @param  {egret.Event} e
         */
        private playerSelectHSZPush(e: egret.Event) {
            let resp = e.data;
            let players = [];
            let mineIndex = Global.gameProxy.getMineIndex();
            if (game.Utils.valueEqual(mineIndex, resp.playerIndex)) {
                Global.gameProxy.getMineGameData().selectedHSZCards = resp.cards;
            }
            if (!game.Utils.valueEqual(mineIndex, resp.playerIndex)) {
                players.push[resp.playerIndex];
            }
            if (players.length < 3 && game.Utils.valueEqual(mineIndex, resp.playerIndex)) {
                this.otherChose.visible = true;
            }
            this.showHszAni(resp.playerIndex);
        }

        /**
         * 换三张结果推送
         * @param  {egret.Event} e
         */
        private async hSZCardExchangedPush(e: egret.Event) {
            let resp = e.data;
            this.hszBar.visible = false;
            this.otherChose.visible = false;
            for (let i = 0; i < this.hszShoupaiArr.length; i++) {
                this.hszShoupaiArr[i].change2NoSelect();
            }
            Global.gameProxy.roomInfo.countdown = null;
            await game.Utils.sleepTime(1000);
            let type = resp.type;
            let player = Global.gameProxy.getMineGameData();
            let hszArr = player.selectedHSZCards;
            //删掉玩家手牌
            Global.gameProxy.updateWanjiaShoupai(hszArr[0], -1);
            Global.gameProxy.updateWanjiaShoupai(hszArr[1], -1);
            Global.gameProxy.updateWanjiaShoupai(hszArr[2], -1);
            let cards = resp.cards;
            Global.gameProxy.updateWanjiaShoupai(cards[0], 1);
            Global.gameProxy.updateWanjiaShoupai(cards[1], 1);
            Global.gameProxy.updateWanjiaShoupai(cards[2], 1);
            this.hszCards = cards;
            this.showHSZSucTip(type);
        }

        /**
         * 展现换三张动画
         */
        private hszTipBar: HSZTipBar;
        //换三张换过来的牌
        private hszCards: number[];
        public showHSZSucTip(type) {
            this.hszTipBar = new HSZTipBar(type);
            this.touchGroup.addChild(this.hszTipBar);
            this.hszTipBar.horizontalCenter = 0;
            this.hszTipBar.verticalCenter = -42;
            egret.setTimeout(this.hszOver, this, 1500);
        }


        /**
         * 游戏积分变化
         * @param  {egret.Event} e
         */
        public syncGoldPush(e: egret.Event) {
            let resp: any = e.data;
            egret.setTimeout(() => {
                this.syncGold(resp);
            }, this, 200)

        }


        /**
         * 发送换三张的请求
         */
        public async sendHSZReq() {
            if (this.hszShoupaiArr.length != 3) {
                return;
            }
            let cardValue = [];
            this.hszShoupaiArr.forEach(function (shoupai: MineShoupai) {
                shoupai.selectTouch();
                cardValue.push(shoupai.value);
            });
            this.maxTouchShoupai = 0;
            let reqData = { cards: cardValue };
            let resp: any = await Global.pomelo.request(ServerPostPath.game_mjHandler_c_selectHSZ, reqData);
            //返回扣牌成功
            if (resp.error.code == 0) {
                this.hszBar.visible = false;
                let playerData = Global.gameProxy.getMineGameData();
                playerData.selectedHSZCards = cardValue;
                this.mineShoupaiGroup.hideRight3pais();
            } else {
                this.maxTouchShoupai = 3;
            }
        }

        /**
         * 换三张完毕过后加入手牌
         */
        private hszJoinpai() {
            game.UIUtils.removeSelf(this.hszBar);
            this.hszBar = null;
            // let values = [13, 22, 23];
            let myCarsArr = Global.gameProxy.getMineShuopaiArr();
            this.mineShoupaiGroup.sortShoupaiByValue(myCarsArr, false);
            this.mineShoupaiGroup.findMajiangByValue(this.hszCards[0]).showDownAni();
            this.mineShoupaiGroup.findMajiangByValue(this.hszCards[1]).showDownAni();
            this.mineShoupaiGroup.findMajiangByValue(this.hszCards[2]).showDownAni();
            this.hszCards = null;
            this.topShoupaiGroup.showAllShoupai();
            this.leftShoupaiGroup.showAllShoupai();
            this.rightShoupaiGroup.showAllShoupai();
            egret.setTimeout(() => {
                this.checkDQStatus();
            }, this, 1000);
            //200毫秒后
        }
        /**
         * 换三张结束
         */
        public hszOver() {
            this.hszShoupaiArr = [];
            game.UIUtils.removeSelf(this.hszTipBar);
            this.hszTipBar = null;
            this.leftHsz.visible = false;
            this.rightHsz.visible = false;
            this.mineHsz.visible = false;
            this.topHsz.visible = false;
            this.hszJoinpai();
        }

        //---------定缺----------
        private mjDqBar: MajiangDQBar;
        private showDingQue() {
            if (this.mjDqBar) {
                return;
            }
            this.mjDqBar = new MajiangDQBar(this);
            this.touchGroup.addChild(this.mjDqBar);
            this.mjDqBar.horizontalCenter = 0;
            this.mjDqBar.bottom = 140;
        }

        /**
         * 选择定缺
         * @param  {number} type
         */
        public async chooseDQ(type: number) {
            let route = ServerPostPath.game_mjHandler_c_selectColor;
            this.mjDqBar.visible = false;
            Global.gameProxy.getMineGameData().selectColor = type;
            let resp: any = await Global.pomelo.request(route, { color: type });
        }

        /**
         * 判断定缺
         */
        private checkDQStatus() {
            let roomInfo = Global.gameProxy.roomInfo;
            let step = roomInfo.steps;
            if (roomInfo.selectColorStatus == 0 && step.indexOf(1) > -1) {
                this.hideHszUI();
                this.majiangStatus = MajiangStatusEnum.QINGQUE;
                let players = roomInfo.players;
                //2018-8-22,缺牌显示选择UI
                for (let key in players) {
                    let player: PlayerGameDataBean = players[key];
                    //如果长度为0 则展现没有换三张的状态
                    if (player.selectColor == -1) {
                        this.showNoSelectDqUI(parseInt(key));
                    } else {
                        this.showSelectedDqUI(parseInt(key));
                    }
                }
            } else {
                //不需要定缺
                this.removeDQUI();
                this.removeHszUI();
                let direction = this.directions[roomInfo.curPlay];
                this.timeDirectionBar.showLightByDirection(direction);
                this.showHeaderTips(roomInfo);
                this.checkOutPutByDirection();
                //这里判断如果手牌=14 则把最后一张牌给change出去
                let playerData = Global.gameProxy.getPlayerByIndex(roomInfo.curPlay);
                this.maxTouchShoupai = 1;
                this.showShoupai(direction);
                this.checkTask();
                this.checkHuTips();
                this.checkShowTips();
                // this.checkMineShoupaiHu
            }
            //如果不走定缺,就开始走座位算
        }


        /**
         * 在重新连接上来过后或者才发完手牌之后改变最后一张为摸牌
         * @param  {} direction
         */
        private showShoupai(direction) {
            this[direction + "ShoupaiGroup"].changeLast2Mopai();
        }

        /**
         * 定缺完毕
         */
        private dingqueOver(player) {
            this.removeHszUI();
            game.UIUtils.removeSelf(this.mjDqBar);
            //重新排序手牌
            // this.mineShoupaiGroup.sortMineShoupai();
            let cards = Global.gameProxy.getMineShuopaiArr();
            this.mineShoupaiGroup.sortShoupaiByValue(cards, false);
            let roomInfo = Global.gameProxy.roomInfo;
            roomInfo.curPlay = roomInfo.dealer;
            let direction = this.directions[roomInfo.curPlay];
            let playerData = Global.gameProxy.getPlayerByIndex(roomInfo.curPlay);
            if (Global.gameProxy.checkIndexIsMe(roomInfo.dealer)) {
                playerData.lastCard = cards[0];
            }
            //只是显示动画
            this.maxTouchShoupai = 1;
            this.showShoupai(direction);
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
            if (Global.gameProxy.roomInfo)
                this.checkTask();
            this.checkHuTips();
            this.checkShowTips();
            // this.checkOutPutByDirection(false);
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

        /**
         * 哪一方玩家定缺完成
         * @param  {egret.Event} e
         */
        private playerSelectColorPush(e: egret.Event) {
            let resp = e.data;
            let players = [];
            let mineIndex = Global.gameProxy.getMineIndex();
            let direction = this.directions[resp.playerIndex];
            if (direction != "mine") {
                players.push[resp.playerIndex];
                let image: eui.Group = this[direction + "NoHsz"];
                image.visible = false;
            }
            if (players.length < 3 && direction == "mine") {
                this.otherChose.visible = true;
            }
        }

        /**
         * "players":{"1":3,"2":2}
         * 全部定缺完成
         * @param  {egret.Event} e
         */
        private playerColorSelected(e: egret.Event) {
            this.otherChose.visible = false;
            this.removeDQUI();
            this.otherChose.visible = false;
            let resp = e.data;
            let players = resp.players;
            for (let key in players) {
                let playerData = Global.gameProxy.getPlayerByIndex(key);
                playerData.selectColor = players[key];
                this.getHeaderByDirection(key);

            }
            //差一个动画
            this.dingqueOver(players);
        }

        /**
         * 获取玩家头像
         * @param  {number} index
         */
        private getHeaderByDirection(index): WidgetHeader {
            return this[this.directions[index] + "Header"]
        }

        //---------定缺 end------

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
            // egret.setTimeout(function () {
            this.maxTouchShoupai = 1;
            this.timeDirectionBar.showLightByDirection(this.directions[resp.curPlay]);
            Global.gameProxy.roomInfo.curPlay = resp.curPlay;
            // if (resp.newCard) {
            //     this.lockChupai = true;
            // } else {
            //     this.lockChupai = false;
            // }
            this.checkOutPutByDirection();
            this.showHeaderTips(Global.gameProxy.roomInfo);
            // }, this, 200);
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
            if (this.lockChupai) {
                return;
            }
            this.lockChupai = true;
            let resp: any = await Global.pomelo.request('game.mjHandler.c_playCard', { card: pai.value, ting: false });
            if (!resp) {
                return;
            }
            this.lockChupai = false;
            if (resp.error.code == 0) {
                EventManager.instance.dispatch(EventNotify.SHOUPAI_TOUCH_SUC, touchShoupai);
                this.majiangStatus = MajiangStatusEnum.OTHER_CHUPAI;
            } else if (resp.error.code == -10101) {
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
         * 玩家出牌推送
         * {"playerIndex":1,"card":28}
         * @param  {egret.Event} e
         */
        private playCardPush(e: egret.Event) {
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
                this.checkMineShoupaiHu()
                if (this.huTipsBar) {
                    this.huTipsBar.hideBar();
                }
            } else {
                Global.gameProxy.updateWanjiaShoupaiByIndex(card, -1, playerIndex);
            }
            this.showChupaiAni1(playerIndex, card);
            MajiangUtils.playCardSound(playerData.sex, card);
        }




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
                    this[direction + 'ShoupaiGroup'].hideMopai();
                    break;
                case "right":
                    game.UIUtils.setUI2CenterY(tempChupai);
                    tempChupai.x = GameConfig.curWidth() * 0.7;
                    tempChupai.y -= 50;
                    targetMajiang = this.rightChupaiGroup.addChupai(value);
                    targetMajiang.visible = false;
                    this[direction + 'ShoupaiGroup'].hideMopai();
                    break;
                case "top":
                    game.UIUtils.setUI2CenterX(tempChupai);
                    tempChupai.y = GameConfig.curHeight() * 0.2;
                    targetMajiang = this.topChupaiGroup.addChupai(value);
                    targetMajiang.visible = false;
                    this[direction + 'ShoupaiGroup'].hideMopai();
                    break;
            }
            game.UIUtils.setAnchorPot(tempChupai);
            tempChupai.scaleX = 0;
            tempChupai.scaleY = 0;
            let pos = targetMajiang.localToGlobal();
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
                this.taskBar.setRoot(this);
                this.taskBar.right = 125;
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
            Global.gameProxy.roomInfo.hangupTaskSource = {};
            this.checkTask();
            // egret.setTimeout(, this, 200);
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
                // this.lockChupai = false;
            }
        }



        private testPeng() {
            // this.createHJZYByDirection("left", 1000);
            // this.createHJZYByDirection("right", 1000);
            // this.createHJZYByDirection("top", -1000);
            // this.createHJZYByDirection("mine", -1000)5
            // let data2 = '{"1":{"type":6,"info":{"gainGold":200,"pumpGold":0,"ownGold":9200,"card":22,"gangType":3,"score":2,"from":1,"transIndex":1,"isDefeat":false}},"2":{"type":6,"info":{"gainGold":-200,"pumpGold":0,"ownGold":10750,"card":22,"gangType":3,"score":-2,"from":1,"transIndex":1,"isDefeat":false}}}';
            // let data = '{"1":{"type":2,"info":{"gainGold":200,"pumpGold":0,"ownGold":9000,"card":38,"from":2,"isDefeat":false}},"2":{"type":2,"info":{"gainGold":-200,"pumpGold":0,"ownGold":10950,"card":38,"from":2,"isDefeat":false}}}'
            // this.syncGold(JSON.parse(data));
            // this.syncGold(JSON.parse(data2));
            return;
            let resp = {};
            resp['card'] = 28;
            resp['playerIndex'] = Global.gameProxy.playerInfo.playerIndex;
            resp['gang'] = 3;
            EventManager.instance.dispatch(ServerNotify.s_playerGangCard, resp);
        }

        /**
        * 玩家碰牌
        * {"playerIndex":1,"from":2,"card":12}
        * @param  {egret.Event} e
        */
        private playerPengCardPush(e: egret.Event) {
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
            //以上玩家数据修改 以下 玩家UI修改
            let direction = this.directions[playerIndex];
            //调用碰
            this[direction + "ShoupaiGroup"].removeShoupaiByPeng(color);
            //播放碰牌动画
            this.addEffectAni(direction, "peng");
            this.hideChupaiTips();
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
                    this.taskBar.hideAllBtns();
                    this.minePgGroup.add(5, color);
                    this.mineShoupaiGroup.checkHuTips();
                    Global.gameProxy.roomInfo.curPlay = Global.gameProxy.getMineIndex();
                    this.checkShowTips();
                    break;
            }
            //播放碰牌音效
            majiang.MajiangUtils.playHPGSound(playerData.sex, 1);
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
                if (playerData.huCards.length > 0) {
                    this.flushTingCards();
                }
            }
            this.addEffectAni(direction, "gang");
            this.hideChupaiTips();
            this.taskBar.hideAllBtns();
            if (direction == "mine") {
                this.mineShoupaiGroup.removeShoupaiByGang(resp.card);
                this[direction + 'ShoupaiGroup'].hideMopai();
            }

            switch (resp.gang) {
                case 1://碰变杠,吊4个正面，巴雨
                    // this.addGangAni("right", "xiayu", GameConfig.curWidth() * 0.5, GameConfig.curHeight() * 0.3);
                    // this.addGangAni("right", "guafeng", GameConfig.curWidth() * 0.41, GameConfig.curHeight() * 0.24);
                    this.addGangAni("guafeng", GameConfig.curWidth() * 0.5 + 5, GameConfig.curHeight() * 0.4 + 5, 2);
                    break;
                case 4://调1个正面，3个背面。暗杠，起手就有三张，摸一张。
                    if (direction != "mine") {
                        group.removeLastPai();
                        group.removeLastPai();
                        group.removeLastPai();
                    }
                    this.addGangAni("xiayu", GameConfig.curWidth() * 0.5 + 10, GameConfig.curHeight() * 0.4 + 5);
                    break;
                case 2://调1个正面，3个背面。暗杠，起手就有四张。不一定第一轮就杠，可能会过几轮。
                    if (direction != "mine") {
                        group.removeLastPai();
                        group.removeLastPai();
                        group.removeLastPai();
                    }
                    this.addGangAni("xiayu", GameConfig.curWidth() * 0.5 + 10, GameConfig.curHeight() * 0.4 + 5);
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
                    this.addGangAni("guafeng", GameConfig.curWidth() * 0.5 + 5, GameConfig.curHeight() * 0.4 + 5, 2);
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
                    majiang.MajiangUtils.playHPGSound(playerData.sex, 2);
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
                    majiang.MajiangUtils.playHPGSound(playerData.sex, 3);
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
                    majiang.MajiangUtils.playHPGSound(playerData.sex, 3);
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
                    majiang.MajiangUtils.playHPGSound(playerData.sex, 2);
                    break;
            }
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
        }



        //--回显玩家胡碰杠的牌

        //---更新剩余牌
        private updateSypai() {
            this.syLabel.text = this.paiQiang.getPaiQiangNum() + ""//Global.gameProxy.addPublicCardPush(num) + "";
        }


        public publicCardChangedPush(e: egret.Event) {
            let resp = e.data;
            this.syLabel.text = resp.cardNum;
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
            this.paiQiang.removeNumByIndex();
            let direction = this.directions[resp.playerIndex];
            let playerData = Global.gameProxy.getPlayerByIndex(resp.playerIndex);
            playerData.cardNum++;
            this.taskBar.hideAllBtns();
            if (direction == "mine") {
                //先刷新自己手牌
                Global.gameProxy.updateWanjiaShoupai(resp.card, 1);
                playerData.lastCard = resp.card;
                this.mineShoupaiGroup.playerNewCardPush(playerData.lastCard);
                this.checkShowTips();
            } else {
                this[direction + "ShoupaiGroup"].playerNewCardPush();
                playerData.lastCard = 1;
            }
            this.lockChupai = true;
            egret.clearTimeout(this.lockChupaiTimeout);
            this.lockChupaiTimeout = egret.setTimeout(function () {
                this.lockChupai = false;;
            }, this, 600);
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
                    egret.setTimeout(() => {
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
                egret.setTimeout(() => {
                    this.addXZDDHuTip(from, playerIndex, true)
                }, this, 5000);
                this[direction + "HupaiGroup"].addHu(resp, 2);
                majiang.MajiangUtils.playHPGSound(huPlayerData.sex, 4);
            } else {
                //点炮
                let lastDirection = this.directions[from];
                this.addEffectAni(direction, "hu");
                egret.setTimeout(() => {
                    this.addXZDDHuTip(from, playerIndex, true)
                }, this, 2000);
                Global.gameProxy.recordChu2Dianpao(from);
                if (this.g2p == 1) {
                    egret.setTimeout(() => {
                        this[direction + "HupaiGroup"].addHu(resp, 1);
                    }, this, 400)
                } else {
                    let time = this[lastDirection + "ChupaiGroup"].showDianpaoAni(mainCard);
                    egret.setTimeout(() => {
                        this[direction + "HupaiGroup"].addHu(resp, 1);
                    }, this, time)
                }
                this.g2p = 0;
                majiang.MajiangUtils.playHPGSound(huPlayerData.sex, 5);
            }
        }
        //--回显胡牌end
        /**
         * 显示换桌子按钮
         */
        private checkShowHzBtn() {
            let roomInfo = Global.gameProxy.roomInfo;
            if (!roomInfo) {
                return;
            }
            let notHuIndex = 0;
            for (let key in roomInfo.players) {
                if (roomInfo.players[key].huCards && roomInfo.players[key].huCards.length < 1) {
                    notHuIndex++;
                }
            }
            this.checkShowTips();
            this.hzBtn.visible = !(notHuIndex == 1);
            if (this.hzBtn.visible) {
                this.showGameTipGroup2();
                // NativeApi.instance.addPlayCount();
            }
        }


        /**
         * 显示血战到底胡牌的提示
         */
        private addXZDDHuTip(from, playerIndex, ani = false) {
            if (Global.gameProxy.diWen != MajiangConfig.MJXZDD) {
                return;
            }
            if (playerIndex == Global.gameProxy.getMineIndex()) {
                this.checkShowHzBtn();
                this.tgGroup.visible = false;
                return;
            }
            let name = "player_zimo_png";
            if (from != playerIndex) {
                name = "player_hu_png";
            }
            let direction = this.directions[playerIndex];
            let image = new eui.Image(name);
            image.scaleX = image.scaleY = 1.5;
            this.effectGroup.addChild(image);
            switch (direction) {
                case "mine":
                    image.horizontalCenter = 0;
                    image.bottom = 148;
                    this.checkShowHzBtn();
                    this.tgGroup.visible = false;
                    break;
                case "left":
                    image.left = 220;
                    image.verticalCenter = -80;
                    break;
                case "right":
                    image.right = 220;
                    image.verticalCenter = -80;
                    break;
                case "top":
                    image.horizontalCenter = 0;
                    image.top = 80;
                    break;
            }
            if (ani) {
                image.alpha = 0;
                egret.Tween.get(image).to({
                    alpha: 1
                }, 200);
            }

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
                    mv.addEventListener(egret.MovieClipEvent.COMPLETE, () => {
                        game.UIUtils.removeSelf(mv);
                        // game.MCUtils.reclaim(effectName, mv);
                    }, this)
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
                    mv.addEventListener(egret.MovieClipEvent.COMPLETE, () => {
                        game.UIUtils.removeSelf(mv);
                        // game.MCUtils.reclaim(effectName, mv);
                    }, this)
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

        private showMajiangTest() {
            // let majiangTest = new MajiangTestScene();
            // this.addChild(majiangTest);
            // majiangTest.initData();
        }

        private testAni() {
            // this.gmBtn.visible = ServerConfig.PATH_CONFIG.debug_model;
            // this.gmStop.visible = ServerConfig.PATH_CONFIG.debug_model;
            // this.gmRun.visible = ServerConfig.PATH_CONFIG.debug_model;
            return;
            let types = ['gang', "peng", 'hu', "zimo", "gsh"];
            let type = types[Math.floor(_.random(0, 4))];
            type = "gang";
            this.addEffectAni("mine", type);
            this.addEffectAni("left", type);
            this.addEffectAni("right", type);
            this.addEffectAni("top", type);
            egret.setTimeout(() => {
                this.addXZDDHuTip(2, 1, true);
                this.addXZDDHuTip(1, 3, true);
                this.addXZDDHuTip(3, 4, true);
                this.addXZDDHuTip(4, 2, true);
            }, this, 700);
        }

        /**
         * 玩家认输
         * @param  {} direction
         */
        private createRenshuFont(direction) {
            let roomInfo = Global.gameProxy.roomInfo;
            if (roomInfo.publicCardNum < 1) {
                return;
            }

            //认输使用缓存
            let image = new eui.Image();
            image.source = RES.getRes("wz_rs_png");
            game.UIUtils.setAnchorPot(image);
            image.alpha = 0;
            this.effectGroup.addChild(image);
            switch (direction) {
                case "mine":
                    image.horizontalCenter = 0;
                    image.bottom = 120;
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
            value = NumberFormat.fNumber(value);
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
            value = NumberFormat.fNumber(value);
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
                        if(dirction == "mine"){
                            this.mineShoupaiGroup.lockHu();
                        }
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

        /**
         * 游戏数据结算信息。
         */
        private async settlementData(e: egret.Event) {
            this.taskBar.visible = false;
            this.hzBtn.visible = false;
            this.majiangStatus = MajiangStatusEnum.OVER;
            this.timeDirectionBar.removeTimer();
            this.tgGroup.visible = false;
            let resp = e.data;
            let players = resp.players;
            this.tgGroup.visible = false;//解决牌局结束，托管不消失。
            this.gameOverShow(players);
            this.showDuijuAni(() => {
                this.checkChaHuazhu(resp.options.hpts, () => {
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

                    let mineData = players[Global.gameProxy.getMineIndex()];
                    Global.playerProxy.updatePlayerGold(mineData.ownGold);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_JIESUAN, { players: players, status: resp.status });
                });
            })
        }

        /**
         * 花猪
         * type 3 : 5 一组
         * @param  {} records
         */
        private checkChaHuazhu(records, callback) {
            let huazuArr = records[4] || {};
            let roomInfo = Global.gameProxy.roomInfo;
            if (!roomInfo) {
                return;
            }
            let data = {};
            for (let playerIndex in huazuArr) {
                let goldData = huazuArr[playerIndex];
                let playerData = roomInfo.players[playerIndex] as PlayerGameDataBean;
                playerData.gold = NumberFormat.add(playerData.gold, goldData.gainGold);
                data[playerIndex] = { score: goldData.gainGold, type: 4 };
            }
            let time = 0;
            for (var key in data) {
                time = 3000;
                this.showScoreAni(key, data[key]);
            }
            egret.setTimeout(() => {
                this.checkChajiao(records, callback);
            }, this, time);
        }

        /**
         * 花猪和查大叫
         * type 3 : 5 一组
         * @param  {} records
         */
        private checkChajiao(records, callback) {
            let chajiaoArr = records[3] || {};
            let roomInfo = Global.gameProxy.roomInfo;
            if (!roomInfo) {
                return;
            }
            let data = {};
            for (let playerIndex in chajiaoArr) {
                let goldData = chajiaoArr[playerIndex];
                let playerData = roomInfo.players[playerIndex] as PlayerGameDataBean;
                playerData.gold = NumberFormat.add(playerData.gold, goldData.gainGold);
                data[playerIndex] = { score: goldData.gainGold, type: 3 };
            }
            let time = 0;
            for (var key in data) {
                time = 3000;
                this.showScoreAni(key, data[key]);
            }
            egret.setTimeout(() => {
                this.checkTuishui(records, callback);
            }, this, time);
        }

        /**
         * 退税
         * @param  {} records
         */
        private checkTuishui(records, callback) {
            let tuishuiArr = records[5] || {};
            let roomInfo = Global.gameProxy.roomInfo;
            if (!roomInfo) {
                return;
            }
            let data = {};
            for (let playerIndex in tuishuiArr) {
                let goldData = tuishuiArr[playerIndex];
                let playerData = roomInfo.players[playerIndex] as PlayerGameDataBean;
                playerData.gold = NumberFormat.add(playerData.gold, goldData.gainGold);
                data[playerIndex] = { score: goldData.gainGold, type: 5 };
            }
            let time = 0;
            for (var key in data) {
                time = 3000;
                if (data[key].score != 0) {
                    this.showScoreAni(key, data[key]);
                }
            }
            egret.setTimeout(callback, this, time);
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
         * 流水按钮
         */
        private lsBtn: eui.Button;
        /**
         * 聊天按钮
         */
        private chatBtn: eui.Button;

        private huTipsBar: HuTipsBar;

        private recordBar: RecordBar;

        private ctBar: ChatBar;

        public lsBtnTouch() {
            if (!this.recordBar) {
                this.recordBar = new RecordBar();
                this.panelGroup.addChild(this.recordBar);
            }
            if (this.recordBar.visible) {
                this.recordBar.hide();
                return;
            }
            this.recordBar.show();
            this.recordBar.bottom = 150;
            this.recordBar.right = 150;

        }

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
            if (this.recordBar) {
                this.recordBar.hide();
            }
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
            // if(Global.gameProxy.getMineGameData().huCards.length > 0){
            //     return;
            // }
            // if (this.lastHuTips.length < 1) {
            //     return;
            // }
            let mineData = Global.gameProxy.getMineGameData();
            let cards = _.clone(mineData.cards);
            if (mineData.lastCard) {
                MajiangUtils.updateCardsNum(cards, mineData.lastCard, -1);
            }
            // if (mineData.huCards.length > 0) {
            // let cards = this.mineShoupaiGroup.getShoupaiArr();
            let huCards = window['TingCardTip'].getTings(cards, mineData.selectColor, mineData.pengCards, mineData.gangCards);
            this.lastHuTips = huCards;
            // }
            this.showhupaiBar();
        }

        /**
         * 杠牌之后如果胡牌了 刷新一次
         */
        public flushTingCards() {
            let mineData = Global.gameProxy.getMineGameData();
            let cards = this.mineShoupaiGroup.getShoupaiArr();
            let huCards = window['TingCardTip'].getTings(cards, mineData.selectColor, mineData.pengCards, mineData.gangCards);
            this.lastHuTips = huCards;
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
            if(direction == "mine"){
                Global.gameProxy.changeGang2Peng(color);
                this.checkHuTips();
            }
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
                let count = majiang.MajiangUtils.findValueLess(huTip.value);
                huTip.count = count;
            }
            this.huTipsBar.showBar(this.lastHuTips);
        }

        /**
         * 检查当前手牌能否胡牌
         */
        public checkMineShoupaiHu() {
            let mineData = Global.gameProxy.getMineGameData();
            if (!mineData.selectColor) {
                return
            }
            //已经胡牌就确定牌型
            if (mineData.huCards.length > 0) {
                return;
            }
            let huCards = window['TingCardTip'].getTings(mineData.cards, mineData.selectColor, mineData.pengCards, mineData.gangCards);
            this.lastHuTips = huCards;
            this.tipBtn.visible = huCards.length > 0;
        }

        private lastHuTips: any = [];
        /**
         * 展现胡牌
         */
        private showHuTips() {
            let mineShoupai = this.touchShoupai;
            // if (!mineShoupai.huTip.visible) {
            //     return;
            // }
            if (Global.gameProxy.getMineGameData().huCards.length > 0) {
                return;
            }
            let value = mineShoupai.value;
            let mineCard = _.clone(Global.gameProxy.getMineGameData().cards);
            if (mineCard[value] > 1) {
                mineCard[value] -= 1;
            } else {
                delete mineCard[value];
            }
            let mineData = Global.gameProxy.getMineGameData();
            // if()
            let huCard = window['TingCardTip'].getTings(mineCard, mineData.selectColor, mineData.pengCards, mineData.gangCards);
            this.lastHuTips = huCard;
            this.tipsBarFlush();
        }

        /**
         * 检测胡牌提示
         */
        private checkHuTips() {
            let mineData = Global.gameProxy.getMineGameData();
            let cards = _.clone(mineData.cards);
            if (mineData.lastCard && mineData.huCards.length < 1) {
                this.mineShoupaiGroup.checkHuTips();
                // MajiangUtils.updateCardsNum(cards, mineData.lastCard, -1);
            } else {
                let majiang = this.mineShoupaiGroup.getShoupaiArr();
                let huCard = window['TingCardTip'].getTings(majiang, mineData.selectColor);
                this.lastHuTips = huCard;
                this.tipBtn.visible = huCard.length > 0;
            }
        }

        /**
         * 换桌子
         */
        private async hzBtnTouch() {
            this.hzBtn.visible = false;
            delete Global.gameProxy.lastGameConfig['roomId'];
            let quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
            Global.playerProxy.playerData.gold = quitResp.gold;
            if (quitResp) {
                if (quitResp.error) {
                    let text = GameConfig.GAME_CONFIG['long_config']['10002'].content;
                    this.hzBtn.visible = true;
                    Global.alertMediator.addAlert(text, () => {
                    }, null, true);
                    return;
                }
                let data = Global.gameProxy.lastGameConfig;
                let zhunru = data.diZhu;
                if (Global.playerProxy.playerData.gold < zhunru) {
                    Global.alertMediator.addAlert("金币不足");
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG);
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_HOME);
                    return;
                }
                let quitResp1: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_enter, data)
                if (quitResp1) {
                    game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_MAJIANG);
                    Global.gameProxy.clearRoomInfo();
                    game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAJIANG_MATCH);
                } else {
                    this.hzBtn.visible = true;
                    Global.alertMediator.addAlert("换桌失败，请重新换桌!");
                }
            } else {
                this.hzBtn.visible = true;
                Global.alertMediator.addAlert("换桌失败，请重新换桌!");
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
            this.gameTipsLabel2.text = "牌局结束前离开会收不到花猪和退税的收入";
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
                this.gameTipTimeOut = egret.setTimeout(() => {
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
            //血流胡牌了过后会提示
            // Global.gameProxy.getMineIndex()
            // if(roomInfo.gameId.indexOf("xlch") > -1 && ){
            //     this.showGameTipGroup(3);
            //     return;
            // }

            //显示庄家提示
            if (roomInfo.publicCardNum == 108 && roomInfo.dealer == Global.gameProxy.getMineIndex()) {
                this.showGameTipGroup(1);
            } else {
                if (Global.gameProxy.findHasQueColor() && !this.showQingqueTipState) {
                    this.showQingqueTipState = true;
                    this.showGameTipGroup(2);
                }
            }
        }
    }
}
