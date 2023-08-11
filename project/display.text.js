var displayText = {
    display: function(displayText, roomPosition, gameSpawn) {
        gameSpawn.room.visual.text(displayText, roomPosition, {color: "#FFFFFF", fontSize: 8, align: left});
    },

    log: function(displayText, roomPosition, gameSpawn) {
        gameSpawn.room.visual.text(displayText, roomPosition, {color: "#FFFFFF", fontSize: 8, align: left});
        console.log(displayText);
    }
}

module.exports = displayText;