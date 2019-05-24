// TypeScript file
class UserheaderBar extends eui.Component {
    private playerImage: eui.Image;
    private select_kuang: eui.Image;
    private chose: eui.Image;
    private value: any;
    private sex: any;
    public constructor() {
        super();
        this.skinName = new UserHeaderBarSkin();

    }

    public createChildren() {
        super.createChildren();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchOn, this);
    }

    private touchOn() {
        let info = { figureUrl: this.value, sex: this.sex };
        EventManager.instance.dispatch(EventNotify.CHANG_PLAYER, info);
    }

    public setContent(value, sex) {
        this.value = value;
        this.sex = sex;
        this.playerImage.source = `hall_header_${sex}_${value}_png`;
    }


    public setTouchon(value) {
        this.select_kuang.visible = this.value == value;
        this.chose.visible = this.value == value;
    }

    public defut() {
        this.select_kuang.visible = true;
        this.chose.visible = true;
    }


}

