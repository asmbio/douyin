import { create } from '@bufbuild/protobuf'
import { createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import {
  MoguService,
  GetContactsRequestSchema,
  GetMsgContactsRequestSchema,
  GetMsgListRequestSchema,
  CONTACT_TAG,
  MyVideoRequestSchema,
  VideoRequestSchema,
  VideoCommentsRequestSchema
} from './gen/moguervice_pb' // 请根据实际路径调整导入

import { type UserInfo } from './gen/userinfo_pb'
import { StringSchema } from './gen/string_pb'
import { EmptySchema } from '@bufbuild/protobuf/wkt'
import type { Worksmsg } from './gen/trans_worksmsg_pb'
import type { ChatMessage } from './gen/message_pb'
import {
  MetaFollowMsg_FollowAction,
  MsgType,
  type MessageBS,
  type MetaFollowMsg,
  type MetaInfoMsg
} from './gen/trans_pb'
import { UpdateVideoViewRequestSchema } from './gen/video_pb'

// 创建全局的 transport 和 client 实例（单例模式）
const transport = createGrpcWebTransport({
  baseUrl: 'http://127.0.0.1:9081' // 根据实际服务地址修改
})

const client = createClient(MoguService, transport)

// 1. 启动核心
export async function startCore(pwd: string) {
  const request = create(StringSchema, { Value: pwd }) // 假设 StringSchema 结构为 { value: string }
  return client.startCore(request)
}

// 1. 获取默认地址
export async function getDftAddr() {
  const request = create(EmptySchema) // 空请求
  return client.getDftAddr(request)
}

// 2. 编辑用户信息
export async function editUserInfo(userinfo: UserInfo) {
  //const request = create(UserInfoSchema, { Value: uid }) // 假设 StringSchema 结构为 { value: string }
  //console.log(userinfo.userAge)
  return client.editUserInfo(userinfo)
}

// 2. 获取用户信息
export async function getUserInfo(uid: string) {
  const request = create(StringSchema, { Value: uid }) // 假设 StringSchema 结构为 { value: string }
  return client.getUserInfo(request)
}

// 3. 获取用户面板信息
export async function getPanel() {
  const request = create(EmptySchema) // 空请求
  return client.getPanel(request)
}

// 4. 获取联系人列表
export async function getContacts(uid: string, size: number, tag: CONTACT_TAG) {
  const request = create(GetContactsRequestSchema, {
    uid,
    size,
    tag
  })

  return client.getContacts(request)
}

// 5. 获取通知
export async function getNoticeList(
  time: bigint, // 使用 bigint 类型处理时间戳
  size: number
) {
  const request = create(GetMsgContactsRequestSchema, {
    time,
    size
  })
  return client.getNoticeList(request)
}

export async function getNoticeStream() {
  // 构建请求（根据 StringSchema 的结构可能需要包装字符串）
  const request = create(EmptySchema)
  return client.getNoticeStream(request)
  // try {

  //   // 4. 处理流数据
  //   for await (const message of stream) {
  //     // message 已自动反序列化为 MessageSchema 类型
  //     console.log("Received message:", message.content);

  //     // 这里可以更新 UI 或处理业务逻辑
  //     // 例如：添加到消息列表、实时显示等
  //   }

  //   console.log("Stream completed");
  // } catch (error) {
  //   console.error("Stream error:", error);
  // }
}
export async function getChatStream(chatId: string) {
  // 构建请求（根据 StringSchema 的结构可能需要包装字符串）
  const request = create(StringSchema, { Value: chatId })
  return client.getChatStream(request)
  // try {

  //   // 4. 处理流数据
  //   for await (const message of stream) {
  //     // message 已自动反序列化为 MessageSchema 类型
  //     console.log("Received message:", message.content);

  //     // 这里可以更新 UI 或处理业务逻辑
  //     // 例如：添加到消息列表、实时显示等
  //   }

  //   console.log("Stream completed");
  // } catch (error) {
  //   console.error("Stream error:", error);
  // }
}
// 6. 获取消息列表
export async function getConversation(time: bigint, size: number, uid: string) {
  const request = create(GetMsgListRequestSchema, {
    time,
    size,
    uid
  })
  return client.getConversation(request)
}

export async function sendMessage(msg: ChatMessage) {
  return client.sendMessage(msg)
}

export async function setRead(uid: string) {
  const request = create(StringSchema, {
    Value: uid
  })
  return client.setRead(request)
}

export async function deleteConversation(uid: string) {
  const request = create(StringSchema, {
    Value: uid
  })
  return client.deleteConversation(request)
}

export async function publishVideo(work: Worksmsg) {
  return client.pushVideo(work)
}

export async function myVideo(time: bigint, size: number) {
  const request = create(MyVideoRequestSchema)
  request.formtime = time
  request.pageSize = size
  return client.myVideo(request)
}

export async function getRecommendedVideos(start: number, size: number) {
  const request = create(VideoRequestSchema, {
    pageNo: start,
    pageSize: size
  })
  return client.getRecommendedVideos(request)
}
//
export async function getVideoComments(
  addr: string,
  videoId: string,
  subCommentId: string,
  fromkey: string,
  size: number
) {
  const request = create(VideoCommentsRequestSchema, {
    addr: '',
    videoId,
    subCommentId: '',
    fromkey: '',
    size
  })
  return client.getVideoComments(request)
}
export async function updateVideoViewStatus(
  videoId: string,
  watchDuration: number,
  completed: boolean,
  position: string
) {
  const request = create(UpdateVideoViewRequestSchema, {
    videoId,
    watchDuration: BigInt(watchDuration),
    completed,
    position
  })
  return client.updateVideoViewStatus(request)
}

export async function signAndPubMsg(msgbs: MessageBS) {
  return client.signAndPubMsg(msgbs)
}

export async function createCommunity(msg: MetaInfoMsg) {
  return client.createCommunity(msg)
}
export async function metaFollow(
  blockedUserId: string,
  currentUserId: string,
  afaction: MetaFollowMsg_FollowAction
) {
  const metaFollowMsg0 = {
    from: currentUserId, // Replace with actual current user ID
    to: blockedUserId,
    tag: afaction,
    feesRate: BigInt(0),
    time: BigInt(Date.now()) * 1_000_000n
  } as MetaFollowMsg

  const messageBS = {
    msgType: MsgType.SIGN_META_FOLLOW,
    body: {
      case: 'metaFollow',
      value: {
        msg: metaFollowMsg0
      }
    }
  } as MessageBS

  return signAndPubMsg(messageBS)
}

export async function joinCommunity(blockedUserId: string, currentUserId: string) {
  return metaFollow(blockedUserId, currentUserId, MetaFollowMsg_FollowAction.FOLLOW)
}

export async function exitCommunity(blockedUserId: string, currentUserId: string) {
  return metaFollow(blockedUserId, currentUserId, MetaFollowMsg_FollowAction.UNFOLLOW)
}

// // 使用示例
// async function exampleUsage() {
//   try {
//     // 获取用户信息示例
//     const userInfo = await getUserInfo("12345");
//     console.log("User Info:", userInfo);

//     // 获取联系人列表示例
//     const contacts = await getContacts(
//       "12345",
//       20,
//       CONTACT_TAG.FRIEND
//     );
//     console.log("Contacts:", contacts.list);

//     // 获取消息列表示例
//     const messages = await getMsgList(
//       BigInt(Date.now()), // 当前时间戳
//       50,
//       "67890"
//     );
//     console.log("Messages:", messages.list);
//   } catch (error) {
//     console.error("API Error:", error);
//   }
// }
