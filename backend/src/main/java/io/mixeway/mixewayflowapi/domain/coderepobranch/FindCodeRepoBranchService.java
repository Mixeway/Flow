package io.mixeway.mixewayflowapi.domain.coderepobranch;

import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FindCodeRepoBranchService {
    private final CodeRepoBranchRepository codeRepoBranchRepository;

    public Optional<CodeRepoBranch> findById(Long id){
        return codeRepoBranchRepository.findById(id);
    }
}
