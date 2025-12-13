"""Gauge widget for GeekMagic displays."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..const import COLOR_CYAN, COLOR_DARK_GRAY
from .base import Widget, WidgetConfig
from .component_helpers import ArcGauge, BarGauge, RingGauge
from .components import Component
from .helpers import (
    calculate_percent,
    extract_numeric,
    format_value_with_unit,
    get_unit,
    resolve_label,
)

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from ..render_context import RenderContext


class GaugeWidget(Widget):
    """Widget that displays a value as a gauge (bar or ring)."""

    def __init__(self, config: WidgetConfig) -> None:
        """Initialize the gauge widget."""
        super().__init__(config)
        self.style = config.options.get("style", "bar")  # bar, ring, arc
        self.min_value = config.options.get("min", 0)
        self.max_value = config.options.get("max", 100)
        self.icon = config.options.get("icon")
        self.show_value = config.options.get("show_value", True)
        self.unit = config.options.get("unit", "")
        # Attribute to read value from (e.g., "temperature" for climate entities)
        self.attribute = config.options.get("attribute")

    def render(
        self,
        ctx: RenderContext,
        hass: HomeAssistant | None = None,
    ) -> Component:
        """Render the gauge widget.

        Args:
            ctx: RenderContext for drawing
            hass: Home Assistant instance

        Returns:
            Component tree for rendering
        """
        # Get entity state
        state = self.get_entity_state(hass)

        # Extract numeric value and display string
        value = extract_numeric(state, self.attribute)
        display_value = f"{value:.0f}" if state is not None else "--"

        # Get unit from state if not configured
        if not self.unit and state is not None:
            self.unit = get_unit(state)

        # Calculate percentage using helper
        percent = calculate_percent(value, self.min_value, self.max_value)

        # Get label using helper
        name = resolve_label(self.config, state)

        color = self.config.color or COLOR_CYAN

        # Format value with unit
        value_text = format_value_with_unit(display_value, self.unit) if self.show_value else ""

        if self.style == "ring":
            return RingGauge(
                percent=percent,
                value=value_text,
                label=name,
                color=color,
                background=COLOR_DARK_GRAY,
            )
        if self.style == "arc":
            return ArcGauge(
                percent=percent,
                value=value_text,
                label=name,
                color=color,
                background=COLOR_DARK_GRAY,
            )
        return BarGauge(
            percent=percent,
            value=value_text,
            label=name,
            color=color,
            icon=self.icon,
            background=COLOR_DARK_GRAY,
        )
