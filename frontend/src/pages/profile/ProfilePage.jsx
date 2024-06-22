import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="flex m-auto w-full h-full  border-r border-gray-700 min-h-screen p-4 ">
      <div>
        <p className="text-xl font-bold">{authUser.fullName}</p>
        <div className="mt-3 whitespace-pre-wrap">{authUser.bio}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
