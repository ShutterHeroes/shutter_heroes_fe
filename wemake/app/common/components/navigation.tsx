import { Link } from "react-router";
import { Separator } from "~/common/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  BarChart3Icon,
  BellIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserIcon,
  MenuIcon,
  ChevronRightIcon,
  Upload,
} from "lucide-react";
import { useState } from "react";

const menus = [
  {
    name: "목격 정보",
    to: "/sightings",
  },
  {
    name: "사용자",
    to: "/users",
  },
];

export default function Navigation({
  isLoggedIn,
  hasNotifications,
  hasMessages,
}: {
  isLoggedIn: boolean;
  hasNotifications: boolean;
  hasMessages: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="flex px-4 md:px-8 lg:px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50 border-b">
      <div className="flex items-center gap-2 md:gap-4">
        <Link to="/" className="font-bold tracking-tighter text-base md:text-lg">
          셔터 히어로즈
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <Separator orientation="vertical" className="h-6 mx-4" />
          <NavigationMenu>
            <NavigationMenuList>
              {menus.map((menu) => (
                <NavigationMenuItem key={menu.name}>
                  {menu.items ? (
                    <>
                      <Link to={menu.to}>
                        <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                      </Link>
                      <NavigationMenuContent>
                        <ul className="grid w-[600px] font-light gap-3 p-4 grid-cols-2">
                          {menu.items?.map((item) => (
                            <NavigationMenuItem
                              key={item.name}
                              className={cn([
                                "select-none rounded-md transition-colors focus:bg-accent hover:bg-accent",
                                item.to === "/pictures/promote" &&
                                  "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                              ])}
                            >
                              <NavigationMenuLink asChild>
                                <Link
                                  className="p-3 space-y-1 block leading-none no-underline outline-none"
                                  to={item.to}
                                >
                                  <span className="text-sm font-medium leading-none">
                                    {item.name}
                                  </span>
                                  <p className="text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </NavigationMenuItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link className={navigationMenuTriggerStyle()} to={menu.to}>
                      {menu.name}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Right Side Actions */}
      {isLoggedIn ? (
        <div className="flex items-center gap-2 md:gap-4">
          {/* Submit Button */}
          <Button asChild size="sm" className="hidden md:flex">
            <Link to="/sightings/submit">등록하기</Link>
          </Button>

          {/* Messages - Hidden on smallest screens */}
          <Button size="icon" variant="ghost" asChild className="relative hidden sm:flex">
            <Link to="/my/messages">
              <MessageCircleIcon className="size-4" />
              {hasMessages && (
                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button>
          
          {/* User Dropdown - Desktop */}
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="font-medium">홍길동</span>
                  <span className="text-xs text-muted-foreground">@사용자명</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/my/sightings">
                      <BarChart3Icon className="size-4 mr-2" />
                      내 목격 정보
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/my/profile">
                      <UserIcon className="size-4 mr-2" />
                      프로필
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/my/settings">
                      <SettingsIcon className="size-4 mr-2" />
                      설정
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/auth/logout">
                    <LogOutIcon className="size-4 mr-2" />
                    로그아웃
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button size="icon" variant="ghost">
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {/* User Info - Mobile */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Avatar>
                    <AvatarImage src="/logo.png" />
                    <AvatarFallback>N</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">홍길동</span>
                    <span className="text-xs text-muted-foreground">@사용자명</span>
                  </div>
                </div>

                {/* Messages Link - Mobile */}
                <Link
                  to="/my/messages"
                  className="flex items-center justify-between p-3 rounded-md hover:bg-accent relative"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <MessageCircleIcon className="size-5" />
                    <span>메시지</span>
                  </div>
                  {hasMessages && (
                    <div className="size-2 bg-red-500 rounded-full" />
                  )}
                </Link>

                <Separator />

                {/* Navigation Links */}
                <div className="flex flex-col gap-2">
                  {menus.map((menu) => (
                    <div key={menu.name}>
                      <Link
                        to={menu.to}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-accent"
                        onClick={() => !menu.items && setMobileMenuOpen(false)}
                      >
                        <span className="font-medium">{menu.name}</span>
                        {menu.items && <ChevronRightIcon className="size-4" />}
                      </Link>
                      {menu.items && (
                        <div className="ml-4 flex flex-col gap-1 mt-1">
                          {menu.items.map((item) => (
                            <Link
                              key={item.name}
                              to={item.to}
                              className="p-2 rounded-md hover:bg-accent text-sm"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                {/* User Actions */}
                <div className="flex flex-col gap-2">
                  <Link
                    to="/sightings/submit"
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-accent bg-primary text-primary-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Upload className="size-5" />
                    <span>등록하기</span>
                  </Link>
                  <Link
                    to="/my/sightings"
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart3Icon className="size-5" />
                    <span>내 목격 정보</span>
                  </Link>
                  <Link
                    to="/my/profile"
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserIcon className="size-5" />
                    <span>프로필</span>
                  </Link>
                  <Link
                    to="/my/settings"
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <SettingsIcon className="size-5" />
                    <span>설정</span>
                  </Link>
                  <Link
                    to="/auth/logout"
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-accent text-destructive"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogOutIcon className="size-5" />
                    <span>로그아웃</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : (
        <div className="flex items-center gap-2 md:gap-4">
          <Button asChild variant="secondary" size="sm" className="md:size-default">
            <Link to="/auth/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="md:size-default">
            <Link to="/auth/join">Join</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}