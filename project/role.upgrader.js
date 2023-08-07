var actions = require('actions');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	    else {
            // TODO: change .find to .findClosestByPath
            // creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: ...});
            var containers = creep.room.find(FIND_STRUCTURES,
                {
                    filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                });
            
            if(containers.length > 0) {
                creep.say("Withdrawing");
                if(creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.say("Too far");
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                actions.harvestEnergy(creep);
            }
	    }
	}
};

module.exports = roleUpgrader;