var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarrier = require('role.carrier');
var roleRepairer = require('role.repairer');
var displayText = require('display.text');
var structureTower = require('structure.tower');

class SubCreep {
    // TODO: roll all the creep configs into a class so we can just do
    // spawnIfAble(harvesterCreep);
    constructor(creepType, creepLimit, labelPos, creepBody) {
        this.creepType = creepType;
        this.creepLimit = creepLimit;
        this.labelPos = labelPos;
        this.creepBody = creepBody;
    }

    get creepTypePlural() {
        return `${this.creepType}s`;
    }
}

module.exports.loop = function () {
    const ROOM_NAME = 'W8N3';    
    const MY_GAME_SPAWN = Game.spawns["Alpha1"];

    // Configurations to tweak as the game progresses
    const MAX_HARVESTERS = 0;
    const MAX_UPGRADERS = 3;
    const MAX_BUILDERS = 1;
    const MAX_BIG_HARVESTERS = 5;
    const MAX_CARRIERS = 1;
    const MAX_REPAIRERS = 1;

    // Cosmetic configs - creep count labels
    const HARVESTER_LABEL_POS = new RoomPosition(40, 29, ROOM_NAME);
    const UPGRADER_LABEL_POS = new RoomPosition(40, 30, ROOM_NAME);
    const BUILDER_LABEL_POS = new RoomPosition(40, 31, ROOM_NAME);
    const BIG_HARVESTER_LABEL_POS = new RoomPosition(40, 32, ROOM_NAME);
    const CARRIER_LABEL_POS = new RoomPosition(40, 33, ROOM_NAME);
    const REPAIRER_LABEL_POS = new RoomPosition(40, 34, ROOM_NAME);

    // Creep body types
    const SMALL_CREEP_BODY = [MOVE, CARRY, WORK];
    const HARVESTER_BODY = [MOVE, WORK];
    const BIG_CREEP_BODY = [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];

    function spawnAnotherCreepIfAble(creepType, creepLimit, labelPos, creepBody) {
        var creepTypePlural = `${creepType}s`;
        var myCreeps = MY_GAME_SPAWN.room.find(FIND_MY_CREEPS);
        var creepList = myCreeps.filter(creep => creep.memory.role === creepType);
        displayText.display(`${creepTypePlural}: ${creepList.length} of ${creepLimit}`, labelPos, MY_GAME_SPAWN);
            
        if(!MY_GAME_SPAWN.spawning && MY_GAME_SPAWN.room.energyAvailable >= bodyCost(creepBody)) {
            if(creepList.length < creepLimit) {
                var newName = `${creepType}${Game.time}`;
                displayText.log(`Spawning new ${creepType}: ${newName}`, new RoomPosition(14, 27, 'W8N3'), MY_GAME_SPAWN);
                MY_GAME_SPAWN.spawnCreep(creepBody, newName, {memory: {role: creepType}});
            }
        }
    }
    
    function bodyCost(body) {
        let sum = 0;
        for (let i in body)
            sum += BODYPART_COST[body[i]];
        return sum;
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            displayText.log(`Clearing non-existing creep memory: ${name}`, new RoomPosition(14, 28, 'W8N3'), MY_GAME_SPAWN);
        }
    }

    spawnAnotherCreepIfAble("harvester", MAX_HARVESTERS, HARVESTER_LABEL_POS, SMALL_CREEP_BODY);
    spawnAnotherCreepIfAble("upgrader", MAX_UPGRADERS, UPGRADER_LABEL_POS, SMALL_CREEP_BODY);
    spawnAnotherCreepIfAble("builder", MAX_BUILDERS, BUILDER_LABEL_POS, SMALL_CREEP_BODY);
    spawnAnotherCreepIfAble("carrier", MAX_CARRIERS, CARRIER_LABEL_POS, SMALL_CREEP_BODY);
    spawnAnotherCreepIfAble("repairer", MAX_REPAIRERS, REPAIRER_LABEL_POS, SMALL_CREEP_BODY);
    spawnAnotherCreepIfAble("big_harvester", MAX_BIG_HARVESTERS, BIG_HARVESTER_LABEL_POS, BIG_CREEP_BODY);

    for(var id in Game.structures) {
        var tower = Game.structures[id];
        if(tower.structureType === STRUCTURE_TOWER) {
            structureTower.run(tower);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'carrier':
                roleCarrier.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'harvester':
            case 'big_harvester':
            default:
                roleHarvester.run(creep);
                break;            
        }
    }
    
    var status = `${MY_GAME_SPAWN.name}: ${MY_GAME_SPAWN.room.energyAvailable} / ${MY_GAME_SPAWN.room.energyCapacityAvailable}`;
    displayText.display(status, new RoomPosition(MY_GAME_SPAWN.pos.x, MY_GAME_SPAWN.pos.y + 1, MY_GAME_SPAWN.room.name), MY_GAME_SPAWN);
}

/*
 * -- Notes --
 * Big Harvester body from the tutorial:
 * Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
    'HarvesterBig',
    { memory: { role: 'harvester' } } );
 *
 *
 * -- TODO --
 * Consolidate some of the duplicated code
 *
 */