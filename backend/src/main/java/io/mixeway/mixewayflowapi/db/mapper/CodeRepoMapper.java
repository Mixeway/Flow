package io.mixeway.mixewayflowapi.db.mapper;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CodeRepoDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.net.MalformedURLException;

@Mapper(componentModel = "spring")
public interface CodeRepoMapper {

    @Mapping(target = "gitHostUrl", expression = "java(getGitHostUrl(codeRepo))")
    CodeRepoDto toDto(CodeRepo codeRepo);

    default String getGitHostUrl(CodeRepo codeRepo) {
        try {
            return codeRepo.getGitHostUrl();
        } catch (MalformedURLException _) {
            return null;
        }
    }
}
