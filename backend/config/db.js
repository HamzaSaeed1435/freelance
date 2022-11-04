const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://Hamza:Hamzasaeed123@cluster0.rc0xeid.mongodb.net/freelance' ,{ useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex : true  })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB