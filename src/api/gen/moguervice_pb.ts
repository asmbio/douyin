// @generated by protoc-gen-es v2.2.3 with parameter "target=ts"
// @generated from file moguervice.proto (package protos, syntax proto3)
/* eslint-disable */

import type { GenEnum, GenFile, GenMessage, GenService } from '@bufbuild/protobuf/codegenv1'
import { enumDesc, fileDesc, messageDesc, serviceDesc } from '@bufbuild/protobuf/codegenv1'
import type { StringSchema } from './string_pb'
import { file_string } from './string_pb'
import type { UserinfolistSchema, UserInfoSchema } from './userinfo_pb'
import { file_userinfo } from './userinfo_pb'
import type { ChatMessageSchema, MessagelistSchema, STATUS } from './message_pb'
import { file_message } from './message_pb'
import type { VideoListSchema, VisibilityLevel } from './video_pb'
import { file_video } from './video_pb'
import type { WorksmsgSchema } from './trans_worksmsg_pb'
import { file_trans_worksmsg } from './trans_worksmsg_pb'
import type { MessageBSSchema, MetaInfoMsgSchema } from './trans_pb'
import { file_trans } from './trans_pb'
import type { EmptySchema } from '@bufbuild/protobuf/wkt'
import { file_google_protobuf_empty } from '@bufbuild/protobuf/wkt'
import type { Message } from '@bufbuild/protobuf'

/**
 * Describes the file moguervice.proto.
 */
