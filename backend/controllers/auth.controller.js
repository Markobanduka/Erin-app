export const signup = async (req, res) => {
  // const { name, email, username, password } = req.body;
  // if (!name || !email || !username || !password) {
  //   res.status(400).json({ message: "Please fill all the fields" });
  // }
  res.send("Welcome to signup");
};

export const login = async (req, res) => {
  res.send("Welcome to login");
};
export const logout = async (req, res) => {
  res.send("Welcome to logout");
};
