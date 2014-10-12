/**
 * Created by human on 01.10.2014.
 */
var GameOverLayer = cc.LayerColor.extend({
    // constructor
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super(cc.color(0, 0, 0, 180));
        var winSize = cc.director.getWinSize();

        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        cc.MenuItemFont.setFontSize(30);
        var menuItemRestart = cc.MenuItemSprite.create(
            cc.Sprite.create(res.restart_n_png),
            cc.Sprite.create(res.restart_s_png),
            this.onRestart, this);
        var menu = cc.Menu.create(menuItemRestart);
        menu.setPosition(centerPos);
        this.addChild(menu);
    },

    onRestart:function (sender) {
        cc.director.resume();
        cc.director.runScene(new PlayScene());
    }
});