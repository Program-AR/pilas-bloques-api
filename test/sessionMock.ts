import { generateToken } from '../src/models/auth'

export const username = 'USERNAME'
export const password = 'PASSWORD'
export const parentCUIL = 'CUIL'

export const userJson = {
  username,
  password,
  parentName: 'string',
  parentCUIL,
  profile: {
    nickName: username,
    avatarURL: 'string'
  }
}

export const token = generateToken({ username })