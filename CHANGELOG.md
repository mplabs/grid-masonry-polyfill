# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-04-11

### Added
- Initial release of the grid-masonry-polyfill
- Support for `masonry` value in `grid-template-rows` CSS property
- Automatic detection and application of masonry layout to grid containers
- Responsive layout that updates on window resize
- TypeScript declarations for better developer experience

### Technical Details
- Written in TypeScript
- Debounced resize event handling for better performance
- Compatible with modern browsers that support CSS Grid
- Zero dependencies
- Available in both CommonJS and ES Module formats

## Notes
- This polyfill implements the masonry layout with columns as the grid axis and rows as the masonry axis
- The current implementation places items into spaces left above by previous items, which differs slightly from the native implementation in supporting browsers
