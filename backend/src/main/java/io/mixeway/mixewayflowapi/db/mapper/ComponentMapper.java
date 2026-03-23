package io.mixeway.mixewayflowapi.db.mapper;

import io.mixeway.mixewayflowapi.api.components.dto.ComponentDto;
import io.mixeway.mixewayflowapi.db.entity.Component;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ComponentMapper {

    ComponentDto toDto(Component component);
}