/**
 * Created by human on 17.09.2014.
 */

var g_groundHight = 0;
var g_heroStartY = 100;
var g_heroStartX = 100;
var g_heroSpeed = 20;
var g_change_bgcolor_speed = 100;
var g_heroMaxSpeed = g_heroSpeed*7;

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Background = 0;
    TagOfLayer.Animation = 1;
    TagOfLayer.GameLayer = 2;
    TagOfLayer.Status = 3;
};

// collision type for chipmunk
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.hero = 0;
    SpriteTag.yummy = 1;
    SpriteTag.rod = 2;
    SpriteTag.remover = 3;
    SpriteTag.wall = 4;
    SpriteTag.bg_obj = 5;
};

if(typeof PHASE == "undefined") {
    var PHASE = {};
    PHASE.DAWN = 0;
    PHASE.DAY = 1;
    PHASE.SUNSET = 2;
    PHASE.NIGHT = 3;
    PHASE.SHORT = 6;
    PHASE.NORMAL = 5;
};