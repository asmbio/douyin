// @generated by protoc-gen-es v2.2.3 with parameter "target=ts"
// @generated from file video2.proto (package protos, syntax proto3)
/* eslint-disable */

import type { GenEnum, GenFile, GenMessage } from '@bufbuild/protobuf/codegenv1'
import { enumDesc, fileDesc, messageDesc } from '@bufbuild/protobuf/codegenv1'
import type { Message } from '@bufbuild/protobuf'

/**
 * Describes the file video2.proto.
 */
export const file_video2: GenFile =
  /*@__PURE__*/
  fileDesc(
    'Cgx2aWRlbzIucHJvdG8SBnByb3RvcyKJAwoIV29ya3Ntc2cSDAoERnJvbRgCIAEoCRIQCghGZWVzcmF0ZRgEIAEoBBINCgVUaXRsZRgFIAEoCRINCgVUb3BpYxgGIAMoCRIPCgdBdFVzZXJzGAcgAygJEgwKBERlc2MYCCABKAkSJQoJTWVkaWFUeXBlGAkgASgOMhIucHJvdG9zLk1FRElBX1RZUEUSDAoEVGltZRgKIAEoBBIqCgtNZWRpYV9BdWRpbxgLIAEoCzITLnByb3Rvcy5NZWRpYV9BdWRpb0gAEiYKCU1lZGlhX0ltZxgMIAEoCzIRLnByb3Rvcy5NZWRpYV9JbWdIABIqCgtNZWRpYV9WaWRlbxgNIAEoCzITLnByb3Rvcy5NZWRpYV9WaWRlb0gAEigKCk1lZGlhX1RleHQYDiABKAsyEi5wcm90b3MuTWVkaWFfVGV4dEgAEjYKEU1lZGlhX1ZpZGVvX01peGVkGA8gASgLMhkucHJvdG9zLk1lZGlhX1ZpZGVvX01peGVkSABCCQoHQ29udGVudCKuAgoPV29ya3Njb21tZW50bXNnEgwKBEZyb20YAiABKAkSCgoCVG8YAyABKAkSCwoDS2V5GAQgASgMEhAKCEZlZXNyYXRlGAUgASgEEh8KA1RhZxgGIAEoDjISLnByb3Rvcy5NRURJQV9UWVBFEgwKBFRpbWUYByABKAQSKgoLTWVkaWFfQXVkaW8YCCABKAsyEy5wcm90b3MuTWVkaWFfQXVkaW9IABImCglNZWRpYV9JbWcYCSABKAsyES5wcm90b3MuTWVkaWFfSW1nSAASKgoLTWVkaWFfVmlkZW8YCiABKAsyEy5wcm90b3MuTWVkaWFfVmlkZW9IABIoCgpNZWRpYV9UZXh0GAsgASgLMhIucHJvdG9zLk1lZGlhX1RleHRIAEIJCgdDb250ZW50Ik4KCElwZnNGaWxlEg8KB0NvbnRlbnQYASABKAkSEAoIRmlsZW5hbWUYAiABKAkSDQoFSXNjaWQYAyABKAgSEAoIRHVyYXRpb24YBCABKA0iMgoLTWVkaWFfQXVkaW8SIwoJaXBmc19maWxlGAEgASgLMhAucHJvdG9zLklwZnNGaWxlIjIKC01lZGlhX1ZpZGVvEiMKCWlwZnNfZmlsZRgBIAEoCzIQLnByb3Rvcy5JcGZzRmlsZSJbChBNZWRpYV9WaWRlb19saXN0EiMKBlZpZGVvcxgBIAMoCzITLnByb3Rvcy5NZWRpYV9WaWRlbxIiCgVhdWRpbxgCIAEoCzITLnByb3Rvcy5NZWRpYV9BdWRpbyJZChFNZWRpYV9WaWRlb19NaXhlZBIgCgZNZWRpYXMYASADKAsyEC5wcm90b3MuSXBmc0ZpbGUSIgoFYXVkaW8YAiABKAsyEy5wcm90b3MuTWVkaWFfQXVkaW8iPgoJTWVkaWFfSW1nEiMKCWlwZnNfZmlsZRgBIAEoCzIQLnByb3Rvcy5JcGZzRmlsZRIMCgRUZXh0GAIgASgJIhoKCk1lZGlhX1RleHQSDAoEVGV4dBgBIAEoCSqkAQoKTUVESUFfVFlQRRIQCgxfVU5TUEVDSUZJRUQQABIJCgVfTElLRRABEgwKCF9ESVNMSUtFEAISDAoIX0NPTU1FTlQQAxIKCgZfU0hBUkUQBBILCgdfVU5MSUtFEAUSCwoGX0lNQUdFEIACEgsKBl9BVURJTxCBAhIKCgVfVEVYVBCCAhILCgZfVklERU8QgwISEQoMX1ZJREVPX01JWEVEEIQCQhZaFGRvdXlpbmFwaS9wcm90b3Mvb3V0YgZwcm90bzM'
  )

