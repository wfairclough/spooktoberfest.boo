import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Mail } from "lucide-react"
import { Link } from '@remix-run/react';

export default function CheckEmail() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-500 text-center">Voter Card Sent!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <p className="text-center text-gray-300">
            Your SpooktoberFest voter card has been sent to your email address. Please check your inbox (and spam folder, just in case) for further instructions.
          </p>
          <p className="text-sm text-gray-400 text-center">
            If you don't receive the email within a few minutes, please try requesting again or complain to Will directly on FB Messenger.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Return to Homepage
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
