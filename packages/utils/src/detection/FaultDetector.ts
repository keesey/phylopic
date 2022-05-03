import type ValidationFaultCollector from "../validation/ValidationFaultCollector"
export type FaultDetector<T> = (x: unknown, faultCollector?: ValidationFaultCollector) => x is T
