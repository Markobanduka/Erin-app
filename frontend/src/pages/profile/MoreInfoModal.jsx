import { useQuery } from "@tanstack/react-query";
import AboutSession from "../../components/sessions/AboutSession";
import { useState } from "react";
import { Link } from "react-router-dom";

const MoreInfoModal = ({ session, sessionsHistory }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const firstSessionDate =
    sessionsHistory?.length > 0
      ? sessionsHistory[0].sessionStart
      : "No sessions yet";

  // console.log(session);

  return (
    <div>
      {authUser.isAdmin && (
        <Link to={`/session/${session._id}`}>
          <button>Update</button>
        </Link>
      )}
      <div className="dropdown dropdown-left">
        <div tabIndex={0} role="button" className="btn m-1">
          Click
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a>{new Date(session.sessionStart).toLocaleString()}</a>
          </li>
          <li>
            <a>{session.sessionInfo}</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MoreInfoModal;

// import { useQuery } from "@tanstack/react-query";
// import React, { useState } from "react";

// const MoreInfoModal = () => {
//   const { data: authUser } = useQuery({ queryKey: ["authUser"] });

//   return (
//     <div>

//       <button
//         className="btn btn-outline border-sky-500"
//         onClick={() => document.getElementById("my_modal_2").showModal()}
//       >
//         More Info
//       </button>

//       <dialog id="my_modal_2" className="modal">
//         <div className="modal-box">
//           <h3 className="font-bold text-lg">Hello!</h3>
//           <p className="py-4">Press ESC key or click outside to close</p>
//           {authUser.isAdmin && (
//             <button className="btn btn-success">Update</button>
//           )}
//         </div>
//         <form method="dialog" className="modal-backdrop">
//           <button>close</button>
//         </form>
//       </dialog>
//     </div>
//   );
// };

// export default MoreInfoModal;
