import dayjs from "dayjs";
import {Aniversarios} from "../models/Aniversarios.js";
import {sequelize} from "../db/dbConfig.js";
import {Op} from "sequelize";

export const CalculateNextAge = (birthday) => {
    const today = dayjs().startOf('day');
    const nextBirthday = dayjs(birthday).set('year', today.year()).startOf('day');
    if (nextBirthday.isBefore(today)) {
        return dayjs(nextBirthday.add(1, 'year'));
    }
    return dayjs(nextBirthday);
}

export const GetTodayBirthdays = async (client) => {
    const todayBirthdays = await Aniversarios.findAll({
        where: sequelize
            .where(sequelize
                .fn('date_part',
                    'day',
                    sequelize
                        .col('birthday')),
                '=',
                dayjs()
                    .format('DD')),
        and: sequelize
            .where(sequelize
                .fn('date_part',
                    'month',
                    sequelize.col('birthday')),
                '=', dayjs()
                    .format('MM')),
        [Op.and]: sequelize.where(sequelize
                .fn('date_part',
                    'day',
                    sequelize
                        .col('birthday')),
            '=',
            dayjs()
                .format('DD'), sequelize.where(sequelize
                    .fn('date_part',
                        'month',
                        sequelize.col('birthday')),
                '=', dayjs()
                    .format('MM')))});

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