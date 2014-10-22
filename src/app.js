
var MainLayer = cc.Layer.extend({
    ctor : function(){
        this._super();
        cc.director.setAnimationInterval(1.0/60);
    },
    init:function(){
        this._super();
        var winsize = cc.director.getWinSize();
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);
        var spritebg = cc.Sprite.create(res.main_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

        var menuItemPlay = cc.MenuItemSprite.create(
            cc.Sprite.create(res.play_png), // normal state image
            cc.Sprite.create(res.play_png), //select state image
            this.onPlay, this);
        var menuItemSettings = cc.MenuItemSprite.create(
            cc.Sprite.create(res.settings_png), // normal state image
            cc.Sprite.create(res.settings_png), //select state image
            this.onSettings, this);

        var menu = cc.Menu.create(menuItemPlay, menuItemSettings);
        menu.alignItemsVerticallyWithPadding(10);
        this.addChild(menu, 1, 2);
        menu.x = winsize.width / 2;
        menu.y = winsize.height / 2;
//        cc.audioEngine.playMusic(res.main_mp3, true);
    },

    onPlay : function(){
        cc.log("==onplay clicked");
//        cc.audioEngine.resumeMusic(res.main_mp3, true);
        cc.director.runScene(new PlayScene());
//        cc.audioEngine.playMusic(res.main_mp3, true);
    },

    onSettings :  function(){
        cc.log("==onsettings clicked");
        cc.audioEngine.pauseMusic();
        var scene = new cc.Scene();
        scene.addChild(new SettingsLayer());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        layer.init();
        this.addChild(layer);
    }
});

