import mongoose from "mongoose";

// a printing product schema is created
const itemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  children: {
    type: Array,
  },
  subLabel: {
    type: String,
  },
  image: {
    type: Array,
  },
  fields: {
    type: Array,
  },
  inquiry: {
    type: Boolean,
  },
});
export default mongoose.model("Item", itemSchema);
