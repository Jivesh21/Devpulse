import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  TrendingUp,
  Users,
  Activity,
  ArrowUpRight,
} from "lucide-react";

const TRENDING = [
  "React 19",
  "Node.js",
  "TypeScript",
  "Next.js",
  "AI Agents",
];

const SUGGESTED_USERS = [
  {
    name: "Sarah Chen",
    username: "@sarahdev",
    initials: "SC",
  },
  {
    name: "Alex Johnson",
    username: "@alexjs",
    initials: "AJ",
  },
  {
    name: "Priya Sharma",
    username: "@priyadev",
    initials: "PS",
  },
];

function RightSidebar() {
  return (
    <div className="space-y-5">
      {/* Trending */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <h2 className="font-semibold">
              Trending Technologies
            </h2>
          </div>

          <div className="space-y-3">
            {TRENDING.map((item) => (
              <button
                key={item}
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition hover:bg-muted"
              >
                <span className="text-sm font-medium">
                  {item}
                </span>

                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Developers */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-600" />
            <h2 className="font-semibold">
              Suggested Developers
            </h2>
          </div>

          <div className="space-y-4">
            {SUGGESTED_USERS.map((user) => (
              <div
                key={user.username}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" />

                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-500 text-white">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {user.username}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Activity */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-violet-600" />

            <h2 className="font-semibold">
              Community Activity
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Developers Online
              </span>

              <span className="font-semibold">
                2,481
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Posts Today
              </span>

              <span className="font-semibold">
                386
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Repositories Shared
              </span>

              <span className="font-semibold">
                142
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RightSidebar;