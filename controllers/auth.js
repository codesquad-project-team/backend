const auth = {};

module.exports = (models) => {
    const { User } = models;

    auth.findUser = async (provider, provided_id, email, done) => {
        const user = await User.findOrCreate({
            where: { provider, provided_id },
            defaults: { email, provider, provided_id }
        })

        if (user.length) {
            return done(null, {
                id: user[0].dataValues.id,
                nickname: user[0].dataValues.nickname,
                provider
            });
        }

        return done(null, false);
    }


    return auth;
}