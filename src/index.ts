import { debounce } from './utils'

interface MasonryGrid {
    _el: HTMLElement
    gap: number
    items: HTMLElement[]
    ncol: number
}

const gridElements = Array.from(document.querySelectorAll<HTMLElement>('.grid-rows-[masonry]'))
let grids: MasonryGrid[] = []

// CSS Grid masonry layout polyfill for browsers that don't support it natively
if (gridElements.length > 0 && !CSS.supports('grid-template-rows', 'masonry')) {
    // Needs polyfill
    grids = gridElements.map(
        (grid): MasonryGrid => ({
            _el: grid,
            gap: parseFloat(getComputedStyle(grid).rowGap),
            items: Array.from(grid.childNodes).filter(
                (c): c is HTMLElement => c.nodeType === 1 && c instanceof HTMLElement,
            ),
            ncol: 0,
        }),
    )

    const layout = debounce(function layout(): void {
        grids.forEach((grid) => {
            // Get the post-resize/load number of columns
            const ncol = getComputedStyle(grid._el).gridTemplateColumns.split(' ').length

            if (grid.ncol !== ncol) {
                // Update number of columns
                grid.ncol = ncol

                // Revert to initial positioning, no margin
                grid.items.forEach((item) => item.style.removeProperty('margin-top'))

                // If we have more than one column, calculate the height of each row and set margin-top accordingly
                if (ncol > 1) {
                    grid.items.slice(ncol).forEach((item, i) => {
                        const prevItem = grid.items[i]
                        const prevFin = prevItem.offsetTop + prevItem.offsetHeight // bottom edge of item above
                        const currIni = item.offsetTop // top edge of current item

                        item.style.marginTop = `${prevFin + grid.gap - currIni}px`
                    })
                }
            }
        })
    }, 250)

    // Layout will shift as images load
    grids.forEach((grid) => {
        grid._el.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
            if (img.complete) {
                layout()
            } else {
                img.addEventListener('load', layout, { once: true })
            }
        })
    })

    // Layout once on load and on every resize
    addEventListener(
        'load',
        () => {
            layout()

            // Prevent attaching multiple listeners on repeated loads
            if (!(globalThis as any)._masonryResizeListener) {
                ;(globalThis as any)._masonryResizeListener = true
                addEventListener('resize', layout)
            }
        },
        false,
    )
}