export const file_moguervice: GenFile =
  /*@__PURE__*/
  fileDesc(
    'ChBtb2d1ZXJ2aWNlLnByb3RvEgZwcm90b3MiNQoTU2VuZE1lc3NhZ2VSZXNwb25zZRIeCgZzdGF0dXMYASABKA4yDi5wcm90b3MuU1RBVFVTIjMKFUdldE1zZ0NvbnRhY3RzUmVxdWVzdBIMCgR0aW1lGAEgASgEEgwKBHNpemUYAiABKAUiPAoRR2V0TXNnTGlzdFJlcXVlc3QSDAoEdGltZRgBIAEoBBIMCgRzaXplGAIgASgFEgsKA3VpZBgDIAEoCSJRChJHZXRDb250YWN0c1JlcXVlc3QSCwoDdWlkGAEgASgJEgwKBHNpemUYAiABKAUSIAoDdGFnGAMgASgOMhMucHJvdG9zLkNPTlRBQ1RfVEFHIl8KDFZpZGVvUmVxdWVzdBIPCgdwYWdlX25vGAEgASgFEhEKCXBhZ2Vfc2l6ZRgCIAEoBRIrCgp2aXNpYmlsaXR5GAMgASgOMhcucHJvdG9zLlZpc2liaWxpdHlMZXZlbCI1Cg5NeVZpZGVvUmVxdWVzdBIQCghmb3JtdGltZRgBIAEoBBIRCglwYWdlX3NpemUYAiABKAUqZAoLQ09OVEFDVF9UQUcSDAoIU1RSQU5HRVIQABIKCgZGT0xMT1cQARIMCghGT0xMT1dFRBACEgoKBkZSSUVORBADEgkKBUJMQUNLEAQSCQoFR1JPVVAQBRILCgdNWUdST1VQEAYynQkKC01vZ3VTZXJ2aWNlEjUKCVN0YXJ0Q29yZRIOLnByb3Rvcy5TdHJpbmcaFi5nb29nbGUucHJvdG9idWYuRW1wdHkiABI2CgpHZXREZnRBZGRyEhYuZ29vZ2xlLnByb3RvYnVmLkVtcHR5Gg4ucHJvdG9zLlN0cmluZyIAEjoKDEVkaXRVc2VySW5mbxIQLnByb3Rvcy5Vc2VySW5mbxoWLmdvb2dsZS5wcm90b2J1Zi5FbXB0eSIAEjEKC0dldFVzZXJJbmZvEg4ucHJvdG9zLlN0cmluZxoQLnByb3Rvcy5Vc2VySW5mbyIAEjYKCEdldFBhbmVsEhYuZ29vZ2xlLnByb3RvYnVmLkVtcHR5GhAucHJvdG9zLlVzZXJJbmZvIgASQQoLR2V0Q29udGFjdHMSGi5wcm90b3MuR2V0Q29udGFjdHNSZXF1ZXN0GhQucHJvdG9zLlVzZXJpbmZvbGlzdCIAEkYKDUdldE5vdGljZUxpc3QSHS5wcm90b3MuR2V0TXNnQ29udGFjdHNSZXF1ZXN0GhQucHJvdG9zLlVzZXJpbmZvbGlzdCIAEj8KD0dldE5vdGljZVN0cmVhbRIWLmdvb2dsZS5wcm90b2J1Zi5FbXB0eRoQLnByb3Rvcy5Vc2VySW5mbyIAMAESQwoPR2V0Q29udmVyc2F0aW9uEhkucHJvdG9zLkdldE1zZ0xpc3RSZXF1ZXN0GhMucHJvdG9zLk1lc3NhZ2VsaXN0IgASMwoHU2V0UmVhZBIOLnByb3Rvcy5TdHJpbmcaFi5nb29nbGUucHJvdG9idWYuRW1wdHkiABJBCgtTZW5kTWVzc2FnZRITLnByb3Rvcy5DaGF0TWVzc2FnZRobLnByb3Rvcy5TZW5kTWVzc2FnZVJlc3BvbnNlIgASOAoNR2V0Q2hhdFN0cmVhbRIOLnByb3Rvcy5TdHJpbmcaEy5wcm90b3MuQ2hhdE1lc3NhZ2UiADABEj4KEkRlbGV0ZUNvbnZlcnNhdGlvbhIOLnByb3Rvcy5TdHJpbmcaFi5nb29nbGUucHJvdG9idWYuRW1wdHkiABJJChVDbGVhckFsbENvbnZlcnNhdGlvbnMSFi5nb29nbGUucHJvdG9idWYuRW1wdHkaFi5nb29nbGUucHJvdG9idWYuRW1wdHkiABI2CgdNeVZpZGVvEhYucHJvdG9zLk15VmlkZW9SZXF1ZXN0GhEucHJvdG9zLlZpZGVvTGlzdCIAEkEKFEdldFJlY29tbWVuZGVkVmlkZW9zEhQucHJvdG9zLlZpZGVvUmVxdWVzdBoRLnByb3Rvcy5WaWRlb0xpc3QiABI3CglQdXNoVmlkZW8SEC5wcm90b3MuV29ya3Ntc2caFi5nb29nbGUucHJvdG9idWYuRW1wdHkiABI8Cg1TaWduQW5kUHViTXNnEhEucHJvdG9zLk1lc3NhZ2VCUxoWLmdvb2dsZS5wcm90b2J1Zi5FbXB0eSIAEjgKD0NyZWF0ZUNvbW11bml0eRITLnByb3Rvcy5NZXRhSW5mb01zZxoOLnByb3Rvcy5TdHJpbmciAEIWWhRkb3V5aW5hcGkvcHJvdG9zL291dGIGcHJvdG8z',
    [
      file_string,
      file_userinfo,
      file_message,
      file_video,
      file_trans_worksmsg,
      file_trans,
      file_google_protobuf_empty
    ]
  )

/**
 * @generated from message protos.SendMessageResponse
 */
export type SendMessageResponse = Message<'protos.SendMessageResponse'> & {
  /**
   * 发送状态
   *
   * @generated from field: protos.STATUS status = 1;
   */
  status: STATUS
}

/**
 * Describes the message protos.SendMessageResponse.
 * Use `create(SendMessageResponseSchema)` to create a new message.
 */
export const SendMessageResponseSchema: GenMessage<SendMessageResponse> =
  /*@__PURE__*/
  messageDesc(file_moguervice, 0)

/**
 * @generated from message protos.GetMsgContactsRequest
 */
export type GetMsgContactsRequest = Message<'protos.GetMsgContactsRequest'> & {
  /**
   * 最后通讯时间
   *
   * @generated from field: uint64 time = 1;
   */
  time: bigint

  /**
   * @generated from field: int32 size = 2;
   */
  size: number
}

/**
 * Describes the message protos.GetMsgContactsRequest.
 * Use `create(GetMsgContactsRequestSchema)` to create a new message.
 */
