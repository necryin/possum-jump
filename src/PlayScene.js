/**
 * Created by human on 17.09.2014.
 */

var PlayScene = cc.Scene.extend({
    space: null,
    backGround: null,
    bgShapes: [],
    shapesToRemove: [],
    gameLayer: null,
    remover: null,
    leftWall: null,
    rightWall: null,
    // init space of chipmunk
    initPhysics: function () {
        this.space = new cp.Space();
        // Gravity
        this.space.gravity = cp.v(0, -10);

        // init body
        var body = new cp.Body(1, cp.momentForBox(1, 10000, 10));
        body.p = cc.p(-1000, g_heroStartY + 200);
        this.remover = new cp.SegmentShape(body,
            cp.v(0, 200),// start point
            cp.v(4294967295, 0),// MAX INT:4294967295
            0);// thickness of wall
        this.space.addShape(this.remover);
        this.remover.setCollisionType(SpriteTag.remover);

//        this.leftWall = new cp.SegmentShape(this.leftBody,
//            cp.v(0, winSize.height),// start point
//            cp.v(0, -4294967295),// MAX INT:4294967295
//            10);// thickness of wall

//        this.rightWall = new cp.SegmentShape(this.rightBody,
//            cp.v(winSize.width, winSize.height),// start point
//            cp.v(0, -4294967295),// MAX INT:4294967295
//            10);// thickness of wall

        // setup chipmunk CollisionHandler
        this.space.addCollisionHandler(SpriteTag.hero, SpriteTag.yummy,
            this.collisionYummyBegin.bind(this), null, null, null);

        this.space.addCollisionHandler(SpriteTag.hero, SpriteTag.rod,
            this.collisionRockBegin.bind(this), null, null, null);

        this.space.addCollisionHandler(SpriteTag.rod, SpriteTag.yummy,
            this.collisionNullBegin.bind(this), null, null, null);

        this.space.addCollisionHandler(SpriteTag.rod, SpriteTag.remover,
            this.collisionRemoverBegin.bind(this), null, null, null);

        this.space.addCollisionHandler(SpriteTag.bg_obj, SpriteTag.remover,
            this.collisionRemoverBegin.bind(this), null, null, null);

        this.space.addCollisionHandler(SpriteTag.yummy, SpriteTag.remover,
            this.collisionRemoverBegin.bind(this), null, null, null);
    },

    collisionYummyBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.shapesToRemove.push(shapes[1]);
        if (config.sound) {
            cc.audioEngine.playEffect(res.pickup_yummy_mp3);
        }
        var statusLayer = this.getChildByTag(TagOfLayer.Status);
        statusLayer.addScore(1);
    },

    collisionRockBegin: function (arbiter, space) {
        cc.log("==game over");
        //stop bg music
        cc.audioEngine.stopMusic();
        cc.director.pause();
        this.addChild(new GameOverLayer());
    },

    collisionNullBegin: function (arbiter, space) {
        return false;
    },

    collisionRemoverBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        //TODO наверное не стоит надеяться что remover hashid = 0 always
        var shapeToRemove = shapes[0].hashid == 0 ? shapes[1] : shapes[0];
        cc.log("collide with remover. Type#" + shapeToRemove.collision_type);
        this.shapesToRemove.push(shapeToRemove);
    },

    onEnter: function () {
        this._super();
        this.initPhysics();

        this.gameLayer = cc.Layer.create();
        //add three layer in the right order
        this.gameLayer.addChild(new BackgroundLayer(this.space, COLOR.DARKBLUE, COLOR.BLUE), 0, TagOfLayer.Background);
        this.gameLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.Animation);

        this.addChild(this.gameLayer);
        this.addChild(new StatusLayer(), 0, TagOfLayer.Status);

        //add background music
        if (config.sound) {
            cc.audioEngine.playMusic(res.main_mp3, true);
        }

        this.scheduleUpdate();
    },

    update: function (dt) {
        // chipmunk step
        this.space.step(dt);

        var animationLayer = this.gameLayer.getChildByTag(TagOfLayer.Animation);

        //gb analog
        for (var i = 0; i < this.shapesToRemove.length; i++) {
            var shape = this.shapesToRemove[i];
            animationLayer.deleteBgByShape(shape);
        }
        this.shapesToRemove = [];

        var eyeY = animationLayer.getEyeY();
        var winSize = cc.director.getWinSize();
        this.remover.a.y = eyeY + winSize.height / 2 + 100;
        this.gameLayer.setPosition(cc.p(0, -eyeY));
    }

});