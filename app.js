var budgetController = (function(){
    
     var Expense = function(id, description, value){           //function Constructors(so that we can blueprint)
         
         this.id = id;
         this.description = description;
         this.value = value;
     }
     
      var Income = function(id, description, value){
         
         this.id = id;
         this.description = description;
         this.value = value;
     }
      
      var calculateTotal = function(type){
          
          var sum = 0;
          data.allItems[type].forEach(function(current){   //Looping through each item in the array 
              sum = sum + current.value;  
          });
          
          data.totals[type] = sum;
      };
      
     var data = {
        allItems : {
            exp: [],
            inc: []
        },
        totals : {
            exp: 0,
            inc: 0
     },
         budget: 0,
         percentage: -1
     }; 
    
      return{
          addItem: function(type, des, val){
              var newItem, ID;
            
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
              
              //CREATING NEW ID
              if (data.allItems[type].length > 0){
              ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
              } else {
              ID = 0;
              }
              
              //CREAING NEW ITEM BASED ON 'INC' OR 'EXP'
              if(type === 'inc'){
                  newItem = new Income(ID, des, val);
              }else if(type === 'exp') 
              {
                  newItem = new Expense(ID, des, val);
              }
              
              //PUSHING DATA TO THE ARRAY
              data.allItems[type].push(newItem);
              
              return newItem;
              
          },
          
          deleteItem: function(type, id){
              var ids, index;
                  
              ids = data.allItems[type].map(function(current){
                 return current.id;                                 //returning the ids of current items(inc or exp ids)
                  
              });
          
              index = ids.indexOf(id);                              //getting the index of the id that we passed
          
              if(index !== -1){
                  
                  data.allItems[type].splice(index, 1);             //[index is our postn] and [1 is no of items to delete]
              }
          
          },
          
          calculateBudget: function(){
              
              //calculate total income and expense
              calculateTotal('exp');
              calculateTotal('inc');
              
              //calculate Budget : income - expense
              data.budget = data.totals.inc - data.totals.exp;
                          
              //calculate percentage of income we spent
              if(data.totals.inc > 0){
                  data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
              }else{
                 data.percentage = -1;
              }
              
          },
          
          getBudget: function(){
              return{
                  budget : data.budget,
                  totalInc : data.totals.inc,
                  totalExp : data.totals.exp,
                  percentage : data.percentage  
              }
            
          },
    
         testing: function(){
             console.log(data);
         }
     };
    
})();

var UIController = (function(){
   
        //assigning class names to a variable for the ease of future use
    var DOMStrings = {                                
        InputType: '.add__type',
        InputDescription: '.add__description',
        InputValue: '.add__value',
        AddButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };
    
    return{
        getInput : function(){
          return{
              //getting input from the UI and storing the value of the variable
             type: document.querySelector(DOMStrings.InputType).value,             //either 'inc' or 'exp'        
             description:  document.querySelector(DOMStrings.InputDescription).value,
             value: parseFloat(document.querySelector(DOMStrings.InputValue).value)
            };                                         
            },
        
        adddListItem: function(obj, type){
            
            var html, newHtml, element;
            
            //create HTML string with placehlder text
            if(type === 'inc'){
                 element = DOMStrings.incomeContainer;
                
                 html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            }else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';  
            }
            
            //replace pLACEHOLDER TEXT WITH ACTUAL DATA
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            
            //INSERT HTML TO DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        deleteListItem: function(selectorID){
            
            var el = document.getElementById(selectorID);    // id to delete
            el.parentNode.removeChild(el);                   // slectng that id's parentNode and removing child of id
            
        },
        
        
        clearFields: function(){       //[clearing the input fields so as to enter the new items frshly]
            var fields,fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.InputDescription + ', ' + DOMStrings.InputValue); 
            //returns a list
            
            fieldsArr = Array.prototype.slice.call(fields); //converting the list into an array
            
            fieldsArr.forEach(function(curent, index, array){
                curent.description = '';              //assigning NIL to input boxes by using "foreach"
                curent.value = '';
                
            });
            
            fieldsArr[0].focus(); //reassigning the focus (or cursor) to description box 
        },
        
           displayBudget: function(obj){
            
               document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
               document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
               document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
               
               if(obj.percentage >0){
                  document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'; 
               }else{
                  document.querySelector(DOMStrings.percentageLabel).textContent = '---';
               }
               
               
           },
            getDOMStrings: function(){
                // returning DOMStrigs so as to use in App controller
                return DOMStrings;                     
            }
    };
    
})();

//APPP CONTTROLLER
var controller = (function(budgetCntrl, UICntrl){
    
    var setUpEventListeners = function(){
    
     var DOM =  UICntrl.getDOMStrings();
        
     document.querySelector(DOM.AddButton).addEventListener('click', cntrlAdditem);
     document.addEventListener('keypress', function(event){
      if(event.keyCode === 13){
          cntrlAdditem();          
      }
    });
    
        document.querySelector(DOM.container).addEventListener('click', cntrlDeleteItem);   
    }
    
    var updateBudget = function(){
        
        // 5) calculatee the budget
              budgetCntrl.calculateBudget();
              
        // 6) return budget
              var budget = budgetCntrl.getBudget();
        
        // 7) DIsplay budget on UI
              UICntrl.displayBudget(budget);
              //console.log(budget);
    };
    
    
    var cntrlAdditem = function(){
              var input, newItem;
        
        // 1) GET THE FIELD INPUT DATA
              input = UICntrl.getInput();
              //console.log(input);
              
         if(input.description !== "" && !isNaN(input.value) && input.value > 0){   
                  //so that when data entered into app only when fields are filled
        
        // 2) ADD THE ITEM TO BUDGET CONTROLLER
              newItem = budgetCntrl.addItem(input.type, input.description, input.value);
        
        // 3) Add Item to UI
              UICntrl.adddListItem(newItem, input.type);
        
        // 4) Cleaar input fileds
              UICntrl.clearFields();
        
        // 5) calculate and updtae Budget
              updateBudget();     
    }
    };
    
    var cntrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
                    
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);    
            
            //1) DELETE ITEM FROM BUDGET CONTROLLER
                 budgetCntrl.deleteItem(type, ID);
                 
            //2) DELETE ITEM FROM UI
                 UICntrl.deleteListItem(itemID);
            
            //3) UPDATE THE CONTROLLEER
                 updateBudget();
            
        }
    };

    
    return{
        init: function(){
        console.log('startedd');
        UICntrl.displayBudget({
            budget : 0,
            totalInc : 0,
            totalExp : 0,
            percentage : -1  
            
        })
            
          //starting the program by calling event listeners
        setUpEventListeners();        
            
        }
    };
    
    
})(budgetController, UIController);


controller.init(); 