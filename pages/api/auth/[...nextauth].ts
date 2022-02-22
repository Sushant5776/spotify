import spotifyApi, { LOGIN_URL } from 'lib/spotify'
import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
type JWTToken = {
  accessToken: string | undefined
  refreshToken: string | undefined
  username: string
  accessTokenExpires: number
}

async function refreshAccessToken(token: JWTToken) {
  try {
    spotifyApi.setAccessToken(token.accessToken as string)
    spotifyApi.setRefreshToken(token.refreshToken as string)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    } as JWTToken
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial Sign In
      if (account && user) {
        return {
          ...token,
          acessToken: account.access_token,
          refreshToken: account?.refresh_token,
          username: account?.providerAccountId,
          accessTokenExpires: (account?.expires_at as number) * 1000,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      return await refreshAccessToken(token as JWTToken)
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username

      return session
    },
  },
})
