import { debounce } from './utils'

interface MasonryGrid {
    _el: HTMLElement
    gap: number
    items: HTMLElement[]
    ncells: number // Number of columns for row-masonry, rows for column-masonry
    type: 'row' | 'column' // Indicates if it's row-masonry or column-masonry
}

// Find grid elements with either masonry rows or columns
const rowMasonryElements = Array.from(document.querySelectorAll<HTMLElement>('.grid-rows-\\[masonry\\]'))
const columnMasonryElements = Array.from(document.querySelectorAll<HTMLElement>('.grid-columns-\\[masonry\\]'))

let grids: MasonryGrid[] = []

// Add row masonry grids if needed
if (rowMasonryElements.length > 0 && !CSS.supports('grid-template-rows', 'masonry')) {
    const rowGrids = rowMasonryElements.map(
        (grid): MasonryGrid => ({
            _el: grid,
            gap: parseFloat(getComputedStyle(grid).rowGap),
            items: Array.from(grid.childNodes).filter(
                (c): c is HTMLElement => c.nodeType === 1 && c instanceof HTMLElement,
            ),
            ncells: 0,
            type: 'row'
        }),
    )
    grids = grids.concat(rowGrids)
}

// Add column masonry grids if needed
if (columnMasonryElements.length > 0 && !CSS.supports('grid-template-columns', 'masonry')) {
    const columnGrids = columnMasonryElements.map(
        (grid): MasonryGrid => ({
            _el: grid,
            gap: parseFloat(getComputedStyle(grid).columnGap),
            items: Array.from(grid.childNodes).filter(
                (c): c is HTMLElement => c.nodeType === 1 && c instanceof HTMLElement,
            ),
            ncells: 0,
            type: 'column'
        }),
    )
    grids = grids.concat(columnGrids)
}

if (grids.length > 0) {
    const layout = debounce(function layout(): void {
        grids.forEach((grid) => {
            const style = getComputedStyle(grid._el)
            
            if (grid.type === 'row') {
                // Row-masonry layout (original implementation)
                const ncol = style.gridTemplateColumns.split(' ').length
                
                if (grid.ncells !== ncol) {
                    grid.ncells = ncol
                    // Reset any previously set margins
                    grid.items.forEach(item => item.style.removeProperty('margin-top'))
                    
                    if (ncol > 1) {
                        // For items after the first row, adjust their top position
                        grid.items.slice(ncol).forEach((item, i) => {
                            const prevItem = grid.items[i]
                            const prevFin = prevItem.offsetTop + prevItem.offsetHeight // bottom edge of item above
                            const currIni = item.offsetTop // top edge of current item
                            
                            item.style.marginTop = `${prevFin + grid.gap - currIni}px`
                        })
                    }
                }
            } else {
                // Column-masonry layout
                const nrow = style.gridTemplateRows.split(' ').length
                // Calculate number of columns based on number of items and rows
                const ncol = Math.ceil(grid.items.length / nrow)
                
                if (grid.ncells !== nrow) {
                    grid.ncells = nrow
                    // Reset any previously set margins
                    grid.items.forEach(item => item.style.removeProperty('margin-left'))
                    
                    if (ncol > 1) {
                        // For each column except the first
                        for (let c = 1; c < ncol; c++) {
                            // For each row
                            for (let r = 0; r < nrow; r++) {
                                // Calculate item index in the grid
                                const index = r * ncol + c
                                if (index >= grid.items.length) continue // Skip if out of bounds
                                
                                const item = grid.items[index]
                                
                                // Find the item to the left (previous column, same row)
                                const prevColIndex = r * ncol + (c - 1)
                                if (prevColIndex < 0 || prevColIndex >= grid.items.length) continue
                                
                                const prevColItem = grid.items[prevColIndex]
                                
                                // Calculate the right edge of the previous item
                                const prevColFin = prevColItem.offsetLeft + prevColItem.offsetWidth
                                // Get the left edge of the current item
                                const currIni = item.offsetLeft
                                
                                // Adjust margin-left to create masonry effect
                                item.style.marginLeft = `${prevColFin + grid.gap - currIni}px`
                            }
                        }
                    }
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
