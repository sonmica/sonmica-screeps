var structureTower = {
    run: function(tower) {
        // TODO: repair a little bit of everything starting with the most damaged thing
        /*
         * <= 5: 800
         * >= 20: 200
         * 
         * find everything in range 5
         * - if there are things, then find the most damaged and repair it
         * - else find everything in range 10
         * - - if there are things then find the most damaged and repair it
         * - - else find everything in range 20
         * - - - if there are things then find the most damaged and repair it
         * 
         * find the most damaged(input -> array of things to be repaired)
         * most damaged = first item
         * lowest hp = first item's hp
         * - for each thing in array
         * - - if hitpoints is 1, break out of loop and fix this thing
         * - - if thing's hp is lower than lowest hp
         * - - - set lowest hp to thing's hp
         * - - - set most damaged to thing
         * 
         */
        //var damagedStructureInRange = tower.pos.findInRange(FIND_STRUCTURES, 5)
        //console.log("damaged structure", damagedStructureInRange.length);

        /*
         * Priority Order for repairs:
         * 1. Spawn
         * 2. Containers
         * 3. Roads
         * 4. Everything else
         */

        //TODO: the below is so gross
        var closestDamagedContainer = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax
        });
        if(closestDamagedContainer) {
            tower.repair(closestDamagedContainer);
        } else {
            var closestDamagedRoad = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax
            });
            if(closestDamagedRoad) {
                tower.repair(closestDamagedRoad);
            } else {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        } 
    }
}

module.exports = structureTower;