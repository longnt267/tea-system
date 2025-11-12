export const telegram = async (req, res) => {
  try {
    res.status(200).json({
      message: "hehe",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
