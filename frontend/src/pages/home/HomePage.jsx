import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const HomePage = () => {
  const queryClient = useQueryClient();

  const {
    mutate: startSessionMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("api/sessions/startSession", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Session started");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="w-full h-[100vh]">
      <div
        className=" w-full flex flex-col justify-center items-center"
        style={{ height: "calc(100vh - 5rem)" }}
      >
        <button
          className="btn btn-success"
          onClick={(e) => {
            e.preventDefault();
            if (window.confirm("Are you sure you want to start session")) {
              startSessionMutation();
            }
          }}
        >
          {isPending ? "Loading..." : "Start Session"}
        </button>
        <p className="mt-6 font-bold tracking-wider">Sessions Left:</p>
        <span className="mt-1 tracking-wide font-semibold">
          {authUser.sessionsLeft}
        </span>
      </div>
      <div className="flex justify-between h-20 border-t ">
        <button
          className="  w-1/2 flex justify-center items-center border-r"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Sessions history
        </button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Sessions history</h3>
            <div className="py-4">
              {authUser?.sessionsHistory?.length > 0 ? (
                authUser.sessionsHistory.map((session, index) => (
                  <p key={index} className="py-3 px-2 border border-sky-500">
                    {`${index + 1}. ${new Date(
                      session.sessionStart
                    ).toLocaleString()}`}
                  </p>
                ))
              ) : (
                <p>No session history available</p>
              )}
            </div>
          </div>
        </dialog>
        <Link
          className="w-1/2 flex justify-center items-center"
          to="/update-profile"
        >
          <div>Update Profile</div>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
