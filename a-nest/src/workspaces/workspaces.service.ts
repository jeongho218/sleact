import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { Workspaces } from '../entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  // id로 워크스페이스 가져오기
  async findById(id: number) {
    return this.workspacesRepository.findByIds([id]);
  }

  // 자신이 속해있는 워크스페이스 조회
  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }

  // 워크스페이스 생성
  async createWorkspace(name: string, url: string, myId: number) {
    const workspace = this.workspacesRepository.create({
      name,
      url,
      OwnerId: myId,
    });
    const returned = await this.workspacesRepository.save(workspace);

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;
    await this.workspaceMembersRepository.save(workspaceMember);

    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;
    const channelReturned = await this.channelsRepository.save(channel);

    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
    // 트랜잭션 걸어줄 것
  }

  // 워크스페이스에 속해있는 사용자 목록 가져오기
  async getWorkspaceMembers(url: string) {
    this.usersRepository
      .createQueryBuilder('u')
      .innerJoin('u.WorkspaceMembers', 'm')
      .innerJoin('m.Workspace', 'w', 'w.url = :url', { url: url })
      .getMany();
    // 여기서 'u'는 엔티티 'Users'의, 'm'는 엔티티 'WorkspaceMembers'의, 'w'는 'Workspace'의 alias(별명)
    // Users와 WorkspaceMembers는 OneToMany(일대다) 관계,
    // WorkspaceMembers와 Workspace도 OneToMany(일대다) 관계
    // 즉 Users에서 WorkspaceMembers를 거쳐 Workspace에 접근한 다음
    // 파라미터 url을 변수 url에 담고, Workspace의 url과 변수 url이 일치하는 내용을 가져옴
  }

  // 워크스페이스 사용자 초대
  async createWorkspaceMembers(url, email) {
    // 워크스페이스 특정
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace,Channels',
        },
      },
    });
    // queryBuilder로 작성했다면
    // await this.workspacesRepository
    //   .createQueryBuilder('workspace')
    //   .innerJoinAndSelect('workspace.Channels', 'Channel')
    //   .getOne();
    // 취향 차이이긴 했지만 둘 다 자주 쓰이는 방법이니 알아두자

    // 사용자 특정
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      return null;
    }

    // 워크스페이스 멤버에 워크스페이스 아이디와 사용자 아이디 저장
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMembersRepository.save(workspaceMember);

    // 채널 멤버에 채널 아이디와 사용자 아이디 저장
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
    // 트랜잭션 걸어줄 것
  }

  // 워크스페이스 멤버 가져오기
  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url: url,
      })
      .getOne();
  }
}
