import schedule from "node-schedule";
import {GetTodayBirthdays} from "./birthday.js";

export function scheduleBirthdayMessage(client){
    return schedule.scheduleJob('00 00 06 * * *', async function () {
            await GetTodayBirthdays(client);
        });
}