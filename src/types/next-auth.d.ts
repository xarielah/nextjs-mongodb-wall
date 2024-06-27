import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** User's wall id. */
      wallId: string;
      email?: string;
      name?: string;
      image?: string;
      emailVerified?: string;
      id?: string;
    };
    expires: string;
  }
}
