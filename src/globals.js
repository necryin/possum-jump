/**
 * Created by human on 17.09.2014.
 */

var g_heroStartY = 400;
var g_heroStartX = 100;
var g_heroSpeed = 150;
var g_bg_speed = 120;
var g_heroMaxSpeed = g_heroSpeed*10;
var MAX_INT = 4294967295;

function rand(min, max) {
    return Math.random() * (max - min) + min;
};

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
    SpriteTag.enemy = 6;
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

if(typeof config == "undefined") {
    var config = {};
    config.sound = false;
};

if(typeof COLOR == "undefined") {
    var COLOR = {};
    COLOR.DARKBLUE = new cc.Color(12, 26, 130, 255);
    COLOR.BLUE  = new cc.Color(6, 180, 252, 255);
};

if(typeof DIR == "undefined") {
    var DIR = {};
    DIR.LEFT = 0;
    DIR.TOP = 1;
    DIR.RIGHT = 2;
    DIR.BOTTOM = 3;
};

if(typeof ENEMY == "undefined") {
    var ENEMY = {};
    ENEMY.BLUEBIRD_L = 0;
    ENEMY.BLUEBIRD_R = 1;
};