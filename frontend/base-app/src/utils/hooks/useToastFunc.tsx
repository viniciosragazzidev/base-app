import { toast } from "sonner"


// Execute toast and before timeOut execute function 
export function useToastFunc({ message, timeOut = 200, func, type }: { message: string, timeOut?: number, func?: () => void, type?: 'success' | 'error' }) {
    toast[type || 'success'](message)

    if (func) {
        setTimeout(func, timeOut)

    }
}