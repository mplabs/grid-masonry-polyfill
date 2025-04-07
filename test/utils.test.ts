import { debounce } from '../src/utils'

jest.useFakeTimers()

describe('debounce', () => {
    it('should call the function once after delay', () => {
        const fn = jest.fn()
        const debounced = debounce(fn, 200)

        debounced()
        expect(fn).not.toBeCalled()

        jest.advanceTimersByTime(199)
        expect(fn).not.toBeCalled()

        jest.advanceTimersByTime(1)
        expect(fn).toBeCalledTimes(1)
    })

    it('should reset the timer if called again before delay', () => {
        const fn = jest.fn()
        const debounced = debounce(fn, 300)

        debounced()
        jest.advanceTimersByTime(100)
        debounced() // resets timer
        jest.advanceTimersByTime(100)
        debounced() // resets again
        jest.advanceTimersByTime(299)
        expect(fn).not.toBeCalled()

        jest.advanceTimersByTime(1)
        expect(fn).toBeCalledTimes(1)
    })

    it('should pass arguments correctly', () => {
        const fn = jest.fn((msg: string) => msg)
        const debounced = debounce(fn, 150)

        debounced('hello')
        jest.runAllTimers()

        expect(fn).toHaveBeenCalledWith('hello')
    })
})
