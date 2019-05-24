/*
 * @Author: he bing 
 * @Date: 2018-08-06 17:28:15 
 * @Last Modified by: he bing
 * @Last Modified time: 2018-10-08 16:15:06
 * @Description: 聊天框，表情框
 */

module majiang {
	export class ChatBar extends game.BaseUI {
		private chatGroup: eui.Group;
		private chatImgGroup: eui.Group;
		private chat_biaoqing: eui.Group;
		private chat_biaoqing1: eui.Group;
		private chat_wenzi: eui.Group;
		private chat_wenzi1: eui.Group;
		private chatLanguageList: eui.List;
		public constructor() {
			super();
			this.skinName = new ChatBarSkin();

		}

		public createChildren() {
			super.createChildren();
			//	alert(JSON.stringify(GameConfig.GAME_CONFIG))
			this.visible = false;
			this.showVisible(1);
			let messageArr: Array<Object> = MajiangConfig.commonMessage;//这个就是你需要添加的数据源
			var myCollection: eui.ArrayCollection = new eui.ArrayCollection(messageArr);
			this.chatLanguageList.dataProvider = myCollection
			this.chatLanguageList.itemRenderer = ChatBarItemRender;//ChatBarItemRender 这个要单独写个类，做赋值的。
			this.chatLanguageList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onCommonMessageSelected, this);//监听的方法

		}

		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			let msg = null;
			switch (e.target) {
				case this.chat_biaoqing:
					this.showVisible(1)
					break;
				case this.chat_wenzi:
					this.showVisible(0)
					break;
				case this.chat_biaoqing1:
					this.showVisible(1)
					break;
				case this.chat_wenzi1:
					this.showVisible(0)
					break;
				default:
					{
						for (let i = 0; i < 12; i++) {
							if (e.target == this.chatImgGroup.getChildAt(i)) {
								msg = this.chatImgGroup.getChildAt(i)["_source"];
								this.hide();
								break;
							}
						}
					}
					break;
			}

			if (msg) {
				let params1: Object = {};
				params1["message"] = msg
				params1["type"] = MajiangConfig.msgType.Expression;//
				this.cacelTuoguan(params1);
			}

		}

		public show() {
			this.visible = true;
		}
		public hide() {
			this.visible = false;
		}

		public hideBar() {
			this.visible = false;
		}
		public showVisible(num) {
			if (num == 1) {
				this.chat_biaoqing.visible = true;
				this.chatImgGroup.visible = true;
				this.chat_wenzi1.visible = true;
				this.chat_wenzi.visible = false;
				this.chatLanguageList.visible = false;
			} else {
				this.chat_wenzi.visible = true;
				this.chat_biaoqing1.visible = true;
				this.chatLanguageList.visible = true;
				this.chat_biaoqing.visible = false;
				this.chatImgGroup.visible = false;
			}
		}

		private onCommonMessageSelected(): void {

			let list_chat_common = this.chatLanguageList;
			//	let params: Object = {};
			let params1: Object = {};
			params1["message"] = list_chat_common.selectedItem["id"];
			params1["type"] = MajiangConfig.msgType.Word;//
			this.cacelTuoguan(params1);
			this.hide();
		}


		private async cacelTuoguan(message) {
			// let params: Object = {};
			// params["message"] = message.message
			// params["type"] = message.type;//
			var handler = ServerPostPath.game_mjHandler_c_chat;
			let resp: any = await game.PomeloManager.instance.request(handler, message);
		}


	}
}