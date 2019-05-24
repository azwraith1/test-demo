/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:27:41 
 * @Last Modified by:   Li MengChan 
 * @Last Modified time: 2018-06-25 14:27:41 
 * @Description: 代理的基本类
 */
class ResourceProxyBase extends puremvc.Proxy implements puremvc.IProxy{
    private _dataMap:Array<any> = new Array();//存储excel数据
    private _proxyName: string = "";//excel名称
    
    public constructor(proxyName: string = "") {
        super(proxyName);
        this._proxyName = proxyName;
    }
}
