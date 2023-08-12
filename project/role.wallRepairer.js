var actions = require('actions');

var roleWallRepairer = {

    /** @param {Creep} creep **/
    /** @param {string[]} structureBlacklistIds */
    run: function(creep, structureBlacklistIds) {
        if(!structureBlacklistIds) {
            structureBlacklistIds = [];
        }

	    if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repairing = true;
	        creep.say('🚧 repair');
	    }

	    if(creep.memory.repairing) {
            // TODO: Repair the most damaged thing
            var closestDamagedRampart = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) =>
                    !structureBlacklistIds.includes(structure.id)
                    && structure.structureType === STRUCTURE_RAMPART
                    && structure.hits < structure.hitsMax
            });
            if(closestDamagedRampart) {
                if(creep.repair(closestDamagedRampart) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestDamagedRampart, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var closestDamagedWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) =>
                        !structureBlacklistIds.includes(structure.id)
                        && structure.structureType === STRUCTURE_WALL
                        && structure.hits < structure.hitsMax
                });
                if(closestDamagedWall) {
                    if(creep.repair(closestDamagedWall) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestDamagedWall, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    var closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) =>
                            !structureBlacklistIds.includes(structure.id)
                            && structure.hits < structure.hitsMax
                    });
                    if(closestDamagedStructure) {
                        if(creep.repair(closestDamagedStructure) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(closestDamagedStructure, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else {
                        // Nothing to build - drop energy on the ground
                        creep.say('Idle');
                        creep.memory.repairing = false;
                        creep.drop(RESOURCE_ENERGY);
                    }
                }
            }
	    }
	    else {
            if(!actions.withdrawEnergy(creep)) {
                actions.harvestEnergy(creep);
            }
	    }
	}
};

module.exports = roleWallRepairer;