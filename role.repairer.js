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
                filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax
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
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
	    }
	}
};

module.exports = roleRepairer;