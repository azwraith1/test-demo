module game {
	export class MCUtils {
		public static mcMap: HashMap<string, egret.MovieClip[]> = new HashMap<string, egret.MovieClip[]>();
		public static reclaim1(name: string, mc: egret.MovieClip){
			let mcArrs = MCUtils.mcMap.get(name);
			if(!mcArrs){
				mcArrs = [];
				MCUtils.mcMap.put(name, mcArrs);
			}
			mcArrs.push(mc);
			return true;
		}
		
		public static getMc(name: string, callback: Function = null, action: string = ""): egret.MovieClip {
			// let mcArrs = MCUtils.mcMap.get(name);
			// if(!mcArrs){
			// 	mcArrs = [];
			// 	MCUtils.mcMap.put(name, mcArrs);
			// }
			// if(mcArrs.length > 0){
			// 	let findMc =  mcArrs.pop();
			// 	if(findMc){
			// 		// console.error("复用动画" + name)
			// 		findMc.gotoAndStop(0);
			// 		if(callback){
			// 			callback(findMc);
			// 		}
			// 		return findMc;
			// 	}
			// }
			// console.error("新建动画" + name);
			let texture: egret.Texture = RES.getRes(name + "_png");
			if (texture) {
				let mc = createMc(action);
				if (callback) {
					callback(mc);
				}
				return mc;
			} else {
				RES.getResAsync(name + "_png", () => {
					RES.getResAsync(name + "_json", () => {
						let mc = createMc(action);
						if(mc){
							MCUtils.mcMap.put(name, mc);
						}
						if (callback) {
							callback(mc);
						}
					}, this);
				}, this);
				return null;
			}

			function createMc(action: string) {
				let texture: egret.Texture = RES.getRes(name + "_png");
				let data: any = RES.getRes(name + "_json");
				//创建动画工厂
				let mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
				//创建 MovieClip，将工厂生成的 MovieClipData 传入参数
				let mc: egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData(action));
				mc['fac'] = mcDataFactory;
				mc.touchEnabled = false;
				return mc;
			}
		}

		public static changeAction(mc: egret.MovieClip, action: string) {
			var fac: egret.MovieClipDataFactory = mc['fac'];
			mc.movieClipData = fac.generateMovieClipData(action);
		}
	}
}