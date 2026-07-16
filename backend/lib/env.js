const getJwtSecret = () => process.env.JWT_SECRATE || process.env.JWT_SECRET;

const getRefreshSecret = () =>
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET;

const getMissingAuthEnv = () => {
    const missing = [];
    if (!getJwtSecret()) missing.push('JWT_SECRATE');
    if (!getRefreshSecret()) missing.push('REFRESH_TOKEN_SECRET');
    if (!process.env.URI) missing.push('URI');
    return missing;
};

const assertProductionEnv = () => {
    const missing = getMissingAuthEnv();
    if (missing.length > 0) {
        console.error(
            `[ENV] Missing required variables: ${missing.join(', ')}. ` +
                'Add them in Render Dashboard → Environment.'
        );
    }
    return missing;
};

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

const clearCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
});

module.exports = {
    getJwtSecret,
    getRefreshSecret,
    getMissingAuthEnv,
    assertProductionEnv,
    cookieOptions,
    clearCookieOptions,
};
