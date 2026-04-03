"use client";

import React, { useState } from "react";
import type { ChatSession, AiModeId } from "@/lib/types";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusCircle,
  MessageSquare,
  Trash2,
  Edit3,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHistorySidebarProps {
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: (modeId?: AiModeId) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
}

export function ChatHistorySidebar({
  chatSessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
}: ChatHistorySidebarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  const { isMobile, setOpenMobile, state: sidebarState } = useSidebar();

  const handleSelectSession = (sessionId: string) => {
    onSelectSession(sessionId);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const startRename = (session: ChatSession) => {
    setRenamingId(session.id);
    setNewName(session.name);
  };

  const commitRename = () => {
    if (renamingId && newName.trim()) {
      onRenameSession(renamingId, newName.trim());
    }
    setRenamingId(null);
    setNewName("");
  };

  const cancelRename = () => {
    setRenamingId(null);
    setNewName("");
  };

  const sortedSessions = [...chatSessions].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return (
    <Sidebar
      className="border-r border-border/50 md:flex md:flex-col"
      side="left"
      collapsible="icon"
    >
      <SidebarHeader className="p-3">
        <Button
          variant="outline"
          className={cn(
            "h-9 transition-all duration-200",
            sidebarState === "expanded"
              ? "w-full justify-start gap-2 px-3 gradient-primary text-white border-0 hover:opacity-90 hover:text-white shadow-md shadow-primary/20"
              : "w-9 justify-center p-0 h-9 gradient-primary text-white border-0",
          )}
          onClick={() => onNewChat()}
          title={sidebarState === "collapsed" ? "New Chat" : undefined}
        >
          <PlusCircle className="h-4 w-4" />
          {sidebarState === "expanded" && (
            <span className="font-medium">New Chat</span>
          )}
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <ScrollArea className="h-full">
          <SidebarMenu className="p-2 space-y-0.5">
            {sortedSessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                {renamingId === session.id && sidebarState === "expanded" ? (
                  <div className="flex items-center gap-1 p-1 w-full max-w-full z-10 relative bg-background rounded-md">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") cancelRename();
                      }}
                      className="h-7 w-full bg-background text-sm min-w-0 border-none outline-none focus-visible:ring-0 shadow-none px-1"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={commitRename}
                      className="h-6 w-6 shrink-0 text-primary hover:text-primary/80"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={cancelRename}
                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex w-full min-w-0 items-center gap-1">
                      <SidebarMenuButton
                        onClick={() => handleSelectSession(session.id)}
                        isActive={session.id === currentSessionId}
                        className={cn(
                          "transition-all duration-200 min-w-0 w-0 flex-1",
                          session.id === currentSessionId &&
                            "sidebar-item-active",
                        )}
                        tooltip={{
                          children: session.name,
                          side: "right",
                          align: "start",
                        }}
                      >
                        <MessageSquare />
                        {sidebarState === "expanded" && (
                          <span className="block min-w-0 truncate">
                            {session.name}
                          </span>
                        )}
                      </SidebarMenuButton>

                      {sidebarState === "expanded" && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(session);
                            }}
                            title="Rename chat"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={(e) => e.stopPropagation()}
                                title="Delete chat"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Delete Chat?</DialogTitle>
                              </DialogHeader>
                              <p className="text-sm text-muted-foreground">
                                Are you sure you want to delete &quot;
                                {session.name}&quot;? This action cannot be
                                undone.
                              </p>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline" size="sm">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDeleteSession(session.id)}
                                  >
                                    Delete
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
