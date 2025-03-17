import { getDftAddr, getNoticeList, getNoticeStream } from '@/api/moguservice'
import { useBaseStore } from './pinia'
import { onUnmounted } from 'vue'
import { PlatformAdapter } from '@/utils/platform'

// 使用Composition API实现
export function useNoticeStream() {
  const store = useBaseStore()

  const controller = new AbortController()

  const init = async () => {
    try {
      store.loading = true
      const platformAdapter = new PlatformAdapter()
      // 获取当前平台
      console.log('Current platform:', platformAdapter.platform)
      const start = await platformAdapter.executePlatformAction('')
      console.log('executePlatformAction', start?.value)

      const uid = await getDftAddr()
      console.log('getDftAddr')
      store.userinfo.uid = uid.Value
      store.loading = false

      store.initChatStream()
      console.log('init noticestream')
      const stm = await getNoticeStream()
      for await (const message of stm) {
        store.addOrUpdateNotification(message)
      }

      console.log('return useNoticeStream ')
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Notice stream error:', err)
      }
    } finally {
      store.loading = false
    }
  }

  // 组件卸载时中止流
  onUnmounted(() => controller.abort())

  return { init }
}
