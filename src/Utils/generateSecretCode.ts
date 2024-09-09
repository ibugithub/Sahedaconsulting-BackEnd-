import { secretCode } from "../models/User"
export const GenerateSecretCode = async() => {
  const createdCode = Math.random().toString(36).substring(2, 15)
  const code = new secretCode({ code: createdCode })
  await code.save();
  return code;
}