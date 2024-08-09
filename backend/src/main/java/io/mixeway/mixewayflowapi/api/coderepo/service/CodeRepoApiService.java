package io.mixeway.mixewayflowapi.api.coderepo;

import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CodeRepoApiService {
    private final FindCodeRepoService findCodeRepoService;

    public List<GetCodeReposResponseDto> getRepos(Principal principal) {
        return findCodeRepoService.findCodeRepoForUser(principal).stream()
                .map(GetCodeReposResponseDto::new)
                .collect(Collectors.toList());
    }

    public CodeRepo getRepo(Long id, Principal principal) {
        return findCodeRepoService.findById(id, principal);
    }
}
