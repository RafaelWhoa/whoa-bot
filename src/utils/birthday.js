const dayjs = require('dayjs');
const aniversario = require("../models/Aniversarios");

const CalculateNextAge = (birthday) => {
    const today = dayjs();
    const nextBirthday = dayjs(birthday).set('year', today.year());
    if (nextBirthday.isBefore(today)) {
        return dayjs(nextBirthday.add(1, 'year'));
    }
    return dayjs(nextBirthday);
}
module.exports = { CalculateNextAge };

const GetTodayBirthdays = async (client) => {
    const todayBirthdays = await aniversario.findAll({where: {birthday: dayjs().hour(0).minute(0).second(0).millisecond(0)}});

    if (todayBirthdays.length > 0) {
        let message = `Hoje é aniversário de: \n`;
        todayBirthdays.forEach(user => {
            const userId = user.dataValues.user_id;
            const birthday = user.dataValues.birthday;
            const year = dayjs(birthday).format('YYYY');
            message += `<@${userId}> - faz ${CalculateNextAge(birthday).year() - year} anos\n`;
        })
        await client.channels.cache.get(process.env.BIRTHDAY_CHANNEL).send(message);
    }
}
module.exports = { GetTodayBirthdays };