const dayjs = require('dayjs');

const CalculateNextAge = (birthday) => {
    const today = dayjs();
    const nextBirthday = dayjs(birthday).set('year', today.year());
    if (nextBirthday.isBefore(today)) {
        return dayjs(nextBirthday.add(1, 'year'));
    }
    return dayjs(nextBirthday);
}
module.exports = { CalculateNextAge };