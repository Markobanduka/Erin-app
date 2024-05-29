// Example function to add a new session to a user's session history
async function addSession(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Add a new session with the current timestamp
    user.sessionsHistory.push({});

    await user.save();
    console.log("Session added successfully");
  } catch (error) {
    console.error("Error adding session:", error);
  }
}
