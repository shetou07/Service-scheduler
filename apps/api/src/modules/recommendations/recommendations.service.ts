import { Injectable } from '@nestjs/common';
import { RecommendationStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

type CreateRecommendationInput = {
  fullName: string;
  email?: string;
  phone: string;
  gymLocation: string;
  serviceNeed: string;
  goal: string;
  privacyAccepted: boolean;
};

@Injectable()
export class RecommendationsService {
  constructor(private readonly db: PrismaService) {}

  async create(input: CreateRecommendationInput) {
    const request = await this.db.recommendationRequest.create({
      data: {
        fullName: input.fullName.trim(),
        email: input.email?.trim().toLowerCase() || null,
        phone: input.phone.trim(),
        gymLocation: input.gymLocation.trim(),
        serviceNeed: input.serviceNeed.trim(),
        goal: input.goal.trim(),
        privacyAcceptedAt: new Date(),
      },
    });
    void import('../../workers/notification.worker')
      .then(({ deliverRecommendationWhatsApp }) => deliverRecommendationWhatsApp(request.id))
      .catch((error: unknown) => {
        console.error(`Could not start recommendation WhatsApp alert ${request.id}`, error);
      });
    return { id: request.id, status: request.status };
  }

  async list() {
    return this.db.recommendationRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateStatus(id: string, status: RecommendationStatus) {
    return this.db.recommendationRequest.update({ where: { id }, data: { status } });
  }
}
