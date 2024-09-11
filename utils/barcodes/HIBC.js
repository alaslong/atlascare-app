// Utility function to format dates
const formatDateString = (dateString, format) => {
  const padZero = (num, size) => num.toString().padStart(size, '0');

  const julianToDate = (year, dayOfYear) => {
    const date = new Date(year, 0); // Start from January 1st of the given year
    date.setDate(dayOfYear); // Set the date to the day of the year
    return date;
  };

  switch (format) {
    case 'MMYY': {
      const month = dateString.slice(0, 2);
      const year = '20' + dateString.slice(2);
      return `${year}-${padZero(month, 2)}-01`;
    }
    case 'MMDDYY': {
      const month = dateString.slice(0, 2);
      const day = dateString.slice(2, 4);
      const year = '20' + dateString.slice(4);
      return `${year}-${padZero(month, 2)}-${padZero(day, 2)}`;
    }
    case 'YYMMDD': {
      const year = '20' + dateString.slice(0, 2);
      const month = dateString.slice(2, 4);
      const day = dateString.slice(4, 6);
      return `${year}-${padZero(month, 2)}-${padZero(day, 2)}`;
    }
    case 'YYMMDDHH': {
      const year = '20' + dateString.slice(0, 2);
      const month = dateString.slice(2, 4);
      const day = dateString.slice(4, 6);
      return `${year}-${padZero(month, 2)}-${padZero(day, 2)}`;
    }
    case 'YYJJJ': {
      const year = '20' + dateString.slice(0, 2);
      const dayOfYear = parseInt(dateString.slice(2), 10);
      const date = julianToDate(year, dayOfYear);
      return `${date.getFullYear()}-${padZero(date.getMonth() + 1, 2)}-${padZero(date.getDate(), 2)}`;
    }
    case 'YYJJJHH': {
      const year = '20' + dateString.slice(0, 2);
      const dayOfYear = parseInt(dateString.slice(2, 5), 10);
      const date = julianToDate(year, dayOfYear);
      return `${date.getFullYear()}-${padZero(date.getMonth() + 1, 2)}-${padZero(date.getDate(), 2)}`;
    }
    case 'YYYYMMDD': {
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);
      return `${year}-${padZero(month, 2)}-${padZero(day, 2)}`;
    }
    default:
      return dateString;
  }
};

// Parse HIBC Barcode
const parseHIBC = (input) => {
  const result = {
    lic: null,
    productNumber: null,
    expiryDate: null,
    batchNumber: null,
    manufactured: null,
    serialNumber: null
  };

  // Check if input starts with '+' to identify a valid HIBC barcode
  if (input.startsWith('+')) {
    result.lic = input.slice(1, 5); // Extract License Number (LIC)
    const productNumberEnd = input.indexOf('/', 5);
    result.productNumber = input.slice(5, productNumberEnd - 1); // Extract Product Number

    // Split the input string into parts based on '/'
    const parts = input.split('/');

    parts.forEach(part => {
      // Handle date and batch information
      if (part.startsWith('$$')) {
        const identifier = part[2];
        const dateString = part.slice(3);
        switch (identifier) {
          case '2': // MMDDYY expiry format
            result.expiryDate = formatDateString(dateString.slice(0, 6), 'MMDDYY');
            result.batchNumber = dateString.slice(6);
            break;
          case '3': // YYMMDD expiry format
            result.expiryDate = formatDateString(dateString.slice(0, 6), 'YYMMDD');
            result.batchNumber = dateString.slice(6);
            break;
          case '4': // YYMMDDHH expiry format
            result.expiryDate = formatDateString(dateString.slice(0, 8), 'YYMMDDHH');
            result.batchNumber = dateString.slice(8);
            break;
          case '5': // YYJJJ expiry format
            result.expiryDate = formatDateString(dateString.slice(0, 5), 'YYJJJ');
            result.batchNumber = dateString.slice(5);
            break;
          case '6': // YYJJJHH expiry format
            result.expiryDate = formatDateString(dateString.slice(0, 7), 'YYJJJHH');
            result.batchNumber = dateString.slice(7);
            break;
          case '7': // Batch number without expiry
            result.batchNumber = part.slice(3);
            break;
          default:
            result.expiryDate = formatDateString(part.slice(2, 6), 'MMYY');
            result.batchNumber = part.slice(6);
        }
      } else if (part.startsWith('$+')) {
        result.serialNumber = part.slice(2); // Serial Number
      } else if (part.startsWith('$')) {
        result.batchNumber = part.slice(1); // Batch Number
      } else if (part.startsWith('16D')) {
        result.manufactured = formatDateString(part.slice(3), 'YYYYMMDD'); // Manufactured Date
      } else if (part.startsWith('14D')) {
        result.expiryDate = formatDateString(part.slice(3), 'YYYYMMDD'); // Expiry Date
      } else if (part.startsWith('/S')) {
        result.serialNumber = part.slice(2); // Serial Number
      }
    });
  }

  return result;
};

export default parseHIBC;
