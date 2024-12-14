import { Sale } from "../schema/Sale.js";

// Obtener todas las órdenes de un usuario
export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Obtén el ID del usuario desde el token decodificado
        const orders = await Sale.find({ idUser: userId }).populate('saleDetails'); // Filtra las órdenes para el usuario autenticado, también puedes hacer populate si necesitas más detalles

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No se encontraron órdenes" });
        }

        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las órdenes" });
    }
};