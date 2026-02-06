"""Tests for font scaling to ensure fonts are appropriately sized."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from custom_components.geekmagic.renderer import Renderer, SUPERSAMPLE_SCALE

# Expected font size ranges (at 480px scaled height)
# Allow tolerance for font metrics variations
EXPECTED_PRIMARY_RANGE = (150, 190)    # ~168px (35% of 480px)
EXPECTED_SECONDARY_RANGE = (80, 110)   # ~96px (20% of 480px)
EXPECTED_TERTIARY_RANGE = (50, 70)     # ~57px (12% of 480px)
EXPECTED_REGULAR_RANGE = (60, 90)      # ~72px (between tertiary and secondary)
EXPECTED_MEDIUM_RANGE = (80, 110)      # ~96px (matches secondary)
EXPECTED_GRID_RANGE = (40, 60)         # ~48px (scaled down for grid layout)


class TestFontScaling:
    """Tests for get_scaled_font method."""

    def test_semantic_font_sizes_at_full_screen(self):
        """Test that semantic fonts scale appropriately for full screen."""
        renderer = Renderer()
        full_height = renderer.height * SUPERSAMPLE_SCALE  # 480px

        # Get semantic fonts
        primary = renderer.get_scaled_font("primary", full_height)
        secondary = renderer.get_scaled_font("secondary", full_height)
        tertiary = renderer.get_scaled_font("tertiary", full_height)

        # Check that fonts are appropriately sized for readability
        # Primary should be ~35% of container (168px)
        # Secondary should be ~20% of container (96px)
        # Tertiary should be ~12% of container (57px)
        assert primary.size > secondary.size
        assert secondary.size > tertiary.size

        # Check approximate sizes (allow some tolerance for font metrics)
        assert EXPECTED_PRIMARY_RANGE[0] < primary.size < EXPECTED_PRIMARY_RANGE[1], (
            f"Primary font size {primary.size} out of expected range {EXPECTED_PRIMARY_RANGE}"
        )
        assert EXPECTED_SECONDARY_RANGE[0] < secondary.size < EXPECTED_SECONDARY_RANGE[1], (
            f"Secondary font size {secondary.size} out of expected range {EXPECTED_SECONDARY_RANGE}"
        )
        assert EXPECTED_TERTIARY_RANGE[0] < tertiary.size < EXPECTED_TERTIARY_RANGE[1], (
            f"Tertiary font size {tertiary.size} out of expected range {EXPECTED_TERTIARY_RANGE}"
        )

    def test_legacy_font_sizes_at_full_screen(self):
        """Test that legacy fonts scale appropriately for full screen."""
        renderer = Renderer()
        full_height = renderer.height * SUPERSAMPLE_SCALE  # 480px

        # Get legacy fonts
        tiny = renderer.get_scaled_font("tiny", full_height)
        small = renderer.get_scaled_font("small", full_height)
        regular = renderer.get_scaled_font("regular", full_height)
        medium = renderer.get_scaled_font("medium", full_height)
        large = renderer.get_scaled_font("large", full_height)

        # Check ordering
        assert tiny.size < small.size
        assert small.size < regular.size
        assert regular.size < medium.size
        assert medium.size < large.size

        # Legacy fonts should be comparable in size to semantic fonts
        # medium should be similar to secondary (~96px)
        # regular should be between tertiary and secondary (~72px)
        assert EXPECTED_REGULAR_RANGE[0] < regular.size < EXPECTED_REGULAR_RANGE[1], (
            f"Regular font size {regular.size} too small for readability"
        )
        assert EXPECTED_MEDIUM_RANGE[0] < medium.size < EXPECTED_MEDIUM_RANGE[1], (
            f"Medium font size {medium.size} too small for readability"
        )

    def test_font_scaling_for_grid_layouts(self):
        """Test that fonts scale down appropriately for smaller containers."""
        renderer = Renderer()

        # 2x2 grid: each cell is 120x120 unscaled, 240x240 scaled
        grid_height = 120 * SUPERSAMPLE_SCALE  # 240px

        secondary = renderer.get_scaled_font("secondary", grid_height)
        medium = renderer.get_scaled_font("medium", grid_height)

        # Fonts should scale down proportionally
        # Secondary at half height should be ~48px (not stuck at min_size)
        assert EXPECTED_GRID_RANGE[0] < secondary.size < EXPECTED_GRID_RANGE[1], (
            f"Grid font size {secondary.size} not scaling properly"
        )
        assert EXPECTED_GRID_RANGE[0] < medium.size < EXPECTED_GRID_RANGE[1], (
            f"Grid font size {medium.size} not scaling properly"
        )

    def test_font_sizes_are_readable(self):
        """Test that smallest fonts are still readable (minimum 20px at supersample)."""
        renderer = Renderer()

        # Very small container (3x3 grid cell: 80x80 unscaled, 160x160 scaled)
        tiny_height = 80 * SUPERSAMPLE_SCALE  # 160px

        # Even in tiny containers, fonts should not be smaller than ~20px
        # Test both legacy and semantic fonts
        small_font = renderer.get_scaled_font("small", tiny_height)
        tiny_font = renderer.get_scaled_font("tiny", tiny_height)
        tertiary_font = renderer.get_scaled_font("tertiary", tiny_height)

        assert small_font.size >= 20, f"'small' font too small for readability: {small_font.size}px"
        assert tiny_font.size >= 20, f"'tiny' font too small for readability: {tiny_font.size}px"
        assert tertiary_font.size >= 20, f"'tertiary' font too small: {tertiary_font.size}px"

    def test_legacy_and_semantic_comparable_sizes(self):
        """Test that legacy medium is comparable to semantic secondary."""
        renderer = Renderer()
        full_height = renderer.height * SUPERSAMPLE_SCALE

        medium = renderer.get_scaled_font("medium", full_height)
        secondary = renderer.get_scaled_font("secondary", full_height)

        # These should be similar sizes (within 20%)
        ratio = medium.size / secondary.size
        assert 0.8 < ratio < 1.2, (
            f"Legacy 'medium' ({medium.size}px) and semantic 'secondary' "
            f"({secondary.size}px) sizes too different"
        )
