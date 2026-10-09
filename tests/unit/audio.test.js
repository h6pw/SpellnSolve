import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAudio } from '../../src/game/audio.js';

function fakeContext() {
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn(), cancelScheduledValues: vi.fn() });
  const gains = [];
  const context = {
    currentTime: 0, state: 'running', destination: {},
    createGain: () => { const gain={gain:param(),connect:vi.fn(),disconnect:vi.fn()};gains.push(gain);return gain; },
    createOscillator: vi.fn(() => ({ frequency: param(), connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn() })),
    suspend: vi.fn(async () => { context.state = 'suspended'; }),
    resume: vi.fn(async () => { context.state = 'running'; }),
    close: vi.fn(async () => { context.state = 'closed'; }),
  };
  return { context, gains };
}
afterEach(() => vi.useRealTimers());
describe('áudio da partida', () => {
  it('não cria contexto antes de Jogar e funciona sem suporte de áudio', () => {
    const make = vi.fn(() => null);const audio=createAudio(null,make);
    expect(make).not.toHaveBeenCalled();expect(audio.start()).toBe(false);audio.stop();
  });
  it('reinício não duplica o agendador e parar libera o timer', async () => {
    vi.useFakeTimers();const {context}=fakeContext();const audio=createAudio(null,()=>context);
    audio.start();expect(vi.getTimerCount()).toBe(1);audio.start();expect(vi.getTimerCount()).toBe(1);
    audio.stop();expect(vi.getTimerCount()).toBe(0);await audio.dispose();expect(context.close).toHaveBeenCalledOnce();
  });
  it('música e efeitos são controlados separadamente', async () => {
    vi.useFakeTimers();const {context,gains}=fakeContext();const audio=createAudio(null,()=>context);
    audio.start();audio.setMusic(false);expect(vi.getTimerCount()).toBe(0);
    const before=context.createOscillator.mock.calls.length;audio.effect('correct');
    expect(context.createOscillator.mock.calls.length).toBeGreaterThan(before);
    audio.setEffects(false);expect(gains[2].gain.setTargetAtTime).toHaveBeenLastCalledWith(0,0,0.02);
    const muted=context.createOscillator.mock.calls.length;audio.effect('life');expect(context.createOscillator).toHaveBeenCalledTimes(muted);
    await audio.dispose();
  });
  it('aba oculta suspende áudio e retorno restaura música', async () => {
    vi.useFakeTimers();const {context}=fakeContext();const audio=createAudio(null,()=>context);
    audio.start();audio.setHidden(true);expect(context.suspend).toHaveBeenCalledOnce();expect(vi.getTimerCount()).toBe(0);
    audio.setHidden(false);await Promise.resolve();expect(context.resume).toHaveBeenCalledOnce();expect(vi.getTimerCount()).toBe(1);
    await audio.dispose();
  });
  it('persiste mute e volume entre partidas e rejeita preferências corrompidas', () => {
    let value=null;const storage={getItem:()=>value,setItem:(_key,raw)=>{value=raw;}};
    const audio=createAudio(storage);audio.setMusic(false);audio.setEffects(false);audio.setVolume(0.25);
    expect(createAudio(storage).preferences).toEqual({music:false,effects:false,volume:0.25});
    value='{"music":true,"effects":true,"volume":99}';expect(createAudio(storage).preferences.volume).toBe(0.6);
  });
});
