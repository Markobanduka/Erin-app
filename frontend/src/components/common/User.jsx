import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const User = ({ user }) => {
  const {
    email,
    fullName,
    sessionsLeft,
    profileImg,
    isAdmin,
    sessionsHistory,
    createdAt,
    updatedAt,
    _id,
  } = user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSessionHistory, setCurrentSessionHistory] = useState([]);

  const openModal = (sessionsHistory) => {
    setCurrentSessionHistory(sessionsHistory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: async (_id) => {
      try {
        const res = await fetch(`/api/users/${user._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });

  const handleDeleteUser = () => {
    deleteUser(_id);
  };

  return (
    <div className="user-card p-4 border rounded-lg shadow-lg mb-4 mt-4">
      <div className="flex items-center mb-4">
        <img
          src={profileImg || "/avatar-placeholder.png"}
          alt={`${fullName}'s profile`}
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold">{fullName}</h2>
          <p className="text-sm text-gray-500">{email}</p>
          {isAdmin && <span className="text-sm text-green-500">Admin</span>}
        </div>
      </div>
      <div className="mb-4">
        <p>
          <strong>Sessions Left:</strong> {sessionsLeft}
        </p>
        <p>
          <strong>Joined:</strong> {new Date(createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(updatedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4">
        <button
          className="btn btn-primary w-full text-white py-2 rounded-md mb-2"
          onClick={() => openModal(sessionsHistory)}
        >
          Sessions History
        </button>
        {isModalOpen && (
          <dialog open className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </form>
              <div>
                <h3 className="font-bold text-lg">Session History</h3>
                <div className="py-4">
                  {currentSessionHistory.length > 0 ? (
                    currentSessionHistory.map((session, index) => (
                      <p
                        key={session._id}
                        className="py-3 px-2 border border-sky-500"
                      >
                        {`${index + 1}. ${new Date(
                          session.sessionStart
                        ).toLocaleString()}`}
                      </p>
                    ))
                  ) : (
                    <p>No sessions history</p>
                  )}
                </div>
              </div>
            </div>
          </dialog>
        )}
        <div className="flex justify-between">
          <button className="btn btn-success w-1/2  text-white py-2 rounded-md mr-1">
            Update
          </button>
          <button
            className="btn btn-error w-1/2  text-white py-2 rounded-md ml-1"
            onClick={() => handleDeleteUser(_id)}
          >
            {isPending ? "Loading" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
