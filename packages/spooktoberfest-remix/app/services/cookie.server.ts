import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const voterCardCookie = createCookie("voter_card", {
  maxAge: 604_800, // one week
});

export const emailCookie = createCookie("email", {
  maxAge: 604_800, // one week
});


