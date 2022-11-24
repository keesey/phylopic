import invalidate from "../../validation/invalidate";
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector";
import { UUIDish } from "../types/UUIDish";
const PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUUIDish = (value: unknown, faultCollector?: ValidationFaultCollector): value is UUIDish =>
    (typeof value === "string" && PATTERN.test(value)) || invalidate(faultCollector, "Not a valid UUID-like identifier.")
export default isUUIDish
