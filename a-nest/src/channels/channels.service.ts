import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';
import { Workspaces } from '../entities/Workspaces';
import { MoreThan, Repository } from 'typeorm';
import { ChannelChats } from './../entities/ChannelChats';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private eventsGateway: EventsGateway,
  ) {}

  // id로 채널 가져오기
  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id: id } });
  }

  // 워크스페이스 내부의 자신이 속한 채널 모두 가져오기
  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels') // 'channels'는 엔티티 'Channels'의 alias(별명)
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers', // 'channels.ChannelMembers'의 alias
        'channelMembers.userId = :myId', // 'channelMembers'의 데이터 중 userId와 변수 myId가 일치하는 데이터를 가져옴
        { myId: myId }, // 파라미터 myId를 변수 myId에 할당
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace', // 'channels.Workspace'의 alias
        'workspace.url = :url', // 'workspace'의 데이터 중 userId와 변수 myId가 일치하는 데이터를 가져옴
        { url: url }, // 파라미터 myId를 변수 myId에 할당
      )
      .getMany();
  }

  // 워크스페이스 채널 하나 가져오기
  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository.findOne({
      where: {
        name: name,
      },
      relations: ['Workspace'],
    });
  }

  // 새로운 채널 만들기
  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url: url },
    });

    const channel = new Channels();
    channel.name = name;
    channel.WorkspaceId = workspace.id;
    const channelReturned = await this.channelsRepository.save(channel);

    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  // 채널 멤버 가져오기
  async getWorkspaceChannelMembers(url: string, name: string) {
    return (
      this.usersRepository
        .createQueryBuilder('user') // 'Users'의 alias
        .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
          name: name,
        }) // 'property', 'alias', 'condition', 'parameter'
        .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
          url: url,
        }) // 'property', 'alias', 'condition', 'parameter'
        // 각기 다른 workspace에 같은 이름을 가진 channel이 있을 수 있기 때문에
        // channel이 소속된 workspace도 확인할 것
        .getMany()
    );
  }

  // 채널 멤버 추가하기
  async createWorkspaceChannelMembers(url, name, email) {
    // 채널 찾기
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url: url,
      }) // 'property', 'alias', 'condition', 'parameter'
      .where('channel.name = :name', { name: name })
      .getOne();

    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }

    // 멤버로써 추가할 사용자 찾기
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
        url: url,
      }) // 'property', 'alias', 'condition', 'parameter'
      .getOne();

    if (!user) {
      throw new NotFoundException('사용자가 존재하지 않습니다.');
    }

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channel.id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  // 채널 내 채팅 내역 가져오기
  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return (
      this.channelChatsRepository
        .createQueryBuilder('channelChats')
        .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
          name: name,
        }) // 'property', 'alias', 'condition', 'parameter'
        .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
          url: url,
        }) // 'property', 'alias', 'condition', 'parameter'
        .innerJoinAndSelect('channelChats.User', 'user') // 'property', 'alias'
        // 채팅 작성자 가져오는 용도
        .orderBy('channelChats.createdAt', 'DESC') // 생성일 기준 내림차순
        .take(perPage) // limit(제한), 채팅을 한번에 몇개씩 가져올 것인지
        .skip(perPage * (page - 1)) // 페이지
        .getMany()
    );
  }

  // 채널에서 아직 내가 읽지 않는 메세지의 개수를 가져오기
  async getChannelUnreadsCount(url, name, after) {
    // 채널 id 가져오는 쿼리,
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url: url,
      })
      .where('channel.name = :name', { name: name })
      .getOne();

    return this.channelChatsRepository.count({
      where: { ChannelId: channel.id, createdAt: MoreThan(new Date(after)) },
      // `MoreThan(new Date(after))`는 쿼리로 createdAt > "`현재 날짜`"와 같다
      // 관련문서: https://orkhan.gitbook.io/typeorm/docs/find-options
    });
  }

  async postChat({ url, name, content, myId }) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel') // 'alias'
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url: url,
      }) // 'property', 'alias', 'condition', 'parameters'
      .where('channel.name = :name', { name: name }) // 'where', 'parameters
      .getOne();
    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }

    const chats = new ChannelChats();
    chats.content = content;
    chats.UserId = myId;
    chats.ChannelId = channel.id;
    const savedChat = await this.channelChatsRepository.save(chats);
    const chatWithUser = await this.channelChatsRepository.findOne({
      where: { id: savedChat.id },
      relations: ['User', 'Channel'],
    });
    // socket.io로 워크스페이스/채널 사용자에게 전송
    this.eventsGateway.server
      .to(`/ws-${url}-${channel.id}`)
      // `워크스페이스-워크스페이스 이름-채널ID`
      .emit('message', chatWithUser);
  }
}
