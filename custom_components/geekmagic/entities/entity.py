"""Base entity class for GeekMagic integration."""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

from homeassistant.const import CONF_HOST, CONF_NAME
from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import EntityDescription
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from ..const import DOMAIN

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

    from ..coordinator import GeekMagicCoordinator


@dataclass(frozen=True, kw_only=True)
class GeekMagicEntityDescription(EntityDescription):
    """Base description for GeekMagic entities."""

    # Additional fields can be added in subclasses


class GeekMagicEntity(CoordinatorEntity["GeekMagicCoordinator"]):
    """Base class for GeekMagic entities.

    Config entities do NOT auto-update on coordinator refresh to prevent
    frontend re-renders during periodic updates. State updates only happen
    when the user changes config values.
    """

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: GeekMagicCoordinator,
        description: EntityDescription,
    ) -> None:
        """Initialize the entity.

        Args:
            coordinator: GeekMagic coordinator
            description: Entity description
        """
        super().__init__(coordinator)
        self.entity_description = description
        # Config entry is always set when entities are created
        entry = self._get_config_entry()
        # Use host as unique ID base to match image entity
        host = entry.data[CONF_HOST]
        self._attr_unique_id = f"{host}_{description.key}"

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle coordinator update.

        Override to prevent automatic state updates on every coordinator refresh.
        Config entities only need to update when their values actually change,
        which happens through their own set methods (async_set_value, etc.),
        not through coordinator updates.
        """
        # Do NOT call async_write_ha_state() - prevents frontend re-renders

    @property
    def available(self) -> bool:
        """Return True - config entities are always available."""
        # Config entities should always be available for user interaction
        # even if the coordinator hasn't successfully updated yet
        return True

    def _get_config_entry(self) -> ConfigEntry:
        """Get the config entry, asserting it exists.

        Returns:
            The config entry

        Raises:
            AssertionError: If config_entry is None (should never happen)
        """
        entry = self.coordinator.config_entry
        assert entry is not None, "Config entry must be set"
        return entry

    @property
    def device_info(self) -> DeviceInfo:
        """Return device information."""
        entry = self._get_config_entry()
        # Use host as identifier to match image entity
        host = entry.data[CONF_HOST]
        return DeviceInfo(
            identifiers={(DOMAIN, host)},
            name=entry.data.get(CONF_NAME, "GeekMagic Display"),
            manufacturer="GeekMagic",
            model="SmallTV Pro",
            sw_version=self.coordinator.device_version,
            configuration_url=f"http://{host}",
        )

    async def _async_update_options(self, key: str, value: Any) -> None:
        """Update a single option in the config entry.

        Args:
            key: Option key to update
            value: New value
        """
        entry = self._get_config_entry()
        new_options = dict(entry.options)
        new_options[key] = value
        self.hass.config_entries.async_update_entry(
            entry,
            options=new_options,
        )
