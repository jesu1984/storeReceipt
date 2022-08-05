const assert = require('chai').assert;
const storeReciets = require('./testData/StoreReceipt.json');
const Helper = require('./Helper');

const helper = new Helper();
describe('StoreReceipt', () => {
    /*
     * Write test(s) to validate the values of fields of each receipt. Also, all fields should be present for each receipt.
    */
    /*
    This test covers null, undefined and empty as well alphanumeric of size 6: first 3 capital letters and last 3 digits
    */
    it('test storeId property value is valid', () => {
        let errors = [];
        storeReciets.forEach(sr => {
            // check for storeId to make sure its not null or empty or size 6: first 3 capital letters and last 3 digits
            if(sr.storeId === null || sr.storeId === undefined || sr.storeId === "" || !sr.storeId.match("^[A-Z]{3}[0-9]{3}$")){
                errors.push(`storeId should be of alphanumeric of size 6: first 3 capital letters and last 3 digits for receiptNumber = ${sr.receiptNumber} but its was ${sr.storeId}`)

            }
        })
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `The following issues exist with the storeId:${JSON.stringify(errors, null, 2)}`)
        
    });
    /*
     * This test covers null, undefined and empty as well digit of size 5 
    */
    it('test pinCode property value is valid', () => {
        let errors = [];
        storeReciets.forEach(sr => {
            // check for pinCode to make sure its not null or empty or 5 digit number
            if(sr.pinCode === null || sr.pinCode === undefined || sr.pinCode === "" || !sr.pinCode.toString().match("^[0-9]{5}$")){
                errors.push(`pinCode should be of digit of size 5 for receiptNumber = ${sr.receiptNumber} but its was ${sr.pinCode}`)

            }
        })
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `The following issues exist with the pinCode:${JSON.stringify(errors, null, 2)}`)


    });
    /*
     * This test assume first receipt in array is the 1st receipt of the day and we validate accordingly 
     * This test covers null, empty and undefined along with incremental receiptNumber
    */
    it('test receiptNumber property value is valid', () => {
        let errors = [];
        let incremental;
        // group all reciept by day
        let groupedReceiptsByDay = helper.groupReceiptByDay(storeReciets);
        // iterate over each array of groupedReceiptsByDay and check all the conditions
        groupedReceiptsByDay.forEach(obj => {
            obj.forEach((sr, index )=> {
                // make sure receiptNumber is not null, empty, undefined and string.
                if(sr.receiptNumber === null || sr.receiptNumber === undefined || sr.receiptNumber === "" || (typeof sr.receiptNumber !== 'number')){
                    errors.push(`receiptNumber should be a number for storeId = ${sr.storeId} but its was ${sr.receiptNumber}`)
    
                } else if (index === 0 && sr.receiptNumber !== 1 ){ // check if index = 0 and recieptNumber not equal to 1
                    errors.push(`receiptNumber should begin with 1 for storeId = ${sr.storeId} but its was ${sr.receiptNumber}`)
    
                } else if (index === 0 && sr.receiptNumber === 1 ){ // if index = 0 and receiptNumber = 1 than up the incremental counter by 1
                    incremental = sr.receiptNumber;
                } else if (index !== 0 && incremental) { // only go inside for index other than 0 and have incremental value
                    if(incremental !== sr.receiptNumber ){ // check next recieptNumber with incremental value if no match fail
                        errors.push(`receiptNumber should be incremental by 1 for storeId = ${sr.storeId} but its was ${sr.receiptNumber} and expected value is ${incremental}`);
    
                    }  
                } 
                incremental++ 
            })

        })
        
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `The following issues exist with the receiptNumber:${JSON.stringify(errors, null, 2)}`)
        
    });
    /*
     * This test coves null, empty and undefined along with boundry conditions for timeStamps
    */
    it('test timeStamp property value is valid', () => {
        let errors = [];
        let startDateTime = new Date(2022, 7, 3, 10, 00, 00, 000);
        let endDataTime = new Date(2022, 7, 3, 19, 00, 00, 000);
        let groupedReceiptsByDay = helper.groupReceiptByDay(storeReciets);
        groupedReceiptsByDay.forEach(obj => {
            obj.forEach(sr => {
                // check for timestamp to make sure its not null or empty or type other than date
                if(sr.timeStamp === null || sr.timeStamp === undefined || sr.timeStamp === "" || sr.timeStamp instanceof Date){
                    errors.push(`timeStamp should be valid date and time for receiptNumber = ${sr.receiptNumber} but its was ${sr.timeStamp}`)
                    // check for time between 10 AM and 7 PM
                } else if (new Date(sr.timeStamp).toLocaleTimeString()  < startDateTime.toLocaleTimeString() || new Date(sr.timeStamp).toLocaleTimeString() > endDataTime.toLocaleTimeString()){
                    errors.push(`timeStamp should be betweem 10am and 7pm for receiptNumber = ${sr.receiptNumber} but its was ${sr.timeStamp}`)
    
                }
            })

        })
        
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `The following issues exist with the timeStamp:${JSON.stringify(errors, null, 2)}`)
        
    });
    /*
     * This test coves null, empty and undefined along negative number and floating numbers
    */
    it('test itemsSold property value is valid', () => {
        let errors = [];
        storeReciets.forEach(sr => {
            // check for itemsSold to make sure its not null or empty or type other than number or not a floating number or not a negative numer
            if(sr.itemsSold === null || sr.itemsSold === undefined || sr.itemsSold === "" || (typeof sr.itemsSold !== 'number') || sr.itemsSold < 0 || !sr.itemsSold.toString().match("^-?[0-9]+$")){
                errors.push(`itemsSold should be integer of net count of items sold for receiptNumber = ${sr.receiptNumber} but its was ${sr.itemsSold}`)
            }
        })
        assert.isEmpty(errors, `The following issues exist with the itemsSold:${JSON.stringify(errors, null, 2)}`)
        
    });
    /*
     * This test covers null, empty and undefined. negative numbers are allowed as customer might be issues full refund
    */
    it('test total property value is valid', () => {
        let errors = [];
        storeReciets.forEach(sr => {
            // check for total to make sure its not null or empty or type other than number
            if(sr.total === null || sr.total === undefined || sr.total === "" || (typeof sr.total !== 'number')){
                errors.push(`total should be float of net sales for receiptNumber = ${sr.receiptNumber} but its was ${sr.total}`)
            }
        })
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `The following issues exist with the total:${JSON.stringify(errors, null, 2)}`)
        
    });
    /*
     * This test covers null, empty and undefined along with other condition for items Array and all the element under items
    */
    it('test items property value is valid', () => {
        let errors = [];
        storeReciets.forEach(sr => {
            // check for items array to make sure its not null or empty and size is not zero
            if(sr.items === null || sr.items === undefined || sr.items === "" || sr.items.length === 0){
                errors.push(`items is array of items sold for receiptNumber = ${sr.receiptNumber} but its was ${sr.items}`)
            } else if (sr.items.length > 0){
                sr.items.forEach(item => {
                    // check for items.itemId to make sure its not null or empty or type other than string
                    if(item.itemId === null || item.itemId === undefined || item.itemId === "" || (typeof item.itemId !== 'string')){
                        errors.push(`items.itemId need to be a string value for receiptNumber = ${sr.receiptNumber} but its was ${item.itemId}`)
                    }
                    // check for items.itemPrice to make sure its not null or empty or type other than number
                    if (item.itemPrice === null || item.itemPrice === undefined || item.itemPrice === "" || (typeof item.itemPrice !== 'number')){
                        errors.push(`items.itemPrice need to be a number value for receiptNumber = ${sr.receiptNumber} but its was ${item.itemPrice}`)

                    }
                    // check for items.taxRate to make sure its not null or empty or type other than number or not between 0 and 1
                    if (item.taxRate === null || item.taxRate === undefined || item.taxRate === "" || (typeof item.taxRate !== 'number') || (item.taxRate <= 0 || item.taxRate >= 1) ) {
                        errors.push(`items.taxRate need to be a number value betweem 0 and 1 for receiptNumber = ${sr.receiptNumber} but its was ${item.taxRate}`)
 
                    }
                    // check for items.discount to make sure its not null or empty or type other than number or not between 0 and 1
                    if (item.discount === null || item.discount === undefined || item.discount === "" || (typeof item.discount !== 'number') || (item.discount <= 0 || item.discount >= 1) ) {
                        errors.push(`items.discount need to be a number value betweem 0 and 1 for receiptNumber = ${sr.receiptNumber} but its was ${item.discount}`)
                    }

                })
                

            }
        })
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `The following issues exist with the items:${JSON.stringify(errors, null, 2)}`)
        
    });
    /*
     * This test covers that reciept object has all the properties
    */
    it('test receipts object has all the properties', () => {
        let arr = ["pinCode", "storeId", "receiptNumber", "items", "total", "itemsSold", "timeStamp"]
        let itmarr = ["itemPrice", "itemId", "taxRate", "discount"];
        let errors = []
        storeReciets.forEach(obj => {
                if(arr.every((val) => Object.keys(obj).includes(val))){  // check if arr value matches with receipt object key
                    if(Array.isArray(obj.items) && obj.items.length > 0){ // now check if obj.items is array and lenght is greater than zero
                        obj.items.forEach( itm => {
                            if(!itmarr.every((val) => Object.keys(itm).includes(val))){ // check if itmarr matches with items object in receipt
                                errors.push(`item key is missing or invalid for receipt number ${obj.receiptNumber} and date ${obj.timeStamp}`) 
                            }
                        })
                    }
                }else {
                    errors.push(`key missing for receipt number ${obj.receiptNumber} and date ${obj.timeStamp}`)
                }
        });
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `The following key are missing from the receipt object:${JSON.stringify(errors, null, 2)}`)   
    });

    /* 
     * Write test to validate the count of items sold for each receipt. Which should be >= 0.
     * itemsSold should match with the count of items. Items with -ve price should not be counted.
     *
    */ 
    /*
     * This test is to check total items count matches with itemsSold properties of that receipt
    */
    it('test number of items sold matches with total itemsSold of receipt', () => {
        let errors = []
        storeReciets.forEach(sr => {
            let countOfItemSold = 0
            if(Array.isArray(sr.items) && sr.items.length > 0){
                sr.items.forEach(item =>{
                    if(item.itemPrice > 0){ // discount is between 0 and 1 but never 1 i.e 100% so itemPrice will be always greater than zero.
                        countOfItemSold++   // increase the counter if itemPrice is greater than zero.
                        // if item has negative check if same item exist with positive than decrement the counter
                    } else if (item.itemPrice < 0 && sr.items.some(eachItem => eachItem.itemId === item.itemId && eachItem.itemPrice > 0)) { 
                        countOfItemSold--

                    }
                })
            }
            // check if object itemsSold values matches with countOfItemSold. if not push the receipt object in the errors.
            if(countOfItemSold != sr.itemsSold){ 
                errors.push(`count of items sold is ${countOfItemSold} does not match with itemsSold is ${sr.itemsSold} for receiptNumer = ${sr.receiptNumber}`);
            }
                
        });
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `Following issues with count of items sold test:${JSON.stringify(errors, null, 2)}`)   
    });

    /*
     * Suppose a function exists which returns the most sold item for a given bunch of receipts
     * mostSoldItem(receiptArray []) returns itemId
     * Implement the different scenarios that need to be covered as part of this test.
    */
    /*
     *Test for mostSoldItem function - If valid reiecptNumberArray is passed into the function 
    */
    it('test mostSoldItem function when receiptArray has valid receiptNumber', () => {
        let itemName = helper.mostSoldItem([1, 2]);
        assert.equal(itemName, "XYZ", `function returned ${itemName}`)
    });
    /*
     * Test for mostSoldItem function - If empty reiecptNumberArray is passed into the function 
    */
    it('test mostSoldItem function when receiptArray has empty receiptNumber', () => {
        let itemName = helper.mostSoldItem([]);
        assert.equal(itemName, "No item found", `function returned ${itemName}`)
    });
    /*
     * Test for mostSoldItem function - If duplicate reiecptNumberArray is passed into the function 
    */
    it('test mostSoldItem function when receiptArray has duplicate receiptNumber', () => {
        let itemName = helper.mostSoldItem([1, 1, 2]);
        assert.equal(itemName, "XYZ", `function returned ${itemName}`)
    });
    /*
     * Test for mostSoldItem function - If invalid reiecptNumberArray is passed into the function 
    */
    it('test mostSoldItem function when receiptArray has invalid receiptNumber', () => {
        let itemName = helper.mostSoldItem(["abcd"]);
        assert.equal(itemName, "No item found", `function returned ${itemName}`)
    });
    /*
     * Test for mostSoldItem function - If results has multiple maxSoldItems.
    */
    it('test mostSoldItem function when receiptArray has valid receiptNumber with multiple mostSoldItem items', () => {
        let itemName = helper.mostSoldItem([3, 4]);
        assert.equal(itemName, "PQR", `function returned ${itemName}`)
    });
    
    /*
     * Write test(s) to ensure that receipts in the array are valid
     * No 2 receipts should have the same receipt number on same day
     * No 2 receipts should have a different pinCode or storeId as all the receipts are from same store.
     * 
    */
    /*
     * Test to make sure all receipt should have unique receiptNumber on same day
    */
    it('test all receipts should have unique receiptNumber on same day', () => {
        let errors = [];
        // iterate over each array of groupedReceiptsByDay and check all the conditions
        let groupedReceiptsByDay = helper.groupReceiptByDay(storeReciets);
        groupedReceiptsByDay.forEach((arr) => {
            var tmpArr = [];
            arr.forEach((obj) => {
              if(tmpArr.indexOf(obj.receiptNumber) < 0){ // check if tempArr has receiptNumber if not add it to tempArr or else duplicate 
                    tmpArr.push(obj.receiptNumber); // 
              } else { 
                    errors.push(`Duplicate entry found for receiptNumber ${obj.receiptNumber}`);
                }
               
            });
        
        });
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `Following duplicate receiptNumber are found:${JSON.stringify(errors, null, 2)}`) 
       
    });
    /*
     * Test to make sure all receipt should have same storeId and pinCode for all storeReceipt.
     *
    */
    it('test all receipts should have same storeId and pinCode', () => {
        let errors = [];
        let storeId;
        let pinCode;
        storeReciets.forEach((sr, index) => {
            // we can hardcode storeId and PinCode for given test and check it but fow now I am assuming receieptNumber 1 has valid storeID and pinCode
            if(index === 0 && sr.receiptNumber === 1){ // get the storeId and pinCode of the first receiptNumber and assign it to local variable
                storeId = sr.storeId;
                pinCode = sr.pinCode;
            } else if (index !== 0 && storeId && pinCode ) { // make sure storeId and pinCode is not null and index is not 0 
                if(sr.storeId !== storeId){ // compare storeId with local variable storeId from receiptNumber = 1 if no match push the error under errors
                    errors.push(`Found one unmatched storeId for receiptNumber ${sr.receiptNumber}`);
                }
                if(sr.pinCode !== pinCode){ // compare pinCode with local variable pinCode from receiptNumber = 1 if no match push the error under errors
                    errors.push(`Found one unmatched pinCode for receiptNumber ${sr.receiptNumber}`)
                }

            }
            
        })
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `The following issues exist for storeId or pinCode:${JSON.stringify(errors, null, 2)}`)
    });

    /*
     * Write test to validate the total amount of each receipt.
     * The total should also match the sum of item prices plus any applicable taxes and discounts
     * 
    */
    /*
     * Test for total amount of each receipt matches with sum of item prices.
    */
    it('test sum of item prices matches with total of receipt', () => {
        let errors = []
        storeReciets.forEach(sr => {
            let sumOfItemPrice = 0;
            let items = [];
            if(Array.isArray(sr.items) && sr.items.length > 0){
                sr.items.forEach(function(obj) {
                    // remove item which has positive and negative price 
                    if (obj.itemPrice < 0 || obj.itemPrice > 0 && sr.items.some(eachItem => eachItem.itemId === obj.itemId && eachItem.itemPrice < 0)) {
                        return;
                    } else {
                        items.push(obj);
                    }
                })
                 items.forEach((item) => {
                    // calculate item price with applicable tax and discount
                    let TotalPriceWithTax = (item.itemPrice + item.itemPrice * item.taxRate);
                    finalPrcie = TotalPriceWithTax - (TotalPriceWithTax * item.discount); 
                    // add it to sumofItemPrice 
                    sumOfItemPrice = sumOfItemPrice + finalPrcie;
                }) ; 
            }
            // check if object total values matches with sumOfItemPrice. if not push the receipt object in the errors.
            if(sumOfItemPrice != sr.total){ 
                errors.push(`sum of items price is ${sumOfItemPrice} does not match with total is ${sr.total} for receiptNumer = ${sr.receiptNumber} and date =${sr.timeStamp} `);
            }            
        });
        // Assert the errors to check for empty.
        assert.isEmpty(errors, `Following issues with sum of items price test:${JSON.stringify(errors, null, 2)}`)
    });

})
