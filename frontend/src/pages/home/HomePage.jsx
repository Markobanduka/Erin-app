import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import EditProfileModal from "../profile/EditProfileModal";
import MoreInfoModal from "../profile/MoreInfoModal";

const HomePage = () => {
  const queryClient = useQueryClient();

  const { mutate: startSessionMutation, isPending } = useMutation({
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
          className="btn btn-success rounded-lg"
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
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 px-2 border border-sky-500"
                  >
                    {`${index + 1}. ${new Date(
                      session.sessionStart
                    ).toLocaleDateString()}`}
                    <span>
                      <MoreInfoModal
                        session={session}
                        sessionsHistory={authUser.sessionsHistory}
                      />
                    </span>
                  </div>
                ))
              ) : (
                <p>No session history available</p>
              )}
            </div>
          </div>
        </dialog>
        <EditProfileModal />
      </div>
    </div>
  );
};
export default HomePage;
