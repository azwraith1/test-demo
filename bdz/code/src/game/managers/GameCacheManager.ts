/*
 * @Author: li mengchan 
 * @Date: 2018-08-23 13:54:56 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-10 10:35:20
 * @Description: 游戏缓存服务
 */
class GameCacheManager {
		private static _instance: GameCacheManager;
		private _cache: HashMap<string, any> = new HashMap<string, any>();
		public constructor() {
			if (GameCacheManager._instance) {
				throw new Error("DateTimer使用单例");
			}
		}

		public static get instance(): GameCacheManager {
			if (!GameCacheManager._instance) {
				GameCacheManager._instance = new GameCacheManager();
			}
			return GameCacheManager._instance;
		}

		/**
		 * 从缓存中拿取东西
		 * @param  {} name
		 */
		public getCache(name, clazz = null){
			let cacheObj = this._cache.get(name);
			if(!cacheObj && clazz){
				cacheObj = new clazz();
				this._cache.put(name, cacheObj);
			}else{
			}	
			return cacheObj;
		}


		public getMcCache(effectName, cacheName, callback){
			let cacheObj = this._cache.get(cacheName) as egret.MovieClip;
			if(cacheObj){
				// console.error(cacheName  + "  使用缓存");
				cacheObj.gotoAndStop(0);
				callback && callback(cacheObj);
				 return cacheObj
			}
			return game.MCUtils.getMc(effectName, (mv: egret.MovieClip) => {
				if(mv){
					// console.error(cacheName  + "  新建");
					this._cache.put(cacheName, mv);
					callback && callback(mv);
					return mv;
				}
			});
		}

		public setCache(name, cacheObj){
			this._cache.put(name, cacheObj);
		}
	}