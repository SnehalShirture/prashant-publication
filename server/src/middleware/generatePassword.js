const generatePassword = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
  
   
    const part1 = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    const part2 = Array.from({ length: 3 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
    const part3 = Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  
    return `${part1}${part2}${part3}`;
  };
  
  export {generatePassword}