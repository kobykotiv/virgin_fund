class SoundEffects {
  private static instance: SoundEffects;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  private constructor() {
    this.initializeSounds();
  }

  public static getInstance(): SoundEffects {
    if (!SoundEffects.instance) {
      SoundEffects.instance = new SoundEffects();
    }
    return SoundEffects.instance;
  }

  private initializeSounds() {
    // Trade sounds
    this.sounds.trade = new Audio('/sounds/trade.mp3');
    this.sounds.profit = new Audio('/sounds/profit.mp3');
    this.sounds.loss = new Audio('/sounds/loss.mp3');
    this.sounds.milestone = new Audio('/sounds/milestone.mp3');
    this.sounds.error = new Audio('/sounds/error.mp3');

    // Set volume levels
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.5;
    });
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(volume: number) {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = normalizedVolume;
    });
  }

  public getVolume(): number {
    // Get the volume of any sound (they all share the same volume)
    const sound = Object.values(this.sounds)[0];
    return sound?.volume || 0;
  }

  public async playSound(type: keyof typeof this.sounds) {
    if (!this.enabled) return;

    try {
      const sound = this.sounds[type];
      if (sound) {
        sound.currentTime = 0;
        await sound.play();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  public playTradeSound(profitLoss: number | null) {
    if (profitLoss === null) {
      this.playSound('trade');
    } else if (profitLoss > 0) {
      this.playSound('profit');
    } else {
      this.playSound('loss');
    }
  }
}

export const soundEffects = SoundEffects.getInstance();
