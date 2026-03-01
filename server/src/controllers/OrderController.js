import Order from "../models/OrderItemSchema.js";

export const CreateOrder = async (req, res) => {
  try {
    const { items, total, stripePaymentId } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Order items are required",
      });
    }
    if (!total || Number(total) <= 0) {
      return res.status(400).json({
        success: false,
        msg: "Order total must be greater than zero",
      });
    }

    const order = await Order.create({
      user: req.userId,
      items,
      total: Number(total),
      stripePaymentId,
    });

    res.status(201).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.product", "name image_url price");

    if (orders.length === 0) {
      return res.json({
        success: false,
        msg: "No Orders Found",
      });
    }

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image_url price");

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatus = ["Paid", "pending", "shipped", "delivered"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("user", "name email")
      .populate("items.product", "name image_url price");

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
