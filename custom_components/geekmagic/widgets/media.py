"""Media player widget for GeekMagic displays."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..const import COLOR_CYAN, COLOR_GRAY, COLOR_WHITE
from .base import Widget, WidgetConfig

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant
    from PIL import ImageDraw

    from ..renderer import Renderer


class MediaWidget(Widget):
    """Widget that displays media player information."""

    def __init__(self, config: WidgetConfig) -> None:
        """Initialize the media widget."""
        super().__init__(config)
        self.show_artist = config.options.get("show_artist", True)
        self.show_album = config.options.get("show_album", False)
        self.show_progress = config.options.get("show_progress", True)

    def render(
        self,
        renderer: Renderer,
        draw: ImageDraw.ImageDraw,
        rect: tuple[int, int, int, int],
        hass: HomeAssistant | None = None,
    ) -> None:
        """Render the media player widget.

        Args:
            renderer: Renderer instance
            draw: ImageDraw instance
            rect: (x1, y1, x2, y2) bounding box
            hass: Home Assistant instance
        """
        x1, y1, x2, y2 = rect
        width = x2 - x1
        height = y2 - y1
        center_x = x1 + width // 2

        # Get scaled fonts based on container height
        font_label = renderer.get_scaled_font("small", height)
        font_title = renderer.get_scaled_font("regular", height)
        font_small = renderer.get_scaled_font("small", height)

        # Calculate relative padding
        padding = int(width * 0.05)

        # Get entity state
        state = self.get_entity_state(hass)

        if state is None or state.state in ("off", "unavailable", "unknown", "idle"):
            # Not playing - show paused state
            self._render_idle(renderer, draw, rect)
            return

        # Get media info
        attrs = state.attributes
        title = attrs.get("media_title", "Unknown")
        artist = attrs.get("media_artist", "")
        album = attrs.get("media_album_name", "")
        position = attrs.get("media_position", 0)
        duration = attrs.get("media_duration", 0)

        # Truncate text if needed
        max_chars = (width - padding * 2) // 8
        if len(title) > max_chars:
            title = title[: max_chars - 2] + ".."
        if len(artist) > max_chars:
            artist = artist[: max_chars - 2] + ".."

        # Calculate positions relative to container
        current_y = y1 + int(height * 0.12)

        # Draw "NOW PLAYING" label
        renderer.draw_text(
            draw,
            "NOW PLAYING",
            (center_x, current_y),
            font=font_label,
            color=COLOR_GRAY,
            anchor="mm",
        )
        current_y += int(height * 0.20)

        # Draw title
        renderer.draw_text(
            draw,
            title,
            (center_x, current_y),
            font=font_title,
            color=COLOR_WHITE,
            anchor="mm",
        )
        current_y += int(height * 0.17)

        # Draw artist
        if self.show_artist and artist:
            renderer.draw_text(
                draw,
                artist,
                (center_x, current_y),
                font=font_small,
                color=COLOR_GRAY,
                anchor="mm",
            )
            current_y += int(height * 0.15)

        # Draw album
        if self.show_album and album:
            if len(album) > max_chars:
                album = album[: max_chars - 2] + ".."
            renderer.draw_text(
                draw,
                album,
                (center_x, current_y),
                font=font_small,
                color=COLOR_GRAY,
                anchor="mm",
            )

        # Draw progress bar
        if self.show_progress and duration > 0:
            bar_height = max(4, int(height * 0.05))
            bar_y = y2 - int(height * 0.21)
            bar_rect = (x1 + padding, bar_y, x2 - padding, bar_y + bar_height)
            progress = min(100, (position / duration) * 100)
            renderer.draw_bar(
                draw,
                bar_rect,
                progress,
                color=self.config.color or COLOR_CYAN,
            )

            # Draw time
            pos_str = self._format_time(position)
            dur_str = self._format_time(duration)
            time_y = bar_y + int(height * 0.12)

            renderer.draw_text(
                draw,
                pos_str,
                (x1 + padding, time_y),
                font=font_small,
                color=COLOR_GRAY,
                anchor="lm",
            )
            renderer.draw_text(
                draw,
                dur_str,
                (x2 - padding, time_y),
                font=font_small,
                color=COLOR_GRAY,
                anchor="rm",
            )

    def _render_idle(
        self,
        renderer: Renderer,
        draw: ImageDraw.ImageDraw,
        rect: tuple[int, int, int, int],
    ) -> None:
        """Render idle/paused state."""
        x1, y1, x2, y2 = rect
        width = x2 - x1
        height = y2 - y1
        center_x = x1 + width // 2
        center_y = y1 + height // 2

        # Get scaled font
        font_label = renderer.get_scaled_font("small", height)

        # Draw pause icon (two vertical bars) - scaled to container
        bar_width = max(4, int(width * 0.04))
        bar_height = max(15, int(height * 0.25))
        gap = max(5, int(width * 0.05))

        left_bar = (
            center_x - gap - bar_width,
            center_y - bar_height // 2,
            center_x - gap,
            center_y + bar_height // 2,
        )
        right_bar = (
            center_x + gap,
            center_y - bar_height // 2,
            center_x + gap + bar_width,
            center_y + bar_height // 2,
        )

        renderer.draw_rect(draw, left_bar, fill=COLOR_GRAY)
        renderer.draw_rect(draw, right_bar, fill=COLOR_GRAY)

        # Draw label
        renderer.draw_text(
            draw,
            "PAUSED",
            (center_x, center_y + int(height * 0.29)),
            font=font_label,
            color=COLOR_GRAY,
            anchor="mm",
        )

    def _format_time(self, seconds: float) -> str:
        """Format seconds as MM:SS or HH:MM:SS."""
        seconds = int(seconds)
        if seconds >= 3600:
            hours = seconds // 3600
            minutes = (seconds % 3600) // 60
            secs = seconds % 60
            return f"{hours}:{minutes:02d}:{secs:02d}"
        minutes = seconds // 60
        secs = seconds % 60
        return f"{minutes}:{secs:02d}"
