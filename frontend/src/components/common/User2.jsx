import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { timeAgo } from "../../utils/date";

const User = ({ user }) => {
  const {
    email,
    fullName,
    sessionsLeft,
    isAdmin,
    sessionsHistory = [],
    createdAt,
    updatedAt,
    _id,
  } = user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSessionHistory, setCurrentSessionHistory] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    bio: "",
    sessionsLeft: "",
  });

  const openModal = (sessionsHistory) => {
    setCurrentSessionHistory(sessionsHistory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async ({ userId, formData }) => {
      try {
        console.log(userId); // Ensure the correct user ID is logged
        const res = await fetch(`/api/users/update/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteUser = () => {
    deleteUser(_id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      updateProfile({ userId: user._id, formData });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const firstSessionDate =
    sessionsHistory.length > 0
      ? sessionsHistory[0].sessionStart
      : "No sessions yet";

  return (
    <div className="user-card p-4 border rounded-lg shadow-lg mb-4 mt-4">
      <div className="flex items-center mb-4">
        <img
          src={"/avatar-placeholder.png"}
          alt={"avatar-placeholder.png"}
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
        <p>
          <strong>Last Session:</strong>{" "}
          {firstSessionDate === "No sessions yet"
            ? firstSessionDate
            : timeAgo(firstSessionDate)}
        </p>
        <p>
          <strong>ID:</strong> {_id}
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
          <button
            className="btn btn-success w-1/2  text-white py-2 rounded-md mr-1"
            onClick={() =>
              document.getElementById("edit_profile_modal_" + _id).showModal()
            }
          >
            Update
          </button>

          <dialog id={"edit_profile_modal_" + _id} className="modal">
            <div className="modal-box border rounded-md border-gray-700 shadow-md">
              <h3 className="font-bold text-lg my-3">Update Profile</h3>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.fullName}
                    name="fullName"
                    onChange={handleInputChange}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.email}
                    name="email"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.currentPassword}
                    name="currentPassword"
                    onChange={handleInputChange}
                  />
                  <textarea
                    placeholder="Bio"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.bio}
                    name="bio"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="password"
                    placeholder="New Password"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.newPassword}
                    name="newPassword"
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    placeholder="Sessions"
                    className="flex-1 input border border-gray-700 rounded p-2 input-md"
                    value={formData.sessionsLeft}
                    name="sessionsLeft"
                    onChange={handleInputChange}
                  />
                </div>

                <button className="btn btn-primary rounded-full btn-sm text-white">
                  {isUpdatingProfile ? "Updating" : "Update"}
                </button>
              </form>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button className="outline-none">close</button>
            </form>
          </dialog>

          <button
            className="btn btn-error w-1/2  text-white py-2 rounded-md ml-1"
            onClick={handleDeleteUser}
          >
            {isPending ? "Loading" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
