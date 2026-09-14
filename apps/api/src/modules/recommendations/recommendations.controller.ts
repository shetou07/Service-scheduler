import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RecommendationStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecommendationsService } from './recommendations.service';

class CreateRecommendationDto {
  @IsString() @MinLength(2) @MaxLength(100) fullName!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsString() @MinLength(7) @MaxLength(30) phone!: string;
  @IsString() @MinLength(2) @MaxLength(160) gymLocation!: string;
  @IsString() @MinLength(2) @MaxLength(300) serviceNeed!: string;
  @IsString() @MinLength(5) @MaxLength(1_000) goal!: string;
  @IsBoolean() @Equals(true) privacyAccepted!: boolean;
}

class UpdateRecommendationStatusDto {
  @IsEnum(RecommendationStatus) status!: RecommendationStatus;
}

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendations: RecommendationsService) {}

  @Post()
  create(@Body() body: CreateRecommendationDto) {
    return this.recommendations.create(body);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('admin/recommendations')
export class AdminRecommendationsController {
  constructor(private readonly recommendations: RecommendationsService) {}

  @Get()
  list() {
    return this.recommendations.list();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: UpdateRecommendationStatusDto) {
    return this.recommendations.updateStatus(id, body.status);
  }
}
