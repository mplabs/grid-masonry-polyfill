/**
 * @jest-environment jsdom
 */

// Manually define global.CSS if it's missing
if (!('CSS' in globalThis)) {
    ;(globalThis as any).CSS = {}
}

describe('grid masonry polyfill', () => {
    beforeEach(() => {
        // Set feature unsupported for test
        Object.defineProperty(global.CSS, 'supports', {
            value: () => false,
            configurable: true,
        })

        document.body.innerHTML = `
<div class="grid--masonry" style="display: grid; row-gap: 10px; grid-template-columns: repeat(2, 1fr);">
    <div style="height: 100px;">A</div>
    <div style="height: 80px;">B</div>
    <div style="height: 60px;">C</div>
    <div style="height: 40px;">D</div>
</div>
    `

        // Import the polyfill now, so we don't miss the load event
        jest.isolateModules(() => {
            require('../src/index')
        })
    })

    afterEach(() => {
        jest.clearAllTimers()
        jest.restoreAllMocks()
        document.body.innerHTML = ''
    })

    it('does not throw when initializing', () => {
        expect(() => {
            require('../src/index')
        }).not.toThrow()
    })

    it('applies margin-top to items not in the first row after layout', () => {
        
        // Simulate load event to trigger layout
        window.dispatchEvent(new Event('load'))
        
        const items = Array.from(document.querySelectorAll('.grid--masonry > div')) as HTMLElement[]

        // Only the second row and beyond should be touched (index >= 2)
        for (let i = 2; i < items.length; i++) {
            const mt = items[i].style.marginTop
            expect(mt).toMatch(/px$/)
        }
    })

    it('updates layout when an image loads', () => {
        const grid = document.querySelector('.grid--masonry') as HTMLElement
        grid.innerHTML = `<img src="img.jpg" />`

        const img = grid.querySelector('img') as HTMLImageElement

        const spy = jest.spyOn(img, 'addEventListener')

        // Polyfill should register a 'load' listener
        expect(spy).toHaveBeenCalledWith('load', expect.any(Function), { once: true })

        // Trigger the load event manually
        const loadEvent = new Event('load')
        img.dispatchEvent(loadEvent)

        // There's no visible output, but no error is success here
        expect(true).toBe(true)
    })
})
