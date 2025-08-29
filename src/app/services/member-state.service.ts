import { Injectable, signal } from '@angular/core';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberStateService {
  private currentMember = signal<Member | null>(null);
  
  readonly currentMember$ = this.currentMember.asReadonly();
  
  setCurrentMember(member: Member | null): void {
    this.currentMember.set(member);
  }
  
  clearCurrentMember(): void {
    this.currentMember.set(null);
  }
}