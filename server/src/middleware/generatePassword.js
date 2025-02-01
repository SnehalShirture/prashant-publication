import crypto from 'crypto';

const generatePassword = () => {
  return Array.from({ length: 8 }, (_, i) => {
    if (i < 3 || i > 5) {
      // Generate lowercase letters 
      return String.fromCharCode(crypto.randomInt(97, 123));
    } else {
      // Generate digits 
      return String.fromCharCode(crypto.randomInt(48, 58));
    }
  }).join('');
};

export {generatePassword}

