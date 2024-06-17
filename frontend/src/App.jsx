import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Sidebar from "./components/common/Sidebar";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./AppRoutes";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        console.log("authUser from App:", data.isAdmin);
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <AppRoutes authUser={authUser} />
      <Toaster />
    </div>
  );
}

export default App;
