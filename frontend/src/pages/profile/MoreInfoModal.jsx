import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";

const MoreInfoModal = ({ session, sessionsHistory }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const firstSessionDate =
    sessionsHistory?.length > 0
      ? sessionsHistory[0].sessionStart
      : "No sessions yet";

  return (
    <div>
      {authUser.isAdmin && (
        <Link to={`/session/${session._id}`}>
          <button className="btn btn-outline btn-primary mr-10">Update</button>
        </Link>
      )}
      <div className="dropdown dropdown-left">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-outline rounded-md border-sky-500"
        >
          Info
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="border-b border-sky-500">
              {new Date(session.sessionStart).toLocaleString()}
            </a>
          </li>
          <li>
            <a>
              {session.sessionInfo ? (
                session.sessionInfo
              ) : (
                <div className="text-slate-600 italic">-No session info-</div>
              )}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MoreInfoModal;
