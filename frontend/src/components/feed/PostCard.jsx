import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
} from "lucide-react";

function PostCard({ post }) {
  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarImage src={post.author?.avatar} />
              <AvatarFallback className="bg-violet-600 text-white">
                {post.author?.fullName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold leading-none">
                {post.author?.fullName}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                @{post.author?.username}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        {post.content && (
          <div className="px-5 pb-4">
            <p className="whitespace-pre-wrap leading-7">
              {post.content}
            </p>
          </div>
        )}

        {/* Image */}
        {post.image && (
          <div className="border-y bg-muted">
            <img
              src={post.image}
              alt="Post"
              className="max-h-[550px] w-full object-contain"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-around border-t p-2">
          <Button
            variant="ghost"
            className="flex-1 gap-2"
          >
            <Heart className="h-5 w-5" />
            Like
          </Button>

          <Button
            variant="ghost"
            className="flex-1 gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Comment
          </Button>

          <Button
            variant="ghost"
            className="flex-1 gap-2"
          >
            <Bookmark className="h-5 w-5" />
            Save
          </Button>

          <Button
            variant="ghost"
            className="flex-1 gap-2"
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;