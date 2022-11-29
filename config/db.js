const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

//protocol://user:pass@host:port/database