
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
import { PlusCircle, MessageSquare, Trash2, Edit3, X, Check } from 'lucide-react';
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
    <Sidebar className="border-r md:flex md:flex-col" side="left" collapsible="icon">
      <SidebarHeader className="p-2">
        <Button
          variant="outline"
          className={cn(
            "h-8",
            sidebarState === "expanded"
              ? "w-full justify-start gap-2 px-2"
              : "w-8 justify-center p-0 h-8" 
          )}
          onClick={() => onNewChat()}
          title={sidebarState === "collapsed" ? "New Chat" : undefined}
        >
          <PlusCircle />
          {sidebarState === "expanded" && <span>New Chat</span>}
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <ScrollArea className="h-full">
          <SidebarMenu className="p-2">
            {sortedSessions.map((session) => (
              <SidebarMenuItem key={session.id} className="relative group/menu-item">
                {renamingId === session.id && sidebarState === "expanded" ? (
                  <div className="flex items-center gap-1 p-1 w-full">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename();
                        if (e.key === 'Escape') cancelRename();
                      }}
                      className="h-8 flex-grow bg-background"
                      autoFocus
                    />
                    <Button variant="ghost" size="icon" onClick={commitRename} className="h-8 w-8">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={cancelRename} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <SidebarMenuButton
                      onClick={() => handleSelectSession(session.id)}
                      isActive={session.id === currentSessionId}
                      className="w-full text-left pr-16" // Added padding-right to make space for absolute buttons
                      tooltip={{ children: session.name, side: 'right', align: 'start' }}
                    >
                      <div className="flex flex-1 items-center gap-2 overflow-hidden min-w-0">
                         <MessageSquare />
                         {sidebarState === "expanded" && <span className="truncate">{session.name}</span>}
                      </div>
                    </SidebarMenuButton>
                    
                    {sidebarState === "expanded" && (
                       <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex shrink-0 items-center">
                         <Button asChild variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); startRename(session);}} className="h-7 w-7 p-1">
                           <span><Edit3 className="h-4 w-4" /></span>
                         </Button>
                         <Dialog>
                            <DialogTrigger asChild>
                              <Button asChild variant="ghost" size="icon" onClick={(e) => e.stopPropagation()} className="h-7 w-7 p-1 hover:bg-destructive/10 hover:text-destructive">
                                <span><Trash2 className="h-4 w-4" /></span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Chat?</DialogTitle>
                              </DialogHeader>
                              <p>Are you sure you want to delete the chat "{session.name}"?</p>
                              <DialogFooter>
                                 <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                 </DialogClose>
                                 <DialogClose asChild>
                                  <Button variant="destructive" onClick={() => onDeleteSession(session.id)}>Delete</Button>
                                 </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                         </Dialog>
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
