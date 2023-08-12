var sortStructuresByHealth = {
    sort: function(structures) {
        if(structures && structures.length) {
            return structures.sort((a, b) => {
                const aHealth = a.hits / a.hitsMax;
                const bHealth = b.hits / b.hitsMax;
                return aHealth < bHealth;
            });
        }
    }
}

module.exports = sortStructuresByHealth;