/**
 * 添加 Worksmsg 结构体
 *
 * @generated from message protos.Worksmsg
 */
export type Worksmsg = Message<'protos.Worksmsg'> & {
  /**
   * @generated from field: string From = 2;
   */
  From: string

  /**
   * @generated from field: uint64 Feesrate = 4;
   */
  Feesrate: bigint

  /**
   * @generated from field: string Title = 5;
   */
  Title: string

  /**
   * @generated from field: repeated string Topic = 6;
   */
  Topic: string[]

  /**
   * @generated from field: repeated string AtUsers = 7;
   */
  AtUsers: string[]

  /**
   * @generated from field: string Desc = 8;
   */
  Desc: string

  /**
   * @generated from field: protos.MEDIA_TYPE MediaType = 9;
   */
  MediaType: MEDIA_TYPE

  /**
   * @generated from field: uint64 Time = 10;
   */
  Time: bigint

  /**
   * @generated from oneof protos.Worksmsg.Content
   */
  Content:
    | {
        /**
         * @generated from field: protos.Media_Audio Media_Audio = 11;
         */
        value: Media_Audio
        case: 'MediaAudio'
      }
    | {
        /**
         * @generated from field: protos.Media_Img Media_Img = 12;
         */
        value: Media_Img
        case: 'MediaImg'
      }
    | {
        /**
         * @generated from field: protos.Media_Video Media_Video = 13;
         */
        value: Media_Video
        case: 'MediaVideo'
      }
    | {
        /**
         * @generated from field: protos.Media_Text Media_Text = 14;
         */
        value: Media_Text
        case: 'MediaText'
      }
    | {
        /**
         * @generated from field: protos.Media_Video_Mixed Media_Video_Mixed = 15;
         */
        value: Media_Video_Mixed
        case: 'MediaVideoMixed'
      }
    | { case: undefined; value?: undefined }
}

/**
 * Describes the message protos.Worksmsg.
 * Use `create(WorksmsgSchema)` to create a new message.
 */
export const WorksmsgSchema: GenMessage<Worksmsg> = /*@__PURE__*/ messageDesc(file_video2, 0)

/**
 * 添加 Workscommentmsg 结构体
 *
 * @generated from message protos.Workscommentmsg
 */
export type Workscommentmsg = Message<'protos.Workscommentmsg'> & {
  /**
   * @generated from field: string From = 2;
   */
  From: string

  /**
   * @generated from field: string To = 3;
   */
  To: string

  /**
   * @generated from field: bytes Key = 4;
   */
  Key: Uint8Array

  /**
   * @generated from field: uint64 Feesrate = 5;
   */
  Feesrate: bigint

  /**
   * @generated from field: protos.MEDIA_TYPE Tag = 6;
   */
  Tag: MEDIA_TYPE

  /**
   * @generated from field: uint64 Time = 7;
   */
  Time: bigint

  /**
   * @generated from oneof protos.Workscommentmsg.Content
   */
  Content:
    | {
        /**
         * @generated from field: protos.Media_Audio Media_Audio = 8;
         */
        value: Media_Audio
        case: 'MediaAudio'
      }
    | {
        /**
         * @generated from field: protos.Media_Img Media_Img = 9;
         */
        value: Media_Img
        case: 'MediaImg'
      }
    | {
        /**
         * @generated from field: protos.Media_Video Media_Video = 10;
         */
        value: Media_Video
        case: 'MediaVideo'
      }
    | {
        /**
         * @generated from field: protos.Media_Text Media_Text = 11;
         */
        value: Media_Text
        case: 'MediaText'
      }
    | { case: undefined; value?: undefined }
}

/**
 * Describes the message protos.Workscommentmsg.
 * Use `create(WorkscommentmsgSchema)` to create a new message.
 */
export const WorkscommentmsgSchema: GenMessage<Workscommentmsg> =
  /*@__PURE__*/
  messageDesc(file_video2, 1)

/**
 * @generated from message protos.IpfsFile
 */
export type IpfsFile = Message<'protos.IpfsFile'> & {
  /**
   * @generated from field: string Content = 1;
   */
  Content: string

  /**
   * @generated from field: string Filename = 2;
   */
  Filename: string

  /**
   * @generated from field: bool Iscid = 3;
   */
  Iscid: boolean

  /**
   * @generated from field: uint32 Duration = 4;
   */
  Duration: number
}

/**
 * Describes the message protos.IpfsFile.
 * Use `create(IpfsFileSchema)` to create a new message.
 */
export const IpfsFileSchema: GenMessage<IpfsFile> = /*@__PURE__*/ messageDesc(file_video2, 2)

