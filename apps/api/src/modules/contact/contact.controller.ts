import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ContactService } from './contact.service';

class ContactDto {
  @IsString() @MinLength(2) @MaxLength(100) fullName!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsString() @MinLength(10) @MaxLength(3000) message!: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}
  @Post() send(@Body() body: ContactDto) { return this.contact.send(body); }
}
