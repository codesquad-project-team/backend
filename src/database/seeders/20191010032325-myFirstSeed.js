'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userRecords = [];
    for(let i = 0; i <= 20; i++) {
      const userRecord = {
        email: 'gmini.y' + i + '@gmail.com',
        profile_image: 'https://team-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile-images/dummyUser%40google.com/myProfile.png',
        password: 'PaSsWoRd',
        nickname: '잉글비' + i
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
        phone: "070-4117-1005"
      },
      {
        name: "공공거실",
        latitude: 37.5845218,
        longitude: 126.9975588,
        address: "서울특별시 종로구 창경궁로33길 12",
        phone: "070-5213-1729"
      },
      {
        name: "신오리경로당",
        latitude: 37.3896438,
        longitude: 126.9236679,
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
          user_email: userRecord.email,
          location_id: locationId
        }
        postRecords.push(postRecord);
      }
    });
    await queryInterface.bulkInsert('posts', postRecords, {});

    const imageRecords = [];
    for(let postId = 1; postId <= postRecords.length; postId++) {
      const numberOfImages = Math.floor(Math.random() * Math.floor(5));
      for(let i = 1; i <= numberOfImages; i++) {
        const url = "https://team-project-s3-bucket.s3.ap-northeast-2.amazonaws.com/post-images/dummy-post-image/myPostImage.png";
        const imageRecord = {
                            url,
                            post_id: postId
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