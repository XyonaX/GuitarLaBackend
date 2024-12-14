import { getOrders } from "../controllers/SalesController.js";




const getOrders = async (req, res) => {
    try {
        const response = await getOrdersByUser(req.user.id);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las ventas." });
    }
}


export { getOrders };