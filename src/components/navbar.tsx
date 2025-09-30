"use client"

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import {UploadModal} from "@/components/upload-modal";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {menuData} from "@/lib/menu";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {ZapIcon} from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false)

  const pathname = usePathname()

  return (
    <header className="border-b w-[200px] p-3 max-[900px]:hidden">
      <div className="flex flex-col h-full justify-between gap-4 pt-3 w-full">
        <div className={'grid gap-5 w-full'}>
          <Link href="/" className="font-semibold flex gap-2 items-center"><ZapIcon/> Next Test Task</Link>
          <NavigationMenu className={'w-full'}>
            <NavigationMenuList className={'grid w-full'}>
              {menuData.map((item) => (
                <NavigationMenuItem key={item.name} className={'w-full'}>
                  <NavigationMenuLink asChild className="px-3 py-2 w-full">
                    <Link href={item.link}
                          className={cn(pathname === item.link && 'bg-background', 'w-full')}>{item.name}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" className={'w-full'} onClick={() => setOpen(true)}>Open form</Button>
        </div>
      </div>
      <UploadModal open={open} onOpenChange={setOpen}/>
    </header>
  )
}