export const createChatId = (uid1, uid2) => {
	let chatId = '';

	if (uid1 < uid2) {
		chatId = uid1 + uid2;
	} else {
		chatId = uid2 + uid1;
	}

	return chatId;
};
