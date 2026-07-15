import jwt from "jsonwebtoken";

export const getJwtSecrets = () => {
  const configuredSecret = process.env.JWT_SECRET;
  return [
    ...new Set(
      [
        configuredSecret,
        "dev-secret-change-me",
        "your_jwt_secret_key_here",
      ].filter(Boolean),
    ),
  ];
};

export const generateToken = (res, user, message) => {
  const userId =
    typeof user === "object" && user !== null
      ? user._id?.toString() || user.id?.toString()
      : user;

  const token = jwt.sign({ userId }, getJwtSecrets()[0], {
    expiresIn: "1d",
  });

  const safeUser =
    typeof user === "object" && user !== null
      ? {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
        }
      : { _id: userId };

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      success: true,
      message,
      token,
      user: safeUser,
    });
};
