/**
 * Created by human on 17.09.2014.
 */

var PlayScene = cc.Scene.extend({
    space:null,
    rodShapes:[],
    backGround: null,
    bgColor: null,
    yummyShapes:[],
    bgShapes:[],
    shapesToRemove:[],
    gameLayer:null,
    remover: null,
    leftWall: null,
    rightWall: null,
    time: 0,
    // init space of chipmunk
    initPhysics:function() {
        this.space = new cp.Space();
        // Gravity
        this.space.gravity = cp.v(0, -10);
        // set up Walls
        var winSize = cc.director.getWinSize();

        // init body
        var body = new cp.Body(1, cp.momentForBox(1, 10000, 10));
        body.p = cc.p(-1000, g_heroStartY + 200);
        this.remover = new cp.SegmentShape(body,
            cp.v(0, 200),// start point
            cp.v(4294967295, 0),// MAX INT:4294967295
            0);// thickness of wall
        this.space.addShape(this.remover);
        this.remover.setCollisionType(SpriteTag.remover);
        this.bgColor = new cc.Color(0,0,0, 255);
        this.leftBody = new cp.Body(1, cp.momentForBox(1, 10000, 10));
        this.leftBody.p = cc.p(0, g_heroStartY );
        this.leftWall = new cp.SegmentShape(this.leftBody,
            cp.v(0, winSize.height),// start point
            cp.v(0, -4294967295),// MAX INT:4294967295
            10);// thickness of wall
        this.space.addShape(this.leftWall);
        this.leftWall.setCollisionType(SpriteTag.wall);

        this.rightBody = new cp.Body(1, cp.momentForBox(1, 10, 10));
        this.rightBody.p = cc.p(0, g_heroStartY );
        this.rightWall = new cp.SegmentShape(this.rightBody,
            cp.v(winSize.width, winSize.height),// start point
            cp.v(0, -4294967295),// MAX INT:4294967295
            10);// thickness of wall
        this.space.addShape(this.rightWall);
        this.rightWall.setCollisionType(SpriteTag.wall);

        // setup chipmunk CollisionHandler
        this.space.addCollisionHandler(SpriteTag.hero, SpriteTag.yummy,
            this.collisionYummyBegin.bind(this), null, null, null);

//        this.space.addCollisionHandler(SpriteTag.hero, SpriteTag.rod,
//            this.collisionRockBegin.bind(this), null, null, null);

        this.space.addCollisionHandler(SpriteTag.hero, SpriteTag.wall,
            this.collisionNullBegin.bind(this), null, null, null);

        this.space.addCollisionHandler(SpriteTag.rod, SpriteTag.remover,
            this.collisionRemoverBegin.bind(this), null, null, null);

        this.space.addCollisionHandler(SpriteTag.bg_obj, SpriteTag.remover,
            this.collisionRemoverBegin.bind(this), null, null, null);

        this.space.addCollisionHandler(SpriteTag.yummy, SpriteTag.remover,
            this.collisionRemoverBegin.bind(this), null, null, null);
    },

    collisionYummyBegin:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        this.yummyShapes.push(shapes[1]);
//
//        cc.audioEngine.playEffect(res.pickup_coin_mp3);
//
        var statusLayer = this.getChildByTag(TagOfLayer.Status);
        statusLayer.addScore(1);
    },

    collisionRockBegin:function (arbiter, space) {
        cc.log("==game over");
        //stop bg music
        cc.audioEngine.stopMusic();
        cc.director.pause();
        this.addChild(new GameOverLayer());
    },

    collisionNullBegin:function (arbiter, space) {
        return true;
    },

    collisionRemoverBegin:function (arbiter, space) {
        cc.log("collide with remover");
        var shapes = arbiter.getShapes();
        var shapeToRemove = shapes[0].hashid == 0 ? shapes[1] : shapes[0];
        var remover = shapes[0].hashid == 0 ? shapes[0] : shapes[1];
        cc.log(shapeToRemove.collision_type);
        switch(shapeToRemove.collision_type) {
            case SpriteTag.rod:
                this.rodShapes.push(shapeToRemove);
                break;
            case SpriteTag.yummy:
                this.yummyShapes.push(shapeToRemove);
                break;
            case SpriteTag.bg_obj:
                this.bgShapes.push(shapeToRemove);
                break;
        }
    },

    onEnter:function () {
        this._super();
        this.initPhysics();

        this.gameLayer = cc.Layer.create();
        this.time = parseInt(new Date().getTime() / 1000);
        //add three layer in the right order
        var startColor = new cc.Color(6, 180, 252, 255);
        var endColor = new cc.Color(12, 26, 130, 255);
        this.backGround = cc.LayerGradient.create(endColor, startColor);

        this.gameLayer.addChild(this.backGround, 0, TagOfLayer.Background);
        this.gameLayer.addChild(new AnimationLayer(this.space), 0, TagOfLayer.Animation);

        this.addChild(this.gameLayer);
        this.addChild(new StatusLayer(), 0, TagOfLayer.Status);

        //add background music
//        cc.audioEngine.playMusic(res.background_mp3, true);

        this.scheduleUpdate();

    },
    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
        this.dayAndNight(dt);
        for(var i = 0; i < this.yummyShapes.length; i++) {
            var shape = this.shapesToRemove[i];
            if (this.gameLayer.getChildByTag(TagOfLayer.Animation).yummy) {
                this.gameLayer.getChildByTag(TagOfLayer.Animation).yummy.removeFromParent();
                this.gameLayer.getChildByTag(TagOfLayer.Animation).yummy = null;
            }
        }

        for(var i = 0; i < this.rodShapes.length; i++) {
            var shape = this.shapesToRemove[i];
            if (this.gameLayer.getChildByTag(TagOfLayer.Animation).vetka) {
                this.gameLayer.getChildByTag(TagOfLayer.Animation).vetka.removeFromParent();
                this.gameLayer.getChildByTag(TagOfLayer.Animation).vetka = null;
            }
        }

        for(var i = 0; i < this.bgShapes.length; i++) {
            var shape = this.bgShapes[i];

            cc.log("sh" + shape.hashid);
           this.gameLayer.getChildByTag(TagOfLayer.Animation).deleteBgByShape(shape);
        }

        this.rodShapes = [];
        this.yummyShapes = [];
        this.bgShapes = [];

        var animationLayer = this.gameLayer.getChildByTag(TagOfLayer.Animation);
        var eyeY = animationLayer.getEyeY();

        var winSize = cc.director.getWinSize();
        this.backGround.y = eyeY;


//        if (this.bgColor.r < 255) {
//            this.bgColor.r += dt*g_change_bgcolor_speed;
//        } else if (this.bgColor.g < 255) {
//            this.bgColor.g += dt*g_change_bgcolor_speed;
//        } else if (this.bgColor.b < 255) {
//            this.bgColor.b += dt*g_change_bgcolor_speed;
//        }
//        if(this.bgColor.r >= 255 && this.bgColor.g >= 255 && this.bgColor.b >= 255)
//        {
//            this.bgColor.r = this.bgColor.g = this.bgColor.b = 0;
//        }
//        this.backGround.setColor(this.bgColor);
        this.remover.a.y = eyeY + winSize.height / 2 + 100;
        this.gameLayer.setPosition(cc.p(0,-eyeY));
    },

    dayAndNight: function(dt) {
//        var ch = dt * g_change_bgcolor_speed;
        var endColor = this.backGround.getEndColor();
        //var endColor = new cc.Color(255, 226, 130, 10); рассвет
//        var endColor = new cc.Color(190, 26, 130, 255); закат
        var ltime = parseInt(new Date().getTime() / 1000);
        var startColor =  this.backGround.getStartColor();
        if(ltime > this.time) {
            this.time = ltime;
            var dr = (endColor.r - startColor.r) / PHASE.NORMAL;
            var dg = (endColor.g - startColor.g) / PHASE.NORMAL;
            var db = (endColor.b - startColor.b) / PHASE.NORMAL;
//        var startColor = new cc.Color(6, 180, 252, 255);
//        var endColor = new cc.Color(12, 26, 130, 255);

            this.backGround.getStartColor().r += dr;
            this.backGround.getStartColor().g += dg;
            this.backGround.getStartColor().b += db;
        }

//        cc.log( dr + "," + dg + "," + db);
        cc.log( this.backGround.getStartColor().r + "," + this.backGround.getStartColor().g + "," + this.backGround.getStartColor().b);
        this.backGround.setEndColor(endColor);
    }
});