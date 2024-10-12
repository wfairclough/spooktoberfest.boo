import { SignJWT, jwtVerify } from "jose";

export interface VoterCard {
  key: string;
  email: string;
  name: string;
}

const encoder = new TextEncoder();
const secret = encoder.encode(process.env.JWT_SECRET!);

export async function signVoterCard(voterCard: VoterCard) {
  const payload = {
    iss: 'urn:spooktoberfest', // issuer
    sub: voterCard.email, // subject
    aud: 'urn:spooktoberfest', // audience
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 72, // expiration time (72 hour)
    key: voterCard.key, // custom claim
    iat: Math.floor(Date.now() / 1000), // issued at
    name: voterCard.name,
  };
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);

  return jwt;
}


export async function verifyVoterCard(jwt: string): Promise<VoterCard> {
  const { payload } = await jwtVerify(jwt, secret, {
    issuer: 'urn:spooktoberfest',
    audience: 'urn:spooktoberfest',
  });
  return {
    key: payload.key as string,
    email: payload.sub as string,
    name: payload.name as string,
  };
}
