import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="w-full h-[100vh]">
      <div
        className=" w-full flex flex-col justify-center items-center"
        style={{ height: "calc(100vh - 5rem)" }}
      >
        <button className="btn btn-success">Start Session</button>
        <p className="mt-6 font-bold tracking-wider">Sessions Left:</p>
        <span className="mt-1 tracking-wide font-semibold">69</span>
      </div>
      <div className="flex justify-between h-20 border-t ">
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="  w-1/2 flex justify-center items-center border-r"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Sessions history
        </button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click on ✕ button to close</p>
            <p className="py-4">02/05/2024</p>
            <p className="py-4">03/24/2024</p>
            <p className="py-4">06/07/2024</p>
            <p className="py-4">09/05/2024</p>
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
