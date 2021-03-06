/**
 * Created by human on 16.09.2014.
 */
var SettingsLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this._super();
        var winsize = cc.director.getWinSize();
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);
        var spritebg = cc.Sprite.create(res.main_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);

    },

    onBackCallback: function (pSender) {
        var scene = new cc.Scene();
        scene.addChild(new MainLayer());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },

    onSoundControl: function () {
        config.sound = !config.sound;
        var audioEngine = cc.audioEngine;
        if (config.sound) {
            audioEngine.playMusic(res.main_mp3, true);
        } else {
            audioEngine.stopMusic();
            audioEngine.stopAllEffects();
        }
    },

    onModeControl: function () {}
});
