const PRIVATE_BY_DEFAULT = ['number', 'email'];

const DEFAULT_PRIVACY = {
    bio: true,
    city: true,
    number: false,
    email: false,
    headline: true,
    skills: true,
    education: true,
    experience: true,
    linkedinURL: true,
    githubURL: true,
    companyName: true,
    companyBio: true,
};

const mergePrivacy = (settings = {}) => ({
    ...DEFAULT_PRIVACY,
    ...settings,
});

const isFieldPublic = (settings, field) => {
    const merged = mergePrivacy(settings);
    if (PRIVATE_BY_DEFAULT.includes(field)) {
        return merged[field] === true;
    }
    return merged[field] !== false;
};

module.exports = {
    PRIVATE_BY_DEFAULT,
    DEFAULT_PRIVACY,
    mergePrivacy,
    isFieldPublic,
};