/**
 * @generated from message protos.Media_Audio
 */
export type Media_Audio = Message<'protos.Media_Audio'> & {
  /**
   * @generated from field: protos.IpfsFile ipfs_file = 1;
   */
  ipfsFile?: IpfsFile
}

/**
 * Describes the message protos.Media_Audio.
 * Use `create(Media_AudioSchema)` to create a new message.
 */
export const Media_AudioSchema: GenMessage<Media_Audio> = /*@__PURE__*/ messageDesc(file_video2, 3)

/**
 * @generated from message protos.Media_Video
 */
export type Media_Video = Message<'protos.Media_Video'> & {
  /**
   * @generated from field: protos.IpfsFile ipfs_file = 1;
   */
  ipfsFile?: IpfsFile
}

/**
 * Describes the message protos.Media_Video.
 * Use `create(Media_VideoSchema)` to create a new message.
 */
export const Media_VideoSchema: GenMessage<Media_Video> = /*@__PURE__*/ messageDesc(file_video2, 4)

/**
 * @generated from message protos.Media_Video_list
 */
export type Media_Video_list = Message<'protos.Media_Video_list'> & {
  /**
   * @generated from field: repeated protos.Media_Video Videos = 1;
   */
  Videos: Media_Video[]

  /**
   * @generated from field: protos.Media_Audio audio = 2;
   */
  audio?: Media_Audio
}

/**
 * Describes the message protos.Media_Video_list.
 * Use `create(Media_Video_listSchema)` to create a new message.
 */
export const Media_Video_listSchema: GenMessage<Media_Video_list> =
  /*@__PURE__*/
  messageDesc(file_video2, 5)

/**
 * @generated from message protos.Media_Video_Mixed
 */
export type Media_Video_Mixed = Message<'protos.Media_Video_Mixed'> & {
  /**
   * @generated from field: repeated protos.IpfsFile Medias = 1;
   */
  Medias: IpfsFile[]

  /**
   * @generated from field: protos.Media_Audio audio = 2;
   */
  audio?: Media_Audio
}

/**
 * Describes the message protos.Media_Video_Mixed.
 * Use `create(Media_Video_MixedSchema)` to create a new message.
 */
export const Media_Video_MixedSchema: GenMessage<Media_Video_Mixed> =
  /*@__PURE__*/
  messageDesc(file_video2, 6)

/**
 * @generated from message protos.Media_Img
 */
export type Media_Img = Message<'protos.Media_Img'> & {
  /**
   * @generated from field: protos.IpfsFile ipfs_file = 1;
   */
  ipfsFile?: IpfsFile

  /**
   * @generated from field: string Text = 2;
   */
  Text: string
}

/**
 * Describes the message protos.Media_Img.
 * Use `create(Media_ImgSchema)` to create a new message.
 */
export const Media_ImgSchema: GenMessage<Media_Img> = /*@__PURE__*/ messageDesc(file_video2, 7)

/**
 * @generated from message protos.Media_Text
 */
export type Media_Text = Message<'protos.Media_Text'> & {
  /**
   * @generated from field: string Text = 1;
   */
  Text: string
}

/**
 * Describes the message protos.Media_Text.
 * Use `create(Media_TextSchema)` to create a new message.
 */
export const Media_TextSchema: GenMessage<Media_Text> = /*@__PURE__*/ messageDesc(file_video2, 8)

/**
 * @generated from enum protos.MEDIA_TYPE
 */
export enum MEDIA_TYPE {
  /**
   * @generated from enum value: _UNSPECIFIED = 0;
   */
  _UNSPECIFIED = 0,

  /**
   * @generated from enum value: _LIKE = 1;
   */
  _LIKE = 1,

  /**
   * @generated from enum value: _DISLIKE = 2;
   */
  _DISLIKE = 2,

  /**
   * @generated from enum value: _COMMENT = 3;
   */
  _COMMENT = 3,

  /**
   * @generated from enum value: _SHARE = 4;
   */
  _SHARE = 4,

  /**
   * @generated from enum value: _UNLIKE = 5;
   */
  _UNLIKE = 5,

  /**
   * @generated from enum value: _IMAGE = 256;
   */
  _IMAGE = 256,

  /**
   * @generated from enum value: _AUDIO = 257;
   */
  _AUDIO = 257,

  /**
   * @generated from enum value: _TEXT = 258;
   */
  _TEXT = 258,

  /**
   * @generated from enum value: _VIDEO = 259;
   */
  _VIDEO = 259,

  /**
   * @generated from enum value: _VIDEO_MIXED = 260;
   */
  _VIDEO_MIXED = 260
}

/**
 * Describes the enum protos.MEDIA_TYPE.
 */
export const MEDIA_TYPESchema: GenEnum<MEDIA_TYPE> = /*@__PURE__*/ enumDesc(file_video2, 0)
