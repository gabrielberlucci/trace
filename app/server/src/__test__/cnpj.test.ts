import { validateCnpj } from '@/utils';
import { describe, it, expect } from 'vitest';

describe('Check if CNPJ is valid or not', () => {
  it('Expects that return false for this CNPJ', () => {
    expect(validateCnpj('111111111111111')).toBe(false);
  });

  it('Expects that return false for this CNPJ', () => {
    expect(validateCnpj('56679108100130')).toBe(false);
  });

  it('Expects that return true for this CNPJ', () => {
    expect(validateCnpj('17079179000117')).toBe(true);
  });
});
