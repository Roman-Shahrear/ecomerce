const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI)
    .then((data)=>{
        console.log(`Mongodb connect with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;


// const mongoose = require("mongoose");

// const connectDatabase = () => {
//     mongoose.connect(process.env.DB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//         serverSelectionTimeoutMS: 5000,
//     })
//     .then(() => {
//         console.log(`MongoDB connected to server: ${mongoose.connection.host}`);
//     })
//     .catch((error) => {
//         console.error(`MongoDB connection error: ${error}`);
//     });
// };

// module.exports = connectDatabase;
