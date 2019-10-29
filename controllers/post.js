module.exports = {
    parseRelatedData: (paginatedData) => {
        return paginatedData.rows.reduce((accumulator, currentValue) => {
            accumulator.posts.push({
                profileImageURL: currentValue.user.profile_image,
                titleCompanion: currentValue.title_companion,
                titleActivity: currentValue.title_activity,
                postId: currentValue.id,
            });
            return accumulator;
        }, {hasNextPage: paginatedData.hasNextPage, posts: [] });
    },
    
    parsePaginatedData: (paginatedData) => {
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
}