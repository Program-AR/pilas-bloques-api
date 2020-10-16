import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const User = new Schema({
  credentials: {
    username: {
      type: String,
      required: true,
      unique: true
    },
    salt: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    parentCUIL: {
      type: String,
      required: true,
    }
  },
  profile: {
    avatarURL: String
  }
}, {
  timestamps: true
})

export default mongoose.model('User', User)