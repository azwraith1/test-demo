/*
 * @Author: MC Lee 
 * @Date: 2019-03-27 13:54:51 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-04-04 14:59:48
 * @Description: 百得之手牌
 */
class BDZShoupai extends game.BaseUI {
	private poker1: BDZPoker;
	private poker2: BDZPoker;
	private poker3: BDZPoker;
	private poker4: BDZPoker;
	private goldLabel: eui.Label;
	private kuangImage: eui.Label;
	private huanpaiLabel: eui.BitmapLabel;
	public moveIndex: number = 1
	public pokerLists: BDZPoker[] = [];
	public selectLists: BDZPoker[] = [];
	//类型 1 朝左left -1 朝右rithg
	private type: number;
	private qipaiRect: eui.Rect;
	public constructor() {
		super();
	}

	public createChildren() {
		super.createChildren();
		if (this.skinName == "BDZLeftShoupaiSkin") {
			this.type = 1;
		} else {
			this.type = -1;
		}
		for (let i = 1; i <= 4; i++) {
			this.pokerLists.push(this[`poker${i}`]);
		}
		this.addTouchEvent(false);
		this.setNameByX();
		this.huanpaiLabel.text = "";
		this.kuangImage.visible = false;
	}

	public getSelectCards() {
		for (let i = 0; i < this.pokerLists.length; i++) {
			let poker = this.pokerLists[i];
			if (poker && poker.selected) {
				game.Utils.removeArrayItem(this.pokerLists, poker);
				this.selectLists.push(poker);
				poker.selectDown();
				// EventManager.instance.dispatch(EventNotify.BDZ_CARD_TOUCH, poker.name);
				i--;
			}
		}
		return this.selectLists;
	}


	public getSelectCardsByOther(number) {
		for (let i = 1; i <= number; i++) {
			let poker = this.pokerLists[4 - i];
			game.Utils.removeArrayItem(this.pokerLists, poker);
			this.selectLists.push(poker);
		}
		return this.selectLists;
	}


	public hebingCards(sort: boolean = true) {
		this.pokerLists = this.pokerLists.concat(this.selectLists);
		this.selectLists = [];
		this.setNames();
		// if(sort){
		this.autoSort(sort);
		// }
	}


	public setNameByX() {
		this.pokerLists = _.sortBy(this.pokerLists, (poker: BDZPoker) => {
			if (this.type == 1) {
				return poker.x;
			} else {
				return poker.x * -1;
			}
		});
		this.setNames();
	}


	private setNames() {
		for (let i = 0; i < this.pokerLists.length; i++) {
			this.pokerLists[i].name = (i + 1) + "";
		}
	}


	public sortShoupaiByValue() {
		let sort1 = _.sortBy(this.pokerLists, (poker: BDZPoker) => {
			return poker.number;
		});
		this.pokerLists = _.sortBy(sort1, (poker: BDZPoker) => {
			return poker.number % 100;
		});
		this.setNames();
		this.autoSort(true);
	}


	public autoSort(ani) {
		for (let i = 0; i < this.pokerLists.length; i++) {
			let poker = this.pokerLists[i];
			this.addChild(poker);
			let moveX = 6 + (i * 59);
			if (this.type == -1) {
				moveX = 43 + (i * 59);
			}
			if (ani) {
				egret.Tween.get(poker).to({
					x: moveX
				}, 200, egret.Ease.circOut);
			}
			else {
				poker.x = moveX;
			}
		}
	}


	public addTouchEvent(canTouch) {
		for (let i = 0; i < this.pokerLists.length; i++) {
			this.pokerLists[i].touchEnabled = canTouch;
		}
		for (let i = 0; i < this.selectLists.length; i++) {
			this.selectLists[i].touchEnabled = canTouch;
		}
	}


	public hideAllShoupai() {
		for (let i = 1; i <= 4; i++) {
			this[`poker${i}`].visible = false;
		}
	}

	public getGlobalIndex() {
		return this.getChildByName(this.moveIndex + "").localToGlobal();
	}

