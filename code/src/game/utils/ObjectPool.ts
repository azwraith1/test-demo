class ObjectPool {
	private static cacheDict: Object = {};
	/**生产*/
	public static produce(cacheName: string, clazz: any) {
		let cacheArr = ObjectPool.cacheDict[cacheName];
		if (!cacheArr) {
			cacheArr = [];
		}
		if (cacheArr.length > 0) {
			let one = cacheArr.shift();
			return one;
		} else {
			return null;
		}
	}
	/**回收*/
	public static reclaim(cacheName: string, obj: any): void {
		let cacheArr = ObjectPool.cacheDict[cacheName];
		if (!cacheArr) {
			ObjectPool.cacheDict[cacheName] = [];
		}
		ObjectPool.cacheDict[cacheName].push(obj);
	}
	/**
	 * 对象池数量
	 * @param  {} cacheName
	 */
	public static objectChildrenNum(cacheName){
		let cacheArr = ObjectPool.cacheDict[cacheName];
		return cacheArr.length;
	}
	/**
	 * 注销对象池
	 * @param  {} cacheName
	 */
	public static cancelPool(cacheName){
		ObjectPool.cacheDict[cacheName] = null;
	}
}