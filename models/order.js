import mongoose from "mongoose";
import { EOrderStatus } from "../constants/index.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    tea: {
      type: Number,
      required: true,
      min: 0
    },
    totalTea: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: EOrderStatus,
      default: EOrderStatus.PENDING
    },
  },
  {
    timestamps: true
  }
);

// Middleware để tính totalTea
orderSchema.pre('save', function(next) {
  this.totalTea = this.tea * this.quantity;
  next();
});

export const Order = mongoose.model("Order", orderSchema);