/*
* sum cpf digits

* @param verifyDigitValue - controls the logic of weight: if you want to validate the sum of first digit,
* pass the value 0; if you want to validate the sum of last digit, pass the value 1
* 
* @param cpf - user's CPF
* @param digits - indicates the which digit you want to validate,
* pass the value 1 if you want to validate 10th digit;
* pass the value 2 if you want to validate 11th digit
* 
* @exemples
* verifyDigits(0, cpf, 2); // returns 295
* verifyDigits(1, cpf, 1); // returns 347
*/

const verifyDigits = (
  verifyDigitValue: number,
  cpf: string,
  digits: number,
): number => {
  let sum: number = 0;

  for (let i: number = 0; i < cpf.length - digits; i++) {
    let weight = 10 + verifyDigitValue - i;
    let digit = Number(cpf[i]);

    sum += digit * weight;
  }

  return sum;
};

export const validateCpf = (cpf: string): boolean => {
  const tenthDigit = Number(cpf.at(9));
  const eleventhDigit = Number(cpf.at(-1));
  let tenthDigitDivision = 0;
  let eleventhDigitDivision = 0;

  if (cpf === cpf[0]!.repeat(11)) return false;

  const tenthDigitSum = verifyDigits(0, cpf, 2);
  const eleventhDigitSum = verifyDigits(1, cpf, 1);

  tenthDigitDivision += (tenthDigitSum * 10) % 11;
  eleventhDigitDivision += (eleventhDigitSum * 10) % 11;

  if (tenthDigitDivision === 10) tenthDigitDivision = 0;
  if (eleventhDigitDivision === 10) eleventhDigitDivision = 0;

  return (
    tenthDigitDivision === tenthDigit && eleventhDigitDivision === eleventhDigit
  );
};