export const GetMsgContactsRequestSchema: GenMessage<GetMsgContactsRequest> =
  /*@__PURE__*/
  messageDesc(file_moguervice, 1)

/**
 * @generated from message protos.GetMsgListRequest
 */
export type GetMsgListRequest = Message<'protos.GetMsgListRequest'> & {
  /**
   * @generated from field: uint64 time = 1;
   */
  time: bigint

  /**
   * @generated from field: int32 size = 2;
   */
  size: number

  /**
   * @generated from field: string uid = 3;
   */
  uid: string
}

/**
 * Describes the message protos.GetMsgListRequest.
 * Use `create(GetMsgListRequestSchema)` to create a new message.
 */
export const GetMsgListRequestSchema: GenMessage<GetMsgListRequest> =
  /*@__PURE__*/
  messageDesc(file_moguervice, 2)

/**
 * @generated from message protos.GetContactsRequest
 */
export type GetContactsRequest = Message<'protos.GetContactsRequest'> & {
  /**
   * 从这个用户开始，用户displayname
   *
   * @generated from field: string uid = 1;
   */
  uid: string

  /**
   * @generated from field: int32 size = 2;
   */
  size: number

  /**
   * 0 - 陌生人 1- 关注，2- 被关注，3- 好友（双向关注 // 4-黑名单
   *
   * @generated from field: protos.CONTACT_TAG tag = 3;
   */
  tag: CONTACT_TAG
}

/**
 * Describes the message protos.GetContactsRequest.
 * Use `create(GetContactsRequestSchema)` to create a new message.
 */
export const GetContactsRequestSchema: GenMessage<GetContactsRequest> =
  /*@__PURE__*/
  messageDesc(file_moguervice, 3)

/**
 * @generated from message protos.VideoRequest
 */
export type VideoRequest = Message<'protos.VideoRequest'> & {
  /**
   * @generated from field: int32 page_no = 1;
   */
  pageNo: number

  /**
   * @generated from field: int32 page_size = 2;
   */
  pageSize: number

  /**
   * @generated from field: protos.VisibilityLevel visibility = 3;
   */
  visibility: VisibilityLevel
}

/**
 * Describes the message protos.VideoRequest.
 * Use `create(VideoRequestSchema)` to create a new message.
 */
export const VideoRequestSchema: GenMessage<VideoRequest> =
  /*@__PURE__*/
  messageDesc(file_moguervice, 4)

/**
 * @generated from message protos.MyVideoRequest
 */
export type MyVideoRequest = Message<'protos.MyVideoRequest'> & {
  /**
   * 从新到旧
   *
   * @generated from field: uint64 formtime = 1;
   */
  formtime: bigint

  /**
   * @generated from field: int32 page_size = 2;
   */
  pageSize: number
}

/**
 * Describes the message protos.MyVideoRequest.
 * Use `create(MyVideoRequestSchema)` to create a new message.
 */
export const MyVideoRequestSchema: GenMessage<MyVideoRequest> =
  /*@__PURE__*/
  messageDesc(file_moguervice, 5)

/**
 * @generated from enum protos.CONTACT_TAG
 */
export enum CONTACT_TAG {
  /**
   * @generated from enum value: STRANGER = 0;
   */
  STRANGER = 0,

  /**
   * @generated from enum value: FOLLOW = 1;
   */
  FOLLOW = 1,

  /**
   * @generated from enum value: FOLLOWED = 2;
   */
  FOLLOWED = 2,

  /**
   * @generated from enum value: FRIEND = 3;
   */
  FRIEND = 3,

  /**
   * @generated from enum value: BLACK = 4;
   */
  BLACK = 4,

  /**
   * @generated from enum value: GROUP = 5;
   */
  GROUP = 5,

  /**
   * @generated from enum value: MYGROUP = 6;
   */
  MYGROUP = 6
}

/**
 * Describes the enum protos.CONTACT_TAG.
 */
export const CONTACT_TAGSchema: GenEnum<CONTACT_TAG> = /*@__PURE__*/ enumDesc(file_moguervice, 0)

/**
 * 用户服务
 *
 * @generated from service protos.MoguService
 */
