import { prop, getModelForClass, ReturnModelType, Severity, modelOptions } from '@typegoose/typegoose'

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class User {
  @prop({ required: true, index: true, unique: true })
  username: string
  @prop({ required: true })
  salt: string
  @prop({ required: true })
  hashedPassword: string
  @prop({ required: true })
  parentName: string
  @prop({ required: true })
  parentCUIL: string
  @prop()
  email: string

  @prop({ _id: false })
  profile: {
    nickName: string
    avatarURL: string
  }

  static findByUsername(this: ReturnModelType<typeof User>, username: string) {
    return this.findOne({ 'username': username })
  }
}


export default getModelForClass<typeof User>(User)