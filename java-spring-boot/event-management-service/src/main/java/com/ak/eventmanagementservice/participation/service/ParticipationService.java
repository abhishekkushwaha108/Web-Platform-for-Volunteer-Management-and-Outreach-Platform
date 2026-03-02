package com.ak.eventmanagementservice.participation.service;

import com.ak.eventmanagementservice.participation.dto.*;

import java.util.List;

public interface ParticipationService {

    ParticipationResponse signup(SignupRequest request);

    ParticipationResponse cancel(String participationId);

    List<ParticipationResponse> history(String volunteerId);

    ParticipationResponse updateParticipation(String id, UpdateParticipationRequest request);
}