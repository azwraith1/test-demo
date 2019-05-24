class RESUtils {
	public static getGroupTotal(resGroups: string[]) {
		if (!resGroups || resGroups.length < 1) {
			return 0;
		}
		let count = 0;
		for (let i = 0; i < resGroups.length; i++) {
			let items = RES.getGroupByName(resGroups[i]);
			for (let j = 0; j < items.length; j++) {
				let item = items[j];
				if (!item.loaded) {
					count += 1;
				}
			}
		}
		return count;
	}


	public static getResNameByGid() {
		switch (ServerConfig.gid) {
			case "mjxlch":
			case "mjxzdd":
				return "majiang_hall";
			case "blnn":
				return "niuniu_hall";
			case "dzmj":
				return "majiang_hall";
			case "zjh":
				return "zhajinhua_hall";
			default:
				return ServerConfig.gid + "_hall";
		}
	}
}