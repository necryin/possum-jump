/**
 * Created by human on 16.09.2014.
 */
var BackgroundLayer = cc.LayerGradient.extend({
    space: null,
    phase: 0,

    ctor:function (space, start, end, v) {
        this._super(start, end, v);
        this.space = space;
        this.init(start, end, v);
    },

    init:function (start, end, v) {
        this._super(start, end, v || cc.p(0, -1));
        var winSize = cc.director.getWinSize();
        this._setHeight(winSize.height * 2);
        this.setPosition(cc.p(0, -winSize.height));
//        this.setBlendFunc( cc.ONE_MINUS_DST_COLOR, cc.ZERO );
        this.setCompressedInterpolation(true);
        var anAction = cc.sequence(
            cc.tintTo(5, COLOR.DARKBLUE.r, COLOR.DARKBLUE.g, COLOR.DARKBLUE.b), //dark
//            cc.callFunc(this.setEndColor, this, COLOR.DARKBLUE),
            cc.delayTime(13),
            cc.tintTo(5, COLOR.BLUE.r, COLOR.BLUE.g, COLOR.BLUE.b),
            cc.delayTime(13)
        ).repeatForever();

        this.runAction(anAction);
        this.scheduleUpdate();
    },

    update:function (dt) {

    }
});
