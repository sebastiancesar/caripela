/**
 * Dummy class for handling Ids pretty similar to UUID
 */
export class SessionService {

  private sessionId: string;

  constructor() {
    try {
      this.sessionId = this.getSession();
    } catch (err) {
      this.sessionId = this.generateId();
      this.setSession(this.sessionId);
    }
  }

  generateId(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  setSession(sessionId: string) {
    localStorage.setItem('caripela_session', sessionId);
  }

  getSession(): string {
    const sessionId = localStorage.getItem('caripela_session');
    if (!sessionId) {
      throw new Error('No session created!');
    }
    return sessionId;
  }
}
