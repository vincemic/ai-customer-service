import { computed, Injectable, signal } from '@angular/core';

export interface AgentSession {
  id: string;
  agentName: string;
  loginTime: Date;
  status: 'available' | 'on-call' | 'break' | 'offline';
  totalCalls: number;
  totalCallTime: number; // in milliseconds
}

export interface CallEvent {
  id: string;
  agentSessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in milliseconds
  callType: 'inbound' | 'outbound' | 'transfer';
  outcome: 'completed' | 'transferred' | 'abandoned' | 'pending';
  memberId?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgentSessionService {
  private currentAgentSession = signal<AgentSession | null>(null);
  private currentCall = signal<CallEvent | null>(null);
  private callHistory = signal<CallEvent[]>([]);

  // Read-only signals for components
  readonly currentAgentSession$ = this.currentAgentSession.asReadonly();
  readonly currentCall$ = this.currentCall.asReadonly();
  readonly callHistory$ = this.callHistory.asReadonly();

  // Computed properties
  readonly isLoggedIn = computed(() => this.currentAgentSession() !== null);
  readonly isOnCall = computed(() => this.currentCall() !== null);
  readonly canTakeCall = computed(() => {
    const session = this.currentAgentSession();
    return session !== null && session.status === 'available';
  });

  readonly sessionDuration = computed(() => {
    const session = this.currentAgentSession();
    if (!session) return 0;
    
    return Date.now() - session.loginTime.getTime();
  });

  readonly currentCallDuration = computed(() => {
    const call = this.currentCall();
    if (!call) return 0;
    
    return Date.now() - call.startTime.getTime();
  });

  // Agent session management
  login(agentName: string): AgentSession {
    const session: AgentSession = {
      id: this.generateId(),
      agentName,
      loginTime: new Date(),
      status: 'available',
      totalCalls: 0,
      totalCallTime: 0
    };

    this.currentAgentSession.set(session);
    console.log(`Agent ${agentName} logged in at ${session.loginTime}`);
    return session;
  }

  logout(): void {
    const session = this.currentAgentSession();
    if (!session) return;

    // End any active call before logging out
    if (this.currentCall()) {
      this.endCall('Agent logged out');
    }

    console.log(`Agent ${session.agentName} logged out after ${this.formatDuration(this.sessionDuration())}`);
    
    // Clear session
    this.currentAgentSession.set(null);
    this.currentCall.set(null);
  }

  setAgentStatus(status: AgentSession['status']): void {
    const session = this.currentAgentSession();
    if (session) {
      this.currentAgentSession.set({
        ...session,
        status
      });
    }
  }

  // Call management
  startCall(callType: 'inbound' | 'outbound' | 'transfer' = 'inbound'): CallEvent | null {
    const session = this.currentAgentSession();
    if (!session || this.currentCall()) {
      return null; // Cannot start call if not logged in or already on call
    }

    const call: CallEvent = {
      id: this.generateId(),
      agentSessionId: session.id,
      startTime: new Date(),
      callType,
      outcome: 'pending'
    };

    this.currentCall.set(call);
    
    // Update agent status to on-call
    this.setAgentStatus('on-call');

    console.log(`Call started: ${call.id} (${callType})`);
    return call;
  }

  endCall(notes?: string, outcome: CallEvent['outcome'] = 'completed'): void {
    const call = this.currentCall();
    const session = this.currentAgentSession();
    
    if (!call || !session) return;

    const endTime = new Date();
    const duration = endTime.getTime() - call.startTime.getTime();

    const completedCall: CallEvent = {
      ...call,
      endTime,
      duration,
      outcome,
      notes: notes || call.notes
    };

    // Update call history
    const history = this.callHistory();
    this.callHistory.set([completedCall, ...history]);

    // Update agent session stats
    this.currentAgentSession.set({
      ...session,
      status: 'available',
      totalCalls: session.totalCalls + 1,
      totalCallTime: session.totalCallTime + duration
    });

    // Clear current call
    this.currentCall.set(null);

    console.log(`Call ended: ${call.id} - Duration: ${this.formatDuration(duration)}`);
  }

  updateCallNotes(notes: string): void {
    const call = this.currentCall();
    if (call) {
      this.currentCall.set({
        ...call,
        notes
      });
    }
  }

  setCallMember(memberId: string): void {
    const call = this.currentCall();
    if (call) {
      this.currentCall.set({
        ...call,
        memberId
      });
    }
  }

  // Utility methods
  formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Statistics methods
  getSessionStats() {
    const session = this.currentAgentSession();
    const history = this.callHistory();
    
    if (!session) return null;

    const totalCalls = history.length;
    const completedCalls = history.filter(call => call.outcome === 'completed').length;
    const averageCallTime = totalCalls > 0 
      ? history.reduce((sum, call) => sum + (call.duration || 0), 0) / totalCalls 
      : 0;

    return {
      sessionDuration: this.sessionDuration(),
      totalCalls,
      completedCalls,
      averageCallTime,
      callsPerHour: this.sessionDuration() > 0 
        ? (totalCalls * 3600000) / this.sessionDuration() 
        : 0
    };
  }
}