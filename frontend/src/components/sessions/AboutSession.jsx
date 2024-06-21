import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const AboutSession = ({ session }) => {
  const [sessionContext, setSessionContext] = useState("");

  const handleInputChange = (e) => {
    setSessionContext(e.target.value);
  };

  const { id } = useParams();

  const { mutate: updateSession, isPending: isUpdatingSession } = useMutation({
    mutationFn: async ({ sessionContent }) => {
      try {
        console.log(id);
        const res = await fetch(`/api/sessions/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionInfo: sessionContent }),
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
      toast.success("Session updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleSubmit = () => {
    updateSession({ sessionContent: sessionContext });
  };

  return (
    <div>
      <h1 className="p-10">ID: {id} </h1>
      <textarea
        placeholder="About session..."
        className=" input border border-gray-700 rounded p-2 input-md m-6"
        value={sessionContext}
        name="sessionInfo"
        onChange={handleInputChange}
      ></textarea>
      <button
        className="mt-10"
        onClick={handleSubmit}
        disabled={isUpdatingSession}
      >
        {!isUpdatingSession ? "Submit" : "Updating"}
      </button>
    </div>
  );
};

export default AboutSession;
