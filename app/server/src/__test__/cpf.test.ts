import { validateCpf } from '@/utils';
import { describe, it, expect } from 'vitest';

describe('Check if CPF is valid or not', () => {
  it('Expects that return false for this CPF', () => {
    expect(validateCpf('11111111111')).toBe(false);
  });

  it('Expects that return false for this CPF', () => {
    expect(validateCpf('50783128069')).toBe(false);
  });

  it('Expects that return true for this CPF', () => {
    expect(validateCpf('23778692038')).toBe(true);
  });
});
