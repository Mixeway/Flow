package io.mixeway.mixewayflowapi.domain.user;

import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class FindUserService {
    private final UserRepository userRepository;

    public UserInfo findUser(String username){
        return userRepository.findByUsername(username);
    }
    public List<UserInfo> findAll(){ return userRepository.findAll();}
    public Optional<UserInfo> findById(Long id) { return userRepository.findById(id);}
    public Optional<UserInfo> findByApiKey(String apiKey) { return userRepository.findByApiKey(apiKey);}
}
