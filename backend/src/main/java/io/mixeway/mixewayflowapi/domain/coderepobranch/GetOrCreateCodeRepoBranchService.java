package io.mixeway.mixewayflowapi.domain.coderepobranch;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class GetOrCreateCodeRepoBranchService {
    private final CodeRepoBranchRepository codeRepoBranchRepository;

    public CodeRepoBranch getOrCreateCodeRepoBranch(String name, CodeRepo codeRepo){
        return codeRepoBranchRepository.findByNameAndCodeRepo(name, codeRepo)
                .orElseGet(() -> createBranch(name, codeRepo));
    }

    private CodeRepoBranch createBranch(String name, CodeRepo codeRepo) {
        return codeRepoBranchRepository.save(new CodeRepoBranch(name, codeRepo));
    }
}
