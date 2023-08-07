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
            var closestTowerOrContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (
                    structure.structureType === STRUCTURE_TOWER
                    || structure.structureType === STRUCTURE_CONTAINER
                ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
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