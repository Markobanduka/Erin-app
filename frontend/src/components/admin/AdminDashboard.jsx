import React from "react";
import User from "../common/User";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../skeletons/PostSkeleton";

const AdminDashboard = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/admin");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && users?.length === 0 && (
        <p className="mx-auto my-auto text-4xl">No users yet</p>
      )}
      {!isLoading && users && (
        <div className="mx-auto my-auto">
          {users.map((user) => (
            <User key={user._id} user={user} />
          ))}
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
