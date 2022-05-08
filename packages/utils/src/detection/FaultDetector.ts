import type ValidationFaultCollector from "../validation/ValidationFaultCollector.js"
export type FaultDetector<T> = (x: unknown, faultCollector?: ValidationFaultCollector) => x is T
