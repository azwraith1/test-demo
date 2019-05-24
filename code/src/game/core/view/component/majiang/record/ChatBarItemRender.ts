module majiang {
	export class ChatBarItemRender extends game.BaseItemRender {
		private chat_language: eui.Label;
		public constructor() {
			super();

			this.skinName = new ChatBarItemSkin();
		}

		public createChildren() {
			super.createChildren();

		}

		protected dataChanged(): void {	
		this.chat_language.text = this.data["message"];
		}
	}
}