var harvestEnergy = {
    do: function(creep) {
        var source = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (source) => source.energy > 0
        });
        if(source) {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            return false;
        }
    }
}

module.exports = harvestEnergy;