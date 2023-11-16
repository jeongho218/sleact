import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';
import { Workspaces } from '../entities/Workspaces';
import { Repository } from 'typeorm';
import { ChannelChats } from './../entities/ChannelChats';

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
}
