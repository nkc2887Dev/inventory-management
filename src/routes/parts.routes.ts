import { Router } from "express"
import { createPartController, setToInventoryController } from "../controllers/parts.controller"
import validate from "../middleware/validate.middleware";
import { addInventory, createPart } from "../validators/parts.validator";

const router = Router()

// Part
router.post("/part", validate(createPart), createPartController);

// Inventory
router.post("/part/:id", validate(addInventory), setToInventoryController);

export default router
