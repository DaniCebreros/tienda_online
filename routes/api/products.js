const router = require('express').Router();

const Product = require('../../models/product.model')

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

router.get('/available', async (req, res) => {
    try {
        const products = await Product.find({ available: true })
        res.json(products);
    } catch (error) {
        res.json({ fatal: error.message })
    }
});

router.get('/cat/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category })
        res.json(products);
    } catch (error) {
        res.json({ fatal: message.error })
    }
})

router.get('/min/:price', async (req, res) => {
    const products = await Product.find({
        price: { $gt: req.params.price }
        // $gt, $gte, $lt, $lte, $in, $nin
    });
    res.json(products);
})

router.get('/min/:min/max/:max', async (req, res) => {
    const { min, max } = req.params;

    const products = await Product.find({
        price: { $gt: min, $lt: max }
    })
    res.json(products);
})

router.get('/stock/:stock', async (req, res) => {
    const { stock } = req.params
    const products = await Product.find({
        stock: { $gt: stock },
        available: true
    })
    res.json(products)
})

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    res.json(product)
})


router.post('/', async (req, res) => {
    const newProduct = await Product.create(req.body)
    res.json(newProduct)
})


router.put('/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findByIdAndUpdate(productId, req.body, { new: true })
    res.json(product)
})

router.delete('/:productId', async (req, res) => {
    const { productId } = req.params;
    const p = await Product.findByIdAndDelete(productId)
    res.json(p)
})


module.exports = router;