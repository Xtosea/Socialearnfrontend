import UserAvatar from "./UserAvatar";

export default function UserRow({ user, size = 32 }) {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar src={user.profilePicture} size={size} />
      <span>@{user.username}</span>
    </div>
  );
}