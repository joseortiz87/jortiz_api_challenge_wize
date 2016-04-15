var current_token = null;
var interval = null;

function getChallenge(){
	try{
		$.ajax({
			  method: "GET",
			  url: "https://wizeservices-api-challenge.herokuapp.com/challenge",
			  data: { },
			  dataType: "json"
			}).done(function( data ) {
        console.log(JSON.stringify(data));
        current_token = data.token;
        preparedTable(data.values);
        $("#challenge_verify_button").show();
        $("#challenge_new_button").attr('disabled','disabled');
        clockStart();
			}).fail(function( jqXHR, textStatus ) {
        showAlertMsg("Upps there is problem with the server! Try again!" + textStatus);
			});
	}catch(e){
    console.log(JSON.stringify(e));
	}
}

function clockStart(){
  interval = setInterval(function(){
     var time = $("#clock").text();
     var time2 = parseInt(time)-1;
     $("#clock").text(time2);
     if(time2 <= 0){
       showAlertMsg("Time out!");
       resetChallange();
       clearInterval(interval);
     }
  }, 1000);
}

/*
FILL CHANGE TABLE WITH VALUES
*/
function preparedTable(values){
  $("#challange_tbody > tr[id*='row_']").remove();
  var button = $("#last");
  button.show();
  $.each(values,function(index,num){
    var html = "<tr id='row_" + index + "' class='text-center'><td></td><td><span>"
      + num + "</span></td></tr>";
    $( html).insertBefore( button );
  });
}

function postChallenge(token,sum){
	try{
		$.ajax({
			  method: "GET",
			  url: "https://wizeservices-api-challenge.herokuapp.com/challenge/" + token + "/" + sum,
			  data: {},
			  dataType: "json"
			}).done(function( data ) {
        console.log("RES - " + JSON.stringify(data));
        if(data.error){
          showAlertMsg(data.error);
        }else{
          showAlertMsg(data.response);
          resetChallange();
        }
			}).fail(function( jqXHR, textStatus ) {
        showAlertMsg("Upps there is problem with the server! Try again!" + textStatus);
			});
	}catch(e){
    console.log(JSON.stringify(e));
	}
}

function resetChallange(){
  current_token = null;
  $("#challenge_new_button").removeAttr('disabled');
  $("#challenge_verify_button").hide();
  $("#last").hide();
  $("#challange_tbody > tr[id*='row_']").remove();
  $("#clock").text(60);
}

/*
SHOW MESSAGE IN A MODAL
*/
function showAlertMsg(msg){
  $("#modal_text").text(msg);
  $("#msgModal").modal('show');
}

/*
 * DOCUMENT READY
 * */
$( document ).ready(function() {

  $("#challenge_verify_button").hide();
  $("#last").hide();

  $("#challenge_new_button").click(function(){
    getChallenge();
  });

  $("#challenge_verify_button").click(function(){
    var res = $("#res").val();
    if(!res){
      showAlertMsg("No answer!");
    }else{
      postChallenge(current_token,res);
    }
  });

});
