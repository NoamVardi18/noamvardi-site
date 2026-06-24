// SharpenDaily brand + config constants. English LTR brand sharing the NV backend.
export const SD = {
  brand: "sharpendaily",
  name: "SharpenDaily",
  handle: "@sharpendaily",
  url: process.env.NEXT_PUBLIC_SD_URL || "https://sharpendaily.co",
  fromEmail: process.env.SD_FROM_EMAIL || "SharpenDaily <hello@sharpendaily.co>",
  replyTo: process.env.SD_REPLY_TO || "hello@sharpendaily.co",
  socials: {
    youtube: "https://youtube.com/@sharpendaily",
    instagram: "https://instagram.com/sharpendaily",
    tiktok: "https://tiktok.com/@sharpendaily",
  },
} as const;

export const SD_ACCESS_COOKIE = "sd_access";
