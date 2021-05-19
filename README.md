# tru.ID open source console

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It's using [NextAuth](https://next-auth.js.org/) for the authentication, making it easier to add other providers.

By default we are using the `Credentials` provider to exchange the workspace `client_id` and `client_secret` with the `client_credentials` grant in order to obtain a valid `access_token` scoped to the workspace.

This repo depends on [`@tru_id/console-components`](https://www.npmjs.com/package/@tru_id/console-components) package that includes the shared components between this open source console and the internal one we use at [tru.ID](https://developer.tru.id/console)

## Local development

Create `.env.local` by cloning `.env.example` and add your `WORKSPACE_CLIENT_ID`, `WORKSPACE_CLIENT_SECRET` and `WORKSPACE_DATA_RESIDENCY` env variables.

You can grab them on https://developer.tru.id/console

![Screenshot_2021-05-18_at_16.28.27](https://gitlab.com/4auth/devx/tru-id-open-source-console/uploads/35c6719c9630a4f87fbf7310ff323f54/Screenshot_2021-05-18_at_16.28.27.png)

You can use the default env variable to secure the NextAuth session when developing locally but you should generate your own set of secrets/keys for production.

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="123_change_me"
NEXTAUTH_ENCRYPTION_KEY='{"kty":"oct","kid":"d1e4a14e-abd3-40da-87b3-1e40eafece52","k":"suBYsn8_qyBXqHanTVluJ1cCppog-N1zZDCKHIeLe1c","alg":"A256GCM"}'
NEXTAUTH_SIGNIN_KEY='{"kty":"oct","kid":"f5398fd6-d9c9-45d2-ab6c-47ed0e23f1cd","k":"m5oDhvCKfFaL2rROe8HFh_uEHHxmWETg_Bfz-dgo7MRz1HFs1FomDzbbU3l3B2Kh7OSvMM1X8lVvw8zA1zwctA","alg":"HS512"}'
```

This can be helpful to generate `HS512` and `A256GCM` keys https://8gwifi.org/jwkfunctions.jsp

Install the packages with `yarn install`.

Run the project `yarn dev` and open [http://localhost:3000](http://localhost:3000)

## Build for prod

If you want to self host the console on your platform you need to build it first and then start the server.

Bear in mind this console has both static assets and lambda functions that require a server.

You can build the assets, including the server lambdas with `yarn build` and serve them with the integrated node server `yarn start`

### Code of Conduct

https://developer.tru.id/code-of-conduct
