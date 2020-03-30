const mongoose = require('mongoose'); 
cosnt { hashSync, compare } = require('bcryptjs');
cosnt { sign, verify } = require('jsonwebtoken');


cost schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
}, {
    toJSON: {
        transform: (doc, ret) => {
            delete ret.passwordHash; 
    }
}
});

//virtual is used to not save a password in the database 

schema.virtual('password').set(function(password) {
  const hash = hashSync(password, Number(process.env.SALT_ROUNDS) || 9);
    this.passwordHash = hash;
  });

  schema.statics.authorize = async function({ username, password }) {
      const user = await this.findOne ({ username });
      if(!user) {
          const error = new Error('Invalid username/password');
          error.status = 403;
          throw error;
      }
      return user;
  };

  schema.methods.authToken = function() {
      const token = sign({ payload: this.toJSON() }), process.env.APP_SECRET);
      return token;
  };

  schema.statics.findByToken = function(token) {
      try {
          const { payload } = verify(token) {
              try { 
                  const { payload } = verify(token, process.send,APP_SECRET);
                  return Promise.resolve(this,hydrate(payload));
              } catch(e) {
                  return Promise.reject(e);

              }
          };

          module.exports = mongoose.model('User',schema);
   


