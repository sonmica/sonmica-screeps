var actions = require('creepActions');
var roomActions = require('roomActions');

var roleRepairer = {

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
            var damagedContainers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) =>
                    !structureBlacklistIds.includes(structure.id)
                    && structure.structureType === STRUCTURE_CONTAINER
                    && structure.hits < structure.hitsMax
            });
            var sortedDamagedContainers = roomActions.sortStructuresByHealth(damagedContainers);
            if(sortedDamagedContainers && sortedDamagedContainers.length) {
                if(creep.repair(sortedDamagedContainers[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sortedDamagedContainers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var damagedRoads = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => 
                        !structureBlacklistIds.includes(structure.id)
                        && structure.structureType === STRUCTURE_ROAD
                        && structure.hits < structure.hitsMax
                });
                var sortedDamagedRoads = roomActions.sortStructuresByHealth(damagedRoads);
                if(sortedDamagedRoads && sortedDamagedRoads.length) {
                    if(creep.repair(sortedDamagedRoads[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(sortedDamagedRoads[0], {visualizePathStyle: {stroke: '#ffffff'}});
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
            actions.withdrawEnergy(creep);
            // if(!actions.withdrawEnergy(creep)) {
            //     actions.harvestEnergy(creep);
            // }
	    }
	}
};

module.exports = roleRepairer;