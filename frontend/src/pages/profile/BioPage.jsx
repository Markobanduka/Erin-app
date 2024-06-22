import React from "react";

const BioPage = ({ bio }) => {
  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-warning rounded-md w-52 h-8 mt-2"
      >
        View Bio
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <a>{bio}</a>
        </li>
      </ul>
    </div>
  );
};

export default BioPage;
