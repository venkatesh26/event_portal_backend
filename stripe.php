      <!-- Step 04 -->
        <div class="containerSection noHorizontalCenter">
            <div class="row centerDiv">
                <div class="col-md-11">
                    <form id="subscription-form">
                        <div id="card-element" class="MyCardElement mb-25">
                            <!-- Elements will create input elements here -->
                        </div>

                        <!-- We'll put the error messages in this element -->
                        <p class="text-danger text-center mb-1" role="alert">
							<small id="card-errors"></small>
						</p>
                        <button class="btn btn-block btn-primary btn-overshield" type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
        </div>


<script
  src="https://code.jquery.com/jquery-3.5.0.min.js"
  integrity="sha256-xNzN2a4ltkB44Mc/Jz3pT4iU1cmeR0FkXs4pru/JxaQ="
  crossorigin="anonymous"></script>

<script src="https://js.stripe.com/v3/"></script>
<script>
var stripe = Stripe('pk_test_vqZwdj6reVGYdCD4QQDnGZ6c00U08F91uY');
  var elements = stripe.elements();
  var style = {
      base: {
        color: '#32325d',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '15px',
        '::placeholder': {
          color: '#aab7c4'
        },
        ':-webkit-autofill': {
          color: '#32325d',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
          ':-webkit-autofill': {
            color: '#fa755a',
        },
      }
  };
    
  // Create an instance of the card Element.
  var card = elements.create('card', {style: style, hidePostalCode:true});
  card.mount('#card-element');  

  var cardholderName = document.getElementById('cardholder-name');
  var cardElement = card;
  var quickPay = 0;
  var form = document.getElementById('subscription-form');
  form.addEventListener('submit', function(event) {
  event.preventDefault();
  stripe.createToken(cardElement,
    {
        payment_method_data: {
        }
        }).then(function(result) {
          // Handle result.error or result.setupIntent
          if (result.error) {
             showStripePayError('#stripe-ajax-loader,#stripe-payment-form', result.error.code, result.error.message, '#card-errors');
           } else {
             processPaymentIntent(result.token.id,quickPay,$('input[name=reuse_authorize]:checked').length,stripe);
           }
        });
  });


function processPaymentIntent(result_id,quickpay,card_reuse,stripe) {
  quickpay = typeof quickpay !== 'undefined' ? quickpay : 0;
  card_reuse = typeof card_reuse !== 'undefined' ? card_reuse : 0;
  $.ajax({
      type: 'POST',
      dataType: 'json',
      url: 'http://127.0.0.1:8012/api/place_order',
      data: {
	stripe_token: result_id,
	email:"damovenkatesh@gmail.com",
	customer_name:'Dhamo',
	payment_type:"stripe",
	event_id:1,
	user_id:1,
		     	   authtoken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiQyYiQwNCREdkFqd2RIRmZYVUVDbkV1SWROWkVlaTJvNmZIMVF2MlRvV0dvSHlrLkREL1ZZSHZnZVRNTyIsInRpbWUiOiIkMmIkMDQkNHU2aHpFWTJDOUR2Rm9rN1VzTHdaTzgzS3M0RjFaQ2lQLlJ5S1NNc1ZzSkhjU1cxeDY2S2kiLCJyX3Rva2VuIjoiejdqWFRaR01kMHUyTUNrVmhWVyt4cDBXOExHdFdnLzB6RHJwN0F3PSIsInN1cGVyX2FkbWluX3Rva2VuIjoiVkpDbXhxVkQwVEVBM1VlNkhGckE5NG5uaEVZPSIsInVzZXJfbmFtZV90b2tlbiI6IklJZm9zRkxobytvMnovVWdQQWt0VVlrQ1JNOEYiLCJyb2xlX2lkIjoibTQ1ai9pSDdSalM1Yy94eEtIeUhmcUk9IiwidXNlcl9pZCI6IjN4WTZLT1RURkU4Q1V4WjNlenNROEk4PSIsImlhdCI6MTU4ODA5Mjc4NywiZXhwIjoxNTg4MTE0Mzg3fQ.6y66jxLOfVMH_kEa7_7zoJ9JK4HMG9wd-AKcrHUbfVU",
	ticket_details:[
		{
			ticket_id:1,
			quantity:2
		},
		{
			ticket_id:2,
			quantity:2
		}
	],
	event_attenders:[
		{
			event_id:1,
			event_ticket_id:2,
			name:"Dhamo",
			email:"Dhamo@gmail.com",
			mobile_no:"9791447542",
			company_name:"constient",
			destination:"System Engg",
			city:"Chennai"
		},
		{
			
			event_id:1,
			event_ticket_id:2,
			name:"Dhamo1",
			email:"Dhamo1@gmail.com",
			mobile_no:"97914475421",
			company_name:"constient",
			destination:"System Engg1",
			city:"Chennai"
		}
	]
      },
      success: function(data) {
        
      },
      error: function(jqXHR, exception) {
        showStripePayError('#stripe-ajax-loader,#stripe-payment-form', jqXHR, 'ajax', '#card-errors',exception);  
      }
    });
}


function showStripePayError(toggleID, code, msg, only_msg, exception) {
  exception = typeof exception !== 'undefined' ? exception : null;
  
  $(toggleID).toggle();
  var err_msg = '';
  $('#payment-confirmation button[type=submit]').prop("disabled", false);
  $('#payment-confirmation button[type=submit]').removeAttr('disabled');
    
  if(msg=='ajax') {
    var msg = '';
        if (code.status === 0) {
            err_msg = 'No connection avaliable. Please Verify your Network.';
        } else if (code.status == 404) {
            err_msg = 'Requested page not found. [404]';
        } else if (code.status == 500) {
            err_msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            err_msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            err_msg = 'Request got time out.';
        } else if (exception === 'abort') {
            err_msg = 'Ajax request aborted.';
        } else {
            err_msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
    
  } else {
    err_msg = $('#stripe-'+code).text();
    if (!err_msg || err_msg == "undefined" || err_msg == '')
      err_msg = msg;
  }
  if(only_msg==true)
    return err_msg;
  $(only_msg).text(err_msg).show();
}

</script>
