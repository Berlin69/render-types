'use client'

import React, {useState} from 'react';
import {PanelLeft, ZapIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {usePathname} from "next/navigation";
import {ThemeToggle} from "@/components/theme/theme-toggler";
import {menuData} from "@/lib/menu";
import {UploadModal} from "@/components/upload-modal";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

export const NavbarSheet = () => {

  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className={''}>
      <div className={'flex justify-between items-center gap-2 mb-3'}>
        <div className={'flex gap-2'}>
          <Sheet>
            <SheetTrigger asChild>
              <PanelLeft/>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <SheetClose asChild>
                    <Link href="/" className="font-semibold flex gap-2 items-center"><ZapIcon/> Next Test Task</Link>
                  </SheetClose>
                </SheetTitle>
                <SheetDescription className={'sr-only'}>
                  Menu
                </SheetDescription>
                <NavigationMenu className={'w-full'}>
                  <NavigationMenuList className={'grid w-full'}>
                    {menuData.map((item) => (
                      <NavigationMenuItem key={item.name} className={'w-full'}>
                        <SheetClose asChild>
                          <NavigationMenuLink asChild className="px-3 py-2 w-full">
                            <Link href={item.link}
                                  className={cn(pathname === item.link && 'bg-background', 'w-full')}>{item.name}</Link>
                          </NavigationMenuLink>
                        </SheetClose>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <div className={'h-[24px] w-px bg-plt-grey'}/>
          <span>
          {menuData.find(item => item.link === pathname)?.name || 'Main'}
          </span>
        </div>
        <div className={'flex gap-2'}>
          <Button variant="default" onClick={() => setOpen(true)}>Open form</Button>
          <ThemeToggle/>
        </div>
      </div>
      <UploadModal open={open} onOpenChange={setOpen}/>
      <Separator className={'mb-3'}/>
    </div>
  );
};