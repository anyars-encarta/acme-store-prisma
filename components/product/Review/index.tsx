import Stars from "../Stars";
import { Card, CardContent } from "../../ui/card";

import { Review } from "@prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ReviewView({ review }: { review: Review }) {
  const { name, rating, content } = review;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage alt="@jaredpalmer" src="/placeholder-avatar.jpg" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <div className="flex items-center gap-0.5">
              <Stars rating={rating} />
            </div>
          </div>
        </div>
        <p>{content}</p>
      </CardContent>
    </Card>
  );
}
