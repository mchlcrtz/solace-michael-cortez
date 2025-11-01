import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ProviderCardSkeleton() {
  return (
    <Card className="flex flex-col h-full" aria-hidden="true" role="presentation">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-muted animate-pulse" />
          </Avatar>
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2 mb-2">
          <div className="flex flex-wrap gap-2">
            <div className="h-6 bg-muted rounded-full w-20 animate-pulse" />
            <div className="h-6 bg-muted rounded-full w-24 animate-pulse" />
            <div className="h-6 bg-muted rounded-full w-16 animate-pulse" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 mt-auto">
        <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
        <div className="h-10 bg-muted rounded w-32 animate-pulse" />
      </CardFooter>
    </Card>
  )
}

