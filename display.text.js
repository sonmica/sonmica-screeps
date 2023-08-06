var displayText = {
    display: function(displayText, roomPosition, gameSpawn) {
        gameSpawn.room.visual.text(displayText, roomPosition, {color: "#FFFFFF", fontSize: 8});
    },

    log: function(displayText, roomPosition, gameSpawn) {
        gameSpawn.room.visual.text(displayText, roomPosition, {color: "#FFFFFF", fontSize: 8});
        console.log(displayText);
    }
}

module.exports = displayText;