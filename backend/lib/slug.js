const Post = require('../Models/PostModel');

const slugifyTitle = (title = '') => {
    let slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    if (!slug) {
        slug = 'internship';
    }

    if (!slug.endsWith('-internship') && slug !== 'internship') {
        slug = `${slug}-internship`;
    }

    return slug;
};

const ensureUniqueSlug = async (title, excludeId = null) => {
    const base = slugifyTitle(title);
    let slug = base;
    let counter = 2;

    while (true) {
        const query = { slug };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existing = await Post.findOne(query).select('_id');
        if (!existing) {
            return slug;
        }

        slug = `${base}-${counter}`;
        counter += 1;
    }
};

const backfillPostSlugs = async () => {
    const posts = await Post.find({
        $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
    });

    for (const post of posts) {
        post.slug = await ensureUniqueSlug(post.title, post._id);
        await post.save();
    }

    if (posts.length > 0) {
        console.log(`Backfilled SEO slugs for ${posts.length} internship post(s)`);
    }
};

module.exports = {
    slugifyTitle,
    ensureUniqueSlug,
    backfillPostSlugs,
};
