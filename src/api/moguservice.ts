import { create } from '@bufbuild/protobuf'
import { createClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import {
  MoguService,
  GetContactsRequestSchema,
  GetMsgContactsRequestSchema,
  GetMsgListRequestSchema,
  CONTACT_TAG
} from './gen/moguervice_pb' // 请根据实际路径调整导入

import { UserInfoSchema, UserinfolistSchema } from './gen/userinfo_pb'
import { MessagelistSchema } from './gen/message_pb'
import { StringSchema } from './gen/string_pb'
import { EmptySchema } from '@bufbuild/protobuf/wkt'
import { WorksmsgSchema, type Worksmsg } from './gen/video2_pb'

// 创建全局的 transport 和 client 实例（单例模式）
const transport = createGrpcWebTransport({
  baseUrl: 'http://127.0.0.1:8081' // 根据实际服务地址修改
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

// 5. 获取消息联系人
export async function getMsgContacts(
  time: bigint, // 使用 bigint 类型处理时间戳
  size: number
) {
  const request = create(GetMsgContactsRequestSchema, {
    time,
    size
  })
  return client.getMsgContacts(request)
}

// 6. 获取消息列表
export async function getMsgList(time: bigint, size: number, uid: string) {
  const request = create(GetMsgListRequestSchema, {
    time,
    size,
    uid
  })
  return client.getMsgList(request)
}

export async function publishVideo(work: Worksmsg) {
  return client.pushVideo(work)
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
