import { prop, getModelForClass, ReturnModelType, Severity, modelOptions } from '@typegoose/typegoose'

class Credentials {
  @prop({ required: true, unique: true })
  username: string
  @prop({ required: true })
  salt: string
  @prop({ required: true })
  hashedPassword: string
  @prop({ required: true })
  parentName: string
  @prop({ required: true })
  parentCUIL: string
}
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class User {
  @prop({ _id: false, required: true })
  credentials: Credentials

  @prop({ _id: false })
  profile: {
    nickName: string
    avatarURL: string
  }

  static findByUsername(this: ReturnModelType<typeof User>, username: string) {
    return this.findOne({ 'credentials.username': username })
  }
}


export default getModelForClass<typeof User>(User)