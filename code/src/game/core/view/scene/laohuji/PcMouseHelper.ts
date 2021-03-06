// TypeScript file 更改鼠标的图案
class PcMouseHelper {
    private static _instance: PcMouseHelper;
    private isListening: boolean = false;
    private canvas: any;
    private list: Array<egret.DisplayObjectContainer>;
 
    public constructor() {
        this.list = new Array<egret.DisplayObjectContainer>();
    }
 
    private add(): void {
        if(this.isListening == false) {
            this.isListening = true;
 
            this.canvas = document.getElementsByTagName("CANVAS")[0];
            this.canvas.addEventListener('mousemove',this.onMove);
        }
    }
 
    public addListener(target: egret.DisplayObjectContainer): void {
        this.add();
        this.list.push(target);
    }
 
    public removeListener(target: egret.DisplayObjectContainer): void {
        if(PcMouseHelper._instance.list.indexOf(target) > -1) {
            PcMouseHelper._instance.list.splice(PcMouseHelper._instance.list.indexOf(target),1);
            this.checkCount();
        }
    }
 
    private checkCount(): void {
        for(var key in PcMouseHelper._instance.list) {
            return;
        }
        PcMouseHelper._instance.canvas.style.cursor = "auto";
        this.canvas.removeEventListener('mousemove',this.onMove);
        this.isListening = false;
    }
 
    private onMove(evt: MouseEvent): void {
        var len: number = PcMouseHelper._instance.list.length;
        var temp = PcMouseHelper._instance.getPoint(evt.currentTarget,evt.x,evt.y);
        for(var i = 0;i < len;i++) {
            var target: egret.DisplayObjectContainer;
            if(PcMouseHelper._instance.list[i].hitTestPoint(temp.x,temp.y)) {
                PcMouseHelper._instance.canvas.style.cursor = "pointer";
                return;//目前同一时间鼠标只能悬浮在一个对象上
            }
        }
        PcMouseHelper._instance.canvas.style.cursor = "auto";
    }
    
    /**
     * 获取canvas内的鼠标坐标
     * egret 3.0.2版本设置了 css width/height
     * @param canvas
     * @param x
     * @param y
     */
    public getPoint(canvas:any,x: number,y: number): any {
        var style = window.getComputedStyle(canvas,null);
        var rect = canvas.getBoundingClientRect();
        return {
            x: (x - rect.left) * (canvas.width / parseFloat(style["width"])),// 全局坐标*水平方向的缩放因子
            y: (y - rect.top) * (canvas.height / parseFloat(style["height"]))
        };
    }
 
    public static get instance(): PcMouseHelper {
        if(PcMouseHelper._instance == null) {
            PcMouseHelper._instance = new PcMouseHelper();
        }
        return PcMouseHelper._instance;
    }
}
