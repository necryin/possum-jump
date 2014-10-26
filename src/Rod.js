/**
 * Created by human on 01.10.2014.
 */
var Rod = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    body: null,
    speed: null,
    type: null,

    ctor: function (spriteSheet, space, pos, type) {
        this.space = space;
        this.type = type;
        this.speed = parseInt(rand(10, 50));
        var winSize = cc.director.getWinSize();
        var speed = rand(40, 60);
        switch(type) {
            case ENEMY.BLUEBIRD_L:
                this.sprite = cc.PhysicsSprite.create(res.enemy1_l_png);
                break;
            case ENEMY.BLUEBIRD_R:
                this.sprite = cc.PhysicsSprite.create(res.enemy1_r_png);
                pos.x += -pos.x + winSize.width;
                speed = -speed;
                break;
        }

        this.body = new cp.Body(1, 0.1); //cp.momentForBox(1, contentSize.width, contentSize.height)
        this.body.p = pos;
       // this.body.applyImpulse(cp.v(speed, 0), cp.v(0, 0));//run speed
        this.space.addBody(this.body);
        //init shape
        var radius = 0.95 * this.sprite.getContentSize().width / 2;
        this.shape = new cp.CircleShape(this.body, radius, cp.vzero);

        this.shape.setCollisionType(SpriteTag.rod);
        this.space.addShape(this.shape);

        this.sprite.setBody(this.body);

        spriteSheet.addChild(this.sprite);
    },

    removeFromParent: function () {
        this.space.removeShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    }

});