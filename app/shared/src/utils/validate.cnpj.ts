const verifyDigit = (cnpj: string, digits: number): number => {
  let sum: number = 0;
  const numbersToMultiply = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const numbersToMultiply2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  if (digits === 2) {
    for (let i = 0; i < cnpj.length - digits; i++) {
      let digit = Number(cnpj[i]);

      sum += digit * numbersToMultiply[i]!;
    }
  }

  if (digits === 1) {
    for (let i = 0; i < cnpj.length - digits; i++) {
      let digit = Number(cnpj[i]);

      sum += digit * numbersToMultiply2[i]!;
    }
  }

  return sum;
};

export const validateCnpj = (cnpj: string): boolean => {
  if (cnpj === cnpj.at(0)?.repeat(14)) return false;

  const thirteenthDigit: number = Number(cnpj.at(12));
  const fourteenthDigit: number = Number(cnpj.at(-1));
  let thirteenDigitDivision: number = 0;
  let fourteenDigitDivision: number = 0;

  const thirteenthDigitSum: number = verifyDigit(cnpj, 2);
  const fourteenthDigitSum: number = verifyDigit(cnpj, 1);

  if (thirteenthDigitSum % 11 < 2) {
    thirteenDigitDivision = 0;
  } else {
    thirteenDigitDivision = 11 - (thirteenthDigitSum % 11);
  }

  if (fourteenthDigitSum % 11 < 2) {
    fourteenDigitDivision = 0;
  } else {
    fourteenDigitDivision = 11 - (fourteenthDigitSum % 11);
  }

  return (
    thirteenDigitDivision === thirteenthDigit &&
    fourteenDigitDivision === fourteenthDigit
  );
};
