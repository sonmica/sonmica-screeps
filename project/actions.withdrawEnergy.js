var withdrawEnergy = {
    /** @param {Creep} creep
     *  @returns {boolean} success
     * **/
    do: function(creep) {
        var closestContainer = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            });
        
        if(closestContainer) {
            creep.say("Withdrawing");
            if(creep.withdraw(closestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true;
        }
        return false;
    }
}

module.exports = withdrawEnergy;