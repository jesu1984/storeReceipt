const storeReciets = require('../test/testData/StoreReceipt.json');
class Helper{

    constructor(){}

    getItems(receiptNumber){
        const receipt = storeReciets.find(obj => {
             return obj.receiptNumber === receiptNumber  // find storeReceipt using receiptNumber
           })
           if(receipt){
            return receipt.items; // If present return the storeReceipt
           } else {
               return []; // else return empty storeReceipt object
           }
           
     }

     mostSoldItem(receiptNumbers) {
        let totalItems = [];
        // Get all items in each receipts
        if(receiptNumbers.length > 0){
            receiptNumbers = [...new Set(receiptNumbers)]; // remove duplicate 
        }
        receiptNumbers.forEach(element => {
            this.getItems(element).forEach(value => {
                totalItems.push(value);
            })
        });
        //  Keep count of total number of each items
        let numberOfItemsCounter = {};
        if(totalItems.length >0){
            totalItems.forEach(function(obj) {
                // keep counter on number of items that been sold. If items is not present it will be 0+1 and if its presnet than it will be item count + 1
                // if item has negative check if same item exist with positive than decrement the numberOfItemsCounter else increment
                if(obj.itemPrice < 0 && totalItems.some(eachItem => eachItem.itemId === obj.itemId && eachItem.itemPrice > 0)){
                    numberOfItemsCounter[obj.itemId] = numberOfItemsCounter[obj.itemId] - 1;
                } else {
                    numberOfItemsCounter[obj.itemId] = (numberOfItemsCounter[obj.itemId] || 0) + 1;
                }
                
            })
            // Get itemId having max count from all items. 
            return  Object.keys(numberOfItemsCounter).reduce((a, b) => numberOfItemsCounter[a] > numberOfItemsCounter[b] ? a : b);

        } else {
            return "No item found"   // if invalid receiptNumbers are provided we need to return no item found
        }
        
    }

    groupReceiptByDay(AllReceiptsArray){
        return Object.values(
            AllReceiptsArray.reduce((a, o) => {
              const day = o.timeStamp.split(",")[0]; //split timeStamp to access the date
              a[day]=a[day]||[]; // assign date to existing array if present or else start a new array for new date
              a[day].push({ ...o }); // push receipt object into the array
              return a;
            }, {}))
    }

}
module.exports = Helper;
