/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:27:19
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-23 10:56:39
 * @Description: 手牌集合组
 */
module majiang {
	export class MineShoupaiGroup extends BaseShoupaiGroup {
		public shoupais: MineShoupai[] = [];
		public mopai: MineShoupai;
		public hupaiMap;
		public lastTouchPai: MineShoupai;
		public lastIndex: number;
		public constructor() {
			super();
			// this.skinName = new MineShoupaiGroupSkin();
		}

		public createChildren() {
			super.createChildren();
			this.sortShoupais();
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.SHOUPAI_TOUCH_SUC, this.shoupaiTouchOn, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.SHOUPAI_TOUCH_SUC, this.shoupaiTouchOn, this);
		}

		//-----new
		public sortShoupais() {
			let newArr = [];
			let mineData: PlayerGameDataBean = Global.gameProxy.getMineGameData();
			let selectColor = mineData.selectColor;
			//手牌数组排序
			this.shoupais = _.sortBy(this.shoupais, (shoupai) => {
				if (Math.floor(shoupai.value / 10) == selectColor) {
					return 40 + shoupai.value;
				} else {
					return shoupai.value;
				}
			});
			//更新自己当前的牌 并且排序
			let sortCardsArr = Global.gameProxy.getMineShuopaiArr();
			//根据重新排序的坐标移动
			for (let i = 0; i < this.shoupais.length; i++) {
				let shoupai = this.shoupais[i];
				let index = sortCardsArr.indexOf(shoupai.value);
				sortCardsArr[index] = -1;
				shoupai.name = "mj" + (index + 1);
				let record = this.recordsJson[index + 1];
				if (Global.runBack) {
					shoupai.setPosition(index + 1);
					shoupai.x = record.x;
				} else {
					if (record) {
						shoupai.setPosition(index + 1);
						egret.Tween.get(shoupai).to({
							x: record.x
						}, 300, egret.Ease.quintOut);
					}
				}
			}
			this.checkShoupaiError();
		}

		/**
		 * 玩家出牌
		 */
		public sortShoupaisByChupai(value = null) {
			if (this.mopai == this.lastTouchPai) {
				this.checkShoupaiByChupaiError3();
				return;
			}
			if (value) {
				if (this.mopai.value == value) {
					this.lastTouchPai = this.mopai;
				} else {
					this.lastTouchPai = this.findMajiangByValue(value);
				}
			}
			let color = Global.gameProxy.getMineGameData().selectColor;
			if (this.lastTouchPai) {
				this.lastTouchPai.visible = true;
				this.lastTouchPai.x = this.mopai.x;
				this.lastTouchPai.y = this.mopai.y;
				this.lastTouchPai.resetValue(this.mopai.value);
				this.lastTouchPai.colorIsLight(color);
				this.lastTouchPai = null;
			}
			this.mopai.visible = false;
			//先把手中牌排序
			let sortCardsArr = Global.gameProxy.getMineShuopaiArr();
			for (let i = 0; i < this.shoupais.length; i++) {
				let shoupai = this.shoupais[i];
				shoupai.visible = true;
				let index = sortCardsArr.indexOf(shoupai.value);
				sortCardsArr[index] = -1;
				shoupai.name = "mj" + (index + 1);
				let record = this.recordsJson[index + 1];
				if (record) {
					shoupai.setPosition(index + 1);
					shoupai.colorIsLight(color);
					egret.Tween.get(shoupai).to({
						x: record.x,
						y: record.y
					}, 600, egret.Ease.quintOut);
				}
			}
			this.checkShoupaiByChupaiError();
		}



		///---new end
		public shoupaiTouchOn(e: egret.TouchEvent) {
			this.lastTouchPai = e.data;
			//获取到上次的index
			this.lastIndex = -1;
			for (let i = 0; i <= 14; i++) {
				var majiang = this.mainGroup.getChildByName("mj" + (i + 1)) as MineShoupai;
				if (majiang && majiang == this.lastTouchPai) {
					this.lastIndex = i + 1;
					break;
				}
			}
		}

