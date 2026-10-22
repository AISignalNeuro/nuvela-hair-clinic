import { created, ok } from "../../../core/apiResponse.js";
import * as booking from "../services/booking.service.js";

export const createAppointment = async (req, res) => created(res, await booking.createAppointment(req.body, req.user));
export const listMyAppointments = async (req, res) => ok(res, await booking.listMyAppointments(req.user));
export const createLead = async (req, res) => created(res, await booking.createLead(req.body));
