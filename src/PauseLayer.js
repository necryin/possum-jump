/**
 * Created by human on 22.10.2014.
 */

var PauseLayer = cc.LayerColor.extend({

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super(cc.color(0, 0, 0, 140));
        var winSize = cc.director.getWinSize();
        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        this.labelScore = cc.LabelTTF.create("PAUSE", "Helvetica", 100);
        this.labelScore.setColor(cc.color(0,240,255));
        this.labelScore.setPosition(centerPos);
        this.addChild(this.labelScore);
    }

});
