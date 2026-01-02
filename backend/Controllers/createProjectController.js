export const createProject = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const project = awaitreq.user._id ({
      title,
      description,
      image,
      owner: req.user._id
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
