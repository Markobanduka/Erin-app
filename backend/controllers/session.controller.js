import User from "../models/user.model.js";
import Session from "../models/session.model.js";

export const startSession = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ error: "User not found" });

    if (currentUser.sessionsLeft <= 0) {
      return res.status(400).json({ error: "No sessions left" });
    }

    const newSession = new Session({
      user: currentUser._id,
      sessionStart: new Date(),
      sessionInfo: "",
    });

    await newSession.save();

    currentUser.sessionsHistory.unshift({
      sessionStart: newSession.sessionStart,
    });
    currentUser.sessionsLeft -= 1;
    await currentUser.save();

    res.status(200).json({ message: "Session started successfully" });
  } catch (error) {
    console.log("Error in starting session controller: " + error.message);
    res.status(500).json({ error: "Internal server error " + error.message });
  }
};

export const updateSessionInfo = async (req, res) => {
  let { sessionInfo } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findOne({ "sessionsHistory._id": id });
    if (!user) return res.status(404).json({ error: "Session not found" });

    const session = user.sessionsHistory.id(id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    session.sessionInfo = sessionInfo;
    await user.save();
    res.status(200).json({ message: "Session info updated successfully" });
  } catch (error) {
    console.log("Error in updateSessionInfo controller: " + error.message);
    res.status(500).json({ error: "Internal server error " + error.message });
  }
};

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

export const getMySessions = async (req, res) => {
  const currentUser = req.user._id;

  try {
    const user = await User.findById(currentUser).populate({
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
