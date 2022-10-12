$(document).ready(function () {
    loadItems();
    addMoney();
    makePurchase();
    returnChange();
   // showHideChangebutton();
});

var currentMoney = 0.00;
$('#currentMoney').empty();
$('#currentMoney').val(parseFloat(currentMoney).toFixed(2))

function loadItems() {
    var itemRows = $('#itemRows');
    $('#itemRows').empty();
    $.ajax({
        type: 'GET',
        url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
        success: function(itemArray) {
        
            $.each(itemArray, function(index, item){
                var itemId = item.id;
                var row = '<div class="card-deck mb-3 text-center">';
                    row += '<div class="card" onclick="selectItem(' + itemId + ')">';
                    row += '<div id="id">' + itemId + '</div>';
                    row += '<div class="card-body">'
                    row += '<h3 class="card-title">' + item.name + '</h3>';
                    row += '<p class="card-text">$' +item.price + '</p>';
                    row += '<p>Quantity Left: ' +item.quantity + '</p>';
                    row += '</div>';
                    row += '</div>';
                    row += '</div>';
                    itemRows.append(row);
            })
        },
        error: function() {
        
        }
    })
}

function addMoney(){

    currentMoney = 0.00;
    $('#currentMoney').val(parseFloat(currentMoney).toFixed(2))

$('#addDollar').click(function (event) {
      currentMoney = currentMoney + 1.00;
      $('#currentMoney').empty();
      $('#currentMoney').val(parseFloat(currentMoney).toFixed(2));

})
$('#addQuarter').click(function (event) {
    currentMoney = currentMoney + 0.25;
    $('#currentMoney').empty();
    $('#currentMoney').val(parseFloat(currentMoney).toFixed(2));

})

$('#addDime').click(function (event) {
    currentMoney = currentMoney + 0.10;
    $('#currentMoney').empty();
    $('#currentMoney').val(parseFloat(currentMoney).toFixed(2));

})
$('#addNickel').click(function (event) {
    currentMoney = currentMoney + 0.05;
    $('#currentMoney').empty();
    $('#currentMoney').val(parseFloat(currentMoney).toFixed(2));

})
}


function selectItem(itemId){
        $('#itemId').empty();
        $('#itemId').val(itemId);
 
}

function makePurchase(){
    $('#makePurchase').click(function (event) {
        currentMoney = $('#currentMoney').val();
        var item = $('#itemId').val();
        $.ajax({
            type: 'POST',
            url: 'http://vending.us-east-1.elasticbeanstalk.com/money/'+currentMoney+'/item/'+item,
            success: function(changeInCoins) {
               $('#purchaseMessage').empty();
               $('#purchaseMessage').val('Thank You!!');
               
               var moneyChange = $('#moneyChange');
               var row = ''
            if(changeInCoins.quarters != 0){
                  row += changeInCoins.quarters + ' Quaters ';
               }
            if(changeInCoins.dimes != 0){
                row += changeInCoins.dimes + ' Dime ';
             }
             if(changeInCoins.nickels != 0){
                row += changeInCoins.nickels + ' Nickels ';
             }
             if(changeInCoins.pennies != 0){
                row += changeInCoins.pennies + ' Pennies ';
             }

             moneyChange.empty();
             moneyChange.val(row);
             loadItems();
             currentMoney = 0.00;
             $('#currentMoney').empty();
             $('#currentMoney').val(parseFloat(currentMoney).toFixed(2))

            },
            error: function(error) {
               var  a = $.parseJSON(error.responseText);
               $('#purchaseMessage').empty();
               $('#purchaseMessage').val(a.message);
               
            }
        })
    })
}

function returnChange(){
    $('#returnChange').click(function (event) {

        // Declare
        currentMoney = $('#currentMoney').val();
        var moneyChange = $('#moneyChange');
        var moneyInPennies = currentMoney * 100;
        var quaters;
        var dime;
        var nickels;
        var pennies;
        var row = "";

        // Quaters
        quaters= parseFloat(moneyInPennies/25).toFixed(0);
        moneyInPennies = moneyInPennies % 25;
        
        //Dime
        dime =parseFloat(moneyInPennies/10).toFixed(0);
        moneyInPennies = moneyInPennies % 10;

        //nickels
        nickels = parseFloat(moneyInPennies/5).toFixed(0);
        moneyInPennies = moneyInPennies % 5;

        //pennies
        pennies = parseFloat(moneyInPennies/1).toFixed(0);
        moneyInPennies = moneyInPennies % 1;

        // Create 
        var row = "";
        if(quaters != 0){
            row += quaters + ' Quaters, ' 
        }
        if(dime !=0){
            row += dime + ' Dime, '
        }
        if(nickels !=0){
            row += nickels + ' Nickels, ' 
        }

        if(pennies !=0){
            row+= pennies + ' Pennies '
        }

        //Display in HTML
        moneyChange.empty();
        moneyChange.val(row);
        currentMoney = 0.00;
             $('#currentMoney').empty();
             $('#currentMoney').val(parseFloat(currentMoney).toFixed(2))

    })

}

function showHideChangebutton(){
    var currentMoney = $('#currentMoney').val();
    if(currentMoney == 0.00){
        $('#returnChange').hide();
    }
    else{
        $('#returnChange').show();
    }
}