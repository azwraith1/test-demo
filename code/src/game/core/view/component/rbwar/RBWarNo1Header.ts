module rbwar {
	export class RBWarNo1Header extends BaseHeader {
		private person1: DBComponent;
		private person2: DBComponent;
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
			let person1 = GameCacheManager.instance.getCache("rbw_no1");
			if (!person1) {
				person1 = new DBComponent("rbw_no1");
				GameCacheManager.instance.setCache("rbw_no1", person1);
			}
			person1.x = 131;
			person1.y = 51;
			this.dbGroup.addChild(person1);
			this.person1 = person1;
			this.person1.playNamesAndLoop(["xunhuan"]);


			let person2 = GameCacheManager.instance.getCache("rbw_no11");
			if (!person2) {
				person2 = new DBComponent("rbw_no1");
				GameCacheManager.instance.setCache("rbw_no11", person2);
			}
			person2.x = 130;
			person2.y = 51;
			this.dbGroup1.addChild(person2);
			this.person2 = person2;
			this.person2.playNamesAndLoop(["touxiang"]);
		}
	}
}