import crypto from "node:crypto";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { globalCacheService } from "~/services/cache.service";
import ULID from "ulid";

const NominationSchema = z.object({
  key: z.string().regex(/^[0-9A-Z]{26}$/),
  name: z.string().nonempty(),
  email: z.string().email(),
  movieIds: z.array(z.number()),
});

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  const movies = formData.getAll("movieIds")?.map((id) => Number(id));
  const parseResult = NominationSchema.safeParse({
    key: ULID.ulid(),
    name,
    email,
    movieIds: movies,
  });
  if (!parseResult.success) {
    return json({
      message: "Invalid nomination data",
      errors: parseResult.error.errors,
    }, 400);
  }
  const nominationData = parseResult.data;
  const emailHash = hashEmail(nominationData.email);
  console.log(nominationData);
  globalCacheService.set(`nominations:${emailHash}`, JSON.stringify(nominationData));
  return json({
    key: nominationData.key,
    message: "Nomination submitted!",
  }, 201);
}


function hashEmail(email: string) {
  return crypto.createHash("sha1").update(email).digest("hex");
}