		// public shoupaiTouchOn(e: egret.TouchEvent) {
		// 	this.lastTouchPai = e.data;
		// 	//获取到上次的index
		// 	this.lastIndex = -1;
		// 	for (let i = 0; i <= 14; i++) {
		// 		var majiang = this.mainGroup.getChildByName("mj" + (i + 1)) as MineShoupai;
		// 		if (majiang && majiang == this.lastTouchPai) {
		// 			this.lastIndex = i + 1;
		// 			break;
		// 		}
		// 	}
		// }
		/**
		 * 初始化麻将数据
		 * @param  {} majiangArr
		 */
		public initWithArr(majiangArr, visible: boolean = true) {
			super.clearGroup();
			let color = Global.gameProxy.getMineGameData().selectColor;
			for (var i = 0; i < majiangArr.length; i++) {
				var index = i;
				var value = majiangArr[index];
				let shoupai = this.createShoupai(index, value);
				shoupai.setPosition(index);
				shoupai.visible = visible;
				shoupai.colorIsLight(color);
			}

			this.mopai = new MineShoupai(0);
			this.mainGroup.addChild(this.mopai);
			this.mopai.visible = false;
			this.mopai.name = "mopai";
			this.mopai.setPosition(-1);
			game.UIUtils.setAnchorPot(this.mopai);
			this.mopai.y = this.mopai.anchorOffsetY;
			this.mopai.addTouch();
		}


		private createShoupai(index, value): MineShoupai {
			var shoupai = new MineShoupai(parseInt(value));
			this.shoupais.push(shoupai);
			this.mainGroup.addChild(shoupai);
			var point = this.recordsJson[index + 1];
			game.UIUtils.setAnchorPot(shoupai);
			shoupai.x = point.x;
			shoupai.y = shoupai.anchorOffsetY;
			shoupai.name = point.name;
			shoupai.visible = false;
			shoupai.addTouch();
			return shoupai;
		}

		/**
		 * 根据牌重新绘制玩家手牌
		 * @param  {number[]} cards
		 */
		public sortShoupaiByValue(cards: number[], ani: boolean = true) {
			let color = Global.gameProxy.getMineGameData().selectColor;
			let isHu = Global.gameProxy.getMineGameData().huCards.length > 0;
			for (var i = 0; i < cards.length; i++) {
				var value = cards[i];
				var majiang = this.mainGroup.getChildByName("mj" + (i + 1)) as MineShoupai;
				let pos = this.recordsJson[(i + 1)];
				if (majiang) {
					majiang.visible = true;
					majiang.resetValue(value);
					if (!isHu) {
						majiang.colorIsLight(color);
					}
					if (ani) {
						egret.Tween.get(majiang).to({
							x: pos.x,
							y: pos.y
						}, 300, egret.Ease.quintOut);
					} else {
						majiang.x = pos.x;
						majiang.y = pos.y;
					}

				}
			}
		}

		/**
		 * sort手牌排序动画
		 */
		public sortShoupaiByMopai(cards: number[]) {
			let color = Global.gameProxy.getMineGameData().selectColor;
			for (let i = 0; i < this.shoupais.length; i++) {
				let shoupai = this.shoupais[i];
				let index = cards.indexOf(shoupai.value);
				cards[index] = -1;
				let pos = this.recordsJson[(index + 1)];
				shoupai.visible = true;
				shoupai.x = pos.x;
				shoupai.y = pos.y;
				shoupai.colorIsLight(color);
			}
			this.checkShoupaiError();
		}

		/**
		 * 根据name查找牌替换花色
		 * @param  {} name
		 * @param  {} value
		 */
		public changeShoupaiValue(name, value) {
			let shoupai = this.mainGroup.getChildByName(name) as MineShoupai;
			shoupai.resetValue(value);
		}

