import { ValidationFaultCollector } from "../validation"
export type FaultDetector<T> = (x: unknown, faultCollector?: ValidationFaultCollector) => x is T
