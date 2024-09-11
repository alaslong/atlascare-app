import isNaN from 'lodash/isNaN';
import parseGS1 from './GS1';
import parseHIBC from './HIBC';

// Determine the type of barcode and apply the correct parser
const parseBarcode = (input) => {
    console.log("barcode input: " + input);

    // Check for HIBC barcode
    if (input.startsWith('+')) {
        return parseHIBC(input);
    }
    
    // Check for GS1 barcode (greater than 13 digits and starts with '0')
    if (input.length > 13 && input.startsWith('0')) {
        console.log('This is a GS1 barcode');
        return parseGS1(input);
    }

    // Check for GTIN-13 barcode (13 digits and starts with a number)
    if (!isNaN(Number(input.charAt(0))) && input.length === 13) {
        console.log('This is a GTIN-13 barcode');
        return { productNumber: input };
    }

    // Check for product number (less than 13 digits and starts with a number)
    if (!isNaN(Number(input.charAt(0))) && input.length < 13) {
        console.log('This is a Product Number');
        return { productNumber: input };
    }

    // Invalid barcode format
    console.log('Invalid barcode format');
    return { error: "invalid format" };
};

export default parseBarcode;
