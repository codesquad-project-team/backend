'use strict';
const provider = ['facebook', 'kakao', 'instagram']
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userRecords = [];
    for(let i = 1; i <= 21; i++) {
      const userRecord = {
        id: i,
        email: 'gmini.y' + i + '@gmail.com',
        phone: `${i}-1234-1234`,
        profile_image: 'https://team-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile-images/dummyUser%40google.com/myProfile.png',
        nickname: '잉글비' + i,
        description: '나는 바보 닙니다',
        provider: `${provider[i%3]}`,
        provided_id: `${i*11}`
      };
      userRecords.push(userRecord);
    }
    await queryInterface.bulkInsert('users', userRecords, {});
    
    const locations = [
      {
        name: "코드스쿼드",
        latitude: 37.4908252,
        longitude: 127.0312283,
        address: "서울특별시 강남구 강남대로62길 23 4층",
        link: "codesquad.kr",
        external_link: "naver.com",
        phone: "070-4117-1005"
      },
      {
        name: "공공거실",
        latitude: 37.5845218,
        longitude: 126.9975588,
        address: "서울특별시 종로구 창경궁로33길 12",
        external_link: "naver.com",
        phone: "070-5213-1729"
      },
      {
        name: "신오리경로당",
        latitude: 37.3896438,
        longitude: 126.9236679,
        external_link: "naver.com",
        address: "경상북도 상주시 낙동면 신오3길 101",
      }
    ]
    await queryInterface.bulkInsert('locations', locations, {});

    const postRecords = [];
    userRecords.forEach((userRecord) => {
      const randomInt1 = Math.floor(Math.random() * Math.floor(locations.length)) + 1;
      const randomInt2 = Math.floor(Math.random() * Math.floor(locations.length)) + 1;
      const start = (randomInt1 <= randomInt2)? randomInt1 : randomInt2;
      const end = (start === randomInt2)? randomInt1 : randomInt2;

      for(let locationId = start;  locationId <= end; locationId++) {
        const postRecord = {
          title_companion: (locationId%2 === 0) ? "친구" : "애인",
          title_activity: '맥주' + locationId + '잔 마시기',
          description: '테스트입니다.',
          createdAt: new Date(),
          updatedAt: new Date(),
          writer_id: userRecord.id,
          location_id: locationId
        }
        postRecords.push(postRecord);
      }
    });
    await queryInterface.bulkInsert('posts', postRecords, {});

    const imageRecords = [];
    for(let postId = 1; postId <= postRecords.length; postId++) {
      const numberOfImages = Math.floor(Math.random() * Math.floor(5)) + 1;
      for(let i = 1; i <= numberOfImages; i++) {
        const url = "https://team-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/post-images/dummy-post-image/myPostImage.png";
        const imageRecord = {
                            url,
                            post_id: postId,
                            is_representative: (i === 1)
                          };
        imageRecords.push(imageRecord);
      }
    }
    await queryInterface.bulkInsert('images', imageRecords, {});
    return;
  },

  down: async (queryInterface, Sequelize) => {
      return;
  }
};