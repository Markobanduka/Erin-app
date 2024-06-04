import User from "../models/user.model.js";
import Session from "../models/session.model.js";

export const getAllSessions = async (req, res) => {
  const isAdmin = req.user.isAdmin;
  try {
    if (isAdmin) {
      const sessions = await Session.find().sort({ createdAt: -1 }).populate({
        path: "user",
        select: "-password",
      });

      if (sessions.length === 0) {
        return res.status(200).json();
      }
      return res.status(200).json(sessions);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.log("Error in getAllSessions: " + error.message);
    res.status(500).json({ error: "ISE " + error.message });
  }
};

export const getUserSessions = async (req, res) => {
  const userId = req.params.id;
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId).populate({
      path: "sessionsHistory",
      select: "sessionStart -_id",
      options: { sort: { sessionStart: -1 } },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sessionDates = user.sessionsHistory
      .map((session) => session.sessionStart)
      .sort((a, b) => new Date(b) - new Date(a));

    return res.status(200).json(sessionDates);
  } catch (error) {
    console.error("Error in getUserSessions:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error: " + error.message });
  }
};
// export const getUserSessions = async (req, res) => {
//   const userId = req.params.id;
//   const isAdmin = req.user.isAdmin;

//   if (!isAdmin) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const sessions = await Session.find({ user: user._id })
//       .sort({ createdAt: -1 })
//       .populate({
//         path: "user",
//         select: "-password",
//       });

//     return res.status(200).json(sessions);
//   } catch (error) {
//     console.error("Error in getUserSessions:", error.message);
//     return res
//       .status(500)
//       .json({ error: "Internal Server Error: " + error.message });
//   }
// };
