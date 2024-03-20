const dayjs = require('dayjs');
const aniversario = require("../models/Aniversarios");
const sequelize = require('sequelize').Op;
const dbConfig = require('../db/dbConfig.js')
const {Sequelize, Op} = require("sequelize");
let dbConnection = dbConfig.connection;

const CalculateNextAge = (birthday) => {
    const today = dayjs().startOf('day');
    const nextBirthday = dayjs(birthday).set('year', today.year()).startOf('day');
    if (nextBirthday.isBefore(today)) {
        return dayjs(nextBirthday.add(1, 'year'));
    }
    return dayjs(nextBirthday);
}
module.exports = {CalculateNextAge};

const GetTodayBirthdays = async (client) => {
    const todayBirthdays = await aniversario.findAll({
        where: dbConnection
            .where(dbConnection
                .fn('date_part',
                    'day',
                    dbConnection
                        .col('birthday')),
                '=',
                dayjs()
                    .format('DD')),
        and: dbConnection
            .where(dbConnection
                .fn('date_part',
                    'month',
                    dbConnection.col('birthday')),
                '=', dayjs()
                    .format('MM')),
        [Op.and]: dbConnection.where(dbConnection
                .fn('date_part',
                    'day',
                    dbConnection
                        .col('birthday')),
            '=',
            dayjs()
                .format('DD'), dbConnection.where(dbConnection
                    .fn('date_part',
                        'month',
                        dbConnection.col('birthday')),
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
module.exports = {GetTodayBirthdays};