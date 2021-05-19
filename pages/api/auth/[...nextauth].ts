import request from 'axios'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Providers from 'next-auth/providers'
import { DataResidency } from '../../../src/types'

type DataResidencyUrlList = {
  [key in DataResidency]?: string
}

const dataResidencyUrlList: DataResidencyUrlList = {
  EU: `${process.env.NEXT_PUBLIC_DR_EU_CUSTOMER_GW_BASE_URL}/oauth2/v1/token`,
}

const clientId = process.env.WORKSPACE_CLIENT_ID
const clientSecret = process.env.WORKSPACE_CLIENT_SECRET
const dataResidency = process.env.WORKSPACE_DATA_RESIDENCY as DataResidency

async function fetchAccessToken() {
  const url = dataResidencyUrlList[dataResidency.toUpperCase() as DataResidency]
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'workspaces projects',
  })
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  )
  const res = await request(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: `Basic ${basicAuth}`,
    },
    data: body.toString(),
  })
  return {
    accessToken: res.data.access_token,
    expiresAt: Date.now() + res.data.expires_in * 1000,
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const { accessToken, expiresAt } = await fetchAccessToken()
    return {
      ...token,
      accessToken,
      expiresAt,
    }
  } catch (err) {
    console.error('Error fetching a new access_token', err)
    return {
      ...token,
      error: 'NewAccessTokenError',
    }
  }
}

export default NextAuth({
  providers: [
    Providers.Credentials({
      id: 'tru_client_credentials',
      type: 'credentials',
      name: 'Client Credentials',
      authorize: async () => {
        try {
          const { accessToken, expiresAt } = await fetchAccessToken()
          const user = {
            id: clientId,
            email: clientId,
            name: clientId,
            accessToken,
            expiresAt,
            dataResidency,
          }
          return user
        } catch (err) {
          console.error('Error fetching access_token', err)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  callbacks: {
    async session(session, token) {
      const updatedSession = {
        ...session,
      }
      if (token?.dataResidency) {
        updatedSession.dataResidency = token.dataResidency
      }
      if (token?.error) {
        updatedSession.error = token.error
      }
      if (token) {
        // only include if the user is logged in
        updatedSession.clientId = clientId
        updatedSession.clientSecret = clientSecret
      }
      return updatedSession
    },
    async jwt(token, user, account, profile) {
      // Initial sign in
      if (account && user && profile) {
        const tokenWithCredentials = {
          ...token,
        }
        if (account.access_token) {
          tokenWithCredentials.accessToken = account.access_token
        }
        if (account.expires_in) {
          tokenWithCredentials.expiresAt =
            Date.now() + account.expires_in * 1000
        }
        tokenWithCredentials.dataResidency = String(
          profile.dataResidency,
        ).toUpperCase() as DataResidency
        return tokenWithCredentials
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.expiresAt) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  jwt: {
    encryption: true,
    secret: process.env.NEXTAUTH_SECRET,
    signingKey: process.env.NEXTAUTH_SIGNIN_KEY,
    encryptionKey: process.env.NEXTAUTH_ENCRYPTION_KEY,
  },
})
