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
    price :{
      type : Number,
      require : true 
    },
    freelancer:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freelancer'
    },
    client :{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client'
    },
    type:{
      type:String,
      require:true
    }
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderModel", OrderModel);
