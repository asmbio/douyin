import { getMsgContacts, getNoticeStream } from '@/api/moguservice'
import { useBaseStore } from './pinia'
import { onUnmounted } from 'vue'

// 使用Composition API实现
export function useNoticeStream() {
  const store = useBaseStore()

  const controller = new AbortController()

  const init = async () => {
    try {
      console.log('useNoticeStream init')
      const notices = await getMsgContacts(BigInt(0), 30)
      store.notifications.push(...notices.all)
      const stm = await getNoticeStream()
      for await (const message of stm) {
        store.addOrUpdateNotification(message)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Notice stream error:', err)
      }
    }
  }

  // 组件卸载时中止流
  onUnmounted(() => controller.abort())

  return { init }
}
