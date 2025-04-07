export function debounce<T extends (...args: any[]) => void>(
    callback: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>

    return function debounced(...args: Parameters<T>) {
        clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            callback(...args)
        }, wait)
    }
}
