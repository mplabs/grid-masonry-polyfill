# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-05-11

### Added
- Support for `grid-template-columns: masonry` CSS property
- Column-based masonry layout implementation (vertical masonry)
- Demo page showing both row and column masonry examples

### Technical Details
- Enhanced grid item positioning calculations
- Support for both horizontal and vertical masonry directions
- Improved handling of grid gaps for different masonry orientations

## [1.0.2] - 2025-04-12

### Fixed
- Fixed image loading event handling to properly recalculate layout
- Improved handling of resize events for better performance
- Addressed edge case with empty grid containers

### Changed
- Enhanced error handling and logging
- Updated documentation with usage examples

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
