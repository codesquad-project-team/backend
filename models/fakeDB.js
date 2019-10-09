class User {
    constructor(email, image, pw, nickname, authority) {
        this.email = email;
        this.profile_image = image;
        this.password = pw;
        this.nickname = nickname;
        this.authority = authority;
    }
}

class Users {
    constructor(user) {
        this.list = [];
        this._user = user;
    }

    addUser (email, image, pw, nickname, authrity) {
        const newUser = new this._user(email, image, pw, nickname, authrity)
        this.list.push(newUser);
    }

    getUser (email){
        for(let i = 0; i < this.list.length; i++){
            if(this.list[i].email === email) return this.list[i];
        }
        return null;
    }
}

class Post {
    constructor(id, place, companion, activity, desc, location_id, user_email) {
        this.id = id;
        this.title_place = place;
        this.title_companion = companion;
        this.title_activity = activity;
        this.description = desc;
        this.location_id = location_id;
        this.user_email = user_email;
    }
}

class Posts {
    constructor(post) {
        this.last = 0;
        this._post = post;
        this.list = [];
    }

    addPost (place, companion, activity, desc, location_id, user_email) {
        this.last++;
        const newPost = new this._post(this.last, place, companion, activity, desc, location_id, user_email);
        this.list.push(newPost);
    }   

    getPost (postID){
        if(this.list[postID-1]) return this.list[postID-1];
        return null;
    }
    getRelatedPost (postID){
        if(this.list[postID-1]){
            const location_id = this.list[postID-1].location_id
            const relatedPost = [];
            for(let i = 0; i < this.list.length; i++){
                if(i === postID-1){
                    continue;
                }
                if(this.list[i].location_id === location_id){
                    relatedPost.push(this.list[i]);
                }
            }
            return relatedPost;
        }
        return null;
    }
}

const users = new Users(User);

for (let i = 1; i <= 20; i++) {
    const email = `email${i}`;
    const image = 'https://user-images.githubusercontent.com/26920620/66458920-e47b3680-eaae-11e9-80c0-59396fce37c2.png';
    const pw = '1234';
    const nickname = `user${i}`;
    const authority = 'normal'
    users.addUser(email, image, pw, nickname, authority)
}

const place = ['카페에서', '한강에서', '노래방에서'];
const companion = ['혼자서', '애인과', '친구와', '가족과'];
const activity = ['맥주를마셨다', '휴식했다', '춤을췄다', '운동을했다', '책을읽었다'];
const desc = '이것은 더미데이터 입니다.\nDB도 fake DB입니다. 모든 정보는 거짓입니다.'

const posts = new Posts(Post);

for(let i = 0; i < 99; i++){
    posts.addPost(place[i%place.length], companion[i%companion.length], activity[i%activity.length], desc, i%place.length+1, users.list[i%users.list.length].email)
}

posts.addPost('집에서', '공룡이랑', '땅을팠다', '허허허', 4, 'email1');

module.exports = {users,posts}
