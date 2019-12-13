module.exports = {
    parseRelatedData: (paginatedData) => {
        return paginatedData.rows.reduce((accumulator, currentValue) => {
            accumulator.posts.push({
                profileImageURL: currentValue.user.profileImage,
                titleCompanion: currentValue.titleCompanion,
                titleActivity: currentValue.titleActivity,
                postId: currentValue.id,
            });
            return accumulator;
        }, {hasNextPage: paginatedData.hasNextPage, posts: [] });
    },
    
    parsePaginatedData: (paginatedData) => {
        return paginatedData.rows.reduce((accumulator, currentValue) => {
            accumulator.posts.push({
                postId: currentValue.id,
                writerId: currentValue.user.id,
                writerImageURL: currentValue.user.profileImage,
                writerNickname: currentValue.user.nickname,
                representativePostImageURL: currentValue.images[0].url,
                titlePlace: currentValue.location.name,
                titleCompanion: currentValue.titleCompanion,
                titleActivity: currentValue.titleActivity,
                description: currentValue.description
            });
            return accumulator;
        }, { hasNextPage: paginatedData.hasNextPage, posts: [] });
    }
}