import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    // return process.env.SECRET;
    // ↑ 'constructor...ConfigService' 없이 .env 내용을 불러오는 방법
    // ↓ 'constructor...ConfigService'를 사용하여 .env 내용을 불러오는 방법
    return this.configService.get('SECRET');
  }
}
