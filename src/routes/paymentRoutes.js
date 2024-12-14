import { Router } from "express";
import {MercadoPagoConfig, Preference} from "mercadopago";
import {Sale} from "../schema/Sale.js";
import {SaleDetail} from "../schema/SaleDetail.js";

const paymentRouter = Router();

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

paymentRouter.post("/create_preference", async (req, res) => {
    try {
        const {userId} = req.body;
        if(!userId) {
            return res.status(400).json({error: 'Faltan datos requeridos.'});
        }

        const items = req.body.items.map(item => ({
            title: item.title,
            unit_price: Number(item.unit_price), // Validar como número
            quantity: Number(item.quantity), // Validar como número
            _id: item._id,
            currency_id: "ARS",
        }));

        if (items.some(item => isNaN(item.unit_price) || isNaN(item.quantity))) {
            return res.status(400).json({ error: "Los valores de unit_price y quantity deben ser números válidos." });
        }

        const body = {
            items,
            back_urls: {
                success: "http://localhost:5173/payment-success",
                failure: "http://localhost:5173/payment-failure",
                pending: "http://localhost:5173/",
            },
            auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        const totalSale = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

        const sale = new Sale({
            idUser: userId,
            totalSale: totalSale,
            saleDetails: [],
        })

        await sale.save();

        const saleDetails = await Promise.all(
            items.map(async(item) =>{
                const saleDetail = new SaleDetail({
                    idProduct: item._id,
                    idVenta: sale._id,
                    quantity: item.quantity,
                    price: item.unit_price,
                });

                await saleDetail.save();
                return saleDetail._id;
            })
        );

        sale.saleDetails = saleDetails;
        await sale.save();


        res.json({ id: result.id });
    } catch (error) {
        console.error("Error en la creación de preferencia:", error);
        res.status(500).json({ error: error.message });
    }
});

export default paymentRouter;