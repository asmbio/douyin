// // async function chatstream() {
// //     try {
// //       const stm= await getChatStream(data.uid)
// //       for await (const message of stm) {
// //         data.messages.push(message)
// //       }
// //     } catch (error) {

// //     }
// //   }

// import { getChatStream, getMsgContacts, getMsgList, getNoticeStream } from "@/api/moguservice"
// import { useBaseStore } from "./pinia"
// import { onUnmounted } from "vue"

// // 使用Composition API实现
// export function useNoticeStream(uid :string) {
//     const store = useBaseStore()

//     const controller = new AbortController()

//     const init = async () => {
//       try {

//         const stm = await getChatStream(uid)
//         for await (const message of stm) {

//         }
//       } catch (err) {
//         if (err.name !== 'AbortError') {
//           console.error('Notice stream error:', err)
//         }
//       }
//     }

//     // 组件卸载时中止流
//     onUnmounted(() => controller.abort())

//     return { init }
//   }