export const MoguService: GenService<{
  /**
   * @generated from rpc protos.MoguService.StartCore
   */
  startCore: {
    methodKind: 'unary'
    input: typeof StringSchema
    output: typeof EmptySchema
  }
  /**
   * 基础信息用户
   *
   * @generated from rpc protos.MoguService.GetDftAddr
   */
  getDftAddr: {
    methodKind: 'unary'
    input: typeof EmptySchema
    output: typeof StringSchema
  }
  /**
   * @generated from rpc protos.MoguService.EditUserInfo
   */
  editUserInfo: {
    methodKind: 'unary'
    input: typeof UserInfoSchema
    output: typeof EmptySchema
  }
  /**
   * @generated from rpc protos.MoguService.GetUserInfo
   */
  getUserInfo: {
    methodKind: 'unary'
    input: typeof StringSchema
    output: typeof UserInfoSchema
  }
  /**
   * @generated from rpc protos.MoguService.GetPanel
   */
  getPanel: {
    methodKind: 'unary'
    input: typeof EmptySchema
    output: typeof UserInfoSchema
  }
  /**
   * @generated from rpc protos.MoguService.GetContacts
   */
  getContacts: {
    methodKind: 'unary'
    input: typeof GetContactsRequestSchema
    output: typeof UserinfolistSchema
  }
  /**
   * 聊天消息
   *
   * @generated from rpc protos.MoguService.GetNoticeList
   */
  getNoticeList: {
    methodKind: 'unary'
    input: typeof GetMsgContactsRequestSchema
    output: typeof UserinfolistSchema
  }
  /**
   * @generated from rpc protos.MoguService.GetNoticeStream
   */
  getNoticeStream: {
    methodKind: 'server_streaming'
    input: typeof EmptySchema
    output: typeof UserInfoSchema
  }
  /**
   * @generated from rpc protos.MoguService.GetConversation
   */
  getConversation: {
    methodKind: 'unary'
    input: typeof GetMsgListRequestSchema
    output: typeof MessagelistSchema
  }
  /**
   * @generated from rpc protos.MoguService.SetRead
   */
  setRead: {
    methodKind: 'unary'
    input: typeof StringSchema
    output: typeof EmptySchema
  }
  /**
   * @generated from rpc protos.MoguService.SendMessage
   */
  sendMessage: {
    methodKind: 'unary'
    input: typeof ChatMessageSchema
    output: typeof SendMessageResponseSchema
  }
  /**
   * @generated from rpc protos.MoguService.GetChatStream
   */
  getChatStream: {
    methodKind: 'server_streaming'
    input: typeof StringSchema
    output: typeof ChatMessageSchema
  }
  /**
   * @generated from rpc protos.MoguService.DeleteConversation
   */
  deleteConversation: {
    methodKind: 'unary'
    input: typeof StringSchema
    output: typeof EmptySchema
  }
  /**
   * @generated from rpc protos.MoguService.ClearAllConversations
   */
  clearAllConversations: {
    methodKind: 'unary'
    input: typeof EmptySchema
    output: typeof EmptySchema
  }
  /**
   *   // 视频获取
   *
   * @generated from rpc protos.MoguService.MyVideo
   */
  myVideo: {
    methodKind: 'unary'
    input: typeof MyVideoRequestSchema
    output: typeof VideoListSchema
  }
  /**
   * @generated from rpc protos.MoguService.GetRecommendedVideos
   */
  getRecommendedVideos: {
    methodKind: 'unary'
    input: typeof VideoRequestSchema
    output: typeof VideoListSchema
  }
  /**
   * @generated from rpc protos.MoguService.PushVideo
   */
  pushVideo: {
    methodKind: 'unary'
    input: typeof WorksmsgSchema
    output: typeof EmptySchema
  }
  /**
   * blocks
   *
   * @generated from rpc protos.MoguService.SignAndPubMsg
   */
  signAndPubMsg: {
    methodKind: 'unary'
    input: typeof MessageBSSchema
    output: typeof EmptySchema
  }
  /**
   * @generated from rpc protos.MoguService.CreateCommunity
   */
  createCommunity: {
    methodKind: 'unary'
    input: typeof MetaInfoMsgSchema
    output: typeof StringSchema
  }
}> = /*@__PURE__*/ serviceDesc(file_moguervice, 0)
