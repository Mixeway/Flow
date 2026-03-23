package io.mixeway.mixewayflowapi.db.mapper;

import io.mixeway.mixewayflowapi.api.dtos.ScanInfoDto;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ScanInfoMapper {

    ScanInfoDto toDto(ScanInfo scanInfo);
}
