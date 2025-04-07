# CSS Grid Masonry layout

This is a lightweight polyfill for the `masonry` value for `grid-template-columns` and `grid-template-rows`.

## Installation

```sh
npm install grid-masonry-polyfill
```

```js
import 'grid-masonry-polyfill';
```

## Creating a masonry layout

To create a masonry layout, your columns will be the grid axis and the rows the masonry axis, defined with `grid-template-columns` and `grid-template-rows`. The child elements of this container will now lay out items along the rows as usual.

As the items move onto new rows, they will be moved into the space left above by the previous item, respecting any gap given for the layout.

This is in contrast to how this feature will work in supported browsers, where items will be placed into the column with the most room.

Both approaches will cause a tightly packed layout with strict row tracks.

```CSS
.grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    grid-template-rows: masonry;
}
```

```HTML
<div class="grid">
  <div class="item" style="block-size: 2em;"></div>
  <div class="item" style="block-size: 3em;"></div>
  <div class="item" style="block-size: 1.6em;"></div>
  <div class="item" style="block-size: 4em;"></div>
  <div class="item" style="block-size: 2.2em;"></div>
  <div class="item" style="block-size: 3em;"></div>
  <div class="item" style="block-size: 4.5em;"></div>
  <div class="item" style="block-size: 1em;"></div>
  <div class="item" style="block-size: 3.5em;"></div>
  <div class="item" style="block-size: 2.8em;"></div>
</div>
```

## Restrictions

Creating a masonry layout with items loading into rows is possible according to the specification, but as of now not implemented in this polyfill.

## References

- [Masonry layout - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Masonry_layout)
- [CSS Grid Layout Module Level 3](https://drafts.csswg.org/css-grid-3/#masonry-layout)