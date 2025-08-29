import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgentDashboardComponent } from './components/agent-dashboard.component';
import { AgentLoginComponent } from './components/agent-login.component';
import { CallManagementComponent } from './components/call-management.component';
import { MemberDetailsComponent } from './components/member-details.component';
import { MemberLookupComponent } from './components/member-lookup.component';
import { AgentSessionService } from './services/agent-session.service';
import { MemberStateService } from './services/member-state.service';
import { MemberService } from './services/member.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    CommonModule, 
    MemberLookupComponent, 
    MemberDetailsComponent, 
    AgentLoginComponent,
    AgentDashboardComponent,
    CallManagementComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private agentSessionService = inject(AgentSessionService);
  private memberService = inject(MemberService);
  private memberStateService = inject(MemberStateService);
  
  protected readonly title = signal('AI Customer Service');
  
  currentAgentSession = this.agentSessionService.currentAgentSession$;
  currentCall = this.agentSessionService.currentCall$;
  isLoggedIn = this.agentSessionService.isLoggedIn;
  isOnCall = this.agentSessionService.isOnCall;
  
  // Computed property to check if a member is identified
  memberIdentified = computed(() => {
    const call = this.currentCall();
    return call?.memberId != null;
  });

  // Get current member from state service
  currentMember = this.memberStateService.currentMember$;

  // Call duration computed property
  callDuration = computed(() => {
    const call = this.currentCall();
    if (!call) return '00:00';
    
    const now = new Date();
    const startTime = new Date(call.startTime);
    const diffMs = now.getTime() - startTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffSeconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
  });

  // End call method
  onEndCall(): void {
    // Delegate to the call management component
    // For now, just end the call directly
    this.agentSessionService.endCall('completed');
  }
}
