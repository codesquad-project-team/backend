const parseRelatedData = (relatedPost) => {
    const parsedData = [];
    for (let i = 0; i < relatedPost.length; i++) {
        parsedData.push({
            profileImageURL: relatedPost[i].dataValues.user.profile_image,
            titleCompanion: relatedPost[i].dataValues.title_companion,
            titleActivity: relatedPost[i].dataValues.title_activity,
            postId: relatedPost[i].dataValues.id
        })
    }
    return parsedData;
}

const parsePaginatedData = (paginatedData) => {
    return paginatedData.rows.reduce((accumulator, currentValue) => {
        accumulator.posts.push({
            postId: currentValue.id,
            writerImageURL: currentValue.user.profile_image,
            writerNickname: currentValue.user.nickname,
            representativePostImageURL: currentValue.images[0].url,
            titlePlace: currentValue.location.name,
            titleCompanion: currentValue.title_companion,
            titleActivity: currentValue.title_activity,
            description: currentValue.description
        });
        return accumulator;
    }, { hasNextPage: paginatedData.hasNextPage, posts: [] });
}


module.exports = { parseRelatedData, parsePaginatedData }