var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarrier = require('role.carrier');
var roleRepairer = require('role.repairer');
var displayText = require('display.text');
var structureTower = require('structure.tower');

class SubCreep {
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

    const MAX_HARVESTERS = 0;
    const MAX_UPGRADERS = 3;
    const MAX_BUILDERS = 1;
    const MAX_BIG_HARVESTERS = 3;
    const MAX_CARRIERS = 1;
    const MAX_REPAIRERS = 1;
    const HARVESTER_LABEL_POS = new RoomPosition(40, 29, 'W8N3');
    const UPGRADER_LABEL_POS = new RoomPosition(40, 30, 'W8N3');
    const BUILDER_LABEL_POS = new RoomPosition(40, 31, 'W8N3');
    const BIG_HARVESTER_LABEL_POS = new RoomPosition(40, 32, 'W8N3');
    const CARRIER_LABEL_POS = new RoomPosition(40, 33, 'W8N3');
    const REPAIRER_LABEL_POS = new RoomPosition(40, 34, 'W8N3');
    const SMALL_CREEP_BODY = [MOVE, CARRY, WORK];
    const HARVESTER_BODY = [MOVE, WORK];
    const BIG_CREEP_BODY = [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
    
    var gameSpawn = Game.spawns["Alpha1"];

    function spawnAnotherCreepIfAble(creepType, creepLimit, labelPos, creepBody) {
        var creepTypePlural = `${creepType}s`;
        var myCreeps = gameSpawn.room.find(FIND_MY_CREEPS);
        var creepList = myCreeps.filter(creep => creep.memory.role === creepType);
        displayText.display(`${creepTypePlural}: ${creepList.length} of ${creepLimit}`, labelPos, gameSpawn);
            
        if(!gameSpawn.spawning && gameSpawn.room.energyAvailable >= bodyCost(creepBody)) {
            if(creepList.length < creepLimit) {
                var newName = `${creepType}${Game.time}`;
                displayText.log(`Spawning new ${creepType}: ${newName}`, new RoomPosition(14, 27, 'W8N3'), gameSpawn);
                gameSpawn.spawnCreep(creepBody, newName, {memory: {role: creepType}});
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
            displayText.log(`Clearing non-existing creep memory: ${name}`, new RoomPosition(14, 28, 'W8N3'), gameSpawn);
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
    
    var status = `${gameSpawn.name}: ${gameSpawn.room.energyAvailable} / ${gameSpawn.room.energyCapacityAvailable}`;
    displayText.display(status, new RoomPosition(gameSpawn.pos.x, gameSpawn.pos.y + 1, gameSpawn.room.name), gameSpawn);
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