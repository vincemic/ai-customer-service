import { Injectable, signal } from '@angular/core';
import { CallSession, Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class CallSessionService {
  private currentSession = signal<CallSession | null>(null);
  
  // Read-only signals for components
  readonly currentSession$ = this.currentSession.asReadonly();

  startCall(agent: string): CallSession {
    const session: CallSession = {
      id: this.generateId(),
      startTime: new Date(),
      callNotes: '',
      status: 'active',
      agent
    };
    
    this.currentSession.set(session);
    return session;
  }

  setMember(member: Member): void {
    const session = this.currentSession();
    if (session) {
      this.currentSession.set({
        ...session,
        member
      });
    }
  }

  updateCallNotes(notes: string): void {
    const session = this.currentSession();
    if (session) {
      this.currentSession.set({
        ...session,
        callNotes: notes
      });
    }
  }

  endCall(finalNotes?: string): void {
    const session = this.currentSession();
    if (session) {
      this.currentSession.set({
        ...session,
        endTime: new Date(),
        status: 'completed',
        callNotes: finalNotes || session.callNotes
      });
      
      // Save to history (in a real app, this would go to a backend)
      this.saveCallToHistory(session);
      
      // Clear current session
      setTimeout(() => {
        this.currentSession.set(null);
      }, 2000); // Show completed state for 2 seconds
    }
  }

  private saveCallToHistory(session: CallSession): void {
    // In a real application, this would save to a backend service
    console.log('Call session saved:', session);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}