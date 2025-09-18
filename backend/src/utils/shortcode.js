import { customAlphabet } from 'nanoid'
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const nano = customAlphabet(alphabet, 7)
export function generateShortcode(){
  return nano()
}