import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Workspaces } from '../../entities/Workspaces';
import { Channels } from '../../entities/Channels';

export default class UserSeed implements Seeder {
  public async run(
    dataSource: DataSource,
    // import는 from 'typeorm'으로 되어 있지만
    // 실제 데이터는 dataSource.ts에 존재함
    factoryManager: SeederFactoryManager,
    // '@faker-js/faker' 라이브러리를 이용해서 가짜 데이터를 만들때 사용
  ): Promise<any> {
    const workspacesRepository = dataSource.getRepository(Workspaces);
    await workspacesRepository.insert([
      { id: 1, name: 'TypeORM seeder', url: 'Welcome' },
    ]);
    const channelsRepository = dataSource.getRepository(Channels);
    await channelsRepository.insert([
      {
        id: 1,
        name: '일반',
        WorkspaceId: 1,
        private: false,
      },
    ]);
  }
}

/** 기본 워크스페이스와 채널을 만드는(seeding) 파일
 * 회원가입을 완료했을때 워크스페이스 화면으로 넘어갈건데,
 * 처음에는 기본 워크스페이스와 그 안의 채널이 없기 때문에
 * 워크스페이스로 넘어가는 순간 에러가 발생함
 * 이를 방지하기 위해 초창기 데이터를 생성하는 역할
 */
