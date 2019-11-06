const whitelist = [undefined,'http://localhost:8080', 'http://connectflavor.cf', 'http://api.connectflavor.cf']

const options = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials : true
}

module.exports = options;