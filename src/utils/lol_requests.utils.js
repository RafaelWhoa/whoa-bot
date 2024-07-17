

export const returnFreeChampions = (freeChampionsJSON, newPlayer) => {
    if (newPlayer) {
        return JSON.parse(JSON.parse(freeChampionsJSON))["freeChampions"]["freeChampionIdsForNewPlayers"]
    }
    else {
        return JSON.parse(JSON.parse(freeChampionsJSON))["freeChampions"]["freeChampionIds"]
    }
}

export const returnNewPlayerLevelCap = (freeChampionsJSON) => {
    return JSON.parse(JSON.parse(freeChampionsJSON))["freeChampions"]["maxNewPlayerLevel"]
}