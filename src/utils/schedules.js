import schedule from "node-schedule";
import {GetTodayBirthdays} from "./birthday.js";

export function scheduleBirthdayMessage(client){
    return schedule.scheduleJob('*/1 * * * *', async function () {
            await GetTodayBirthdays(client);
        });
}