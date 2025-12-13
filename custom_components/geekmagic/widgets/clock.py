"""Clock widget for GeekMagic displays."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import TYPE_CHECKING

from ..const import COLOR_GRAY, COLOR_WHITE
from .base import Widget, WidgetConfig

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant
    from PIL import ImageDraw

    from ..renderer import Renderer


class ClockWidget(Widget):
    """Widget that displays current time and date."""

    def __init__(self, config: WidgetConfig) -> None:
        """Initialize the clock widget."""
        super().__init__(config)
        self.show_date = config.options.get("show_date", True)
        self.show_seconds = config.options.get("show_seconds", False)
        self.time_format = config.options.get("time_format", "24h")

    def get_entities(self) -> list[str]:
        """Clock widget doesn't depend on entities."""
        return []

    def render(
        self,
        renderer: Renderer,
        draw: ImageDraw.ImageDraw,
        rect: tuple[int, int, int, int],
        hass: HomeAssistant | None = None,
    ) -> None:
        """Render the clock widget.

        Args:
            renderer: Renderer instance
            draw: ImageDraw instance
            rect: (x1, y1, x2, y2) bounding box
            hass: Home Assistant instance (used for timezone)
        """
        x1, y1, x2, y2 = rect
        width = x2 - x1
        height = y2 - y1
        center_x = x1 + width // 2
        center_y = y1 + height // 2

        # Get scaled fonts based on container height
        font_time = renderer.get_scaled_font("xlarge", height)
        font_date = renderer.get_scaled_font("regular", height)
        font_small = renderer.get_scaled_font("small", height)

        # Get timezone from Home Assistant if available, otherwise use UTC
        tz = None
        if hass is not None:
            tz = getattr(hass.config, "time_zone_obj", None) or UTC
        now = datetime.now(tz=tz or UTC)

        # Format time
        if self.show_seconds:
            if self.time_format == "12h":
                time_str = now.strftime("%I:%M:%S")
                ampm = now.strftime("%p")
            else:
                time_str = now.strftime("%H:%M:%S")
                ampm = None
        elif self.time_format == "12h":
            time_str = now.strftime("%I:%M")
            ampm = now.strftime("%p")
        else:
            time_str = now.strftime("%H:%M")
            ampm = None

        # Calculate positions relative to container
        offset_y = int(height * 0.08) if self.show_date else 0
        time_y = center_y - offset_y

        # Draw time
        color = self.config.color or COLOR_WHITE
        renderer.draw_text(
            draw,
            time_str,
            (center_x, time_y),
            font=font_time,
            color=color,
            anchor="mm",
        )

        # Draw AM/PM if 12-hour format
        if ampm:
            ampm_x = center_x + renderer.get_text_size(time_str, font_time)[0] // 2 + 5
            renderer.draw_text(
                draw,
                ampm,
                (ampm_x, time_y - int(height * 0.08)),
                font=font_small,
                color=COLOR_GRAY,
                anchor="lm",
            )

        # Draw date
        if self.show_date:
            date_str = now.strftime("%a, %b %d")
            date_y = center_y + int(height * 0.20)
            renderer.draw_text(
                draw,
                date_str,
                (center_x, date_y),
                font=font_date,
                color=COLOR_GRAY,
                anchor="mm",
            )

        # Draw label if provided
        if self.config.label:
            label_y = y1 + int(height * 0.12)
            renderer.draw_text(
                draw,
                self.config.label.upper(),
                (center_x, label_y),
                font=font_small,
                color=COLOR_GRAY,
                anchor="mm",
            )
