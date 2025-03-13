export function unixNanoToYYYYMMDD(unixNano: bigint): string {
  // 将 bigint 纳秒转换为毫秒（需要先转换为 bigint 除法）
  const milliseconds = unixNano / 1_000_000n // 使用 bigint 字面量 1_000_000n
  // 将 bigint 转换为 number（注意：确保结果不超过 Number.MAX_SAFE_INTEGER）
  const timestamp = Number(milliseconds)
  const date = new Date(timestamp)

  // 格式化为 YY-MM-DD（UTC 时间）
  const year = date.getUTCFullYear().toString() // 取年份后两位
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0') // 月份补零
  const day = date.getUTCDate().toString().padStart(2, '0') // 日期补零

  return `${year}-${month}-${day}`
}

//   export function formatTimeUnixnano(nano : bigint){
//     return formatTime( Number(nano/ 1_000_000n))
//   }

//   export function formatTime(seconds: number) {
//     const mins = Math.floor(seconds / 60)
//     const secs = seconds % 60
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
//   }