		/**
		 * 根据value查找
		 * @param  {} value
		 */
		public findMajiangByValue(value) {
			for (var i = 0; i < this.shoupais.length; i++) {
				var majiang = this.shoupais[i];
				if (majiang.value == value) {
					return majiang;
				}
			}
			return null;
		}


		public showHuTipsByValue(value) {
			let arr = this.shoupais;
			if (this.mopai) {
				arr = arr.concat([this.mopai]);
			}
			for (var i = 0; i < arr.length; i++) {
				let pai = arr[i];
				if (pai.value == value) {
					pai.huTip.visible = true;
				}
			}
		}

		/**
		 * 隐藏三张
		 */
		public hideRight3pais() {
			var myCarsArr = Global.gameProxy.getMineShuopaiArr();
			var selectHsz = Global.gameProxy.getMineGameData().selectedHSZCards;
			game.Utils.removeArrayItem(myCarsArr, selectHsz[0]);
			game.Utils.removeArrayItem(myCarsArr, selectHsz[1]);
			game.Utils.removeArrayItem(myCarsArr, selectHsz[2]);
			myCarsArr = myCarsArr.concat(selectHsz);
			this.sortShoupaiByValue(myCarsArr);
			//myCarsArr
			var index = 14;
			if (!this.mainGroup.getChildByName("mj" + index)) {
				index = 13;
			}
			for (var i = index; i > index - 3; i--) {
				this.mainGroup.getChildByName("mj" + i).visible = false;
			}
		}
		/*
		 * 帮玩家选择三张牌
		 */
		public randomChoseThree(value) {
			for (let i = 0; i < this.shoupais.length; i++) {
				let shoupai = this.shoupais[i];
				if (shoupai.selected) {
					continue;
				}
				if (shoupai.value == value) {
					shoupai.selectUp();
					return shoupai;
				}

			}
			return null;

		}

		public sortMineShoupai() {
			let mineColorsArr = Global.gameProxy.getMineShuopaiArr();
			this.sortShoupaiByMopai(mineColorsArr);
		}

		/**
		 * 摸牌
		 * @param  {} card
		 */
		public playerNewCardPush(card) {
			this.lastTouchPai = null;
			this.mopai.resetValue(card);
			this.showMopai(true);
		}

		/**
		 * 摸牌动画
		 * @param  {boolean} needAni
		 */
		public showMopai(needAni: boolean) {
			// super.showMopai(needAni);
			this.setPointByIndex(this.shoupais.length + 1);
			for (var i = 0; i < this.shoupais.length; i++) {
				if (this.shoupais[i].visible == false) {
					this.shoupais[i].visible = true;
				}
			}
			let mopai = this.mopai;
			let pos = this.recordsJson[this.shoupais.length + 1];
			if (pos) {
				mopai.x = pos.x + mopai.width / 2;
				mopai.y = mopai.anchorOffsetY;
			}
			let mineColor = Global.gameProxy.getMineGameData();
			mopai.colorIsLight(mineColor.selectColor);
			if (Global.runBack) {
				mopai.visible = true;
			}
			if (mopai.visible) {
				this.checkHuTips();
				return;

			}
			mopai.visible = true;
			egret.Tween.removeTweens(mopai)
			if (needAni) {
				var x = mopai.x;
				var y = mopai.anchorOffsetY;
				mopai.x += mopai.width;
				mopai.y -= mopai.height;
				mopai.rotation = 75;
				egret.Tween.get(mopai).to({
					rotation: 0,
					x: x,
					y: y
				}, 350, egret.Ease.circIn).call(() => {
					mopai.x = x;
					mopai.y = y;
					this.checkHuTips();
				}, this);
			}
		}


		public shoupaiDowns() {
			for (var i = 0; i < this.shoupais.length; i++) {
				this.shoupais[i].change2NoSelect();
			}
		}


