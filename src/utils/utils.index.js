import loggerUtils from "./logger.utils.js";
import {returnFreeChampions} from "./lol_requests.utils.js";
import {returnNewPlayerLevelCap} from "./lol_requests.utils.js";
import {returnFreeChampionsMsgResponse} from "./lol.utils.js";

export {
    loggerUtils as logger,
    returnFreeChampions,
    returnNewPlayerLevelCap,
    returnFreeChampionsMsgResponse
}