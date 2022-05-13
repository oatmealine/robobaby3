import { ImgurClient } from "imgur";

export const imgur = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID as string });
