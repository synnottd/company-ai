import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
import robotUrl from "@/assets/robot.jpg"
import userUrl from "@/assets/user.avif"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

function RobotAvatar({
  ...props
}: React.ComponentProps<typeof Avatar>) {
  return (
    <Avatar {...props} >
      <AvatarImage src={robotUrl} />
      <AvatarFallback>AI</AvatarFallback>
    </Avatar>
  );
}

function UserAvatar({
  ...props
}: React.ComponentProps<typeof Avatar>) {
  return (
    <Avatar {...props} >
      <AvatarImage src={userUrl} />
      <AvatarFallback>YOU</AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback, RobotAvatar, UserAvatar }
