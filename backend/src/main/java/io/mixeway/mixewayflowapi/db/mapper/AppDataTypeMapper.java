package io.mixeway.mixewayflowapi.db.mapper;

import io.mixeway.mixewayflowapi.api.dtos.AppDataTypeDto;
import io.mixeway.mixewayflowapi.db.entity.AppDataType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AppDataTypeMapper {

    AppDataTypeDto toDto(AppDataType appDataType);
}
