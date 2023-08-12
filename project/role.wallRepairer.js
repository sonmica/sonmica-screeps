var actions = require('creepActions');
var roomActions = require('roomActions');

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
            var damagedRamparts = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) =>
                    !structureBlacklistIds.includes(structure.id)
                    && structure.structureType === STRUCTURE_RAMPART
                    && structure.hits < structure.hitsMax
            });
            var sortedDamagedRamparts = roomActions.sortStructuresByHealth(damagedRamparts);
            if(sortedDamagedRamparts && sortedDamagedRamparts.length) {                
                if(creep.repair(sortedDamagedRamparts[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sortedDamagedRamparts[0], {visualizePathStyle: {stroke: '#ffff00'}});
                }
            } else {
                var damagedWalls = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) =>
                        !structureBlacklistIds.includes(structure.id)
                        && structure.structureType === STRUCTURE_WALL
                        && structure.hits < structure.hitsMax
                });
                var sortedDamagedWalls = roomActions.sortStructuresByHealth(damagedWalls);
                if(sortedDamagedWalls && sortedDamagedWalls.length) {
                    if(creep.repair(sortedDamagedWalls[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sortedDamagedWalls[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                } else {
                    var damagedStructures = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) =>
                            !structureBlacklistIds.includes(structure.id)
                            && structure.hits < structure.hitsMax
                    });
                    var sortedDamagedStructures = roomActions.sortStructuresByHealth(damagedStructures);
                    if(sortedDamagedStructures && sortedDamagedStructures.length) {
                        if(creep.repair(sortedDamagedStructures[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(sortedDamagedStructures[0], {visualizePathStyle: {stroke: '#ffff00'}});
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