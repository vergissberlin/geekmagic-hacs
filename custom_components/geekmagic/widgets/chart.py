"""Chart widget for GeekMagic displays."""

from __future__ import annotations

import contextlib
from typing import TYPE_CHECKING

from ..const import COLOR_CYAN, COLOR_GRAY
from .base import Widget, WidgetConfig

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant
    from PIL import ImageDraw

    from ..renderer import Renderer


class ChartWidget(Widget):
    """Widget that displays a sparkline chart from entity history."""

    def __init__(self, config: WidgetConfig) -> None:
        """Initialize the chart widget."""
        super().__init__(config)
        self.hours = config.options.get("hours", 24)
        self.show_value = config.options.get("show_value", True)
        self.show_range = config.options.get("show_range", True)

        # History data cache (populated externally)
        self._history_data: list[float] = []

    def set_history(self, data: list[float]) -> None:
        """Set the history data for the chart.

        Args:
            data: List of numeric values
        """
        self._history_data = data

    def render(
        self,
        renderer: Renderer,
        draw: ImageDraw.ImageDraw,
        rect: tuple[int, int, int, int],
        hass: HomeAssistant | None = None,
    ) -> None:
        """Render the chart widget.

        Args:
            renderer: Renderer instance
            draw: ImageDraw instance
            rect: (x1, y1, x2, y2) bounding box
            hass: Home Assistant instance
        """
        x1, y1, x2, y2 = rect
        width = x2 - x1
        height = y2 - y1

        # Get scaled fonts
        font_label = renderer.get_scaled_font("small", height)
        font_value = renderer.get_scaled_font("regular", height)

        # Calculate relative padding
        padding = int(width * 0.08)

        # Get current value from entity
        state = self.get_entity_state(hass)
        current_value = None
        unit = ""
        name = self.config.label or "Chart"

        if state is not None:
            with contextlib.suppress(ValueError, TypeError):
                current_value = float(state.state)
            unit = state.attributes.get("unit_of_measurement", "")
            name = self.config.label or state.attributes.get("friendly_name", "Chart")

        # Calculate chart area relative to container
        header_height = int(height * 0.15) if self.config.label else int(height * 0.08)
        footer_height = int(height * 0.12) if self.show_range else int(height * 0.04)
        chart_top = y1 + header_height
        chart_bottom = y2 - footer_height
        chart_rect = (x1 + padding, chart_top, x2 - padding, chart_bottom)

        # Draw label
        if self.config.label:
            center_x = x1 + width // 2
            renderer.draw_text(
                draw,
                name.upper(),
                (center_x, y1 + int(height * 0.08)),
                font=font_label,
                color=COLOR_GRAY,
                anchor="mm",
            )

        # Draw current value
        if self.show_value and current_value is not None:
            value_str = f"{current_value:.1f}{unit}"
            renderer.draw_text(
                draw,
                value_str,
                (x2 - padding, y1 + int(height * 0.08)),
                font=font_value,
                color=self.config.color or COLOR_CYAN,
                anchor="rm",
            )

        # Draw sparkline
        if self._history_data and len(self._history_data) >= 2:
            color = self.config.color or COLOR_CYAN
            renderer.draw_sparkline(draw, chart_rect, self._history_data, color=color, fill=True)

            # Draw min/max range
            if self.show_range:
                min_val = min(self._history_data)
                max_val = max(self._history_data)
                range_y = chart_bottom + int(height * 0.08)

                renderer.draw_text(
                    draw,
                    f"{min_val:.1f}",
                    (x1 + padding, range_y),
                    font=font_label,
                    color=COLOR_GRAY,
                    anchor="lm",
                )
                renderer.draw_text(
                    draw,
                    f"{max_val:.1f}",
                    (x2 - padding, range_y),
                    font=font_label,
                    color=COLOR_GRAY,
                    anchor="rm",
                )
        else:
            # No data - show placeholder
            center_x = x1 + width // 2
            center_y = (chart_top + chart_bottom) // 2
            renderer.draw_text(
                draw,
                "No data",
                (center_x, center_y),
                font=font_label,
                color=COLOR_GRAY,
                anchor="mm",
            )
