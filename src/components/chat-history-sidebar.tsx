
'use client';

import React, { useState } from 'react';
import type { ChatSession, AiModeId } from '@/lib/types';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MessageSquare, Trash2, Edit3, X, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [newName, setNewName] = useState<string>('');
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
    setNewName('');
  };

  const cancelRename = () => {
    setRenamingId(null);
    setNewName('');
  };

  const sortedSessions = [...chatSessions].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Sidebar className="border-r border-border/50 md:flex md:flex-col" side="left" collapsible="icon">
      <SidebarHeader className="p-3">
        <Button
          variant="outline"
          className={cn(
            "h-9 transition-all duration-200",
            sidebarState === "expanded"
              ? "w-full justify-start gap-2 px-3 gradient-primary text-white border-0 hover:opacity-90 hover:text-white shadow-md shadow-primary/20"
              : "w-9 justify-center p-0 h-9 gradient-primary text-white border-0"
          )}
          onClick={() => onNewChat()}
          title={sidebarState === "collapsed" ? "New Chat" : undefined}
        >
          <PlusCircle className="h-4 w-4" />
          {sidebarState === "expanded" && <span className="font-medium">New Chat</span>}
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
                        if (e.key === 'Enter') commitRename();
                        if (e.key === 'Escape') cancelRename();
                      }}
                      className="h-7 w-full bg-background text-sm min-w-0 border-none outline-none focus-visible:ring-0 shadow-none px-1"
                      autoFocus
                    />
                    <Button variant="ghost" size="icon" onClick={commitRename} className="h-6 w-6 shrink-0 text-primary hover:text-primary/80">
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={cancelRename} className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <SidebarMenuButton
                      onClick={() => handleSelectSession(session.id)}
                      isActive={session.id === currentSessionId}
                      className={cn(
                        "transition-all duration-200",
                        session.id === currentSessionId && "sidebar-item-active"
                      )}
                      tooltip={{ children: session.name, side: 'right', align: 'start' }}
                    >
                      <MessageSquare />
                      {sidebarState === "expanded" && <span>{session.name}</span>}
                    </SidebarMenuButton>
                    
                    {sidebarState === "expanded" && (
                       <div className={cn(
                          "absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5",
                          session.id === currentSessionId 
                            ? "opacity-100" 
                            : "opacity-0 group-hover/menu-item:opacity-100 focus-within:opacity-100"
                        )}>
                         <div className="flex items-center rounded-md bg-background/80 backdrop-blur-sm shadow-sm border border-border/40 p-0.5">
                           <Button asChild variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); startRename(session);}} className="h-6 w-6 p-1 hover:bg-primary/10">
                             <span><Edit3 className="h-3 w-3" /></span>
                           </Button>
                           <Dialog>
                              <DialogTrigger asChild>
                                <Button asChild variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="h-6 w-6 p-1 hover:bg-destructive/10 hover:text-destructive">
                                  <span><Trash2 className="h-3 w-3" /></span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Delete Chat?</DialogTitle>
                                </DialogHeader>
                                <p className="text-sm text-muted-foreground">Are you sure you want to delete &quot;{session.name}&quot;? This action cannot be undone.</p>
                                <DialogFooter>
                                   <DialogClose asChild>
                                    <Button variant="outline" size="sm">Cancel</Button>
                                   </DialogClose>
                                   <DialogClose asChild>
                                    <Button variant="destructive" size="sm" onClick={() => onDeleteSession(session.id)}>Delete</Button>
                                   </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                           </Dialog>
                         </div>
                       </div>
                    )}
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
