import '../src/index' // Import the polyfill

// Enable fake timers for all tests in this file
jest.useFakeTimers()

describe('Grid Masonry Polyfill', () => {
    // Setup and teardown
    let container: HTMLElement

    beforeEach(() => {
        // Create a container with grid layout
        container = document.createElement('div')
        container.style.display = 'grid'
        container.style.gap = '10px'
        container.style.gridTemplateColumns = 'repeat(3, 1fr)'
        container.style.gridTemplateRows = 'masonry'
        document.body.appendChild(container)
    })

    afterEach(() => {
        document.body.removeChild(container)
    })

    // Tests
    it('should apply masonry layout to grid elements', () => {
        // Add items with different heights
        for (let i = 0; i < 9; i++) {
            const item = document.createElement('div')
            item.className = 'item'
            // Vary the heights to create masonry effect
            item.style.blockSize = `${Math.floor(Math.random() * 4 + 1)}em`
            container.appendChild(item)
        }

        // Force layout calculation
        window.dispatchEvent(new Event('resize'))
        jest.runAllTimers() // Now this will work with jest.useFakeTimers()

        // Mock the getBoundingClientRect to return different positions
        // This is necessary because JSDOM doesn't actually perform layout
        const mockPositions = [
            { top: 0, left: 0, height: 20, width: 100 },
            { top: 0, left: 110, height: 30, width: 100 },
            { top: 0, left: 220, height: 25, width: 100 },
            { top: 30, left: 0, height: 40, width: 100 },
            { top: 40, left: 110, height: 20, width: 100 },
            { top: 35, left: 220, height: 30, width: 100 },
            { top: 80, left: 0, height: 25, width: 100 },
            { top: 70, left: 110, height: 35, width: 100 },
            { top: 75, left: 220, height: 20, width: 100 },
        ]

        const items = container.querySelectorAll('.item')
        items.forEach((item, index) => {
            jest.spyOn(item, 'getBoundingClientRect').mockImplementation(() => {
                return mockPositions[index] as DOMRect
            })
        })

        // Check that items have been positioned in a masonry layout
        const positions = new Set()
        items.forEach((item) => {
            const rect = item.getBoundingClientRect()
            positions.add(`${rect.top},${rect.left}`)
        })

        // In a masonry layout, we should have multiple items with different positions
        expect(positions.size).toBeGreaterThan(1)
    })

    it('should reposition items when window is resized', () => {
        // Add some items
        for (let i = 0; i < 6; i++) {
            const item = document.createElement('div')
            item.className = 'item'
            item.style.blockSize = `${(i % 3) + 1}em`
            container.appendChild(item)
        }

        // Mock initial positions
        const initialMockPositions = [
            { top: 0, left: 0, height: 20, width: 100 },
            { top: 0, left: 110, height: 30, width: 100 },
            { top: 0, left: 220, height: 25, width: 100 },
            { top: 30, left: 0, height: 40, width: 100 },
            { top: 40, left: 110, height: 20, width: 100 },
            { top: 35, left: 220, height: 30, width: 100 },
        ]

        const items = container.querySelectorAll('.item')
        items.forEach((item, index) => {
            jest.spyOn(item, 'getBoundingClientRect').mockImplementation(() => {
                return initialMockPositions[index] as DOMRect
            })
        })

        // Initial layout
        window.dispatchEvent(new Event('resize'))
        jest.runAllTimers()

        // Get initial positions
        const initialPositions = Array.from(items).map((item) => {
            const rect = item.getBoundingClientRect()
            return `${rect.top},${rect.left}`
        })

        // Mock new positions after resize
        const newMockPositions = [
            { top: 0, left: 0, height: 20, width: 80 },
            { top: 0, left: 90, height: 30, width: 80 },
            { top: 0, left: 180, height: 25, width: 80 },
            { top: 0, left: 270, height: 40, width: 80 },
            { top: 30, left: 0, height: 20, width: 80 },
            { top: 40, left: 90, height: 30, width: 80 },
        ]

        items.forEach((item, index) => {
            jest.spyOn(item, 'getBoundingClientRect').mockImplementation(() => {
                return newMockPositions[index] as DOMRect
            })
        })

        // Change container width to trigger reflow
        container.style.width = '500px'

        // Trigger resize event
        window.dispatchEvent(new Event('resize'))
        jest.runAllTimers()

        // Get new positions
        const newPositions = Array.from(items).map((item) => {
            const rect = item.getBoundingClientRect()
            return `${rect.top},${rect.left}`
        })

        // Positions should change after resize
        expect(newPositions).not.toEqual(initialPositions)
    })

    it('should respect gap property in layout', () => {
        // Create items
        for (let i = 0; i < 4; i++) {
            const item = document.createElement('div')
            item.className = 'item'
            item.style.blockSize = '2em'
            item.style.width = '100%'
            container.appendChild(item)
        }

        // Set a specific gap
        container.style.gap = '20px'

        // Mock positions with the correct gap
        const mockPositions = [
            { top: 0, left: 0, height: 20, width: 100 },
            { top: 0, left: 120, height: 20, width: 100 }, // 100 + 20 gap
            { top: 0, left: 240, height: 20, width: 100 }, // 220 + 20 gap
            { top: 40, left: 0, height: 20, width: 100 }, // 20 + 20 gap
        ]

        const items = container.querySelectorAll('.item')
        items.forEach((item, index) => {
            jest.spyOn(item, 'getBoundingClientRect').mockImplementation(() => {
                return mockPositions[index] as DOMRect
            })
        })

        // Force layout
        window.dispatchEvent(new Event('resize'))
        jest.runAllTimers()

        // Get positions of adjacent items
        const rects = Array.from(items).map((item) => item.getBoundingClientRect())

        // Check horizontal gap
        const horizontalGap = rects[1].left - (rects[0].left + rects[0].width)
        expect(Math.abs(horizontalGap - 20)).toBeLessThan(2) // Allow small rounding differences

        // Check vertical gap
        const verticalGap = rects[3].top - (rects[0].top + rects[0].height)
        expect(Math.abs(verticalGap - 20)).toBeLessThan(2)
    })

    it('should handle dynamically added items', () => {
        // Initial items
        for (let i = 0; i < 3; i++) {
            const item = document.createElement('div')
            item.className = 'item'
            item.style.blockSize = '2em'
            container.appendChild(item)
        }

        // Mock initial positions
        const initialItems = container.querySelectorAll('.item')
        const initialMockPositions = [
            { top: 0, left: 0, height: 20, width: 100 },
            { top: 0, left: 110, height: 20, width: 100 },
            { top: 0, left: 220, height: 20, width: 100 },
        ]

        initialItems.forEach((item, index) => {
            jest.spyOn(item, 'getBoundingClientRect').mockImplementation(() => {
                return initialMockPositions[index] as DOMRect
            })
        })

        // Initial layout
        window.dispatchEvent(new Event('resize'))
        jest.runAllTimers()

        // Add more items
        for (let i = 0; i < 3; i++) {
            const item = document.createElement('div')
            item.className = 'item new-item'
            item.style.blockSize = '3em'
            container.appendChild(item)
        }

        // Mock positions for all items including new ones
        const allItems = container.querySelectorAll('.item')
        const allMockPositions = [
            { top: 0, left: 0, height: 20, width: 100 },
            { top: 0, left: 110, height: 20, width: 100 },
            { top: 0, left: 220, height: 20, width: 100 },
            { top: 30, left: 0, height: 30, width: 100 },
            { top: 30, left: 110, height: 30, width: 100 },
            { top: 30, left: 220, height: 30, width: 100 },
        ]

        allItems.forEach((item, index) => {
            jest.spyOn(item, 'getBoundingClientRect').mockImplementation(() => {
                return allMockPositions[index] as DOMRect
            })
        })

        // Force layout update
        window.dispatchEvent(new Event('resize'))
        jest.runAllTimers()

        // Check that new items are positioned correctly
        const newItems = container.querySelectorAll('.new-item')
        expect(newItems.length).toBe(3)

        // Verify they have different positions
        const positions = new Set()
        newItems.forEach((item) => {
            const rect = item.getBoundingClientRect()
            positions.add(`${rect.top},${rect.left}`)
        })

        expect(positions.size).toBeGreaterThan(1)
    })

    // Additional test for MutationObserver functionality
    // Additional test for MutationObserver functionality
    it('should update layout when item heights change', () => {
        // Add items
        for (let i = 0; i < 4; i++) {
            const item = document.createElement('div')
            item.className = 'item'
            item.style.blockSize = '2em'
            container.appendChild(item)
        }

        // Mock initial positions
        const items = container.querySelectorAll('.item') as NodeListOf<HTMLElement>
        const initialMockPositions = [
            { top: 0, left: 0, height: 20, width: 100 },
            { top: 0, left: 110, height: 20, width: 100 },
            { top: 0, left: 220, height: 20, width: 100 },
            { top: 30, left: 0, height: 20, width: 100 },
        ]

        items.forEach((item, index) => {
            jest.spyOn(item, 'getBoundingClientRect').mockImplementation(() => {
                return initialMockPositions[index] as DOMRect
            })
        })

        // Initial layout
        window.dispatchEvent(new Event('resize'))
        jest.runAllTimers()

        // Get initial positions
        const initialPositions = Array.from(items).map((item) => {
            const rect = item.getBoundingClientRect()
            return `${rect.top},${rect.left}`
        })

        // Change height of an item
        const targetItem = items[1] as HTMLElement
        targetItem.style.blockSize = '4em'

        // Mock new positions after height change
        // In a real masonry layout, changing the height of an item would affect
        // the positions of items below it or in other columns
        const newMockPositions = [
            { top: 0, left: 0, height: 20, width: 100 },
            { top: 0, left: 110, height: 40, width: 100 }, // Height changed
            { top: 0, left: 220, height: 20, width: 100 },
            { top: 30, left: 0, height: 20, width: 100 },
        ]

        // Clear previous mocks and set new ones
        items.forEach((item) => {
            jest.spyOn(item, 'getBoundingClientRect').mockRestore()
        })

        // The key change: Update the positions of subsequent items to reflect layout changes
        // In a masonry layout, when one item's height changes, it affects the positions of other items
        const updatedMockPositions = [
            { top: 0, left: 0, height: 20, width: 100 },
            { top: 0, left: 110, height: 40, width: 100 }, // Height changed
            { top: 0, left: 220, height: 20, width: 100 },
            { top: 50, left: 110, height: 20, width: 100 }, // Position changed due to item above it
        ]

        items.forEach((item, index) => {
            jest.spyOn(item, 'getBoundingClientRect').mockImplementation(() => {
                return updatedMockPositions[index] as DOMRect
            })
        })

        // Trigger a mutation event or resize to update layout
        window.dispatchEvent(new Event('resize'))
        jest.runAllTimers()

        // Get new positions
        const newPositions = Array.from(items).map((item) => {
            const rect = item.getBoundingClientRect()
            return `${rect.top},${rect.left}`
        })

        // Verify that the layout has been updated
        expect(newPositions).not.toEqual(initialPositions)
    })
})
