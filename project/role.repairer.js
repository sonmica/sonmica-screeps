var actions = require('actions');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
	        creep.memory.repairing = true;
	        creep.say('🚧 repair');
	    }

	    if(creep.memory.repairing) {
            var closestDamagedContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_RAMPART) && structure.hits < structure.hitsMax
            });
            if(closestDamagedContainer) {
                if(creep.repair(closestDamagedContainer) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestDamagedContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var closestDamagedRoad = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax
                });
                if(closestDamagedRoad) {
                    if(creep.repair(closestDamagedRoad) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestDamagedRoad, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    var closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < structure.hitsMax
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

module.exports = roleRepairer;