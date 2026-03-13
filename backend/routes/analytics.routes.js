import express from 'express'


import Revenue from '../models/revenue.model.js'
import checkoutModel from '../models/Checkout.model.js'



const app = express()



app.get('/test', (req, res) => {


})


app.get('/total-revenue', async (req, res) => {
    try {
        const revenueDoc = await Revenue.findOne(); // assuming there's only one document
        if (!revenueDoc) {
            return res.status(404).json({ message: 'Revenue data not found' });
        }
        res.status(200).json({ message: "fetched revenue successfully", totalRevenue: revenueDoc.total });
    } catch (error) {
        console.error('Failed to fetch revenue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/all-orders', async (req, res) => {
    try {
        const orders = await checkoutModel.find({});
        if (!orders || orders.length == 0) {
            return res.status(404).json({ message: "No orders found" })
        }
        res.status(200).json({ message: "Found orders successfully", orders: orders })
    }
    catch (error) {
        console.error('Failed to fetch orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.put('/update-order-status', async (req, res) => {
    const { orderID, orderStatus } = req.body;
    console.log("Received update-order-status request with orderID:", orderID, "and orderStatus:", orderStatus);
    if (!orderID || !orderStatus) {
        return res.status(400).json({ message: "both order id and order status are required" });
    }

    try {
        // Fetch current order to know previous status and amount
        const existingOrder = await checkoutModel.findById(orderID);
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        const previousStatus = existingOrder.orderStatus;

        // Update status
        existingOrder.orderStatus = orderStatus;
        await existingOrder.save();
        console.log(existingOrder)
        // Only add revenue when transitioning to completed once
        if (orderStatus === 'delivered' && previousStatus !== 'delivered') {
            await Revenue.findOneAndUpdate(
                {},
                { $inc: { total: Number(existingOrder.orderTotal) || 0 } },
                { upsert: true, new: true }
            );
        }

        return res.status(200).json({ message: "order status updated successfully" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


export default app;