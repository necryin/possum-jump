/**
 * Created by human on 06.10.2014.
 */
var BgObject = cc.Class.extend({
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
    // механизм рандомных фонов
        this.sprite = cc.PhysicsSprite.create(res.bg1_png);
        var contentSize = this.sprite.getContentSize();
        this.sprite.opacity = rand(30, 100);

        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        this.body.applyImpulse(cp.v(0, g_heroSpeed), cp.v(0, 0));
        this.body.setPos(cc.p(posX, posY));

        this.sprite.setBody(this.body);

        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(SpriteTag.bg_obj);
        this.shape.setSensor(true);
        this.space.addStaticShape(this.shape);
        spriteSheet.addChild(this.sprite);
    },

    removeFromParent: function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    }

});
