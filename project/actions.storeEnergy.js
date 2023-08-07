var storeEnergy = {
    do: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN) && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        // TODO: priority ordering
        if(target) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            var closestTower = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            });
            if(closestTower) {
                if(creep.transfer(closestTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                })
                if(closestContainer) {
                    if(creep.transfer(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    // Could not find anywhere to store energy, give up
                    creep.say('Dropping');
                    creep.drop(RESOURCE_ENERGY);
                }
            }
        }
    }
}

module.exports = storeEnergy;