$(function(){

	//Searching part
	$('#search').keyup(function(){
		var search_term = $(this).val();
		console.log(search_term);
		$.ajax({
			url : '/api/search'
			, method : 'POST'
			//, data : { search_term : search_term }
			, data : { search_term }
			, dataType : 'json'
			, success : function(json){
				var data = json.hits.hits.map(function(hit){
					return hit;
				});
				console.log(data);

				$('#searchResults').empty();
				for(var i = 0; i < data.length; i++) {
				
					var html = '<div class="col-md-4">';
					html += '<a href="/product/' + data[i]._source._id + '">';
					html += '<div class="thumbnail">';
					html += '<img src="' + data[i]._source.image + '">';
					html += '<div class="caption">';
					html += '<h3>' + data[i]._source.name +'</h3>';
					html += '<p>' + data[i]._source.category.name  + '</p>';
					html += '<p>' + data[i]._source.price + '</p>';
					html += '</div>';
					html += '</div>';
					html += '</a>';
					html += '</div>';
					$('#searchResults').append(html);
				}

			}
			, error : function(err){
				console.log(err);
			}
			, complete : function(){
				console.log('search finished');
			}
		});
	});


	$(document).on('click', '#plus', function(e){
		//blocking refreshing
		e.preventDefault();
		var priceValue = parseFloat($('#priceValue').val());
		var quantity = parseInt($('#quantity').val());

		console.log(priceValue);

		// Add original
		priceValue += parseFloat($('#priceHidden').val());
		quantity += 1;

		console.log(quantity);

		$('#quantity').val(quantity);
		$('#priceValue').val(priceValue.toFixed(2));
		$('#total').html(quantity);
	});

	$(document).on('click', '#minus', function(e){
		//blocking refreshing
		e.preventDefault();
		var priceValue = parseFloat($('#priceValue').val());
		var quantity = parseInt($('#quantity').val());

		console.log(priceValue);

		/* This is not order, just a shopping cart
		if(quantity < 1){
			priceValue -= parseFloat($('#priceHidden').val());
			quantity -= 1;
		}
		*/

		if(quantity == 1) {
			priceValue = $('#priceValue').val();
			quantity = 1;
		} else {
			priceValue -= parseFloat($('#priceHidden').val());
			quantity -= 1;
		}

		console.log(quantity);

		$('#quantity').val(quantity);
		$('#priceValue').val(priceValue.toFixed(2));
		$('#total').html(quantity);
	});	

});