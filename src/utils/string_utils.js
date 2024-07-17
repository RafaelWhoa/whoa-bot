

export const returnNickNameParsed = (nickname) => {
    return nickname.split('#');
}

export const returnNickNameTag = (nickname) => {
    return nickname.split('#')[1];
}