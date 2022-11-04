const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const OrderModel = mongoose.Schema(
{
    proposalId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'proposal',
    },
    submittedBy :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer',
    },
    freelancer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer'
    }
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderModel", OrderModel);
