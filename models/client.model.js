const { model, Schema } = require('mongoose');

const clientShema = new Schema({
    name: String,
    email: String,
    adress: String,
    age: Number,
    active: Boolean,
    products: [{ type: Schema.Types.ObjectId, ref: 'product' }]
});

module.exports = model('client', clientShema);