		/**
		 * 删除手牌中一定数量的牌
		 */
		public removeShoupaiByValue(value, number) {
			for (let i = 0; i < number; i++) {
				let pai = this.findMajiangByValue(value);
				if (pai) {
					game.Utils.removeArrayItem(this.shoupais, pai);
					game.UIUtils.removeSelf(pai);
				}
			}
		}

		/**
		 * 删除手牌by碰
		 * @param  {} value
		 */
		public removeShoupaiByPeng(value) {
			this.removeShoupaiByValue(value, 2);
			this.lastTouchPai = null;
			this.sortShoupais();
			this.changeLast2Mopai();
		}


		public removeShoupaiByChi(card, maxCard) {
			for (let i = 0; i < 3; i++) {
				let value = maxCard - i;
				if (value != card) {
					this.removeShoupaiByValue(value, 1);
				}
			}
			this.lastTouchPai = null;
			this.sortShoupais();
			this.changeLast2Mopai();

		}

		/**
		 * 删除手牌by杠
		 * @param  {} value
		 */
		public removeShoupaiByGang(value) {
			this.lastTouchPai = null;
			if (this.mopai.visible && this.mopai.value != value) {
				this.lastTouchPai = this.findMajiangByValue(value);
				this.lastTouchPai.visible = false;
			}
			this.removeShoupaiByValue(value, 4);
			if (this.lastTouchPai) {
				this.mainGroup.addChild(this.lastTouchPai);
				this.shoupais.push(this.lastTouchPai);
				this.lastTouchPai.addTouch();
			}
			this.sortShoupaisByChupai();
		}

		public getMopaiPosition() {
			let number = this.mainGroup.numChildren + 1;
			return this.recordsJson[number];
		}

		public changeLast2Mopai() {
			if (this.isMopais(this.shoupais.length)) {
				let last = this.getLastMajiang() as MineShoupai;
				this.mopai.resetValue(last.value);
				game.UIUtils.removeSelf(last);
				game.Utils.removeArrayItem(this.shoupais, last);
				this.showMopai(false);
			}
		}

		/**
		 * 锁定胡牌后无法点击
		 */
		public lockHu() {
			for (var i = 0; i < this.shoupais.length; i++) {
				this.shoupais[i].huLight();
			}
		}

		public unLockAll() {
			let arr = this.shoupais;
			if (this.mopai) {
				arr = this.shoupais.concat([this.mopai]);
			}
			for (var i = 0; i < arr.length; i++) {
				arr[i].huUnLight();
				// arr[i].huTip.visible = false;;
			}
		}


		public unLockByValue(value) {
			let arr = this.shoupais;
			if (this.mopai) {
				arr = this.shoupais.concat([this.mopai]);
			}
			for (var i = 0; i < arr.length; i++) {
				let shoupai = arr[i];
				if (shoupai.value == value) {
					shoupai.huUnLight();
					shoupai.huTip.visible = true;
				}

			}
		}

		/**
		 * 牌身上的胡牌提示隐藏
		 * @param  {} visible
		 */
		public changePaiToVisible(visible) {
			let paiArr = this.shoupais.concat([this.mopai]);
			for (let i = 0; i < paiArr.length; i++) {
				let pai = paiArr[i];
				pai.huTip.visible = visible
			}
		}

		/**
		 * 检测哪些牌打出去是可以胡的
		 * @param  {} value
		 */
		public changePaiToTip(value) {
			let paiArr = this.shoupais.concat([this.mopai]);
			for (let i = 0; i < paiArr.length; i++) {
				let pai = paiArr[i];
				if (!pai.huTip.visible) {
					pai.huTip.visible = game.Utils.valueEqual(pai.value, value);
				}
			}
		}

		/**
		 * 检测是不是定缺花色
		 */
		public checkColors() {
			let color = Global.gameProxy.getMineGameData().selectColor;
			for (let i = 0; i < this.shoupais.length; i++) {
				let pai = this.shoupais[i];
				if (pai) {
					pai.colorIsLight(color);
				}
			}
		}

