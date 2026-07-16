const User = require('../Models/userModel');

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const USERNAME_CHANGE_COOLDOWN_MS = 15 * 24 * 60 * 60 * 1000;

const slugifyUsername = (value = '') => {
    let username = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    if (!username) {
        username = 'user';
    }

    return username.slice(0, USERNAME_MAX_LENGTH);
};

const normalizeUsername = (value = '') => slugifyUsername(value);

const validateUsername = (value) => {
    const username = normalizeUsername(value);

    if (!username || username.length < USERNAME_MIN_LENGTH) {
        return {
            valid: false,
            message: `Username must be at least ${USERNAME_MIN_LENGTH} characters.`,
        };
    }

    if (!/^[a-z0-9-]+$/.test(username)) {
        return {
            valid: false,
            message: 'Username can only contain lowercase letters, numbers, and hyphens.',
        };
    }

    return { valid: true, username };
};

const getUsernameChangeStatus = (user) => {
    if (!user?.usernameChangedAt) {
        return { canChange: true, daysRemaining: 0, nextChangeAt: null };
    }

    const elapsed = Date.now() - new Date(user.usernameChangedAt).getTime();

    if (elapsed >= USERNAME_CHANGE_COOLDOWN_MS) {
        return { canChange: true, daysRemaining: 0, nextChangeAt: null };
    }

    const msRemaining = USERNAME_CHANGE_COOLDOWN_MS - elapsed;
    const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
    const nextChangeAt = new Date(new Date(user.usernameChangedAt).getTime() + USERNAME_CHANGE_COOLDOWN_MS);

    return { canChange: false, daysRemaining, nextChangeAt };
};

const isUsernameAvailable = async (username, excludeId = null) => {
    const query = { username };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    const existing = await User.findOne(query).select('_id');
    return !existing;
};

const ensureUniqueUsername = async (value, excludeId = null) => {
    const base = slugifyUsername(value);
    let username = base;
    let counter = 2;

    while (true) {
        const query = { username };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existing = await User.findOne(query).select('_id');
        if (!existing) {
            return username;
        }

        const suffix = `-${counter}`;
        username = `${base.slice(0, 30 - suffix.length)}${suffix}`;
        counter += 1;
    }
};

const backfillUsernames = async () => {
    const users = await User.find({
        $or: [{ username: { $exists: false } }, { username: null }, { username: '' }],
    });

    for (const user of users) {
        const base = user.name || user.email?.split('@')[0] || 'user';
        user.username = await ensureUniqueUsername(base, user._id);
        await user.save();
    }

    if (users.length > 0) {
        console.log(`Backfilled usernames for ${users.length} user(s)`);
    }
};

module.exports = {
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_CHANGE_COOLDOWN_MS,
    slugifyUsername,
    normalizeUsername,
    validateUsername,
    getUsernameChangeStatus,
    isUsernameAvailable,
    ensureUniqueUsername,
    backfillUsernames,
};
