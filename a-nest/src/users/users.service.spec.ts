import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
import { DataSource } from 'typeorm';

class MockUserRepository {
  // 테스트에 쓰일 가짜 데이터
  #data = [{ id: 1, email: 'test@gmail.com' }];

  // 테스트에 쓰일 가짜 메소드
  findOne({ where: { email: email } }) {
    const data = this.#data.find((v) => v.email === email);
    if (data) {
      return data;
    }
    return null;
  }
}
class MockWorkspaceMembersRepository {}
class MockChannelMembersRepository {}
// 실제 DB를 사용하지 말고, Mock(가짜) 클래스를 만들어 DB에 접근하는 과정을 우회함

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
          // 모킹하는 것이 클래스라면 useClass, 함수라면 useFactory, 일반 값이라면 useValue
        },
        {
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMembersRepository,
        },
        {
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMembersRepository,
        },
        // {
        //   provide: getRepositoryToken(DataSource),
        //   useClass: class MockDataSource {},
        // },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail은 이메일을 통해 유저를 찾아야 한다.', () => {
    expect(service.findByEmail('test@email.com')).resolves.toStrictEqual({
      email: 'test@email.com',
      id: 1,
    });
  });
  // expect는 테스트에 쓰일(제스트가 입력할) 데이터
  // toBe는 expect가 입력되었을때 리턴으로 받아와야할 데이터

  it('findByEmail은 유저를 찾지 못했다면 null을 반환한다.', () => {
    expect(service.findByEmail('test00@gmail.com')).resolves.toBe(null);
  });
});
