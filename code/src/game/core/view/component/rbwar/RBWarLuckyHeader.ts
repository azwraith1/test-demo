module rbwar {
	export class RBWarLuckyHeader extends BaseHeader {
		private person2: DBComponent;
		private person1: DBComponent;
		private dbGroup: eui.Group;
		private dbGroup1: eui.Group;
		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
			this.createPersons();
		}

		public createPersons() {
			let person2 = GameCacheManager.instance.getCache("rbw_luckey");
			if (!person2) {
				person2 = new DBComponent("rbw_luckey");
				GameCacheManager.instance.setCache("rbw_luckey", person2);
			}
			person2.x = 128;
			person2.y = 58;
			this.dbGroup.addChild(person2);
			this.person2 = person2;
			this.person2.playNamesAndLoop(["xunhuan"]);

			let person1 = GameCacheManager.instance.getCache("rbw_luckey1");
			if (!person1) {
				person1 = new DBComponent("rbw_luckey");
				GameCacheManager.instance.setCache("rbw_luckey1", person1);
			}
			person1.x = 120;
			person1.y = 58;
			this.dbGroup1.addChild(person1);
			this.person1 = person1;
			this.person1.playNamesAndLoop(["touxiang"]);
		}

		
	}
}