		public checkShoupaiByChupaiError() {
			let arr = [13, 10, 7, 4, 1];
			//手牌错误
			if (arr.indexOf(this.shoupais.length) < 0) {
				console.log("手牌错误1")
				game.PomeloManager.instance.disConnect();
				return true;
			}
			if (this.checkShoupaiByChupaiError3()) {
				return true;
			}
			this.checkShoupaiByChupaiError2();
			return false;
		}

		private checkShoupaiByChupaiError3() {
			for (let i = 1; i <= this.shoupais.length; i++) {
				let child = this.mainGroup.getChildByName("mj" + i);
				if (!child) {
					console.log("手牌错误3")
					game.PomeloManager.instance.disConnect();
					return true;
				}
			}
		}

		public checkShoupaiError() {
			let arr = [12, 9, 6, 3];
			//手牌错误
			if (arr.indexOf(this.shoupais.length) > -1) {
				console.log("手牌错误2")
				game.PomeloManager.instance.disConnect();
				return true;
			}
			//
			let length = this.shoupais.length;
			if (this.isMopais(length)) {
				length -= 1;
			}
			for (let i = 1; i <= length; i++) {
				let child = this.mainGroup.getChildByName("mj" + i);
				if (!child) {
					console.log("手牌错误4")
					game.PomeloManager.instance.disConnect();
					return true;
				}
			}
			return false;
		}


		/**
		 * 判断打那张牌可以下叫
		 */
		public checkHuTips() {
			try {
				//过滤大众麻将
				let gameConfig = Global.gameProxy.lastGameConfig;
				let mineData = Global.gameProxy.getMineGameData();
				if (gameConfig.gameId == 10006 || gameConfig.gameId == "dzmj") {
					return;
				}
				this.changePaiToVisible(false);
				let mineCard = Global.gameProxy.getMineShuopaiArr();
				if (mineData.huCards.length > 0 || !this.mopai.visible) {
					return;
				}
				let huCards = {};
				for (let i = 0; i < mineCard.length; i++) {
					let majiang = {};
					for (let j = 0; j < mineCard.length; j++) {
						if (i == j) {
							continue;
						}
						let value = mineCard[j];
						if (majiang[value]) {
							majiang[value] += 1;
						} else {
							majiang[value] = 1;
						}
					}
					let result = window['TingCardTip'].getTings(majiang, mineData.selectColor, mineData.pengCards, mineData.gangCards);
					if (result.length > 0) {
						huCards[mineCard[i]] = 1;
					}
				}
				//根据value获取
				let huArr = _.keys(huCards);
				for (let i = 0; i < huArr.length; i++) {
					let value = huArr[i];
					this.changePaiToTip(value);
				}
			} catch (e) {
				// alert(JSON.stringify(e));	
			}
		}


		/**
		 * 获取当前手牌的排数
		 */
		public getShoupaiArr() {
			let majiang = {};
			for (let i = 0; i < this.shoupais.length; i++) {
				let shoupai = this.shoupais[i];
				if (majiang[shoupai.value]) {
					majiang[shoupai.value]++;
				} else {
					majiang[shoupai.value] = 1;
				}
			}
			return majiang;
		}

		public checkShoupaiByChupaiError2() {
			for (let i = 0; i < this.shoupais.length; i++) {
				let pai = this.shoupais[i];
				let pai0 = this.shoupais[i + 1];
				if (pai && pai0) {
					if (Math.abs(pai0.x - pai0.x) > (pai.width - 20)) {
						game.PomeloManager.instance.disConnectAndReconnect();
						return;
					}
				}
			}
		}

		public playerTing() {
			for (let i = 0; i < this.shoupais.length; i++) {
				let pai = this.shoupais[i];
				pai.tingLight();
			}
		}



	}
}