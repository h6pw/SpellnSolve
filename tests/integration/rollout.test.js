import { it, expect } from 'vitest';
import { changeRollout } from '../../scripts/pages.mjs';
const a='a'.repeat(40), b='b'.repeat(40);
it('promoção azul-verde guarda a versão anterior',()=>expect(changeRollout({estavel:a},'promote',b)).toMatchObject({estavel:b,anterior:a,percentual:0}));
it('rollback restaura a versão sem recompilar',()=>expect(changeRollout({estavel:b,anterior:a},'rollback')).toMatchObject({estavel:a,anterior:b}));
it('primeira publicação não inventa rollback',()=>expect(()=>changeRollout({estavel:a},'rollback')).toThrow());
it('promoção rejeita ponteiro inválido',()=>expect(()=>changeRollout({},'promote','../')).toThrow());
