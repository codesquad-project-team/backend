const express = require('express');
const router = express.Router();
const { users, posts } = require('../models/fakeDB');
const { User, Post, Location, Image } = require('../models');

const getRelatedPost = (postid) => {
  const relatedPost = posts.getRelatedPost(postid);
  return relatedPost;
}

const parseData = (relatedPost) => {
  const parsedData = [];
  for(let i = 0; i < relatedPost.length; i++){
    const userEmail = relatedPost[i].user_email;
    const user = users.getUser(userEmail);
    parsedData.push({
      profileImageURL : user.profile_image,
      titleCompanion : relatedPost[i].title_companion,
      titleActivity : relatedPost[i].title_activity,
      postId : relatedPost[i].id 
    })
  }
  return parsedData;
}

router.get('/related-to', (req, res, next) => {
  const query = req.query;

  // postid || page number 가 없으면 400에러
  if (!query['post-id'] || !query['page']) {
    return res.status(400).json('Bad Request');
    // return next(createError(400));
  }

  //DB에서 post id 와 장소 같은 글찾기
  const post = posts.getPost(query['post-id']);
  // 존재하지 않는 post id 면 404에러
  if (!post) {
    return res.status(404).json('Not Found')
    // return next(createError(404));
  }

  const relatedPost = getRelatedPost(query['post-id']);
  // 해당 장소에 다른 게시글이 없을 때
  // page number 가 커서 더이상 글이 없을 때
  // 일단 pagenumber 상관없이 전체 리스트 전송
  // status code : 204 , No contents

  // 100번 글은 같은 장소 게시글이 없음
  if (!relatedPost.length) {
    return res.status(204).json([]);
  }

  const sendingData = parseData(relatedPost);

  res.json(sendingData);
});


router.get('/', async (req, res, next) => {
  try {
    const postId = req.query.id;

    if(postId === undefined) {
      return res.status(400).send('Post ID is not defined');
    }

    const post = await Post.findOne({
                            where: { id: postId }, 
                            attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'location_id', 'user_email']},
                            include: [{
                                        model: User, 
                                        attributes: ['nickname', 'profile_image']
                                      },
                                      {
                                        model: Location,
                                        attributes: { exclude: ['id'] }
                                      },
                                      {
                                        model: Image,
                                        attributes: ['url']
                                      }]
                          });

    if(post === null) {
      return res.status(204).send();
    }

    const postInfo = {
      "titlePlace": post.location.name,
      "titleCompanion": post.title_companion,
      "titleActivity": post.title_activity,
      "description": post.description,
      "postImageUrls": [],
      "locationLatitude": post.location.latitude,
      "locationAddress": post.location.address,
      "locationPhoneNumber": post.location.phone,
      "locationLinkAddress": post.link,
      "locationLongitude": post.longitude,
      "writerNickname": post.user.nickname,
      "writerImageUrl": post.user.profile_image
    }
    post.images.forEach(image => postInfo.postImageUrls.push(image.url));
    res.json(postInfo);
  } catch(error) {
    next(error);
  }
});

module.exports = router;