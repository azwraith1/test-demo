/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:26:37 
 * @Last Modified by: Li MengChan
 * @Last Modified time: 2018-07-02 12:09:59
 * @Description: http请求代理模块
 */
module game {
    export class NetProxy extends ResourceProxyBase {
        public static NAME: string = "NetProxy";
        private callbackList: HashMap<number, Function> = new HashMap<number, Function>();

        public init() {
            Global.netProxy = this;
        }

        /**
         * 发送请求
         */
        public sendRequest(url: string, data: Object, callback: Function) {
            var loader: egret.URLLoader = new egret.URLLoader();
            this.callbackList.set(loader.hashCode, callback);
            loader.dataFormat = egret.URLLoaderDataFormat.VARIABLES;
            loader.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);

            var request: egret.URLRequest = new egret.URLRequest(url);
            request.requestHeaders.push(new egret.URLRequestHeader("Content-Type", "application/json;charset=utf-8"));
            request.method = data ? egret.URLRequestMethod.POST : egret.URLRequestMethod.GET;
            request.data = JSON.stringify(data);
            loader.load(request);
        }


        public sendRequestAsync(url: string, data: Object) {
            return new Promise((resolve, reject) => {
                var loader: egret.URLLoader = new egret.URLLoader();
                // this.callbackList.set(loader.hashCode, callback);
                loader.dataFormat = egret.URLLoaderDataFormat.VARIABLES;
                loader.addEventListener(egret.Event.COMPLETE, (event: egret.Event) => {
                    var loader = <egret.URLLoader>event.currentTarget;
                    loader.removeEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
                    loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
                    var str = loader.data.replace(/\s/g, "");
                    var data = JSON.parse(str);
                    resolve(data);
                }, this);
                var request: egret.URLRequest = new egret.URLRequest(url);
                request.requestHeaders.push(new egret.URLRequestHeader("Content-Type", "application/json;charset=utf-8"));
                request.method = data ? egret.URLRequestMethod.POST : egret.URLRequestMethod.GET;
                request.data = JSON.stringify(data);
                loader.load(request);
            });

        }


        private onPostComplete(event: egret.Event): void {
            var loader = <egret.URLLoader>event.currentTarget;
            loader.removeEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
            loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
            var str = loader.data.replace(/\s/g, "");
            var data = JSON.parse(str);
            var callback: Function = this.callbackList.get(loader.hashCode);
            if (callback) {
                callback(data);
                this.callbackList.remove(loader.hashCode);
            }
        }

        private onPostIOError(event: egret.IOErrorEvent): void {
            egret.error("post error : " + event);
        }


        public sendGetRequest(url: string, data: Object, callback: Function) {
            var loader: egret.URLLoader = new egret.URLLoader();
            this.callbackList.set(loader.hashCode, callback);
            loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
            loader.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);

            var request: egret.URLRequest = new egret.URLRequest(url);
            request.method = egret.URLRequestMethod.GET;
            var argsArr = [];
            // for (var key in data) {
            //     argsArr.push(key + "=" + data[key]);
            // }
            request.data = data//new egret.URLVariables(argsArr.join("&"));
            loader.load(request);
        }


    }
}
