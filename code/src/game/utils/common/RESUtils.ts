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


	public static getRESNameByReconnect() {
		if (Global.gameProxy.roomState && Global.gameProxy.roomState.state == 1) {
			switch (Global.gameProxy.roomState.gid) {
				case "mjxlch":
				case "mjxzdd":
					return ["majiang_hall", "majiang_game"];
				case "blnn":
					return ["niuniu_hall", "niuniu_game"];
				case "dzmj":
					return ["dzmj_hall", "majiang_game"];
				case "zjh":
					return ["zhajinhua_hall", "zhajinhua_game"];
				default:
					return [ServerConfig.gid + "_hall", ServerConfig.gid + "_game"];
			}
		}
	}

	public static getResNameByGid(): string[] {
		if (Global.gameProxy.roomState && Global.gameProxy.roomState.state == 1) {
			return this.getRESNameByReconnect();
		}
		if (ServerConfig.gid && ServerConfig.gid != "") {
			switch (ServerConfig.gid) {
				case "mjxlch":
				case "mjxzdd":
					return ["majiang_hall"];
				case "blnn":
					return ["niuniu_hall"];
				case "dzmj":
					return ["dzmj_hall"];
				case "zjh":
					return ["zhajinhua_hall"];
				default:
					return [ServerConfig.gid + "_hall"];
			}
		}
		return [];
	}


}