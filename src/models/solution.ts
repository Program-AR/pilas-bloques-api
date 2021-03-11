import { prop, getModelForClass, Severity, modelOptions, Ref } from '@typegoose/typegoose'
import { Schema } from 'mongoose'
import { User } from './user'

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Solution {
  @prop({ required: true, index: true })
  challengeId: Schema.Types.Mixed
  @prop({ required: true, index: true })
  solutionId: Schema.Types.Mixed
  @prop({ required: true })
  program: string
  @prop()
  staticAnalysis: Schema.Types.Mixed
  @prop()
  executionResult: Schema.Types.Mixed
  @prop({ ref: () => User })
  user: Ref<User>
}

export default getModelForClass<typeof Solution>(Solution)