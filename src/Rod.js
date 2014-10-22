/**
 * Created by human on 01.10.2014.
 */
var Rod = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    body: null,

    /**
     *
     * @param spriteSheet
     * @param space
     * @param posX
     * @param posY
     */
    ctor: function (spriteSheet, space, posX, posY) {
        this.space = space;

        //create runner through physic engine
        this.sprite = cc.PhysicsSprite.create(res.enemy1_l_png);
        var contentSize = this.sprite.getContentSize();
        // init body
        this.body = new cp.Body(0.1, 0.1); //cp.momentForBox(1, contentSize.width, contentSize.height)
        this.body.p = cc.p(posX, posY);

        this.body.applyImpulse(cp.v(rand(6, 15), 0), cp.v(0, 0));//run speed
        this.space.addBody(this.body);
        //init shape
        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
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
    },

    getShape: function () {
        return this.shape;
    }
});