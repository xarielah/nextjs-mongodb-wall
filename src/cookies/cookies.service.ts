import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

/**
 * Cookie service is wrapper of Next.js cookies header function
 */
export class CookiesService {
  c: ReadonlyRequestCookies;

  cookieConfig: object = {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    httpOnly: true,
  };

  constructor() {
    this.c = cookies();
  }

  sendClientHttpTokenCookie(token: string) {
    this.c.set("access_token", token, this.cookieConfig);
  }
}
