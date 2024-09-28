import { Injectable, Logger } from "@nestjs/common";
import { z } from "zod";

export const NominationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  movies: z.array(z.number()),
});

export type Nomination = z.infer<typeof NominationSchema>;

const log = new Logger('NominationService');

@Injectable()
export class NominationService {
  

  async nominateMovies(nomination: Nomination) {
    log.log(`Received nomination: ${JSON.stringify(nomination)}`);
    return {
      message: "Nomination received",
    };
  }


}

