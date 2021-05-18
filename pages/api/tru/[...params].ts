import request, { Method } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { DataResidency } from "../../../src/types";

type ApiBaseUrlList = {
  [key in DataResidency]?: string;
};

const apiBaseUrlList: ApiBaseUrlList = {
  EU: process.env.NEXT_PUBLIC_DR_EU_CUSTOMER_GW_BASE_URL,
  GB: null,
};

async function TruAPIHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
    signingKey: process.env.NEXTAUTH_SIGNIN_KEY,
    encryptionKey: process.env.NEXTAUTH_ENCRYPTION_KEY,
  });
  if (!token || !token.accessToken) {
    res.status(401).end();
    return;
  }
  const { params } = req.query;
  const apiBaseUrl =
    apiBaseUrlList[token.dataResidency.toUpperCase() as DataResidency];
  if (!apiBaseUrl) {
    res.status(400).end();
    return;
  }
  // @ts-ignore
  const url = `${apiBaseUrl}/${params.join("/")}`;
  try {
    const apiRes = await request(url, {
      data: req.body,
      method: req.method as Method,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    res.status(apiRes.status).send(apiRes.data);
  } catch (err) {
    if (request.isAxiosError(err)) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.status(err.response.status).end(err.response.data);
      }
    } else {
      res.status(500).end();
    }
  }
}

export default TruAPIHandler;
