import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AgentSessionService } from '../services/agent-session.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css'],
  imports: [CommonModule]
})
export class AgentDashboardComponent implements OnInit, OnDestroy {
  private agentSessionService = inject(AgentSessionService);
  private updateInterval?: number;

  currentSession = this.agentSessionService.currentAgentSession$;
  currentCall = this.agentSessionService.currentCall$;
  isOnCall = this.agentSessionService.isOnCall;
  canTakeCall = this.agentSessionService.canTakeCall;

  showLogoutModal = signal(false);
  
  // Real-time session duration
  sessionDuration = computed(() => {
    const session = this.currentSession();
    if (!session) return '00:00:00';
    
    const duration = this.agentSessionService.sessionDuration();
    return this.formatDuration(duration);
  });

  // Real-time call duration
  callDuration = computed(() => {
    const call = this.currentCall();
    if (!call) return '00:00:00';
    
    const duration = this.agentSessionService.currentCallDuration();
    return this.formatDuration(duration);
  });

  // Session statistics
  sessionStats = computed(() => {
    return this.agentSessionService.getSessionStats();
  });

  ngOnInit(): void {
    // Update durations every second
    this.updateInterval = window.setInterval(() => {
      // Force recomputation by accessing computed values
      this.sessionDuration();
      if (this.isOnCall()) {
        this.callDuration();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  // Call management
  onStartCall(): void {
    this.agentSessionService.startCall('inbound');
  }

  onEndCall(): void {
    this.agentSessionService.endCall();
  }

  onStartOutboundCall(): void {
    this.agentSessionService.startCall('outbound');
  }

  // Status management
  onSetAvailable(): void {
    this.agentSessionService.setAgentStatus('available');
  }

  onSetBreak(): void {
    this.agentSessionService.setAgentStatus('break');
  }

  onSetOffline(): void {
    this.agentSessionService.setAgentStatus('offline');
  }

  // Logout
  onLogout(): void {
    this.showLogoutModal.set(true);
  }

  confirmLogout(): void {
    this.agentSessionService.logout();
    this.showLogoutModal.set(false);
  }

  cancelLogout(): void {
    this.showLogoutModal.set(false);
  }

  // Utility methods
  formatTime(date: Date): string {
    return this.agentSessionService.formatTime(date);
  }

  private formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available': return 'var(--success)';
      case 'on-call': return 'var(--warning)';
      case 'break': return 'var(--secondary-blue)';
      case 'offline': return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  }
}