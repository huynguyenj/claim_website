export type SidebarItem = {
      title: string,
      icon:React.ComponentType<{sx?:object}>
      path:string,
      role?:string,
      gap?:boolean
}