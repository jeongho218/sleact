import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository, DataSource } from 'typeorm';
import bcrypt from 'bcrypt';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    private dataSource: DataSource,
  ) {}
  getUsers() {}

  // 이메일 중복 검사
  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email: email },
      select: ['id', 'email', 'password'],
    });
  }

  // 회원가입 API
  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // DB 연결
    await queryRunner.startTransaction(); // 트랜잭션 시작

    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const returned = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });

      // throw new Error('롤백 테스트');

      const workspaceMember = queryRunner.manager
        .getRepository(WorkspaceMembers)
        .create();
      workspaceMember.UserId = returned.id;
      workspaceMember.WorkspaceId = 1; // seeding으로 만든 기본 워크스페이스
      await queryRunner.manager
        .getRepository(WorkspaceMembers)
        .save(workspaceMember);

      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: returned.id,
        ChannelId: 1, // seeding으로 만든 기본 워스페이스의 기본 채널
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // 트랜잭션 내 3개의 쿼리 중 에러가 발생한다면
      console.error(error);
      await queryRunner.rollbackTransaction(); // 트랜잭션 실행 전으로 롤백
      throw error;
    } finally {
      // 트랜잭션이 성공하였건, 실패하였건
      await queryRunner.release(); // DB 연결 해제
    }
  }
}