	public showShoupai(index) {
		this.getChildByName(index + "").visible = true;
	}

	public showShoupaiByAni(index, cardValue) {
		let poker = this.getChildByName(index) as BDZPoker;
		if (cardValue) {
			poker.initWithNum(cardValue);
		} else {
			let mineData = Global.roomProxy.getMineData() as PlayerGameDataBean;
			let cards = mineData.handCards.value;
			poker.initWithNum(cards[index - 1]);
		}
		poker.visible = true;
		poker.pokerB2ZAni1();
	}


	public showShoupaiRecCard(values) {
		for (let i = 0; i < values.length; i++) {
			let card = values[i];
			let poker = this.getChildByName((i + 1) + "") as BDZPoker;
			poker.visible = true;
			poker.initWithNum(card);
			poker.showB2Z();
		}
	}

	public showShoupaiRecLength(length) {
		for (let i = 0; i < length; i++) {
			let poker = this.getChildByName((i + 1) + "") as BDZPoker;
			poker.visible = true;
			poker.showZ2B();
		}
	}

	public selectUpByIndex(index) {
		let poker = this.getChildByName(index) as BDZPoker;
		if (poker.selected) {
			return poker.selectDown();
		} else {
			return poker.selectUp();
		}
	}


	public showKuangAni(useAni) {
		egret.Tween.removeTweens(this.kuangImage);
		this.kuangImage.alpha = 1;
		this.kuangImage.visible = useAni;
		if (useAni) {
			egret.Tween.get(this.kuangImage, { loop: true }).to({
				alpha: 0
			}, 500).to({
				alpha: 1
			}, 500)
		}
	}


	public showHuanpaiCount(numberArr) {
		let str = "";
		for (let i = 0; i < numberArr.length; i++) {
			str += numberArr[i]
		}
		this.huanpaiLabel.text = str;
	}

	/**
	 * 自动提示牌
	 */
	public autoTipsCards() {
		let mineInfo = Global.roomProxy.getMineInfo();
		let tipCard = mineInfo.tipCards;
		for (let i = 0; i < this.pokerLists.length; i++) {
			let poker = this.pokerLists[i] as BDZPoker;
			// EventManager.instance.dispatch(EventNotify.BDZ_CARD_TOUCH, poker.name);
			if (tipCard.indexOf(poker.number) > -1) {
				poker.selectUp();
			} else {
				poker.selectDown();
			}
		}
	}

	public cardsAllDown() {
		for (let i = 0; i < this.pokerLists.length; i++) {
			this.pokerLists[i].selectDown();
		}
		for (let i = 0; i < this.selectLists.length; i++) {
			this.selectLists[i].selectDown();
		}
	}


	public showQipaiAni(ani: boolean = true) {
		let poker0 = this.pokerLists[0];
		if (this.type == -1) {
			poker0 = this.pokerLists[this.pokerLists.length - 1];
		}
		this.qipaiRect.visible = true;
		this.addChild(this.qipaiRect);
		for (let i = 0; i < this.pokerLists.length; i++) {
			let poker = this.pokerLists[i] as BDZPoker;
			poker.selectDown();
			poker.showZ2B();
			if (ani) {
				if (i > 0) {
					egret.Tween.get(poker).to({
						x: poker0.x + (30 * i)
					}, 200, egret.Ease.sineIn)
				}
			} else {
				poker.x = poker0.x + (30 * i);
			}
		}
	}

	/**
	 * 其他玩家翻牌
	 * @param  {} playerIndex
	 */
	public showOtherFanpai(playerIndex) {
		let playerData = Global.roomProxy.getPlayerByIndex(playerIndex);
		let cards = playerData.handCards.value;
		for (let i = 0; i < this.pokerLists.length; i++) {
			let poker = this.pokerLists[i] as BDZPoker;
			poker.selectDown();
			poker.initWithNum(cards[i]);
			poker.pokerB2ZAni2();
		}
	}
}