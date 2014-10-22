/**
 * Created by human on 01.10.2014.
 */
var Yummy = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,

    /**
     *
     * @param spriteSheet
     * @param space
     * @param posX
     * @param posY
     */
    ctor:function (spriteSheet, space, posX, posY) {
        this.space = space;
// механизм рандомных вкуснях
        this.sprite = cc.PhysicsSprite.create(res.yummy1_png);
        var body = new cp.StaticBody();
        body.setPos(cc.p(posX, posY));
        this.sprite.setBody(body);

        this.shape = new cp.BoxShape(body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(SpriteTag.yummy);

        this.space.addStaticShape(this.shape);
        spriteSheet.addChild(this.sprite);
    },

    removeFromParent:function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    getShape:function () {
        return this.shape;
    }
});