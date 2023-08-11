var storeEnergy = {
    do: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return [STRUCTURE_EXTENSION, STRUCTURE_SPAWN].includes(structure.structureType)
                    && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        // TODO: priority ordering
        if(target) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            var closestTowerOrContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => 
                    [STRUCTURE_TOWER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE].includes(structure.structureType)=== STRUCTURE_TOWER
                        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if(closestTowerOrContainer) {
                if(creep.transfer(closestTowerOrContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestTowerOrContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // Could not find anywhere to store energy, give up
                creep.say('Dropping');
                creep.drop(RESOURCE_ENERGY);
            }
        }
    }
}

module.exports = storeEnergy;