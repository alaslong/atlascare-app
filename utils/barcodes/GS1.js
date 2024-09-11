// Based on https://github.com/PeterBrockfeld/BarcodeParser

const parseGS1 = (barcode) => {

  const fncChar = String.fromCharCode(29);
  const symbologyIdentifier = barcode.slice(0, 3);
  let restOfBarcode = "";
  const result = {
    productNumber: null,
    expiryDate: null,
    batchNumber: null,
    manufactured: null,
    serialNumber: null,
    variant: null,
  };
  let answer = [];

  // Identifies the AI (application identifier) at the start of the provided codestring and returns

  function identifyAI(codestring) {
    const firstNumber = codestring.slice(0, 1);
    const secondNumber = codestring.slice(1, 2);
    let thirdNumber = "";
    let fourthNumber = "";
    let codestringToReturn = "";
    const codestringLength = codestring.length;

    // Removes leading FNC characters from a string.

    function cleanCodestring(stringToClean) {
      let firstChar = stringToClean.slice(0, 1);
      while (firstChar === fncChar) {
        stringToClean = stringToClean.slice(1);
        firstChar = stringToClean.slice(0, 1);
      }
      return stringToClean;
    }

    // Parses a date in the format "YYMMDD".

    function parseDate(ai) {
      const offSet = ai.length;
      const dateYYMMDD = codestring.slice(offSet, offSet + 6);

      const yearAsNumber = parseInt(dateYYMMDD.slice(0, 2), 10);
      const monthAsNumber = parseInt(dateYYMMDD.slice(2, 4), 10) - 1;
      const dayAsNumber = parseInt(dateYYMMDD.slice(4, 6), 10);

      const year = yearAsNumber > 50 ? yearAsNumber + 1900 : yearAsNumber + 2000;
      result.expiryDate = `${year}-${monthAsNumber + 1}-${dayAsNumber}`;
      codestringToReturn = codestring.slice(offSet + 6);
    }

    // Parses a fixed-length GS1 format.

    function parseFixedLength(ai, title, length) {
      const offSet = ai.length;
      if (ai === "20") {
        result.variant = codestring.slice(offSet, length + offSet);
      } else {
        result.productNumber = codestring.slice(offSet, length + offSet);
      }
      codestringToReturn = codestring.slice(length + offSet);
    }

    // Parses a variable-length GS1 format, including those that may be terminated by FNC1.

    function parseVariableLength(ai) {
      const offSet = ai.length;
      const posOfFNC = codestring.indexOf(fncChar);
      const parseEnd = posOfFNC === -1 ? codestringLength : posOfFNC;

      if (ai === "10") {
        result.batchNumber = codestring.slice(offSet, parseEnd);
      } else if (ai === "21") {
        result.serialNumber = codestring.slice(offSet, parseEnd);
      }

      codestringToReturn = posOfFNC === -1 ? "" : codestring.slice(posOfFNC + 1);
    }

    // Switch statement that attempts to identify an AI based on the first few digits.

    switch (firstNumber) {
      case "0":
        switch (secondNumber) {
          case "0":
            parseFixedLength("00", "SSCC", 18);
            break;
          case "1":
            parseFixedLength("01", "GTIN", 14);
            break;
          case "2":
            parseFixedLength("02", "CONTENT", 14);
            break;
          default:
            throw "01";
        }
        break;
      case "1":
        switch (secondNumber) {
          case "0":
            parseVariableLength("10");
            break;
          case "1":
            parseDate("11");
            break;
          case "2":
            parseDate("12");
            break;
          case "5":
            parseDate("15");
            break;
          case "6":
            parseDate("16");
            break;
          case "7":
            parseDate("17");
            break;
          default:
            throw "02";
        }
        break;
      case "2":
        switch (secondNumber) {
          case "0":
            parseFixedLength("20", "VARIANT", 2);
            break;
          case "1":
            parseVariableLength("21");
            break;
          case "4":
            thirdNumber = codestring.slice(2, 3);
            if (!["0", "1", "2", "3"].includes(thirdNumber)) {
              throw "03";
            }
            break;
          default:
            throw "05";
        }
        break;
      case "3":
        break;
      case "4":
        break;
      case "7":
        break;
      case "8":
        break;
      case "9":
        break;
      default:
        throw "32";
    }

    return {
      element: "",
      codestring: cleanCodestring(codestringToReturn),
    };
  }

  // Parses the symbology identifier if present, and removes it from the barcode string.

  switch (symbologyIdentifier) {
    case "]C1":
    case "]e0":
    case "]e1":
    case "]e2":
    case "]d2":
    case "]Q3":
      restOfBarcode = barcode.slice(3);
      break;
    default:
      restOfBarcode = barcode;
      break;
  }

  // Main loop that parses the barcode element by element using identifyAI.

  while (restOfBarcode.length > 0) {
    try {
      const firstElement = identifyAI(restOfBarcode);
      restOfBarcode = firstElement.codestring;
      answer.push(firstElement.element);
    } catch (e) {
      const errorMap = {
        "01": "invalid AI after '0'",
        "02": "invalid AI after '1'",
        "03": "invalid AI after '24'",
        "05": "invalid AI after '2'",
        "32": "no valid AI",
        "33": "invalid year in date",
        "34": "invalid month in date",
        "35": "invalid day in date",
        "unknown": "unknown error",
      };
      throw errorMap[e] || "unknown error";
    }
  }


  return result;
}

export default parseGS1;