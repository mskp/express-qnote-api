import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import Notes from "../models/note.js";
import { validateNote } from "../utils/validation.js";

const router = Router();

router
  .get("/", verifyToken, async (req, res) => {
    try {
      let notes = await Notes.find({ user: req.user._id }, null, {
        sort: { date: -1 },
      });
      return res.status(200).json(notes);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  })

  .post("/", verifyToken, async (req, res) => {
    const { error } = validateNote(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    try {
      console.log(req.user);
      await Notes.create({
        user: req.user._id,
        ...req.body,
      });
      res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ success: false, error: err.message });
    }
  })

  .put("/:id", verifyToken, async (req, res) => {
    const { error } = validateNote(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    try {
      let note = await Notes.findById(req.params.id);
      if (!note)
        return res
          .status(404)
          .json({ success: false, message: "Invalid note" });
      if (note.user.toString() !== req.user._id)
        res.status(401).json({ success: false });
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: { ...req.body } },
        { new: true }
      );
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  })

  .delete("/:id", verifyToken, async (req, res) => {
    try {
      let note = await Notes.findById(req.params.id);
      if (!note) return res.status(404).json({ message: "Note not found" });

      if (note.user.toString() !== req.user._id)
        res.status(401).json({ message: "Could not delete" });

      note = await Notes.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ message: `Note with id ${note.id} got deleted` });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });

export default router;
