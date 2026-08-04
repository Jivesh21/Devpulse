import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useSearchUsers } from "@/hooks/useProfile";

function SearchBar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } =
    useSearchUsers(debouncedQuery);

  const users = data?.data || [];

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type="search"
        placeholder="Search developers..."
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        className="h-10 rounded-full bg-muted/50 pl-10"
      />

      {query.trim() && (
        <div className="absolute mt-2 max-h-80 w-full overflow-hidden rounded-xl border bg-background shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No developers found
            </div>
          ) : (
            users.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  navigate(`/profile/${user.username}`);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-muted"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">
                    {user.fullName}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;