import { z } from 'zod'

const PhotoName = z.union([
  z.literal("lightbulb"),
  z.literal("orange"),
  z.literal("pear"),
  z.literal("apple"),
  z.literal("hotdog"),
  z.literal("icecream"),
  z.literal("cloud"),
  z.literal("earth"),
  z.literal("heart"),
])

export const UserData = z.object({
  uid: z.string(),
  displayName: z.string(),
  mostRecentProgram: z.string(),
  photoName: PhotoName,
  programs: z.array(z.string()),
  /* TODO: add developer account */
  /* classes: z.array(z.string()), */
})

export const Program = z.object({
  code: z.string(),
  language: z.union([z.literal('react'), z.literal('python')]),
  name: z.string(),
  thumbnail: z.number().int(),
})

export const Programs = z.record(Program)

export const GetUserDataResponse = z.object({
  userData: UserData,
  programs: Programs,
})
