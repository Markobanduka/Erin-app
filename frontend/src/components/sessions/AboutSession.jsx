import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../common/LoadingSpinner";

const AboutSession = ({ session }) => {
  const [sessionContext, setSessionContext] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (session) {
      setSessionContext(session.sessionInfo);
    }
  }, [session]);

  const handleInputChange = (e) => {
    setSessionContext(e.target.value);
  };

  const { mutate: updateSession, isLoading: isUpdatingSession } = useMutation({
    mutationFn: async ({ sessionContent }) => {
      try {
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
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    try {
      updateSession({ sessionContent: sessionContext });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex mx-auto">
      {/* <h1 className="p-10">ID: {id}</h1> */}
      <div className="flex flex-col items-center">
        <textarea
          placeholder="About session..."
          className="input border border-pink-500 rounded-lg p-2 input-md m-6 w-full sm:w-[200px] md:w-[400px] md:h-[300px] lg:w-[600px] lg:h-[400px]"
          value={sessionContext}
          name="sessionInfo"
          onChange={handleInputChange}
          style={{ minHeight: "150px", resize: "vertical" }}
        ></textarea>
        <button
          className="mt-10 btn btn-outline border-pink-500 rounded-lg"
          onClick={handleSubmit}
          disabled={isUpdatingSession}
        >
          {!isUpdatingSession ? "Submit" : "Updating"}
        </button>
        {isUpdatingSession && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default AboutSession;
