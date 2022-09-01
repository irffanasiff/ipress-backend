import mongoose from "mongoose";

// a printing product schema is created
const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    } /* 
    details: {
      type: String,
      required: true,
    }, */,
    fields: {
      type: Object,
      required: true,
    },
    browseDesign: {
      type: Boolean,
      required: true,
    },
    uploadDesign: {
      type: Boolean,
      required: true,
    },
    design: {
      image: {
        type: String,
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    isOrdered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// a product model is exported
export default mongoose.model("Product", productSchema);
