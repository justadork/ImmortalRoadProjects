export type ReactiveOptions = {
    // 强制更新
    forceUpdate?: boolean,
    // 监听值的改变
    watch?: (o: any , k: string|symbol , nv: any , ov: any) => void, 
}