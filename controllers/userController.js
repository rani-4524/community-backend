import userService from "../services/userService.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const token = await userService.registerUser({ name, email, password });
    res.cookie("token", token.token, {
      httpOnly: true,
      secure : true, //keep it for PRODUCTION
      sameSite: "none", //strict , lax , none
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.json({
      data: {
        message: "User register Successfully",
        user: token.user,
      },
      error: null,
    });
  } catch (error) {
    res.json({
      error: {
        message: "failed to save user in db",
        info: error.message,
      },
      data: null,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.loginUser({ email, password });

    res.cookie("token", user.token, {
      httpOnly: true,
      secure : true, //keep it for PRODUCTION
      sameSite: "none", //strict , lax , none
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.json({
      data: {
        message: "User login Successfully",
        user: user.user,
      },
      error: null,
    });
  } catch (error) {
    res.json({
      error: {
        message: "failed to login user ",
        info: error.message,
      },
      data: null,
    });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.query;

    await userService.joinCommunity({ userId: req.user._id, communityId });

    res.json({
      data: {
        message: "user has successfully joined the community",
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        message: "failed to add user in community",
        info: error.message,
      },
    });
  }
};

const makeHost = async (req, res) => {
  try {
    const userId = req.user._id;
    await userService.makeHost(userId);

    res.json({
      data: {
        message: "user role changed to host",
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        message: "failed to upgrade user to host",
        info: error.message,
      },
      data: null,
    });
  }
};

const profile = async (req, res) => {
  try {
    if (!req.user) throw new Error("user not found , maybe invalid token");

    const userDetails = await userService.profile(req.user);
    res.json({
      data: {
        message: "user details fetched successfully",
        user: userDetails,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        message: "unable to find user details",
        info: error.message,
      },
      data: null,
    });
  }
};

const leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    await userService.leaveCommunity({ userId, id });

    res.json({
      data: {
        message: "user left the community successfully",
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        message: "failed to remove user from this community",
        info: error.message,
      },
      data: null,
    });
  }
};

const dashboard = async (req, res) => {
  try {
    const { _id: id } = req.user;
    const dashboard = await userService.dashboard(id);

    res.json({
      data: {
        message: "successfully fetched the member dashboard",
        dashboard,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        message: "failed to fetch the member dashboard",
        info: error.message,
      },
      data: null,
    });
  }
};

const hostDashboard = async (req, res) => {
  try {
    const { _id: id } = req.user;
    const hostDashboard = await userService.hostDashboard(id);

    res.json({
      data: {
        message: "successfully fetch the host dashboard",
        hostDashboard,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        message: "failed to fetch the host dashboard",
        info: error.message,
      },
      data: null,
    });
  }
};

const toggleRSVP = async (req, res) => {
  try {
    const user = req.user;
    const { eventId } = req.query;

    await userService.rsvpToggle({ user, eventId });

    res.json({
      data: {
        message: "user successfully rsvpedEvent",
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        message: "failed to rsvped events",
        info: error.message,
      },
      data: null,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure:true,
      sameSite: "none",
    });

    res.json({
      data: {
        message: "user logged out successfully",
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        message: "failed to logout user",
        info: error.message,
      },
    });
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) throw new Error("file not received");

    if (!req.file.mimetype?.startsWith("image/"))
      throw new Error("only images are allowed as profile picture");

    const profileFilePath = req.file.path;
    await userService.uploadProfilePic({
      userId: req.user._id,
      profileFilePath,
    });
    res.json({
      data: {
        message: "profile picture updated successfully",
        file: req.file,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        message: "",
        info: error.message,
      },
      data: null,
    });
  }
};

export default {
  register,
  login,
  joinCommunity,
  makeHost,
  profile,
  leaveCommunity,
  dashboard,
  hostDashboard,
  toggleRSVP,
  logout,
  uploadProfilePic,
};
