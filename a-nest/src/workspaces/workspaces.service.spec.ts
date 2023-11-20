import { Test, TestingModule } from '@nestjs/testing';
import { WorkspacesService } from './workspaces.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { ChannelMembers } from '../entities/ChannelMembers';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { Channels } from '../entities/Channels';
import { Workspaces } from '../entities/Workspaces';

class MockWorkspacesRepository {}
class MockChannelsRepository {}
class MockWorkspaceMembersRepository {}
class MockChannelMembersRepository {}
class MockUsersRepository {}

describe('WorkspacesService', () => {
  let service: WorkspacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesService,
        {
          provide: getRepositoryToken(Users),
          useClass: MockUsersRepository,
        },
        {
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMembersRepository,
        },
        {
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMembersRepository,
        },
        {
          provide: getRepositoryToken(Channels),
          useClass: MockChannelsRepository,
        },
        {
          provide: getRepositoryToken(Workspaces),
          useClass: MockWorkspacesRepository,
        },
      ],
    }).compile();

    service = module.get<WorkspacesService>(WorkspacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
