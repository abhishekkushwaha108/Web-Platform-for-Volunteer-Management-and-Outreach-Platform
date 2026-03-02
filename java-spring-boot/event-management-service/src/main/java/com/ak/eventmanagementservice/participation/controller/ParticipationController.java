package com.ak.eventmanagementservice.participation.controller;

import com.ak.eventmanagementservice.participation.dto.*;
import com.ak.eventmanagementservice.participation.service.ParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;

    @PostMapping("/signup")
    public ParticipationResponse signup(@RequestBody SignupRequest request) {
        return participationService.signup(request);
    }

    @PostMapping("/{id}/cancel")
    public ParticipationResponse cancel(@PathVariable String id) {
        return participationService.cancel(id);
    }

    @GetMapping("/history/{volunteerId}")
    public List<ParticipationResponse> history(@PathVariable String volunteerId) {
        return participationService.history(volunteerId);
    }

    @PatchMapping("/{id}")
    public ParticipationResponse updateParticipation(@PathVariable String id,
                                                     @RequestBody UpdateParticipationRequest request) {
        return participationService.updateParticipation(id, request);
    }
}