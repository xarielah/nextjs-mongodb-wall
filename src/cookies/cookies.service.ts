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

  settingsCookieConfig: object = {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    httpOnly: true,
  };

  wallIdCookieConfig: object = {
    path: "/",
    httpOnly: false,
  };

  constructor() {
    this.c = cookies();
  }

  sendClientHttpTokenCookie(token: string) {
    this.c.set("access_token", token, this.cookieConfig);
  }

  getSettingsCookie() {
    return this.c.get("user-settings");
  }

  sendSettingsHttpCookie(settings: string) {
    this.c.set("user-settings", settings, this.cookieConfig);
  }

  deleteSettingsHttpCookie() {
    this.c.delete("user-settings");
  }

  sendWallIdCookie(wallId: string) {
    this.c.set("wall-id", wallId, this.wallIdCookieConfig);
  }
}
