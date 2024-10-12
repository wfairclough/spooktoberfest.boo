import { Resend } from "resend";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, Form, redirect } from "@remix-run/react";

export default function GetVoterCard() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500">
            Voter Card Request
          </CardTitle>
          <CardDescription className="text-gray-400">
            Get your voter card to provide access to the voting page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-300">
            To prevent rampant voter fraud, we must verify your identity. Please
            enter the email address you provided during nomination.
          </p>
          <Form method="POST" action="/get-voter-card">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-200"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Hannibal_Lecter@yahoo.com"
                  required
                  className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
            <CardFooter className="px-0 pt-4">
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Request Voter Card
              </Button>
            </CardFooter>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  console.log('Email received', email);
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "SpookyBot <spooky_bot@vote.spooktoberfest.boo>",
    to: [email],
    subject: "👻 So you want to vote, huh? 👻",
    html: "<p>it works!</p>",
  });

  return redirect("/check-email", {
    headers: {
      "Set-Cookie": `email=${formData.get("email")}; Path=/; HttpOnly`,
    },
  });
}
