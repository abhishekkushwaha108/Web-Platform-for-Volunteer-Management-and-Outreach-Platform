package com.ak.usermanagement.service;

import com.ak.usermanagement.model.User;
import com.ak.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }


    @Override
    public User updateUser(Long id, User user) {
        User existing = getUserById(id);

        existing.setFirstName(user.getFirstName());
        existing.setLastName(user.getLastName());
        existing.setEmail(user.getEmail());
        existing.setPassword(user.getPassword());
        existing.setRole(user.getRole());
        existing.setActive(user.isActive());

        return userRepository.save(existing);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

